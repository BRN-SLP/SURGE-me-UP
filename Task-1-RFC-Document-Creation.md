# Task 1 — SURGE Identity System RFC (Technical Spec for AI Agent)

## Objective

Create a complete, technically precise RFC for the **SURGE Identity System** — a multi-wallet identity, wallet compromise protection, and reputation preservation protocol for the Optimism Superchain (Base, OP Mainnet, Celo, Zora, etc.).

The output must fully reflect the latest design decisions:

- Identity = core of the project.
- NFT badges are a consequence / signal layer, not the core.
- No LayerZero. Superchain-native and/or indexer-based sync.
- Primary wallet, suspended identity, compromised flow, heritage badges.

The result must be suitable for:

- Internal engineering team
- External reviewers (grants, auditors, ecosystem partners)
- Community discussion (KARMA, forums, Snapshot)

---

## Output Files

The agent must generate **4 Markdown files**:

1. `RFC-001-SURGE-Identity.md`  
   High-level RFC with motivation, architecture, and spec.

2. `RFC-001-Technical-Spec.md`  
   Detailed contract-level technical specification.

3. `RFC-001-FAQ.md`  
   FAQ for devs, users, and ecosystem partners.

4. `RFC-001-Voting-Questions.md`  
   Structured questions for community voting (Snapshot / forum).

All files must be in **Markdown**, clean, structured, with headings and lists.

---

## RFC-001-SURGE-Identity.md — Structure & Requirements

### 1. Title & Summary

- Title: `RFC-001: SURGE Identity System – Multi-Wallet Identity & Reputation Preservation`
- Short summary (3–5 paragraphs):
  - Problem: wallet compromise, identity loss, fragmented cross-chain reputation.
  - Solution: one identity ↔ many wallets, recovery, heritage badges, Primary wallet.
  - Scope: Optimism Superchain (Base, OP, Celo, Zora, + others).

### 2. Motivation

Explain in detail:

- Why wallet-based identity is brittle:
  - Loss/compromise of keys = loss of reputation, airdrops, DAO rights.
  - Real-world example: long-lived wallet with years of history gets compromised.
- Why cross-chain reputation is currently fragmented.
- Why ENS / POAP / simple NFTs do NOT solve:
  - ENS tied to address, no recovery.
  - POAP = proof of event, not identity continuity.
- Why SURGE focuses on:
  - **Recovery of identity** after compromise.
  - **Aggregation** of multi-chain activity into one identity.

Include 3–5 user stories, e.g.:

- Power user loses hot wallet → wants to keep 3+ years of DeFi/activity/POAP-like history.
- Airdrop program wants to target “real veterans” across Superchain, not farmers.
- DAO wants to weight voting by identity score, not wallet count.

### 3. High-Level Architecture

Describe in clear terms:

- A user has **one SURGE Identity** (identityId).
- Multiple wallets can be linked to this identity.
- Each linked wallet gets a **soulbound IdentityAnchor NFT** with the same tokenId (identityId).
- Wallets cannot be “unlinked” or linked to another identity.
- One wallet at a time is marked as **Primary**, used for:
  - Display of aggregated score.
  - External eligibility checks (airdrops, gating, etc.).
- If a wallet is compromised:
  - It can be marked as compromised from another linked wallet.
  - History is preserved, wallet blocked.
  - Heritage badges can be claimed to new active wallets.

Add one or two diagrams (use mermaid) to show:

- Identity ↔ wallets relationship.
- Status transitions.

---

## RFC-001-Technical-Spec.md — Technical Details

This file must go deep into the implementation.

### 1. Data Structures

Define all core structs:

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
uint256 activityCountsUntil; // timestamp of markAsCompromised (freeze point)
}

text

Define SBT metadata structure (even if off-chain JSON):

{
"tokenId": 12345,
"identityId": 12345,
"wallet": "0xWallet",
"status": "active|pending_compromise|compromised",
"linkedAt": 1672531200,
"compromiseInitiatedAt": null,
"compromisedAt": null,
"isPrimary": false
}

text

### 2. Contracts

Specify **three** main contracts and their responsibilities:

#### 2.1 IdentityAnchor.sol

- ERC-721 Soulbound:
  - Non-transferable.
  - Minted only by IdentityRegistry.
  - One SBT per wallet maximum.
- **Same tokenId** (identityId) for all wallets in the same identity.
- Used as visible on-chain proof that wallets share identity.

Key properties:

- Mapping from `wallet → tokenId`.
- Enforce: wallet cannot mint second IdentityAnchor.

