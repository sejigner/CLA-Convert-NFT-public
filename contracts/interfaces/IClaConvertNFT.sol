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
  function claimClaReward(uint256 tokenId) external;
}