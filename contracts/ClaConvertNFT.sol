pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "./interfaces/IClaContract.sol";
import "./interfaces/IClaDistributor.sol";
import "./interfaces/IClsToken.sol";

contract ClaConvertNFT is ERC721Full {
  constructor(string memory name, string memory symbol) ERC721Full(name, symbol) public {
  }

  using SafeMath for uint256;


  /// @notice tokenId -> CCT
  mapping (uint256 => CCT) public ccts;
  /// @notice NFT 별 쌓인 CLA
  mapping (uint256 => uint256) private _distributedRewardPerToken;

  /// @notice 180일 고정 예치 기간
  uint8 private constant LOCKUP_PERIOD = 180;
  /// @notice 180일 예치에 대한 MULTIPLE 값(CLA:CLS 비 = 1:2)
  uint8 private constant MULTIPLE_FOR_180DAYS = 2;
  /// @notice CLA 컨트랙트 주소
  /// @dev CLA cypress : 0xCF87f94fD8F6B6f0b479771F10dF672f99eADa63
  /// @dev CLA baobab : 0xe4da7F04Be81a0B3FF8e7bfa154845dab98ae1f6
  address private constant CLA_CONTRACT = 0xCF87f94fD8F6B6f0b479771F10dF672f99eADa63;
  address private constant CLS_TOKEN =  0x5F5dEC0d6402408eE81f52ab985a9C665b6e6010;
  address private constant CLA_DISTRIBUTOR = 0xE9e1031eEAA5817E4706BE294c3Bb4681FDb2447;

  IClaContract claContract = IClaContract(CLA_CONTRACT);
  IClsToken clsToken = IClsToken(CLS_TOKEN);
  IClaDistributor claDistributor = IClaDistributor(CLA_DISTRIBUTOR);
  
  /// @dev CLA 예치에 대한 리워드로 받는 CCT
  struct CCT {
    uint256 claAmount;
    uint32 endDay;
  }

  event MintedCCT(uint256 tokenId, uint256 claAmount, uint32 endDay, address owner);
  event BurnedCCT(uint256 tokenId, uint256 claAmount);
  event UpdatedAccumulatedRewardPerToken(uint256 tokenId, uint256 distributedRewardPerToken);

  /// @notice CCT 민팅
  function _mintCCT(address _account, uint256 _claAmount)
        private
        returns (bool)
      { 
        uint256 tokenId = totalSupply().add(1);
        uint32 endDay = uint32(SafeMath.add(uint256(_getDay()),uint256(LOCKUP_PERIOD)));
        ccts[tokenId] = CCT(_claAmount, endDay);

        _mint(_account, tokenId);

        emit MintedCCT(tokenId, _claAmount, endDay, _account);
    }

  /// @notice CCT 소각
  function burn(uint256 tokenId) public {
    CCT memory _cct = ccts[tokenId];
    require(_cct.endDay <= _getDay());
    require(ownerOf(tokenId) == msg.sender);
    claimClaReward(tokenId, msg.sender);
    clsToken.burn(msg.sender, MULTIPLE_FOR_180DAYS, _cct.claAmount );
    _burn(tokenId);

    emit BurnedCCT( tokenId, _cct.claAmount);
  }
/**
  * @notice (쓰기 작업 없는 단순 조회 용도) 컨트랙트 상태 변수 _distributedRewardPerToken 업데이트 없이 현재까지 쌓인 CLA 이자 반환(본 컨트랙트와 claDistributor 컨트랙트 각각의 이자를 합산)
  * @return uint256 해당 NFT에 축적된 CLA 이자
  */
  function accumulatedRewardCla(uint tokenId) public view returns (uint256) {
    uint256 pendingCla = claDistributor.pendingCla(address(this));
    return _distributedRewardPerToken[tokenId] + _pendingClaPerToken(tokenId, pendingCla);
  }

  /// @notice 유저가 가진 모든 NFT에 쌓인 CLA 이자 조회
  function totalAccumulatedRewardCla(address owner) public view returns (uint256) {
    uint256[] memory tokenList = _tokensOfOwner(owner);
    uint256 totalReward;
    uint256 pendingCla = claDistributor.pendingCla(address(this));

    for (uint i = 0 ; i < tokenList.length; i++) {
      uint256 tokenId = tokenList[i];
      totalReward += _distributedRewardPerToken[tokenId] + _pendingClaPerToken(tokenId, pendingCla);
    }
    return totalReward;
  }

  /// @notice NFT 별 clsToken 컨트랙트 내 pendingCla 지분 조회
  function _pendingClaPerToken(uint256 tokenId, uint256 pendingCla) private view returns (uint256) {
    uint256 claAmountPerToken = ccts[tokenId].claAmount;
    (,uint256 totalClaDeposit,,) = clsToken.lockedClaInfo(address(this), MULTIPLE_FOR_180DAYS);
    return SafeMath.div(SafeMath.mul(pendingCla, claAmountPerToken), totalClaDeposit);
  }

  /// @notice ClaConvertNFT 컨트랙트의 상태변수에 claDistributor pendingCla 추가
  function _updateAllTokensReward() private {
    uint256 pendingCla = claDistributor.pendingCla(address(this));
    claDistributor.harvest(address(this));

    for (uint i = 0 ; i < totalSupply(); i++) {
      uint256 tokenId = tokenByIndex(i);
      _distributedRewardPerToken[tokenId]+= _pendingClaPerToken(tokenId, pendingCla);
      emit UpdatedAccumulatedRewardPerToken(tokenId, _distributedRewardPerToken[tokenId]);
    }
  }
  /// @notice CLA 토큰 잔고 반환
  function claBalanceOf(address account) public view returns (uint256) {
    return claContract.balanceOf(account);
  }

  /// @notice CLA 토큰을 EOA에서 CCT 컨트랙트로 전송하고, 해당 토큰을 CLS 토큰 컨트랙트에 180일 예치
  function convertClaToCct(uint amount) public {
    require(amount > 0);
    // Transfer CLA from user to CCT contract
    claContract.transferFrom(msg.sender, address(this), amount);
    // Update all tokens reward and lock CLA in ClsToken contract
    _updateAllTokensReward();
    claContract.approve(CLS_TOKEN, amount);
    clsToken.mint(address(this), amount, MULTIPLE_FOR_180DAYS);
    // Mint CCT
    _mintCCT(msg.sender, amount);
  }

  /**
  * @notice Claims CLA reward entitled to NFT
  * @dev 먼저 CCT 홀더들에게 pendingCla 이자를 지분에 따라 분배하고 홀더 계정으로 CLA 이자 전송
  */
  function claimClaReward(uint256 tokenId, address owner) public {
    require(msg.sender == ownerOf(tokenId));
    _updateAllTokensReward();
    require(_distributedRewardPerToken[tokenId] > 0);
    uint amount = _distributedRewardPerToken[tokenId];
    claContract.approve(owner, amount);
    claContract.transferFrom(address(this), owner, amount);
    _distributedRewardPerToken[tokenId] = 0;
  }
  /// @notice 유닉스 시간 일자
  function _getDay() private view returns (uint32) {
         return uint32(block.timestamp / 1 days);
  }
  
}