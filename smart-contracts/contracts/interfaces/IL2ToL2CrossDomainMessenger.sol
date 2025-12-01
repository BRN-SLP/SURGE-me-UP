// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IL2ToL2CrossDomainMessenger
 * @notice Interface for OP Stack L2→L2 messaging
 * @dev Standard OP Stack messenger at address 0x4200000000000000000000000000000000000023
 */
interface IL2ToL2CrossDomainMessenger {
    /**
     * @notice Sends a message to another L2 chain
     * @param _destination Chain ID of destination
     * @param _target Target contract address on destination chain
     * @param _message Encoded message data
     */
    function sendMessage(
        uint256 _destination,
        address _target,
        bytes calldata _message
    ) external;
    
    /**
     * @notice Get the cross domain sender (for received messages)
     */
    function crossDomainMessageSender() external view returns (address);

    /**
     * @notice Get the source of the cross domain message
     * @return sourceChainId Chain ID of the source chain
     * @return sender Address of the sender on the source chain
     */
    function crossDomainMessageSource() external view returns (uint256 sourceChainId, address sender);
}
