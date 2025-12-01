// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IL2ToL2CrossDomainMessenger.sol";
import "./SURGECore.sol";

interface ISURGEFactory {
    function validateEvent(address _event) external view returns (bool);
}

/**
 * @title SURGEBridge
 * @dev Cross-chain bridge coordinator for SURGE NFTs using L2→L2 messaging
 * @notice SURGE = Superchain User Recognition and Growth Engine
 * @notice Enables bridging SURGE tokens between OP Stack chains (Base, Optimism, etc.)
 */
contract SURGEBridge is Ownable {
    
    // ============ CONSTANTS ============
    
    // OP Stack L2→L2 Messenger (same address on all OP Stack chains)
    IL2ToL2CrossDomainMessenger public constant MESSENGER = 
        IL2ToL2CrossDomainMessenger(0x4200000000000000000000000000000000000023);
    
    // ============ ENUMS ============
    
    enum BridgeStatus { Pending, Completed, Failed, Retrying }
    
    // ============ STRUCTS ============
    
    struct BridgeTransaction {
        uint256 sourceChainId;
        uint256 destChainId;
        address sourceEvent;
        address destEvent;
        uint256 tokenId;
        address owner;
        uint256 timestamp;
        BridgeStatus status;
        uint256 retryCount;
    }
    
    // ============ STATE VARIABLES ============
    
    // Transaction tracking
    mapping(bytes32 => BridgeTransaction) public transactions;
    mapping(address => bytes32[]) public userTransactions;
    
    // Bridge fees (per destination chain)
    mapping(uint256 => uint256) public bridgeFees;
    
    // SURGEBridge addresses on other chains
    mapping(uint256 => address) public bridgeAddresses;
    
    // Factory for event validation
    address public factory;
    
    // Treasury for fees
    address public treasury;
    
    // Total stats
    uint256 public totalBridged;
    uint256 public totalFeesCollected;
    
    // ============ EVENTS ============
    
    event BridgeInitiated(
        bytes32 indexed txHash,
        address indexed owner,
        uint256 sourceChainId,
        uint256 destChainId,
        address sourceEvent,
        uint256 tokenId
    );
    
    event BridgeCompleted(
        bytes32 indexed txHash,
        uint256 newTokenId
    );
    
    event BridgeFailed(
        bytes32 indexed txHash,
        string reason
    );
    
    event BridgeRetried(
        bytes32 indexed txHash,
        uint256 retryCount
    );
    
    event FeeCollected(address indexed user, uint256 amount, uint256 destChainId);
    
    // ============ ERRORS ============
    
    error InvalidDestinationChain();
    error InsufficientFee();
    error UnauthorizedCaller();
    error TransactionNotFound();
    error TransactionAlreadyCompleted();
    error TokenNotOwned();
    error EventNotRegistered();
    error BridgeNotConfigured();
    
    // ============ CONSTRUCTOR ============
    
    constructor(
        address _factory,
        address _treasury
    ) Ownable(msg.sender) {
        factory = _factory;
        treasury = _treasury;
        
        // Set default base fees (can be updated)
        bridgeFees[10] = 0.0001 ether;      // Optimism
        bridgeFees[8453] = 0.0001 ether;    // Base
        bridgeFees[42220] = 0.0001 ether;   // Celo
        bridgeFees[130] = 0.0002 ether;     // Unichain
        bridgeFees[1135] = 0.0002 ether;    // Lisk
        bridgeFees[57073] = 0.0002 ether;   // Ink
        bridgeFees[34443] = 0.0002 ether;   // Mode
        bridgeFees[7777777] = 0.0001 ether; // Zora
    }
    
    // ============ BRIDGE FUNCTIONS ============
    
    /**
     * @dev Bridge token to another chain
     * @param _eventContract Source event contract
     * @param _tokenId Token ID to bridge
     * @param _destChainId Destination chain ID
     */
    function bridgeToChain(
        address _eventContract,
        uint256 _tokenId,
        uint256 _destChainId
    ) external payable returns (bytes32) {
        // Validate destination
        if (bridgeAddresses[_destChainId] == address(0)) {
            revert BridgeNotConfigured();
        }
        
        if (_destChainId == block.chainid) {
            revert InvalidDestinationChain();
        }
        
        // Check fee
        uint256 requiredFee = bridgeFees[_destChainId];
        if (msg.value < requiredFee) {
            revert InsufficientFee();
        }
        
        // Verify event is registered (through factory)
        if (!ISURGEFactory(factory).validateEvent(_eventContract)) {
            revert EventNotRegistered();
        }
        
        // Verify ownership
        SURGECore eventContract = SURGECore(_eventContract);
        if (eventContract.ownerOf(_tokenId) != msg.sender) {
            revert TokenNotOwned();
        }
        
        // Lock token on source chain
        eventContract.lockForBridge(_tokenId);
        
        // Generate transaction hash
        bytes32 txHash = keccak256(abi.encodePacked(
            block.chainid,
            _destChainId,
            _eventContract,
            _tokenId,
            msg.sender,
            block.timestamp
        ));
        
        // Store transaction
        transactions[txHash] = BridgeTransaction({
            sourceChainId: block.chainid,
            destChainId: _destChainId,
            sourceEvent: _eventContract,
            destEvent: address(0), // Will be set on destination
            tokenId: _tokenId,
            owner: msg.sender,
            timestamp: block.timestamp,
            status: BridgeStatus.Pending,
            retryCount: 0
        });
        
        userTransactions[msg.sender].push(txHash);
        
        // Collect fee
        if (requiredFee > 0) {
            (bool sent, ) = treasury.call{value: requiredFee}("");
            require(sent, "Fee transfer failed");
            totalFeesCollected += requiredFee;
            emit FeeCollected(msg.sender, requiredFee, _destChainId);
        }
        
        // Refund excess
        if (msg.value > requiredFee) {
            (bool refunded, ) = msg.sender.call{value: msg.value - requiredFee}("");
            require(refunded, "Refund failed");
        }
        
        // Send cross-chain message
        _sendBridgeMessage(
            _destChainId,
            txHash,
            _eventContract,
            _tokenId,
            msg.sender
        );
        
        emit BridgeInitiated(
            txHash,
            msg.sender,
            block.chainid,
            _destChainId,
            _eventContract,
            _tokenId
        );
        
        return txHash;
    }
    
    /**
     * @dev Receive bridged token (called by L2→L2 messenger)
     * @param _txHash Original transaction hash
     * @param _sourceEvent Source event contract address
     * @param _tokenId Original token ID
     * @param _owner Token owner
     */
    function receiveBridgedToken(
        bytes32 _txHash,
        address _sourceEvent,
        uint256 _tokenId,
        address _owner
    ) external {
        // Verify caller is L2→L2 messenger
        if (msg.sender != address(MESSENGER)) {
            revert UnauthorizedCaller();
        }
        
        // Get source chain (from cross domain sender)
        (uint256 sourceChainId, address sourceBridge) = MESSENGER.crossDomainMessageSource();
        
        // Verify sourceBridge is valid SURGEBridge on source chain
        if (bridgeAddresses[sourceChainId] != sourceBridge) {
            revert UnauthorizedCaller();
        }
        
        // Find corresponding event contract on this chain
        // For MVP, assume same address deployment or registry lookup
        address destEventContract = _sourceEvent; // Simplified for now
        
        try SURGECore(destEventContract).mintFromBridge(_owner, _tokenId) returns (uint256 newTokenId) {
            // Update transaction status if we're tracking it
            if (transactions[_txHash].owner != address(0)) {
                transactions[_txHash].status = BridgeStatus.Completed;
                transactions[_txHash].destEvent = destEventContract;
                emit BridgeCompleted(_txHash, newTokenId);
            }
            
            totalBridged++;
        } catch Error(string memory reason) {
            if (transactions[_txHash].owner != address(0)) {
                transactions[_txHash].status = BridgeStatus.Failed;
                emit BridgeFailed(_txHash, reason);
            }
        }
    }
    
    /**
     * @dev Retry failed bridge transaction
     * @param _txHash Transaction hash to retry
     */
    function retryBridge(bytes32 _txHash) external payable {
        BridgeTransaction storage txn = transactions[_txHash];
        
        if (txn.owner == address(0)) revert TransactionNotFound();
        if (txn.status == BridgeStatus.Completed) revert TransactionAlreadyCompleted();
        if (txn.owner != msg.sender) revert UnauthorizedCaller();
        
        // Check fee for retry
        uint256 requiredFee = bridgeFees[txn.destChainId];
        if (msg.value < requiredFee) revert InsufficientFee();
        
        // Update status
        txn.status = BridgeStatus.Retrying;
        txn.retryCount++;
        
        // Collect fee
        if (requiredFee > 0) {
            (bool sent, ) = treasury.call{value: requiredFee}("");
            require(sent, "Fee transfer failed");
            totalFeesCollected += requiredFee;
        }
        
        // Resend message
        _sendBridgeMessage(
            txn.destChainId,
            _txHash,
            txn.sourceEvent,
            txn.tokenId,
            txn.owner
        );
        
        emit BridgeRetried(_txHash, txn.retryCount);
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @dev Send bridge message via L2→L2 messenger
     */
    function _sendBridgeMessage(
        uint256 _destChainId,
        bytes32 _txHash,
        address _eventContract,
        uint256 _tokenId,
        address _owner
    ) internal {
        address destBridge = bridgeAddresses[_destChainId];
        
        bytes memory message = abi.encodeWithSignature(
            "receiveBridgedToken(bytes32,address,uint256,address)",
            _txHash,
            _eventContract,
            _tokenId,
            _owner
        );
        
        MESSENGER.sendMessage(_destChainId, destBridge, message);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Set bridge address for destination chain
     */
    function setBridgeAddress(uint256 _chainId, address _bridge) external onlyOwner {
        bridgeAddresses[_chainId] = _bridge;
    }
    
    /**
     * @dev Update bridge fee for destination chain
     */
    function setBridgeFee(uint256 _chainId, uint256 _fee) external onlyOwner {
        bridgeFees[_chainId] = _fee;
    }
    
    /**
     * @dev Update treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }
    
    /**
     * @dev Update factory address
     */
    function setFactory(address _factory) external onlyOwner {
        factory = _factory;
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get transaction details
     */
    function getTransaction(bytes32 _txHash) external view returns (BridgeTransaction memory) {
        return transactions[_txHash];
    }
    
    /**
     * @dev Get user's bridge transactions
     */
    function getUserTransactions(address _user) external view returns (bytes32[] memory) {
        return userTransactions[_user];
    }
    
    /**
     * @dev Estimate bridge fee for destination
     */
    function estimateBridgeFee(uint256 _destChainId) external view returns (uint256) {
        return bridgeFees[_destChainId];
    }
    
    /**
     * @dev Get bridge stats
     */
    function getBridgeStats() external view returns (
        uint256 _totalBridged,
        uint256 _totalFees
    ) {
        return (totalBridged, totalFeesCollected);
    }
}
