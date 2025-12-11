# RFC-001: Governance Voting Questions

## SURGE Identity System — Community Decisions

> **Purpose:** This document contains structured questions for community voting via Snapshot, forums, or governance channels. Each question presents options with tradeoffs for informed decision-making.

---

## How to Participate

1. **Review** each question and its options
2. **Discuss** in community forums (KARMA, Discord, etc.)
3. **Vote** on Snapshot when polls are live
4. **Current defaults** are marked — they will be used if no vote occurs

---

## Question 1: Dispute Period Length

### Context

When a wallet is marked as compromised, there's a dispute period before finalization. This window allows cancellation if marked by mistake.

### Options

| Option | Duration | Pros | Cons |
|--------|----------|------|------|
| **A** | 14 days | Faster recovery, less limbo | Less time to detect false positives |
| **B** ⭐ | 30 days | Balanced security & speed | Standard wait time |
| **C** | 60 days | Maximum safety window | Long period of uncertainty |

### Default: **Option B (30 days)**

### Considerations

- Shorter periods favor legitimate users with actual compromises
- Longer periods protect against sophisticated social engineering
- Attackers with wallet access can't cancel (requires another linked wallet)

---

## Question 2: Primary Wallet Cooldown

### Context

After changing Primary wallet, a cooldown prevents rapid switching. This prevents gaming eligibility by constantly rotating Primary status.

### Options

| Option | Cooldown | Pros | Cons |
|--------|----------|------|------|
| **A** | 7 days | Flexible for active users | Easier to game airdrops |
| **B** ⭐ | 14 days | Balanced flexibility & security | Standard wait |
| **C** | 30 days | Maximum anti-gaming | Inconvenient if mistake made |

### Default: **Option B (14 days)**

### Considerations

- Shorter: better UX for legitimate use cases
- Longer: stronger anti-Sybil for airdrop/gating integrations
- First-time setup has no cooldown (only subsequent changes)

---

## Question 3: Suspended Identity Behavior

### Context

When a compromised wallet was the Primary, and no new Primary is set before finalization, the identity becomes "suspended." How should this be handled?

### Available Options

| Option | Behavior | Pros | Cons |
|--------|----------|------|------|
| **A** ⭐ | Suspension | Identity frozen until new Primary set | Requires user action to recover |
| **B** | Auto-assign | Auto-assign oldest active wallet | No user intervention needed, may assign unwanted wallet |
| **C** | Vote-based | Linked wallets vote on new Primary | Democratic | Complex, slow |

### Default: **Option A (Suspension)**

### Considerations

- Suspension is safest (no automatic decisions)
- Auto-assign could choose a less secure wallet
- Vote-based adds complexity for little benefit

---

## Question 4: Heritage Badges Claim Mode

### Context

Heritage Badges can be claimed from compromised wallet history. How should the claim process work?

### Options

| Option | Mode | Description | Pros | Cons |
|--------|------|-------------|------|------|
| **A** | Auto-mint | Badges automatically minted on compromise finalization | No user action needed | No choice of destination wallet |
| **B** ⭐ | Manual claim | User calls `claimHeritageBadges()` | User controls destination | Requires action |
| **C** | Lazy claim | Minted when queried/displayed | Gas-efficient | Complexity |

### Default: **Option B (Manual claim)**

### Considerations

- Auto-mint decides destination for user (may not want badges on certain wallet)
- Manual gives full control
- Lazy is gas-efficient but adds protocol complexity

---

## Question 5: Minimum Wallets for Compromise Initiation

### Context

Currently, any linked wallet can mark another as compromised. Should we require multiple wallets to agree?

### Options

| Option | Requirement | Pros | Cons |
|--------|-------------|------|------|
| **A** ⭐ | 1 wallet | Fast response to actual compromise | Potential for single-wallet mistakes |
| **B** | 2 wallets | Reduces false positives | Slower response; may not have 2 active |
| **C** | Majority | Democratic | Too slow for emergencies |

### Default: **Option A (1 wallet)**

### Considerations

