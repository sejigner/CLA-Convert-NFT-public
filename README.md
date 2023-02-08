# CLA-Convert-NFT

CLA-Convert-NFT(이하 CCT)는 클레이튼 기반의 탈중앙화 거래소 ClaimSwap에서 발행하는 토큰 CLA를 받아 NFT를 발행해주는 서비스입니다.   
CLA는 일괄적으로 180일간 예치할 수 있으며, 실시간으로 쌓여있는 CLA 이자 토큰을 인출할 수 있습니다.   
CCT는, CLA 예치 시 받는 CLS 토큰이 전송이 불가능한 것과 달리 전송이 가능한 NFT입니다. 따라서 예치한 CLA 토큰과 예치 기간 내 쌓인 이자 CLA를 유동화가 가능합니다.

## 서비스 이용 방법
CCT는 크롬 익스텐션인 Kaikas 지갑을 이용해서 사용이 가능합니다. [사이트 이동하기](https://claconvertnft.netlify.app/)

## Smart Contract Address

0x5fd363522940860014f1B9C531450e6781F07b99

## Smart Contract Interface

```solidity
pragma solidity ^0.5.0;

interface IClaConvertNFT {
  struct CCT {
    uint256 claAmount;
    uint32 endDay;
  }
  function burn(uint256 tokenId) external;
  function accumulatedRewardCla(uint tokenId) external view returns (uint256 rewardCla);
  function totalAccumulatedRewardCla(address owner) external view returns (uint256 totalRewardCla);
  function claBalanceOf(address account) external view returns (uint256 claBalance);
  function approveCla(uint256 amount) external returns (bool success);
  function convertClaToCct(uint amount) external;
  function claimClaReward(uint256 tokenId, address owner) external;
}

```

## CLA-Convert-NFT Front-End

https://claconvertnft.netlify.app/
