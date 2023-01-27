pragma solidity ^0.5.0;

interface IClsToken {
    /// @dev Lock CLAs and mint CLSs.
    /// @param to CLS Receiver.
    /// @param amount Amount of CLA to lock.
    /// @param multiple Multiple of CLA to lock.
    function mint(
        address to,
        uint256 amount,
        uint8 multiple
    ) external;

    /// @dev Unlock CLAs and burn CLSs.
    /// @param to CLA receiver.
    /// @param multiple Multiple of CLA.
    /// @param amount Amount Of CLA to unlock.
    function burn(
        address to,
        uint8 multiple,
        uint256 amount
    ) external;

    /// @dev Return unlockable amount of cla and locked list of cla
    function lockedClaInfo(address account, uint8 multiple)
        external
        view
        returns (
            uint256 unlockableAmount,
            uint256 lockedAmount,
            uint256[] memory lockedAmounts,
            uint32[] memory endDays
        );
}
