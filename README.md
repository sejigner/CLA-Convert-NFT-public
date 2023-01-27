# CLA-Convert-NFT

## Smart Contract Address

0x3b16FD875B373Da4aE91231E3A00C3964c8cE556

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

https://63d3f39f163b330a303c3b26--subtle-taffy-00dd51.netlify.app/

## 해결하지 못한 문제

harvest 요청 시 모든 절차는 정상적으로 실행되나 마지막 CLA 컨트랙트에서 CLA를 유저에게 전송하는 단계에서 계속해서 revert됨