- In a real compromise, speed is critical
- Most users have 2-3 wallets; requiring majority is impractical
- 30-day dispute period provides safety net for mistakes

---

## Question 6: Heritage Badge Thresholds

### Context

What should the minimum thresholds be for Heritage Badge eligibility?

### Veteran Wallet Badge

| Option | Threshold | Notes |
|--------|-----------|-------|
| **A** | 6 months | Lower barrier |
| **B** ⭐ | 1 year | Standard milestone |
| **C** | 2 years | OG status |

### Default: **Option B (1 year)**

### Cross-Chain Native Badge

| Option | Networks | Notes |
|--------|----------|-------|
| **A** | 2 networks | Easy to achieve |
| **B** ⭐ | 3 networks | Moderate challenge |
| **C** | 5 networks | Power user only |

### Default: **Option B (3 networks)**

### Event Collector Badge

| Option | SURGE Badges | Notes |
|--------|--------------|-------|
| **A** | 10 badges | Casual collector |
| **B** ⭐ | 20 badges | Active participant |
| **C** | 50 badges | Dedicated collector |

### Default: **Option B (20 badges)**

---

## Question 7: Stake for Recovery (Future Phase)

### Context

For users who lose access to all wallets, could staking provide a recovery path? This is for future consideration, not MVP.

### Options

| Option | Mechanism | Pros | Cons |
|--------|-----------|------|------|
| **A** | No staking | Simple, no financial barrier | No recovery for total loss |
| **B** ⭐ | Optional stake | Users can opt-in for enhanced recovery | Added complexity |
| **C** | Required stake | All identities must stake | Financial barrier |

### Default: **Option B (Optional stake)** for future phases

### How it would work (Option B)

1. User stakes tokens to identity
2. If all wallets lost, governance process reviews claim
3. Stake + social verification enables recovery
4. Failed claims forfeit stake

---

## Question 8: API Rate Limits for External Integrations

### Context

External protocols query SURGE Identity API. How should access be throttled?

### Options

| Option | Free Tier | Pro Tier | Notes |
|--------|-----------|----------|-------|
| **A** | 100 req/min | 1000 req/min | Conservative |
| **B** ⭐ | 500 req/min | 5000 req/min | Balanced |
| **C** | Unlimited | N/A | No throttling |

### Default: **Option B (500/5000)**

### Considerations

- Free tier should cover most small protocols
- Unlimited invites abuse
- Pro tier for serious integrations

---

## Question 9: Identity Creation Requirements

### Context

Should creating an identity have any requirements beyond gas?

### Options

| Option | Requirement | Pros | Cons |
|--------|-------------|------|------|
| **A** ⭐ | None (gas only) | Maximum accessibility | Potential spam |
| **B** | Min wallet age (30 days) | Reduces spam | Blocks legitimate new users |
| **C** | Min balance (0.001 ETH) | Proves some investment | Financial barrier |

### Default: **Option A (None)**

### Considerations

- MVP prioritizes adoption
- Spam concerns can be addressed later
- No financial barriers aligns with SURGE mission

---

## Voting Timeline

| Phase | Activity | Duration |
|-------|----------|----------|
| **Discussion** | Forum threads, KARMA | 2 weeks |
| **Snapshot Prep** | Finalize options | 3 days |
| **Voting** | Snapshot polls live | 7 days |
| **Implementation** | Code changes if needed | As required |

---

## How Votes Are Weighted

Options under consideration:

1. **1 wallet = 1 vote** (simple but Sybil-prone)
2. **1 identity = 1 vote** (preferred, requires identity adoption)
3. **Score-weighted** (reputation influences voting power)
4. **Token-weighted** (if SURGE token exists)

**Recommendation for MVP:** 1 identity = 1 vote, verified via IdentityAnchor

---

## Submit Feedback

Before formal voting, share thoughts:

- **KARMA:** governance.surge-me-up.eth (or relevant ENS)
- **Forum:** community.surge-me-up.vercel.app/governance
- **Discord:** #governance channel
- **GitHub:** Create discussion in repository

---

*Document updated: 2025-12-11 — SURGE Core Team*