#### 2.2 IdentityRegistry.sol

Core logic contract.

Functions to specify:

1. **Identity Creation**
function createIdentity(address initialWallet) external returns (uint256 identityId);

```

```text
- Creates new identity if wallet has none.
- Mints SBT via IdentityAnchor to `initialWallet`.
- Sets `primaryWallet = initialWallet`.
- Initializes `Identity` and `WalletStatus`.

2. **Link Wallet**
function linkWallet(
uint256 identityId,
address existingLinkedWallet,
address newWallet,
bytes existingWalletSignature,
bytes newWalletSignature
) external;

```

```text
Requirements:
- both wallets have signed a message linking newWallet to identityId.
- existingLinkedWallet is already linked to identityId.
- newWallet has NO existing identity/SBT.
- Mints SBT with same identityId to newWallet.
- Creates `WalletStatus` for newWallet.

3. **Set Primary Wallet**
function setPrimaryWallet(uint256 identityId, address newPrimary) external;

text
Rules:
- Caller must be linked wallet of identityId.
- newPrimary must be:
  - linked,
  - NOT pending_compromise,
  - NOT compromised.
- Enforce 14-day cooldown:
  - `block.timestamp >= lastPrimaryChangeAt + 14 days`.
- If identity was `isSuspended == true`, setting newPrimary unsuspends.

4. **Mark as Compromised**
function markAsCompromised(uint256 identityId, address walletToMark) external;

text
Rules:
- Caller must be **another** linked wallet of the same identity (NOT walletToMark).
- When called:
  - Set `isPendingCompromise = true`.
  - Set `compromiseInitiatedAt = block.timestamp`.
  - Set `activityCountsUntil = block.timestamp`.
  - Forbid any further interactions from `walletToMark`.
  - If `walletToMark` was primary: `primaryWallet = address(0)`.
- Immediately blocks login / usage from this wallet.

5. **Cancel Compromise**
function cancelCompromise(uint256 identityId, address wallet) external;

text
Rules:
- Caller must be a linked wallet (NOT the compromised one).
- `isPendingCompromise == true`.
- `block.timestamp < compromiseInitiatedAt + 30 days`.
- On success:
  - `isPendingCompromise = false`.
  - `compromiseInitiatedAt = 0`.
  - `activityCountsUntil = 0`.

6. **Finalize Compromise**
function finalizeCompromise(uint256 identityId, address wallet) external;

text
Rules:
- `isPendingCompromise == true`.
- `block.timestamp >= compromiseInitiatedAt + 30 days`.
- On success:
  - `isPendingCompromised = false`.
  - `isCompromised = true`.
  - `compromisedAt = block.timestamp`.
  - If `primaryWallet == address(0)` → set `identity.isSuspended = true`.

7. **Modifiers & Checks**
- `modifier onlyLinked(identityId)`.
- `modifier notCompromisedWallet()`.
- `modifier identityNotSuspended(identityId)`.

8. **Score & History**
- Define generic hooks:
  - `recordActivity(address wallet, ActivityType, uint256 amount)` – for later integration.
  - `getIndividualScore(wallet)` – reads stored stats.
  - `getAggregatedScore(identityId)` – sums all linked wallets (compromised included, but only up to `activityCountsUntil`).

#### 2.3 HeritageBadges.sol

- Mint heritage badges based on history of **compromised** wallets.
- Badge categories:
- Veteran Wallet (by age).
- Volume Warrior (by volume).
- Cross-Chain Native (by number of networks).
- Contract Maestro (by unique contract interactions).
- For the RFC, assume historical metrics come either:
- from IdentityRegistry (it stores aggregate stats),
- or from a trusted indexer.

Function:

function claimHeritageBadges(
uint256 identityId,
address compromisedWallet,
address destinationWallet
) external;

text

Rules:

- `compromisedWallet` must belong to identityId and `isCompromised == true`.
- `destinationWallet` must be linked + active.
- Each badge type claimable only once per `compromisedWallet`.
- Emits events logging which stats were used.

---

### 3. Wallet Status State Machine

Document clearly:

