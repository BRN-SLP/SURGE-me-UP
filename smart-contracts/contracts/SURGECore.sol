// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title SURGECore
 * @dev Main NFT contract for individual SURGE events
 * @notice SURGE = Superchain User Recognition and Growth Engine
 * @notice Each SURGE event gets its own instance of this contract
 */
contract SURGECore is ERC721Enumerable, Ownable {
    
    // ============ ENUMS ============
    
    enum Tier { Official, Verified, Community }
    
    enum DistributionMode {
        Public,         // Anyone can mint
        Whitelist,      // Pre-approved addresses (Merkle tree)
        MintLinks,      // Unique claim links (hash-based)
        SocialVerify,   // Twitter/Farcaster verification (placeholder)
        EmailVerify     // Email verification (placeholder)
    }
    
    // ============ STRUCTS ============
    
    struct EventMetadata {
        string name;
        string description;
        string imageURI;
        uint256 chainId;
        Tier tier;
        uint256 maxSupply;
        uint256 expiryTimestamp;
        DistributionMode mode;
        address creator;
    }
    
    // ============ STATE VARIABLES ============
    
    EventMetadata public eventMetadata;
    uint256 public claimed;
    bool public isPaused;
    
    // Distribution-specific data
    mapping(address => bool) public hasClaimed;
    mapping(address => bool) public whitelist;      // For simple whitelist mode
    mapping(bytes32 => bool) public usedMintLinks;  // For mint links mode
    bytes32 public merkleRoot;                       // For Merkle tree whitelist
    
    // Bridge support
    mapping(uint256 => bool) public lockedForBridge;
    address public bridgeContract;
    
    // Factory reference
    address public factory;
    
    // ============ EVENTS ============
    
    event SURGEClaimed(address indexed claimer, uint256 indexed tokenId, uint256 timestamp);
    event EventPaused(bool paused);
    event BridgeLocked(uint256 indexed tokenId, uint256 destChainId);
    event BridgeUnlocked(uint256 indexed tokenId);
    event BridgeMinted(address indexed to, uint256 indexed tokenId, uint256 sourceChainId);
    
    // ============ ERRORS ============
    
    error EventExpired();
    error ContractPaused();
    error SupplyExhausted();
    error AlreadyClaimed();
    error NotWhitelisted();
    error InvalidMintLink();
    error InvalidProof();
    error UnauthorizedBridge();
    error TokenLocked();
    
    // ============ CONSTRUCTOR ============
    
    constructor(
        EventMetadata memory _metadata,
        address _factory
    ) ERC721(_metadata.name, "SURGE") Ownable(msg.sender) {
        eventMetadata = _metadata;
        factory = _factory;
        claimed = 0;
        isPaused = false;
    }
    
    // ============ MODIFIERS ============
    
    modifier whenNotPaused() {
        if (isPaused) revert ContractPaused();
        _;
    }
    
    modifier whenNotExpired() {
        if (block.timestamp > eventMetadata.expiryTimestamp) revert EventExpired();
        _;
    }
    
    modifier onlyBridge() {
        if (msg.sender != bridgeContract) revert UnauthorizedBridge();
        _;
    }
    
    // ============ CLAIMING FUNCTIONS ============
    
    /**
     * @dev Public claiming (DistributionMode.Public)
     * @param _to Address to mint to
     */
    function claim(address _to) external whenNotPaused whenNotExpired {
        if (eventMetadata.mode != DistributionMode.Public) {
            revert("Not public distribution");
        }
        _executeClaim(_to);
    }
    
    /**
     * @dev Whitelist claiming with Merkle proof (DistributionMode.Whitelist)
     * @param _to Address to mint to
     * @param _proof Merkle proof
     */
    function claimWithProof(
        address _to,
        bytes32[] calldata _proof
    ) external whenNotPaused whenNotExpired {
        if (eventMetadata.mode != DistributionMode.Whitelist) {
            revert("Not whitelist distribution");
        }
        
        bytes32 leaf = keccak256(abi.encodePacked(_to));
        if (!MerkleProof.verify(_proof, merkleRoot, leaf)) {
            revert InvalidProof();
        }
        
        _executeClaim(_to);
    }
    
    /**
     * @dev Claiming with unique mint link (DistributionMode.MintLinks)
     * @param _to Address to mint to
     * @param _linkHash Unique link hash
     * @param _signature Signature from creator
     */
    function claimWithLink(
        address _to,
        bytes32 _linkHash,
        bytes calldata _signature
    ) external whenNotPaused whenNotExpired {
        if (eventMetadata.mode != DistributionMode.MintLinks) {
            revert("Not mint link distribution");
        }
        
        if (usedMintLinks[_linkHash]) {
            revert InvalidMintLink();
        }
        
        // Mark link as used
        usedMintLinks[_linkHash] = true;
        
        _executeClaim(_to);
    }
    
    /**
     * @dev Internal claim execution
     */
    function _executeClaim(address _to) internal {
        if (hasClaimed[_to]) revert AlreadyClaimed();
        if (claimed >= eventMetadata.maxSupply) revert SupplyExhausted();
        
        uint256 tokenId = claimed + 1;
        claimed++;
        hasClaimed[_to] = true;
        
        _safeMint(_to, tokenId);
        
        emit SURGEClaimed(_to, tokenId, block.timestamp);
    }
    
    // ============ BRIDGE FUNCTIONS ============
    
    /**
     * @dev Lock token for bridging to another chain
     * @param _tokenId Token to lock
     */
    function lockForBridge(uint256 _tokenId) external onlyBridge {
        if (lockedForBridge[_tokenId]) revert TokenLocked();
        
        lockedForBridge[_tokenId] = true;
        emit BridgeLocked(_tokenId, 0); // destChainId passed from bridge
    }
    
    /**
     * @dev Unlock token after failed bridge or return
     * @param _tokenId Token to unlock
     */
    function unlockFromBridge(uint256 _tokenId) external onlyBridge {
        lockedForBridge[_tokenId] = false;
        emit BridgeUnlocked(_tokenId);
    }
    
    /**
     * @dev Mint token on destination chain (called by bridge)
     * @param _to Recipient address
     * @param _originalTokenId Original token ID from source chain
     */
    function mintFromBridge(
        address _to,
        uint256 _originalTokenId
    ) external onlyBridge returns (uint256) {
        uint256 tokenId = claimed + 1;
        claimed++;
        
        _safeMint(_to, tokenId);
        
        emit BridgeMinted(_to, tokenId, 0); // sourceChainId from bridge
        return tokenId;
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Set bridge contract address
     */
    function setBridgeContract(address _bridge) external onlyOwner {
        bridgeContract = _bridge;
    }
    
    /**
     * @dev Set Merkle root for whitelist distribution
     */
    function setMerkleRoot(bytes32 _root) external onlyOwner {
        merkleRoot = _root;
    }
    
    /**
     * @dev Pause/unpause event
     */
    function setPaused(bool _paused) external onlyOwner {
        isPaused = _paused;
        emit EventPaused(_paused);
    }
    
    /**
     * @dev Update event metadata (limited fields)
     */
    function updateMetadata(
        string memory _description,
        uint256 _expiryTimestamp
    ) external onlyOwner {
        eventMetadata.description = _description;
        eventMetadata.expiryTimestamp = _expiryTimestamp;
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get full event metadata
     */
    function getEventMetadata() external view returns (EventMetadata memory) {
        return eventMetadata;
    }
    
    /**
     * @dev Get remaining supply
     */
    function getRemainingSupply() external view returns (uint256) {
        return eventMetadata.maxSupply - claimed;
    }
    
    /**
     * @dev Check if event is expired
     */
    function isExpired() external view returns (bool) {
        return block.timestamp > eventMetadata.expiryTimestamp;
    }
    
    /**
     * @dev Check if address has claimed
     */
    function hasAddressClaimed(address _user) external view returns (bool) {
        return hasClaimed[_user];
    }
    
    /**
     * @dev Get token URI (override to use IPFS base)
     */
    function tokenURI(uint256 _tokenId) public view virtual override returns (string memory) {
        _requireOwned(_tokenId);
        return eventMetadata.imageURI;
    }
    
    /**
     * @dev Prevent transfer of locked tokens
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        if (lockedForBridge[tokenId] && to != address(0)) {
            revert TokenLocked();
        }
        return super._update(to, tokenId, auth);
    }
}
