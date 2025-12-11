// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "./IdentityAnchor.sol";

/**
 * @title IdentityRegistry
 * @author SURGE Core Team
 * @notice Core logic contract for SURGE Identity management
 * @dev Manages identity lifecycle, wallet linking, and compromise flow
 * 
 * Key Features:
 * - Create identities with automatic SBT minting
 * - Link wallets with dual-signature verification
 * - Primary wallet designation with cooldown
 * - Wallet compromise flow with 30-day dispute period
 * - Score aggregation across linked wallets
 */
contract IdentityRegistry is Ownable {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    // ============================================
    // STRUCTS
    // ============================================
    
    struct Identity {
        uint256 identityId;
        address[] linkedWallets;
        address primaryWallet;
        bool isSuspended;
        uint256 createdAt;
        uint256 lastPrimaryChangeAt;
    }
    
    struct WalletStatus {
        bool isLinked;
        bool isPendingCompromise;
        bool isCompromised;
        uint256 linkedAt;
        uint256 compromiseInitiatedAt;
        uint256 compromisedAt;
        uint256 activityCountsUntil;  // Freeze point for activity history
    }

    // ============================================
    // ERRORS
    // ============================================
    
    error WalletAlreadyLinked(address wallet);
    error WalletNotLinked(address wallet);
    error CallerNotLinkedToIdentity();
    error WalletIsCompromised(address wallet);
    error WalletIsPendingCompromise(address wallet);
    error IdentityIsSuspended(uint256 identityId);
    error CannotMarkSelfAsCompromised();
    error WalletNotPendingCompromise(address wallet);
    error DisputePeriodNotExpired();
    error DisputePeriodExpired();
    error PrimaryCooldownActive(uint256 remainingTime);
    error InvalidWalletForPrimary(address wallet);
    error InvalidSignature();
    error ZeroAddress();
    error IdentityNotFound(uint256 identityId);

    // ============================================
    // EVENTS
    // ============================================
    
    event IdentityCreated(
        uint256 indexed identityId,
        address indexed initialWallet,
        uint256 timestamp
    );
    
    event WalletLinked(
        uint256 indexed identityId,
        address indexed newWallet,
        address indexed linkedBy,
        uint256 timestamp
    );
    
    event PrimaryWalletChanged(
        uint256 indexed identityId,
        address indexed oldPrimary,
        address indexed newPrimary,
        uint256 timestamp
    );
    
    event WalletCompromiseInitiated(
        uint256 indexed identityId,
        address indexed wallet,
        address indexed initiatedBy,
        uint256 timestamp
    );
    
    event CompromiseCancelled(
        uint256 indexed identityId,
        address indexed wallet,
        address indexed cancelledBy,
        uint256 timestamp
    );
    
    event WalletCompromiseFinalized(
        uint256 indexed identityId,
        address indexed wallet,
        uint256 timestamp
    );
    
    event IdentitySuspended(
        uint256 indexed identityId,
        uint256 timestamp
    );
    
    event IdentityUnsuspended(
        uint256 indexed identityId,
        address indexed newPrimary,
        uint256 timestamp
    );

    // ============================================
    // CONSTANTS
    // ============================================
    
    /// @notice Duration of the dispute period after marking as compromised
    uint256 public constant DISPUTE_PERIOD = 30 days;
    
    /// @notice Cooldown period between primary wallet changes
    uint256 public constant PRIMARY_COOLDOWN = 14 days;
    
    /// @notice Domain separator for signatures
    string public constant SIGNATURE_DOMAIN = "SURGE_LINK_WALLET";

    // ============================================
    // STATE VARIABLES
    // ============================================
    
    /// @notice Reference to the IdentityAnchor SBT contract
    IdentityAnchor public identityAnchor;
    
    /// @notice Counter for generating identity IDs
    uint256 public nextIdentityId;
    
    /// @notice Mapping from identityId to Identity struct
    mapping(uint256 => Identity) public identities;
    
    /// @notice Mapping from wallet address to identityId
    mapping(address => uint256) public walletToIdentity;
    
    /// @notice Mapping from wallet address to WalletStatus
    mapping(address => WalletStatus) public walletStatuses;
    
    /// @notice Mapping for individual wallet scores (placeholder for future integration)
    mapping(address => uint256) public individualScores;

    // ============================================
    // MODIFIERS
    // ============================================
    
    modifier onlyLinked(uint256 identityId) {
        if (walletToIdentity[msg.sender] != identityId) {
            revert CallerNotLinkedToIdentity();
        }
        _;
    }
    
    modifier notCompromisedWallet() {
        WalletStatus storage status = walletStatuses[msg.sender];
        if (status.isCompromised) {
            revert WalletIsCompromised(msg.sender);
        }
        if (status.isPendingCompromise) {
            revert WalletIsPendingCompromise(msg.sender);
        }
        _;
    }
    
    modifier identityNotSuspended(uint256 identityId) {
        if (identities[identityId].isSuspended) {
            revert IdentityIsSuspended(identityId);
        }
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor(address _identityAnchor) Ownable(msg.sender) {
        if (_identityAnchor == address(0)) revert ZeroAddress();
        identityAnchor = IdentityAnchor(_identityAnchor);
        nextIdentityId = 1; // Start from 1 (0 = no identity)
    }

    // ============================================
    // IDENTITY CREATION
    // ============================================
    
    /**
     * @notice Create a new SURGE Identity for the caller
     * @return identityId The newly created identity ID
     */
    function createIdentity() external returns (uint256) {
        return _createIdentityFor(msg.sender);
    }
    
    /**
     * @notice Internal function to create identity for a wallet
     * @param initialWallet Address to create identity for
     * @return identityId The newly created identity ID
     */
    function _createIdentityFor(address initialWallet) internal returns (uint256) {
        if (walletToIdentity[initialWallet] != 0) {
            revert WalletAlreadyLinked(initialWallet);
        }
        
        uint256 identityId = nextIdentityId++;
        
        // Create identity
        Identity storage identity = identities[identityId];
        identity.identityId = identityId;
        identity.linkedWallets.push(initialWallet);
        identity.primaryWallet = initialWallet;
        identity.isSuspended = false;
        identity.createdAt = block.timestamp;
        identity.lastPrimaryChangeAt = block.timestamp;
        
        // Create wallet status
        walletToIdentity[initialWallet] = identityId;
        walletStatuses[initialWallet] = WalletStatus({
            isLinked: true,
            isPendingCompromise: false,
            isCompromised: false,
            linkedAt: block.timestamp,
            compromiseInitiatedAt: 0,
            compromisedAt: 0,
            activityCountsUntil: 0
        });
        
        // Mint SBT
        identityAnchor.mint(initialWallet, identityId);
        
        emit IdentityCreated(identityId, initialWallet, block.timestamp);
        
        return identityId;
    }

    // ============================================
    // WALLET LINKING
    // ============================================
    
    /**
     * @notice Link a new wallet to an existing identity
     * @param identityId The identity to link to
     * @param newWallet The wallet to link
     * @param existingWalletSig Signature from an existing linked wallet
     * @param newWalletSig Signature from the new wallet
     */
    function linkWallet(
        uint256 identityId,
        address newWallet,
        bytes calldata existingWalletSig,
        bytes calldata newWalletSig
    ) 
        external 
        onlyLinked(identityId)
        notCompromisedWallet
        identityNotSuspended(identityId)
    {
        if (newWallet == address(0)) revert ZeroAddress();
        if (walletToIdentity[newWallet] != 0) {
            revert WalletAlreadyLinked(newWallet);
        }
        
        // Verify signatures
        bytes32 messageHash = keccak256(abi.encodePacked(
            SIGNATURE_DOMAIN,
            identityId,
            msg.sender,
            newWallet,
            block.chainid
        ));
        
        bytes32 ethSignedHash = messageHash.toEthSignedMessageHash();
        
        // Verify existing wallet signature (caller)
        if (ethSignedHash.recover(existingWalletSig) != msg.sender) {
            revert InvalidSignature();
        }
        
        // Verify new wallet signature
        if (ethSignedHash.recover(newWalletSig) != newWallet) {
            revert InvalidSignature();
        }
        
        // Link the wallet
        Identity storage identity = identities[identityId];
        identity.linkedWallets.push(newWallet);
        
        walletToIdentity[newWallet] = identityId;
        walletStatuses[newWallet] = WalletStatus({
            isLinked: true,
            isPendingCompromise: false,
            isCompromised: false,
            linkedAt: block.timestamp,
            compromiseInitiatedAt: 0,
            compromisedAt: 0,
            activityCountsUntil: 0
        });
        
        // Mint SBT with same identityId
        identityAnchor.mint(newWallet, identityId);
        
        emit WalletLinked(identityId, newWallet, msg.sender, block.timestamp);
    }

    // ============================================
    // PRIMARY WALLET MANAGEMENT
    // ============================================
    
    /**
     * @notice Set a new primary wallet for the identity
     * @param identityId The identity to update
     * @param newPrimary The wallet to set as primary
     */
    function setPrimaryWallet(
        uint256 identityId,
        address newPrimary
    ) 
        external 
        onlyLinked(identityId)
        notCompromisedWallet
    {
        Identity storage identity = identities[identityId];
        
        // Check cooldown (skip if identity is suspended - need to recover)
        if (!identity.isSuspended) {
            uint256 cooldownEnd = identity.lastPrimaryChangeAt + PRIMARY_COOLDOWN;
            if (block.timestamp < cooldownEnd) {
                revert PrimaryCooldownActive(cooldownEnd - block.timestamp);
            }
        }
        
        // Verify newPrimary is valid
        if (walletToIdentity[newPrimary] != identityId) {
            revert WalletNotLinked(newPrimary);
        }
        
        WalletStatus storage newPrimaryStatus = walletStatuses[newPrimary];
        if (newPrimaryStatus.isCompromised || newPrimaryStatus.isPendingCompromise) {
            revert InvalidWalletForPrimary(newPrimary);
        }
        
        address oldPrimary = identity.primaryWallet;
        identity.primaryWallet = newPrimary;
        identity.lastPrimaryChangeAt = block.timestamp;
        
        // Unsuspend if was suspended
        if (identity.isSuspended) {
            identity.isSuspended = false;
            emit IdentityUnsuspended(identityId, newPrimary, block.timestamp);
        }
        
        emit PrimaryWalletChanged(identityId, oldPrimary, newPrimary, block.timestamp);
    }

    // ============================================
    // COMPROMISE FLOW
    // ============================================
    
    /**
     * @notice Mark a wallet as compromised (starts 30-day dispute period)
     * @param identityId The identity containing the wallet
     * @param walletToMark The wallet to mark as compromised
     */
    function markAsCompromised(
        uint256 identityId,
        address walletToMark
    ) 
        external 
        onlyLinked(identityId)
        notCompromisedWallet
    {
        if (walletToMark == msg.sender) {
            revert CannotMarkSelfAsCompromised();
        }
        
        if (walletToIdentity[walletToMark] != identityId) {
            revert WalletNotLinked(walletToMark);
        }
        
        WalletStatus storage status = walletStatuses[walletToMark];
        if (status.isCompromised) {
            revert WalletIsCompromised(walletToMark);
        }
        
        // Set pending compromise
        status.isPendingCompromise = true;
        status.compromiseInitiatedAt = block.timestamp;
        status.activityCountsUntil = block.timestamp;
        
        // If this was the primary, clear it
        Identity storage identity = identities[identityId];
        if (identity.primaryWallet == walletToMark) {
            identity.primaryWallet = address(0);
        }
        
        emit WalletCompromiseInitiated(identityId, walletToMark, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Cancel a pending compromise (only during dispute period)
     * @param identityId The identity containing the wallet
     * @param wallet The wallet to restore
     */
    function cancelCompromise(
        uint256 identityId,
        address wallet
    ) 
        external 
        onlyLinked(identityId)
        notCompromisedWallet
    {
        if (wallet == msg.sender) {
            revert CannotMarkSelfAsCompromised(); // Reuse error - can't cancel own
        }
        
        WalletStatus storage status = walletStatuses[wallet];
        if (!status.isPendingCompromise) {
            revert WalletNotPendingCompromise(wallet);
        }
        
        if (block.timestamp >= status.compromiseInitiatedAt + DISPUTE_PERIOD) {
            revert DisputePeriodExpired();
        }
        
        // Reset status
        status.isPendingCompromise = false;
        status.compromiseInitiatedAt = 0;
        status.activityCountsUntil = 0;
        
        emit CompromiseCancelled(identityId, wallet, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Finalize a compromise after dispute period (callable by anyone)
     * @param identityId The identity containing the wallet
     * @param wallet The wallet to finalize
     */
    function finalizeCompromise(
        uint256 identityId,
        address wallet
    ) external {
        if (walletToIdentity[wallet] != identityId) {
            revert WalletNotLinked(wallet);
        }
        
        WalletStatus storage status = walletStatuses[wallet];
        if (!status.isPendingCompromise) {
            revert WalletNotPendingCompromise(wallet);
        }
        
        if (block.timestamp < status.compromiseInitiatedAt + DISPUTE_PERIOD) {
            revert DisputePeriodNotExpired();
        }
        
        // Finalize compromise
        status.isPendingCompromise = false;
        status.isCompromised = true;
        status.compromisedAt = block.timestamp;
        
        // Check if identity should be suspended
        Identity storage identity = identities[identityId];
        if (identity.primaryWallet == address(0)) {
            identity.isSuspended = true;
            emit IdentitySuspended(identityId, block.timestamp);
        }
        
        emit WalletCompromiseFinalized(identityId, wallet, block.timestamp);
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================
    
    /**
     * @notice Get full identity data
     * @param identityId The identity to query
     */
    function getIdentity(uint256 identityId) external view returns (
        address[] memory linkedWallets,
        address primaryWallet,
        bool isSuspended,
        uint256 createdAt,
        uint256 lastPrimaryChangeAt
    ) {
        Identity storage identity = identities[identityId];
        return (
            identity.linkedWallets,
            identity.primaryWallet,
            identity.isSuspended,
            identity.createdAt,
            identity.lastPrimaryChangeAt
        );
    }
    
    /**
     * @notice Get wallet status
     * @param wallet The wallet to query
     */
    function getWalletStatus(address wallet) external view returns (
        bool isLinked,
        bool isPendingCompromise,
        bool isCompromised,
        uint256 linkedAt,
        uint256 compromiseInitiatedAt,
        uint256 compromisedAt,
        uint256 activityCountsUntil
    ) {
        WalletStatus storage status = walletStatuses[wallet];
        return (
            status.isLinked,
            status.isPendingCompromise,
            status.isCompromised,
            status.linkedAt,
            status.compromiseInitiatedAt,
            status.compromisedAt,
            status.activityCountsUntil
        );
    }
    
    /**
     * @notice Check if a wallet can perform actions
     * @param wallet The wallet to check
     */
    function isWalletActive(address wallet) external view returns (bool) {
        WalletStatus storage status = walletStatuses[wallet];
        return status.isLinked && !status.isCompromised && !status.isPendingCompromise;
    }
    
    /**
     * @notice Get aggregated score for an identity
     * @param identityId The identity to query
     * @return totalScore Sum of all linked wallet scores (respecting activity cutoff)
     */
    function getAggregatedScore(uint256 identityId) external view returns (uint256) {
        Identity storage identity = identities[identityId];
        uint256 totalScore = 0;
        
        for (uint256 i = 0; i < identity.linkedWallets.length; i++) {
            address wallet = identity.linkedWallets[i];
            // For compromised/pending wallets, only count score up to cutoff
            // This is a placeholder - actual implementation would query historical data
            totalScore += individualScores[wallet];
        }
        
        return totalScore;
    }
    
    /**
     * @notice Get individual wallet score
     * @param wallet The wallet to query
     */
    function getIndividualScore(address wallet) external view returns (uint256) {
        return individualScores[wallet];
    }
    
    /**
     * @notice Get time remaining on primary cooldown
     * @param identityId The identity to check
     */
    function getPrimaryCooldownRemaining(uint256 identityId) external view returns (uint256) {
        Identity storage identity = identities[identityId];
        uint256 cooldownEnd = identity.lastPrimaryChangeAt + PRIMARY_COOLDOWN;
        
        if (block.timestamp >= cooldownEnd) {
            return 0;
        }
        
        return cooldownEnd - block.timestamp;
    }
    
    /**
     * @notice Get time remaining on dispute period
     * @param wallet The wallet to check
     */
    function getDisputePeriodRemaining(address wallet) external view returns (uint256) {
        WalletStatus storage status = walletStatuses[wallet];
        
        if (!status.isPendingCompromise) {
            return 0;
        }
        
        uint256 disputeEnd = status.compromiseInitiatedAt + DISPUTE_PERIOD;
        
        if (block.timestamp >= disputeEnd) {
            return 0;
        }
        
        return disputeEnd - block.timestamp;
    }

    // ============================================
    // ADMIN / INTEGRATION FUNCTIONS
    // ============================================
    
    /**
     * @notice Record activity for a wallet (for future scoring integration)
     * @param wallet The wallet to record activity for
     * @param amount Score amount to add
     */
    function recordActivity(address wallet, uint256 amount) external onlyOwner {
        WalletStatus storage status = walletStatuses[wallet];
        
        // Only record if wallet is active and not past cutoff
        if (status.isLinked && !status.isCompromised && !status.isPendingCompromise) {
            individualScores[wallet] += amount;
        }
    }
    
    /**
     * @notice Update the IdentityAnchor contract reference
     * @param _newAnchor Address of new IdentityAnchor contract
     */
    function setIdentityAnchor(address _newAnchor) external onlyOwner {
        if (_newAnchor == address(0)) revert ZeroAddress();
        identityAnchor = IdentityAnchor(_newAnchor);
    }
}
