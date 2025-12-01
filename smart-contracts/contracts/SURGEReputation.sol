// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SURGEReputation
 * @dev On-chain reputation system for SURGE Protocol
 * @notice SURGE = Superchain User Recognition and Growth Engine
 * @notice Tracks creator reputation, handles flagging, and manages bans
 */
contract SURGEReputation is AccessControl {
    
    // ============ ROLES ============
    
    bytes32 public constant MODERATOR_ROLE = keccak256("MODERATOR_ROLE");
    bytes32 public constant FACTORY_ROLE = keccak256("FACTORY_ROLE");
    
    // ============ STRUCTS ============
    
    struct ReputationData {
        uint256 score;              // 0-1000 reputation score
        uint256 eventsCreated;      // Total events created
        uint256 totalClaims;        // Total claims across all events
        uint256 flagsReceived;      // Number of flags received
        uint256 flagsResolved;      // Flags that were resolved (approved/denied)
        uint256 appealsWon;         // Successful ban appeals
        bool isBanned;              // Ban status
        uint256 bannedAt;           // Ban timestamp
        string banReason;           // Reason for ban
    }
    
    struct Flag {
        address flagger;
        address flaggedCreator;
        address flaggedEvent;
        string reason;
        uint256 timestamp;
        FlagStatus status;
        string moderatorNotes;
    }
    
    struct Appeal {
        address appellant;
        string evidence;
        uint256 timestamp;
        AppealStatus status;
        string moderatorDecision;
    }
    
    enum FlagStatus { Pending, Approved, Dismissed }
    enum AppealStatus { Pending, Approved, Denied }
    
    // ============ STATE VARIABLES ============
    
    // Reputation tracking
    mapping(address => ReputationData) public reputation;
    
    // Flagging system
    Flag[] public flags;
    mapping(address => uint256[]) public creatorFlags;  // creator => flag IDs
    mapping(address => uint256[]) public eventFlags;    // event => flag IDs
    mapping(address => uint256) public userFlagCount;   // user => flags submitted
    
    // Appeals
    Appeal[] public appeals;
    mapping(address => uint256[]) public creatorAppeals; // creator => appeal IDs
    
    // Auto-ban thresholds
    uint256 public autoBanThreshold = 5;  // Auto-ban after X unresolved flags
    uint256 public flagTimeWindow = 30 days;  // Time window for auto-ban calculation
    
    // Reputation constants
    uint256 public constant MAX_REPUTATION = 1000;
    uint256 public constant INITIAL_REPUTATION = 500;
    
    // ============ EVENTS ============
    
    event ReputationUpdated(
        address indexed creator,
        uint256 oldScore,
        uint256 newScore,
        string reason
    );
    
    event EventFlagged(
        uint256 indexed flagId,
        address indexed flagger,
        address indexed flaggedEvent,
        address creator,
        string reason
    );
    
    event FlagResolved(
        uint256 indexed flagId,
        bool approved,
        string moderatorNotes
    );
    
    event CreatorBanned(
        address indexed creator,
        string reason,
        bool automatic
    );
    
    event CreatorUnbanned(address indexed creator);
    
    event AppealSubmitted(
        uint256 indexed appealId,
        address indexed appellant
    );
    
    event AppealResolved(
        uint256 indexed appealId,
        bool approved
    );
    
    // ============ ERRORS ============
    
    error AlreadyBanned();
    error NotBanned();
    error InvalidScore();
    error UnauthorizedFlagger();
    error FlagAlreadyResolved();
    error AppealAlreadyResolved();
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MODERATOR_ROLE, msg.sender);
    }
    
    // ============ REPUTATION FUNCTIONS ============
    
    /**
     * @dev Initialize creator reputation
     * @param _creator Creator address
     */
    function initializeCreator(address _creator) external onlyRole(FACTORY_ROLE) {
        if (reputation[_creator].score == 0) {
            reputation[_creator].score = INITIAL_REPUTATION;
        }
    }
    
    /**
     * @dev Increase reputation
     * @param _creator Creator to reward
     * @param _amount Amount to increase
     * @param _reason Reason for increase
     */
    function increaseReputation(
        address _creator,
        uint256 _amount,
        string memory _reason
    ) external onlyRole(MODERATOR_ROLE) {
        ReputationData storage data = reputation[_creator];
        uint256 oldScore = data.score;
        
        uint256 newScore = oldScore + _amount;
        if (newScore > MAX_REPUTATION) {
            newScore = MAX_REPUTATION;
        }
        
        data.score = newScore;
        
        emit ReputationUpdated(_creator, oldScore, newScore, _reason);
    }
    
    /**
     * @dev Decrease reputation
     * @param _creator Creator to penalize
     * @param _amount Amount to decrease
     * @param _reason Reason for decrease
     */
    function decreaseReputation(
        address _creator,
        uint256 _amount,
        string memory _reason
    ) external onlyRole(MODERATOR_ROLE) {
        ReputationData storage data = reputation[_creator];
        uint256 oldScore = data.score;
        
        uint256 newScore = oldScore > _amount ? oldScore - _amount : 0;
        data.score = newScore;
        
        emit ReputationUpdated(_creator, oldScore, newScore, _reason);
    }
    
    /**
     * @dev Update stats (called by Factory)
     * @param _creator Creator address
     * @param _eventsCreated Total events created
     * @param _totalClaims Total claims
     */
    function updateStats(
        address _creator,
        uint256 _eventsCreated,
        uint256 _totalClaims
    ) external onlyRole(FACTORY_ROLE) {
        reputation[_creator].eventsCreated = _eventsCreated;
        reputation[_creator].totalClaims = _totalClaims;
    }
    
    // ============ FLAGGING SYSTEM ============
    
    /**
     * @dev Flag an event
     * @param _eventContract Event to flag
     * @param _creator Event creator
     * @param _reason Reason for flag
     */
    function flagEvent(
        address _eventContract,
        address _creator,
        string memory _reason
    ) external returns (uint256) {
        // Prevent spam flagging (limit per user)
        if (userFlagCount[msg.sender] > 10) {
            revert UnauthorizedFlagger();
        }
        
        uint256 flagId = flags.length;
        
        flags.push(Flag({
            flagger: msg.sender,
            flaggedCreator: _creator,
            flaggedEvent: _eventContract,
            reason: _reason,
            timestamp: block.timestamp,
            status: FlagStatus.Pending,
            moderatorNotes: ""
        }));
        
        creatorFlags[_creator].push(flagId);
        eventFlags[_eventContract].push(flagId);
        userFlagCount[msg.sender]++;
        
        reputation[_creator].flagsReceived++;
        
        emit EventFlagged(flagId, msg.sender, _eventContract, _creator, _reason);
        
        // Check auto-ban threshold
        _checkAutoBan(_creator);
        
        return flagId;
    }
    
    /**
     * @dev Resolve flag (moderator only)
     * @param _flagId Flag to resolve
     * @param _approved Whether to approve or dismiss
     * @param _notes Moderator notes
     */
    function resolveFlag(
        uint256 _flagId,
        bool _approved,
        string memory _notes
    ) external onlyRole(MODERATOR_ROLE) {
        require(_flagId < flags.length, "Invalid flag ID");
        
        Flag storage flag = flags[_flagId];
        if (flag.status != FlagStatus.Pending) {
            revert FlagAlreadyResolved();
        }
        
        flag.status = _approved ? FlagStatus.Approved : FlagStatus.Dismissed;
        flag.moderatorNotes = _notes;
        
        address creator = flag.flaggedCreator;
        reputation[creator].flagsResolved++;
        
        // Penalize if approved
        if (_approved) {
            this.decreaseReputation(creator, 50, "Flag approved");
            
            // Ban if severe
            if (reputation[creator].flagsReceived >= autoBanThreshold) {
                _banCreator(creator, "Multiple flags approved", false);
            }
        }
        
        emit FlagResolved(_flagId, _approved, _notes);
    }
    
    /**
     * @dev Check and execute auto-ban if threshold met
     */
    function _checkAutoBan(address _creator) internal {
        ReputationData storage data = reputation[_creator];
        
        if (data.isBanned) return;
        
        // Count recent unresolved flags
        uint256[] memory creatorFlagIds = creatorFlags[_creator];
        uint256 recentFlags = 0;
        
        for (uint256 i = 0; i < creatorFlagIds.length; i++) {
            Flag storage flag = flags[creatorFlagIds[i]];
            if (
                flag.status == FlagStatus.Pending &&
                block.timestamp - flag.timestamp <= flagTimeWindow
            ) {
                recentFlags++;
            }
        }
        
        if (recentFlags >= autoBanThreshold) {
            _banCreator(_creator, "Auto-ban: Multiple unresolved flags", true);
        }
    }
    
    // ============ BAN SYSTEM ============
    
    /**
     * @dev Ban creator (internal)
     */
    function _banCreator(
        address _creator,
        string memory _reason,
        bool _automatic
    ) internal {
        ReputationData storage data = reputation[_creator];
        
        if (data.isBanned) return;
        
        data.isBanned = true;
        data.bannedAt = block.timestamp;
        data.banReason = _reason;
        data.score = 0;  // Reset reputation
        
        emit CreatorBanned(_creator, _reason, _automatic);
    }
    
    /**
     * @dev Manual ban (moderator)
     */
    function banCreator(
        address _creator,
        string memory _reason
    ) external onlyRole(MODERATOR_ROLE) {
        if (reputation[_creator].isBanned) revert AlreadyBanned();
        _banCreator(_creator, _reason, false);
    }
    
    /**
     * @dev Unban creator (moderator)
     */
    function unbanCreator(address _creator) external onlyRole(MODERATOR_ROLE) {
        ReputationData storage data = reputation[_creator];
        
        if (!data.isBanned) revert NotBanned();
        
        data.isBanned = false;
        data.score = INITIAL_REPUTATION / 2;  // Start with reduced reputation
        
        emit CreatorUnbanned(_creator);
    }
    
    // ============ APPEAL SYSTEM ============
    
    /**
     * @dev Submit ban appeal
     * @param _evidence Evidence for appeal
     */
    function submitAppeal(string memory _evidence) external returns (uint256) {
        if (!reputation[msg.sender].isBanned) revert NotBanned();
        
        uint256 appealId = appeals.length;
        
        appeals.push(Appeal({
            appellant: msg.sender,
            evidence: _evidence,
            timestamp: block.timestamp,
            status: AppealStatus.Pending,
            moderatorDecision: ""
        }));
        
        creatorAppeals[msg.sender].push(appealId);
        
        emit AppealSubmitted(appealId, msg.sender);
        
        return appealId;
    }
    
    /**
     * @dev Resolve appeal (moderator)
     */
    function resolveAppeal(
        uint256 _appealId,
        bool _approved,
        string memory _decision
    ) external onlyRole(MODERATOR_ROLE) {
        require(_appealId < appeals.length, "Invalid appeal ID");
        
        Appeal storage appeal = appeals[_appealId];
        if (appeal.status != AppealStatus.Pending) {
            revert AppealAlreadyResolved();
        }
        
        appeal.status = _approved ? AppealStatus.Approved : AppealStatus.Denied;
        appeal.moderatorDecision = _decision;
        
        address creator = appeal.appellant;
        
        if (_approved) {
            reputation[creator].appealsWon++;
            this.unbanCreator(creator);
        }
        
        emit AppealResolved(_appealId, _approved);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /**
     * @dev Set auto-ban threshold
     */
    function setAutoBanThreshold(uint256 _threshold) external onlyRole(DEFAULT_ADMIN_ROLE) {
        autoBanThreshold = _threshold;
    }
    
    /**
     * @dev Set flag time window
     */
    function setFlagTimeWindow(uint256 _window) external onlyRole(DEFAULT_ADMIN_ROLE) {
        flagTimeWindow = _window;
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @dev Get creator reputation data
     */
    function getReputation(address _creator) external view returns (ReputationData memory) {
        return reputation[_creator];
    }
    
    /**
     * @dev Get creator flags
     */
    function getCreatorFlags(address _creator) external view returns (uint256[] memory) {
        return creatorFlags[_creator];
    }
    
    /**
     * @dev Get event flags
     */
    function getEventFlags(address _event) external view returns (uint256[] memory) {
        return eventFlags[_event];
    }
    
    /**
     * @dev Get flag details
     */
    function getFlag(uint256 _flagId) external view returns (Flag memory) {
        require(_flagId < flags.length, "Invalid flag ID");
        return flags[_flagId];
    }
    
    /**
     * @dev Get total flags count
     */
    function getFlagsCount() external view returns (uint256) {
        return flags.length;
    }
    
    /**
     * @dev Get pending flags (for moderator queue)
     */
    function getPendingFlags() external view returns (uint256[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < flags.length; i++) {
            if (flags[i].status == FlagStatus.Pending) {
                count++;
            }
        }
        
        uint256[] memory pending = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < flags.length; i++) {
            if (flags[i].status == FlagStatus.Pending) {
                pending[index] = i;
                index++;
            }
        }
        
        return pending;
    }
    
    /**
     * @dev Get appeal details
     */
    function getAppeal(uint256 _appealId) external view returns (Appeal memory) {
        require(_appealId < appeals.length, "Invalid appeal ID");
        return appeals[_appealId];
    }
    
    /**
     * @dev Check if creator is banned
     */
    function isBanned(address _creator) external view returns (bool) {
        return reputation[_creator].isBanned;
    }
}