ACTIVE
└─ markAsCompromised() → PENDING_COMPROMISE (30-day window, wallet blocked)
PENDING_COMPROMISE
├─ cancelCompromise() → ACTIVE (only from other linked wallet, within 30 days)
└─ finalizeCompromise() → COMPROMISED (after 30 days)
COMPROMISED
└─ Final, irreversible
```

Clarify:

- In `PENDING_COMPROMISE`:
  - wallet is **blocked immediately** for SURGE functions.
  - history is still preserved; last contributing timestamp = `activityCountsUntil`.
- In `COMPROMISED`:
  - wallet blocked permanently.
  - may be used as source for heritage badges.
- `Suspended Identity`:
  - triggered when compromise finalized and no new Primary set.
  - identity blocked from actions until new Primary set.

---

### 4. Primary Wallet & Anti-Sybil

Explain in detail:

- Aggregated score is only externally exposed for `primaryWallet`.
- Non-primary wallets:
  - see their **individual** score in UI.
  - external API returns either 0 or a flag “not primary”.
- All external eligibility checks (airdrops, gating) should:
  - query `GET /api/identity/{wallet}`.
  - only use `aggregatedScore` when `isPrimary == true`.
- Primary wallet:
  - can be changed unlimited times, but with **14-day cooldown**.
  - cannot be in pending_compromise or compromised state.
  - if Primary is marked compromised → must choose new Primary before finalize, or identity becomes suspended.

---

### 5. Deployment & Networks

Document deployment strategy:

- **Phase 0 (MVP):**
  - Deploy IdentityAnchor + IdentityRegistry + HeritageBadges only on **Base**.
  - Treat Base as initial source of truth.
  - Existing SURGE badge contracts on all networks continue as-is.

- **Phase 1:**
  - Deploy identity contracts on Optimism, Celo, Zora.
  - Use backend indexer to sync link/compromise events from Base to other chains (no LayerZero).
  - Introduce multi-chain identity gradually.

- **Phase 2:**
  - Deploy to all 19 Superchain networks.
  - Optionally implement OP Stack native L2-L2 messaging for direct cross-chain sync.
  - Backend sync can remain as fallback until native messaging production-ready.

---

### 6. API Specification

Define endpoints (pseudo-REST):

#### `GET /api/identity/{wallet}`

Response example:

{
"wallet": "0xCCC...",
"hasIdentity": true,
"identityId": 12345,
"isPrimary": true,
"status": "active",
"aggregatedScore": 847,
"individualScore": 100,
"linkedWallets": ["0xAAA...", "0xBBB...", "0xCCC..."],
"primaryWallet": "0xCCC...",
"createdAt": 1672531200,
"isSuspended": false
}

text

For non-primary wallet:

{
"wallet": "0xBBB...",
"hasIdentity": true,
"identityId": 12345,
"isPrimary": false,
"status": "active",
"aggregatedScore": null,
"individualScore": 435,
"primaryWallet": "0xCCC...",
"message": "This wallet is linked but not primary. Use primary wallet for full reputation."
}

text

For compromised wallet:

{
"wallet": "0xAAA...",
"hasIdentity": true,
"identityId": 12345,
"isPrimary": false,
"status": "compromised",
"aggregatedScore": 0,
"individualScore": 0,
"primaryWallet": "0xCCC...",
"message": "Wallet is compromised. Identity must be accessed via active primary wallet."
}

text

Also define:

- `GET /api/identity/{wallet}/badges`
- `GET /api/identity/{wallet}/history` (optional)
- Notes for external integrators: always treat identity, not wallet, as the subject.

---

### 7. Voting Questions (Summary)

Prepare in RFC a pointer to `RFC-001-Voting-Questions.md` with:

- Dispute period (30 days vs other options — though default here is 30).
- Primary cooldown (7, 14, 30 days).
- Suspension vs auto-assign Primary (design chooses suspension now, but open to discussion).
- Heritage badges claim mode (auto vs manual vs lazy).
- Stake for full recovery (Phase 1, not MVP).

---

## RFC-001-FAQ.md

Agent must include:

- Q: What happens if my primary wallet is compromised?
- Q: Can I reverse marking as compromised?
- Q: Can I unlink a wallet?
- Q: Can someone else steal my identity by linking my wallet?
- Q: What if I do nothing during the 30-day window?
- Q: Why is score only visible on Primary?

Answers must align with all logic above.

---

## RFC-001-Voting-Questions.md

Agent should format questions like:

SURGE Identity – Governance Questions

1. Dispute Period Length
Option A: 14 days

Option B: 30 days (current default)

Option C: 60 days

...

```

---

## Style Requirements

- Language: English (technical, clear).
- Formatting: Markdown, headings H1–H3, bullet lists, code blocks.
- No marketing fluff, only technical + architectural clarity.
- Use consistent terminology: Identity, Primary, linked wallet, compromised, pending_compromise, suspended, heritage badges.
