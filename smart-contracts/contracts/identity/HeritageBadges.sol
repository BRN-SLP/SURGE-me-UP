// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IdentityRegistry.sol";

/**
 * @title HeritageBadges
 * @author SURGE Core Team
 * @notice Mint achievement badges based on history from compromised wallets
 * @dev Heritage badges prove historical on-chain experience survived wallet compromise
 * 
 * Badge Categories:
 * - Veteran Wallet: Wallet age > 1 year
 * - Volume Warrior: High transaction volume
 * - Cross-Chain Native: Activity on 3+ networks
 * - Contract Maestro: 50+ unique contract interactions
 * - Event Collector: 20+ SURGE badges collected
 */
contract HeritageBadges is ERC721, Ownable {
    
    // ============================================
    // ENUMS
    // ============================================
    
    enum BadgeType {
        VeteranWallet,      // Wallet age > 1 year
        VolumeWarrior,      // High transaction volume
        CrossChainNative,   // Activity on 3+ networks
        ContractMaestro,    // 50+ unique contract interactions
        EventCollector      // 20+ SURGE badges collected
    }

    // ============================================
    // STRUCTS
    // ============================================
    
    struct BadgeMetadata {
        BadgeType badgeType;
        address sourceWallet;       // The compromised wallet
        address destinationWallet;  // Where badge was minted
        uint256 identityId;
        uint256 claimedAt;
        string achievementValue;    // Human-readable achievement (e.g., "3 years 4 months")
    }

    // ============================================
    // ERRORS
    // ============================================
    
    error OnlyIdentityRegistry();
    error WalletNotCompromised(address wallet);
    error WalletNotLinkedToIdentity(address wallet);
    error DestinationNotActiveWallet(address wallet);
    error BadgeAlreadyClaimed(address sourceWallet, BadgeType badgeType);
    error CallerNotLinkedToIdentity();
    error ZeroAddress();
    error InvalidBadgeType();
    error ThresholdNotMet(BadgeType badgeType);

    // ============================================
    // EVENTS
    // ============================================
    
    event HeritageBadgeClaimed(
        uint256 indexed tokenId,
        uint256 indexed identityId,
        address indexed sourceWallet,
        address destinationWallet,
        BadgeType badgeType,
        string achievementValue,
        uint256 timestamp
    );
    
    event ThresholdsUpdated(
        uint256 veteranDays,
        uint256 volumeWei,
        uint256 crossChainNetworks,
        uint256 contractInteractions,
        uint256 eventBadges
    );

    // ============================================
    // STATE VARIABLES
    // ============================================
    
    /// @notice Reference to IdentityRegistry contract
    IdentityRegistry public identityRegistry;
    
    /// @notice Counter for token IDs
    uint256 private _nextTokenId;
    
    /// @notice Mapping from tokenId to badge metadata
    mapping(uint256 => BadgeMetadata) public badgeMetadata;
    
    /// @notice Mapping to track claimed badges: sourceWallet => badgeType => claimed
    mapping(address => mapping(BadgeType => bool)) public claimedBadges;
    
    /// @notice Mapping to track claimed badge tokenIds: sourceWallet => badgeType => tokenId
    mapping(address => mapping(BadgeType => uint256)) public claimedBadgeTokens;
    
    // Thresholds (configurable by admin)
    uint256 public veteranThresholdDays = 365;
    uint256 public volumeThresholdWei = 10 ether;
    uint256 public crossChainMinNetworks = 3;
    uint256 public contractMaestroMinInteractions = 50;
    uint256 public eventCollectorMinBadges = 20;
    
    // Off-chain oracle/indexer data (set by admin or trusted source)
    // In production, this would come from an oracle or be verified on-chain
    mapping(address => uint256) public walletAgeInDays;
    mapping(address => uint256) public walletVolume;
    mapping(address => uint256) public walletNetworkCount;
    mapping(address => uint256) public walletContractInteractions;
    mapping(address => uint256) public walletSurgeBadges;
    
    /// @notice Base URI for token metadata
    string private _baseTokenURI;

    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor(
        address _identityRegistry,
        string memory baseURI_
    ) ERC721("SURGE Heritage Badges", "HERITAGE") Ownable(msg.sender) {
        if (_identityRegistry == address(0)) revert ZeroAddress();
        identityRegistry = IdentityRegistry(_identityRegistry);
        _baseTokenURI = baseURI_;
        _nextTokenId = 1;
    }

    // ============================================
    // CLAIM FUNCTIONS
    // ============================================
    
    /**
     * @notice Claim a heritage badge from a compromised wallet
     * @param identityId The identity that owns the compromised wallet
     * @param compromisedWallet The source wallet (must be compromised)
     * @param destinationWallet The active wallet to receive the badge
     * @param badgeType The type of badge to claim
     */
    function claimHeritageBadge(
        uint256 identityId,
        address compromisedWallet,
        address destinationWallet,
        BadgeType badgeType
    ) external returns (uint256 tokenId) {
        // Verify caller is linked to identity
        if (identityRegistry.walletToIdentity(msg.sender) != identityId) {
            revert CallerNotLinkedToIdentity();
        }
        
        // Verify compromised wallet belongs to identity and is compromised
        if (identityRegistry.walletToIdentity(compromisedWallet) != identityId) {
            revert WalletNotLinkedToIdentity(compromisedWallet);
        }
        
        (,, bool isCompromised,,,,) = identityRegistry.getWalletStatus(compromisedWallet);
        if (!isCompromised) {
            revert WalletNotCompromised(compromisedWallet);
        }
        
        // Verify destination is active wallet in same identity
        if (identityRegistry.walletToIdentity(destinationWallet) != identityId) {
            revert WalletNotLinkedToIdentity(destinationWallet);
        }
        
        if (!identityRegistry.isWalletActive(destinationWallet)) {
            revert DestinationNotActiveWallet(destinationWallet);
        }
        
        // Check if already claimed
        if (claimedBadges[compromisedWallet][badgeType]) {
            revert BadgeAlreadyClaimed(compromisedWallet, badgeType);
        }
        
        // Verify threshold is met and get achievement value
        string memory achievementValue = _verifyAndGetAchievement(compromisedWallet, badgeType);
        
        // Mint badge
        tokenId = _nextTokenId++;
        _safeMint(destinationWallet, tokenId);
        
        // Store metadata
        badgeMetadata[tokenId] = BadgeMetadata({
            badgeType: badgeType,
            sourceWallet: compromisedWallet,
            destinationWallet: destinationWallet,
            identityId: identityId,
            claimedAt: block.timestamp,
            achievementValue: achievementValue
        });
        
        // Mark as claimed
        claimedBadges[compromisedWallet][badgeType] = true;
        claimedBadgeTokens[compromisedWallet][badgeType] = tokenId;
        
        emit HeritageBadgeClaimed(
            tokenId,
            identityId,
            compromisedWallet,
            destinationWallet,
            badgeType,
            achievementValue,
            block.timestamp
        );
        
        return tokenId;
    }
    
    /**
     * @notice Claim all available heritage badges at once
     * @param identityId The identity
     * @param compromisedWallet Source wallet
     * @param destinationWallet Target wallet
     * @return claimedTokenIds Array of minted token IDs
     */
    function claimAllAvailableBadges(
        uint256 identityId,
        address compromisedWallet,
        address destinationWallet
    ) external returns (uint256[] memory claimedTokenIds) {
        uint256[] memory tempIds = new uint256[](5);
        uint256 count = 0;
        
        // Try claiming each badge type
        for (uint8 i = 0; i < 5; i++) {
            BadgeType badgeType = BadgeType(i);
            
            if (!claimedBadges[compromisedWallet][badgeType] && 
                _meetsThreshold(compromisedWallet, badgeType)) {
                try this.claimHeritageBadge(identityId, compromisedWallet, destinationWallet, badgeType) returns (uint256 tokenId) {
                    tempIds[count++] = tokenId;
                } catch {
                    // Skip if claim fails
                }
            }
        }
        
        // Copy to properly sized array
        claimedTokenIds = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            claimedTokenIds[i] = tempIds[i];
        }
        
        return claimedTokenIds;
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================
    
    /**
     * @notice Get available badges for a compromised wallet
     * @param compromisedWallet The wallet to check
     * @return available Array of badge types available to claim
     */
    function getAvailableBadges(address compromisedWallet) 
        external 
        view 
        returns (BadgeType[] memory available) 
    {
        BadgeType[] memory temp = new BadgeType[](5);
        uint256 count = 0;
        
        for (uint8 i = 0; i < 5; i++) {
            BadgeType badgeType = BadgeType(i);
            if (!claimedBadges[compromisedWallet][badgeType] && 
                _meetsThreshold(compromisedWallet, badgeType)) {
                temp[count++] = badgeType;
            }
        }
        
        available = new BadgeType[](count);
        for (uint256 i = 0; i < count; i++) {
            available[i] = temp[i];
        }
        
        return available;
    }
    
    /**
     * @notice Get badge type name as string
     * @param badgeType The badge type
     */
    function getBadgeTypeName(BadgeType badgeType) 
        public 
        pure 
        returns (string memory) 
    {
        if (badgeType == BadgeType.VeteranWallet) return "Veteran Wallet";
        if (badgeType == BadgeType.VolumeWarrior) return "Volume Warrior";
        if (badgeType == BadgeType.CrossChainNative) return "Cross-Chain Native";
        if (badgeType == BadgeType.ContractMaestro) return "Contract Maestro";
        if (badgeType == BadgeType.EventCollector) return "Event Collector";
        return "Unknown";
    }
    
    /**
     * @notice Get all badges owned by an address
     * @param owner The address to query
     */
    function getBadgesOfOwner(address owner) 
        external 
        view 
        returns (uint256[] memory tokenIds) 
    {
        uint256 balance = balanceOf(owner);
        tokenIds = new uint256[](balance);
        
        uint256 index = 0;
        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (_ownerOf(i) == owner) {
                tokenIds[index++] = i;
                if (index >= balance) break;
            }
        }
        
        return tokenIds;
    }

    // ============================================
    // INTERNAL FUNCTIONS
    // ============================================
    
    /**
     * @notice Verify threshold is met and return achievement value
     */
    function _verifyAndGetAchievement(
        address wallet, 
        BadgeType badgeType
    ) internal view returns (string memory) {
        if (badgeType == BadgeType.VeteranWallet) {
            uint256 ageDays = walletAgeInDays[wallet];
            if (ageDays < veteranThresholdDays) {
                revert ThresholdNotMet(badgeType);
            }
            return string(abi.encodePacked(_uintToString(ageDays / 365), " years ", _uintToString((ageDays % 365) / 30), " months"));
        }
        
        if (badgeType == BadgeType.VolumeWarrior) {
            uint256 volume = walletVolume[wallet];
            if (volume < volumeThresholdWei) {
                revert ThresholdNotMet(badgeType);
            }
            return string(abi.encodePacked(_uintToString(volume / 1 ether), " ETH volume"));
        }
        
        if (badgeType == BadgeType.CrossChainNative) {
            uint256 networks = walletNetworkCount[wallet];
            if (networks < crossChainMinNetworks) {
                revert ThresholdNotMet(badgeType);
            }
            return string(abi.encodePacked("Active on ", _uintToString(networks), " networks"));
        }
        
        if (badgeType == BadgeType.ContractMaestro) {
            uint256 interactions = walletContractInteractions[wallet];
            if (interactions < contractMaestroMinInteractions) {
                revert ThresholdNotMet(badgeType);
            }
            return string(abi.encodePacked(_uintToString(interactions), " unique interactions"));
        }
        
        if (badgeType == BadgeType.EventCollector) {
            uint256 badges = walletSurgeBadges[wallet];
            if (badges < eventCollectorMinBadges) {
                revert ThresholdNotMet(badgeType);
            }
            return string(abi.encodePacked(_uintToString(badges), " SURGE badges"));
        }
        
        revert InvalidBadgeType();
    }
    
    /**
     * @notice Check if threshold is met without reverting
     */
    function _meetsThreshold(address wallet, BadgeType badgeType) internal view returns (bool) {
        if (badgeType == BadgeType.VeteranWallet) {
            return walletAgeInDays[wallet] >= veteranThresholdDays;
        }
        if (badgeType == BadgeType.VolumeWarrior) {
            return walletVolume[wallet] >= volumeThresholdWei;
        }
        if (badgeType == BadgeType.CrossChainNative) {
            return walletNetworkCount[wallet] >= crossChainMinNetworks;
        }
        if (badgeType == BadgeType.ContractMaestro) {
            return walletContractInteractions[wallet] >= contractMaestroMinInteractions;
        }
        if (badgeType == BadgeType.EventCollector) {
            return walletSurgeBadges[wallet] >= eventCollectorMinBadges;
        }
        return false;
    }
    
    /**
     * @notice Convert uint to string
     */
    function _uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================
    
    /**
     * @notice Set wallet historical data (called by oracle/indexer)
     * @dev In production, this would be set by a trusted oracle
     */
    function setWalletData(
        address wallet,
        uint256 ageInDays,
        uint256 volume,
        uint256 networkCount,
        uint256 contractInteractions,
        uint256 surgeBadges
    ) external onlyOwner {
        walletAgeInDays[wallet] = ageInDays;
        walletVolume[wallet] = volume;
        walletNetworkCount[wallet] = networkCount;
        walletContractInteractions[wallet] = contractInteractions;
        walletSurgeBadges[wallet] = surgeBadges;
    }
    
    /**
     * @notice Update badge thresholds
     */
    function setThresholds(
        uint256 _veteranDays,
        uint256 _volumeWei,
        uint256 _crossChainNetworks,
        uint256 _contractInteractions,
        uint256 _eventBadges
    ) external onlyOwner {
        veteranThresholdDays = _veteranDays;
        volumeThresholdWei = _volumeWei;
        crossChainMinNetworks = _crossChainNetworks;
        contractMaestroMinInteractions = _contractInteractions;
        eventCollectorMinBadges = _eventBadges;
        
        emit ThresholdsUpdated(
            _veteranDays,
            _volumeWei,
            _crossChainNetworks,
            _contractInteractions,
            _eventBadges
        );
    }
    
    /**
     * @notice Update base URI
     */
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseTokenURI = baseURI_;
    }
    
    /**
     * @notice Update IdentityRegistry reference
     */
    function setIdentityRegistry(address _registry) external onlyOwner {
        if (_registry == address(0)) revert ZeroAddress();
        identityRegistry = IdentityRegistry(_registry);
    }

    // ============================================
    // METADATA
    // ============================================
    
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    function supportsInterface(bytes4 interfaceId) 
        public 
        view 
        virtual 
        override 
        returns (bool) 
    {
        return super.supportsInterface(interfaceId);
    }
}
