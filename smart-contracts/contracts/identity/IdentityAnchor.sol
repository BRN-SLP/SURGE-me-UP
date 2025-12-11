// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title IdentityAnchor
 * @author SURGE Core Team
 * @notice Soulbound ERC-721 token proving wallet membership in a SURGE Identity
 * @dev Each linked wallet receives an SBT with the SAME tokenId (equal to identityId)
 * 
 * Key Properties:
 * - Non-transferable (soulbound)
 * - Non-burnable
 * - One per wallet maximum
 * - Same tokenId for all wallets in an identity
 */
contract IdentityAnchor is ERC721, Ownable {
    // ============================================
    // ERRORS
    // ============================================
    
    error OnlyIdentityRegistry();
    error WalletAlreadyHasAnchor(address wallet);
    error SoulboundTokenCannotBeTransferred();
    error InvalidIdentityId();
    error ZeroAddress();

    // ============================================
    // EVENTS
    // ============================================
    
    event IdentityAnchorMinted(
        address indexed wallet,
        uint256 indexed identityId,
        uint256 timestamp
    );
    
    event IdentityRegistryUpdated(
        address indexed oldRegistry,
        address indexed newRegistry
    );

    // ============================================
    // STATE VARIABLES
    // ============================================
    
    /// @notice Address of the IdentityRegistry contract (only caller allowed to mint)
    address public identityRegistry;
    
    /// @notice Mapping from wallet address to their identity tokenId (0 = no anchor)
    mapping(address => uint256) public walletToIdentityId;
    
    /// @notice Mapping from identityId to array of linked wallets
    mapping(uint256 => address[]) public identityIdToWallets;
    
    /// @notice Base URI for token metadata
    string private _baseTokenURI;

    // ============================================
    // MODIFIERS
    // ============================================
    
    modifier onlyRegistry() {
        if (msg.sender != identityRegistry) {
            revert OnlyIdentityRegistry();
        }
        _;
    }

    // ============================================
    // CONSTRUCTOR
    // ============================================
    
    constructor(
        string memory name_,
        string memory symbol_,
        string memory baseURI_
    ) ERC721(name_, symbol_) Ownable(msg.sender) {
        _baseTokenURI = baseURI_;
    }

    // ============================================
    // ADMIN FUNCTIONS
    // ============================================
    
    /**
     * @notice Set the IdentityRegistry contract address
     * @param _registry Address of the IdentityRegistry contract
     */
    function setIdentityRegistry(address _registry) external onlyOwner {
        if (_registry == address(0)) revert ZeroAddress();
        
        emit IdentityRegistryUpdated(identityRegistry, _registry);
        identityRegistry = _registry;
    }
    
    /**
     * @notice Update the base URI for token metadata
     * @param baseURI_ New base URI
     */
    function setBaseURI(string memory baseURI_) external onlyOwner {
        _baseTokenURI = baseURI_;
    }

    // ============================================
    // MINTING (Registry Only)
    // ============================================
    
    /**
     * @notice Mint a new IdentityAnchor SBT to a wallet
     * @dev Only callable by IdentityRegistry
     * @param wallet Address to mint the SBT to
     * @param identityId The identity ID (same as tokenId for all wallets in identity)
     * @return The minted token ID (same as identityId)
     */
    function mint(
        address wallet,
        uint256 identityId
    ) external onlyRegistry returns (uint256) {
        if (wallet == address(0)) revert ZeroAddress();
        if (identityId == 0) revert InvalidIdentityId();
        if (walletToIdentityId[wallet] != 0) {
            revert WalletAlreadyHasAnchor(wallet);
        }
        
        // Store the mapping
        walletToIdentityId[wallet] = identityId;
        identityIdToWallets[identityId].push(wallet);
        
        // Mint the SBT
        // Note: We use _safeMint but the token is soulbound (cannot transfer)
        _safeMint(wallet, identityId);
        
        emit IdentityAnchorMinted(wallet, identityId, block.timestamp);
        
        return identityId;
    }

    // ============================================
    // VIEW FUNCTIONS
    // ============================================
    
    /**
     * @notice Get the identity ID for a wallet
     * @param wallet Address to query
     * @return identityId The identity ID (0 if no anchor)
     */
    function getIdentityId(address wallet) external view returns (uint256) {
        return walletToIdentityId[wallet];
    }
    
    /**
     * @notice Get all wallets linked to an identity
     * @param identityId The identity ID to query
     * @return wallets Array of linked wallet addresses
     */
    function getLinkedWallets(uint256 identityId) external view returns (address[] memory) {
        return identityIdToWallets[identityId];
    }
    
    /**
     * @notice Get the number of wallets linked to an identity
     * @param identityId The identity ID to query
     * @return count Number of linked wallets
     */
    function getLinkedWalletCount(uint256 identityId) external view returns (uint256) {
        return identityIdToWallets[identityId].length;
    }
    
    /**
     * @notice Check if a wallet has an IdentityAnchor
     * @param wallet Address to check
     * @return hasAnchor True if wallet has an anchor
     */
    function hasAnchor(address wallet) external view returns (bool) {
        return walletToIdentityId[wallet] != 0;
    }

    // ============================================
    // SOULBOUND ENFORCEMENT
    // ============================================
    
    /**
     * @notice Override to make tokens soulbound (non-transferable)
     * @dev Reverts on any transfer attempt except minting
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Allow minting (from == address(0))
        // Block all transfers (from != address(0) && to != address(0))
        // Could allow burning in future (to == address(0))
        if (from != address(0) && to != address(0)) {
            revert SoulboundTokenCannotBeTransferred();
        }
        
        return super._update(to, tokenId, auth);
    }

    // ============================================
    // METADATA
    // ============================================
    
    /**
     * @notice Returns the base URI for token metadata
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
    
    /**
     * @notice Check if contract supports an interface
     * @dev Supports ERC721 and ERC165
     */
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
