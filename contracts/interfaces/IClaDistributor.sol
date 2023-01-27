pragma solidity ^0.5.0;

interface IClaDistributor {
    /// @dev Harvest proceeds for transaction sender to `to`.
    /// @param to Receiver of CLA rewards.
    function harvest(address to) external;


    /// @notice View function to see pending CLA.
    /// @param user Address of user.
    /// @return Pending CLA reward for a given user.
    function pendingCla(address user) external view returns (uint256 pending);
}
