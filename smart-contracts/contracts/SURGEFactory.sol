// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SURGECore.sol";

/**
 * @title SURGEFactory
 * @dev Registry and creator management for SURGE Protocol
 * @notice SURGE = Superchain User Recognition and Growth Engine
 * @notice Deploys and tracks all SURGE event contracts
 */
contract SURGEFactory is Ownable {
    
    // ============ ENUMS ============
    
    enum CreatorTier { Community, Verified, Official }
    
    // ============ STRUCTS ============
    
    struct CreatorProfile {
        address creator;
        CreatorTier tier;
        uint256 reputationScore;
        bool isBlacklisted;
        uint256 eventsCreated;
        uint256 totalClaims;
        uint256 registeredAt;
    }
    
    struct DistributionConfig {
        bytes32 merkleRoot;         // For whitelist mode
        uint256 startTimestamp;     // When claiming starts
    }
    
    // ============ STATE VARIABLES ============
    
    // Creator management
    mapping(address => CreatorProfile) public creators;
    mapping(address => address[]) public creatorEvents; // creator => SURGECore[]
    
    // Global registry
    address[] public allEvents;
    mapping(address => bool) public isValidEvent;
    
    // Tier limits
    mapping(CreatorTier => uint256) public maxSupplyLimits;
    mapping(CreatorTier => uint256) public commissionBps; // Basis points (1 bps = 0.01%)
    
    // Revenue
    uint256 public totalCommissionsCollected;
    address public treasury;
    
    // Reputation contract (optional)
    address public reputationContract;
    
    // ============ EVENTS ============
    
    event SURGEEventCreated(
        address indexed eventContract,
        address indexed creator,
        string name,
        CreatorTier tier,
        uint256 maxSupply
    );
    
    event CreatorVerified(address indexed creator, CreatorTier tier);
    event CreatorBlacklisted(address indexed creator, string reason);
    event CreatorUnblacklisted(address indexed creator);
    event CommissionCollected(address indexed creator, uint256 amount);
    
    // ============ ERRORS ============
    
    error CreatorIsBlacklisted();
    error SupplyExceedsTierLimit();
    error InvalidTier();
    error EventNotFound();
    error InsufficientCommission();
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _treasury) Ownable(msg.sender) {
        treasury = _treasury;
        
        // Set default tier limits
        maxSupplyLimits[CreatorTier.Community] = 5_000;
        maxSupplyLimits[CreatorTier.Verified] = 50_000;
        maxSupplyLimits[CreatorTier.Official] = type(uint256).max; // Unlimited
        
        // Set default commissions (all free for now)
        commissionBps[CreatorTier.Community] = 0;
        commissionBps[CreatorTier.Verified] = 0;
        commissionBps[CreatorTier.Official] = 0;
    }
    
    // ============ CORE FUNCTIONS ============
    
    /**
     * @dev Create new SURGE event
     * @param _metadata Event metadata
     * @param _config Distribution configuration
     */
    function createSURGEEvent(
        SURGECore.EventMetadata memory _metadata,
        DistributionConfig memory _config
    ) external payable returns (address) {
        // Get or create creator profile
        if (creators[msg.sender].creator == address(0)) {
            _registerCreator(msg.sender);
        }
        
        CreatorProfile storage creator = creators[msg.sender];
        
        // Check blacklist
        if (creator.isBlacklisted) revert CreatorIsBlacklisted();
        
        // Validate supply against tier limits
        uint256 tierLimit = maxSupplyLimits[creator.tier];
        if (_metadata.maxSupply > tierLimit) revert SupplyExceedsTierLimit();
        
        // Calculate and collect commission
        uint256 commission = _calculateCommission(creator.tier, _metadata.maxSupply);
        if (msg.value < commission) revert InsufficientCommission();
        
        if (commission > 0) {
            (bool sent, ) = treasury.call{value: commission}("");
            require(sent, "Commission transfer failed");
            totalCommissionsCollected += commission;
            emit CommissionCollected(msg.sender, commission);
        }
        
        // Set tier in metadata
        _metadata.tier = SURGECore.Tier(uint8(creator.tier));
        _metadata.creator = msg.sender;
        _metadata.chainId = block.chainid;
        
        // Deploy new SURGECore contract
        SURGECore newEvent = new SURGECore(_metadata, address(this));
        
        // Set Merkle root if whitelist mode
        if (_metadata.mode == SURGECore.DistributionMode.Whitelist && _config.merkleRoot != bytes32(0)) {
            newEvent.setMerkleRoot(_config.merkleRoot);
        }
        
        // Transfer ownership to creator
        newEvent.transferOwnership(msg.sender);
        
        // Register event
        address eventAddress = address(newEvent);
        allEvents.push(eventAddress);
        creatorEvents[msg.sender].push(eventAddress);
        isValidEvent[eventAddress] = true;
        
        // Update creator stats
        creator.eventsCreated++;
        
        emit SURGEEventCreated(
            eventAddress,
            msg.sender,
            _metadata.name,
            creator.tier,
            _metadata.maxSupply
        );
        
        return eventAddress;
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Verify creator and set tier
     * @param _creator Creator address
     * @param _tier New tier
     */
    function verifyCreator(address _creator, CreatorTier _tier) external onlyOwner {
        if (_creator == address(0)) revert("Invalid creator");
        
        if (creators[_creator].creator == address(0)) {
            _registerCreator(_creator);
        }
        
        creators[_creator].tier = _tier;
        
        emit CreatorVerified(_creator, _tier);
    }
    
    /**
     * @dev Blacklist creator
     * @param _creator Creator to blacklist
     * @param _reason Reason for blacklist
     */
    function blacklistCreator(address _creator, string memory _reason) external onlyOwner {
        creators[_creator].isBlacklisted = true;
        emit CreatorBlacklisted(_creator, _reason);
    }
    
    /**
     * @dev Unblacklist creator
     * @param _creator Creator to unblacklist
     */
    function unblacklistCreator(address _creator) external onlyOwner {
        creators[_creator].isBlacklisted = false;
        emit CreatorUnblacklisted(_creator);
    }
    
    /**
     * @dev Update tier limits
     */
    function setTierLimit(CreatorTier _tier, uint256 _limit) external onlyOwner {
        maxSupplyLimits[_tier] = _limit;
    }
    
    /**
     * @dev Update commission rates
     */
    function setCommissionRate(CreatorTier _tier, uint256 _bps) external onlyOwner {
        require(_bps <= 10000, "Invalid bps"); // Max 100%
        commissionBps[_tier] = _bps;
    }
    
    /**
     * @dev Set reputation contract
     */
    function setReputationContract(address _reputation) external onlyOwner {
        reputationContract = _reputation;
    }
    
    /**
     * @dev Update treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }
    
    // ============ INTERNAL FUNCTIONS ============
    
    /**
     * @dev Register new creator with Community tier
     */
    function _registerCreator(address _creator) internal {
        creators[_creator] = CreatorProfile({
            creator: _creator,
            tier: CreatorTier.Community,
            reputationScore: 0,
            isBlacklisted: false,
            eventsCreated: 0,
            totalClaims: 0,
            registeredAt: block.timestamp
        });
    }
    
    /**
     * @dev Calculate commission for event creation
     */
    function _calculateCommission(
        CreatorTier _tier,
        uint256 _maxSupply
    ) internal view returns (uint256) {
        uint256 tierLimit = maxSupplyLimits[_tier];
        
        // No commission if within tier limit
        if (_maxSupply <= tierLimit) {
            return 0;
        }
        
        // Commission on excess supply
        uint256 excess = _maxSupply - tierLimit;
        uint256 rate = commissionBps[_tier];
        
        // Example: $0.01 per token over limit (in wei, assuming ETH price)
        // This would need to be adjusted or use an oracle
        return excess * rate;
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get creator profile
     */
    function getCreatorProfile(address _creator) external view returns (CreatorProfile memory) {
        return creators[_creator];
    }
    
    /**
     * @dev Get events by creator
     */
    function getEventsByCreator(address _creator) external view returns (address[] memory) {
        return creatorEvents[_creator];
    }
    
    /**
     * @dev Get all events with pagination
     */
    function getAllEvents(
        uint256 _offset,
        uint256 _limit
    ) external view returns (address[] memory) {
        uint256 total = allEvents.length;
        if (_offset >= total) {
            return new address[](0);
        }
        
        uint256 end = _offset + _limit;
        if (end > total) {
            end = total;
        }
        
        uint256 size = end - _offset;
        address[] memory result = new address[](size);
        
        for (uint256 i = 0; i < size; i++) {
            result[i] = allEvents[_offset + i];
        }
        
        return result;
    }
    
    /**
     * @dev Get total number of events
     */
    function getTotalEvents() external view returns (uint256) {
        return allEvents.length;
    }
    
    /**
     * @dev Get tier limit for address
     */
    function getTierLimit(address _creator) external view returns (uint256) {
        CreatorTier tier = creators[_creator].tier;
        return maxSupplyLimits[tier];
    }
    
    /**
     * @dev Check if event is valid
     */
    function validateEvent(address _event) external view returns (bool) {
        return isValidEvent[_event];
    }
}
