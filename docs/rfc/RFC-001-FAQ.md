# RFC-001: Frequently Asked Questions

## SURGE Identity System — FAQ for Users, Developers & Partners

---

## General Questions

### Q: What is the SURGE Identity System?

**A:** The SURGE Identity System is a multi-wallet identity layer for the Optimism Superchain. It allows you to:

- Link multiple wallets to a single on-chain identity
- Protect your reputation if a wallet is compromised
- Aggregate your cross-chain activity under one identity
- Designate a "Primary" wallet for external eligibility checks

Think of it as your Web3 passport that survives wallet compromise.

---

### Q: How is this different from ENS?

**A:** ENS ties a name to a single address. If that address is compromised, your ENS provides no recovery.

SURGE Identity:

- Links multiple wallets to one identity
- Has a built-in compromise/recovery flow
- Preserves reputation history even after wallet loss
- Aggregates activity across all your wallets

They can work together: your ENS could point to your SURGE Primary wallet.

---

### Q: Do I need to pay to create an identity?

**A:** Creating an identity only costs gas fees on the network. There are no protocol fees in the MVP.

Future phases may introduce optional features (like staking for enhanced recovery) that could have associated costs.

---

## Wallet Management

### Q: Can I unlink a wallet from my identity?

**A:** **No.** Once a wallet is linked to an identity, it cannot be unlinked. This is intentional:

1. **Security:** Prevents attackers from stealing your identity by unlinking your wallets
2. **Reputation integrity:** All your history remains associated with your identity
3. **Sybil resistance:** Prevents gaming the system by cycling wallets

If a wallet is compromised, you can mark it as compromised (which blocks it) rather than unlinking.

---

### Q: How many wallets can I link to one identity?

**A:** There is no hard limit in the protocol. However:

- Each link requires signatures from both wallets
- More wallets = larger attack surface
- Most users will have 2-5 linked wallets (hot, cold, hardware, etc.)

---

### Q: Can someone else steal my identity by linking my wallet?

**A:** **No.** Linking requires a cryptographic signature from BOTH:

1. An already-linked wallet in the identity
2. The new wallet being linked

Without your private key, no one can link your wallet to their identity or any identity.

---

### Q: What is a Primary wallet and why does it matter?

**A:** The Primary wallet is your designated "main" wallet for external interactions:

- **Aggregated score:** Only the Primary wallet shows your combined reputation score
- **Eligibility:** Airdrops, gating, and DAO votes typically query the Primary wallet
- **Display:** External apps show your full identity data for the Primary wallet

Non-primary wallets show individual scores only, protecting you from Sybil attacks while still allowing multi-wallet use.

---

## Compromise & Recovery

### Q: What happens if my Primary wallet is compromised?

**A:** Here's the step-by-step flow:

1. **Immediately:** From any other linked wallet, call `markAsCompromised()` on the compromised wallet
2. **Effect:** The compromised wallet is instantly blocked from all SURGE functions
3. **Primary reset:** Since your Primary is compromised, you must designate a new Primary
4. **30-day window:** A 30-day dispute period begins (in case of false alarm)
5. **Finalize:** After 30 days, anyone can call `finalizeCompromise()` to permanently mark it
6. **Heritage:** You can claim Heritage Badges from the compromised wallet's history

Your reputation and history are preserved — only the wallet access is blocked.

---

### Q: Can I reverse marking a wallet as compromised?

**A:** **Yes, but only within 30 days.**

If a wallet was marked as compromised by mistake (e.g., you still have access):

1. Another linked wallet must call `cancelCompromise()`
2. This must happen before the 30-day dispute period ends
3. The wallet returns to ACTIVE status

After 30 days, the compromise is finalized and **cannot be reversed**.

---

### Q: What if I do nothing during the 30-day window?

**A:** After 30 days:

1. Anyone can call `finalizeCompromise()` to finalize the status
2. The wallet becomes permanently COMPROMISED
3. If no new Primary was set, your identity becomes SUSPENDED

**Suspended identity:**

- Cannot perform any actions
- Stays suspended until you set a new Primary wallet from another linked wallet
- Your history is preserved; you're just "locked out" temporarily

**Recommendation:** Always set a new Primary wallet before the 30-day window ends.

---

### Q: What if ALL my wallets are compromised?

**A:** This is the worst-case scenario. Currently:

- Your identity would be suspended with no active wallets to recover
- Your reputation history is preserved but inaccessible

**Future consideration:** Stake-based recovery (Phase 2+) where staking tokens could prove ownership and enable recovery through governance.

**Prevention:** Link at least one cold/hardware wallet that's rarely used.

---

## Reputation & Scoring

### Q: Why is my aggregated score only visible on my Primary wallet?

**A:** **Anti-Sybil protection.**

If all wallets showed aggregated scores, users could:

1. Create 10 wallets
2. Link them to one identity
3. All 10 wallets would appear to have the full reputation

By limiting to Primary only:

- External protocols see ONE wallet representing the identity
- Cannot game airdrops by appearing as multiple high-reputation addresses
- Your individual wallets still have their individual scores visible

---

### Q: How is my score calculated?

**A:** The aggregated score combines:

- Transaction activity across all linked wallets
- SURGE badges collected
- Network diversity (cross-chain activity)
- Wallet age
- Unique contract interactions

For compromised wallets, only activity **before** the compromise timestamp counts.

---

### Q: Do compromised wallets affect my score?

**A:** **Positively, yes!**

- Activity from compromised wallets (up to compromise timestamp) still counts toward your aggregated score
- You can claim Heritage Badges from their history
- The compromise blocks the wallet, not the historical contribution

This is the key innovation: your history survives wallet loss.

---

## Heritage Badges

### Q: What are Heritage Badges?

**A:** Heritage Badges are achievement tokens you can claim based on a compromised wallet's history:

| Badge | Criteria |
|-------|----------|
| Veteran Wallet | Wallet was active for 1+ years |
| Volume Warrior | High total transaction volume |
| Cross-Chain Native | Active on 3+ Superchain networks |
| Contract Maestro | 50+ unique contract interactions |
| Event Collector | 20+ SURGE badges collected |

They prove your Web3 experience survived wallet compromise.

---

### Q: How do I claim Heritage Badges?

**A:** Steps:

1. Ensure the compromised wallet's status is COMPROMISED (after 30-day finalization)
2. Call `claimHeritageBadges(identityId, compromisedWallet, destinationWallet)`
3. The destination must be an active linked wallet
4. Badges are minted to your destination wallet

Each badge type can only be claimed once per compromised wallet.

---

## Technical & Integration

### Q: What networks is this deployed on?

**A:**

**Existing SURGE Badge Contracts (8 mainnet networks):**

- Base, Optimism, Celo, Zora, Ink, Lisk, Unichain, Soneium

**Identity System Deployment Plan:**

- **MVP (Phase 0):** Base mainnet only
- **Phase 1:** All 8 mainnet networks
- **Phase 2:** Full sync and optional OP Stack native messaging

Existing SURGE badge contracts continue on all 8 networks independently.

---

### Q: How does cross-chain sync work?

**A:** MVP uses off-chain indexing:

1. Identity contracts on Base track state
2. Backend indexer reads badge data from all networks
3. Aggregated view provided via API

Phase 1+ will deploy identity contracts to all networks with event-based synchronization — no LayerZero dependency, fully Superchain-native.

---

### Q: How should my protocol integrate with SURGE Identity?

**A:** For airdrops, gating, or reputation checks:

```javascript
// Query the API
const response = await fetch(`https://surge-me-up.vercel.app/api/identity/${wallet}`);
const data = await response.json();

// Check if wallet is primary and active
if (data.isPrimary && data.status === "active") {
    // Use data.aggregatedScore for eligibility
    allocateAirdrop(wallet, data.aggregatedScore);
} else if (data.hasIdentity && !data.isPrimary) {
    // Linked but not primary - reduced allocation or redirect
    redirectToPrimary(data.primaryWallet);
} else {
    // No identity - treat as new/unknown user
    handleNewUser(wallet);
}
```

---

### Q: Are the smart contracts audited?

**A:**

- **Current status:** RFC stage (pre-implementation)
- **Plan:** Full audit before mainnet deployment
- **Audit scope:** IdentityAnchor, IdentityRegistry, HeritageBadges

Follow project updates for audit announcements.

---

## Governance & Future

### Q: Can I vote on protocol parameters?

**A:** Yes! Key parameters open for governance:

- Dispute period length (currently 30 days)
- Primary wallet cooldown (currently 14 days)
- Heritage badge thresholds
- Future fee structures

See [RFC-001-Voting-Questions.md](./RFC-001-Voting-Questions.md) for active governance questions.

---

### Q: What's coming in future phases?

**A:** Roadmap highlights:

- **Phase 1:** Multi-chain identity deployment
- **Phase 2:** Full Superchain coverage, optional staking mechanics
- **Phase 3:** Advanced recovery options, governance integration
- **Future:** Social graph features, reputation lending, cross-ecosystem portability

---

## Still Have Questions?

- **Community:** Join our Discord/Telegram (links on surge-me-up.vercel.app)
- **GitHub:** File issues or discussions in the repository
- **KARMA:** Participate in governance discussions

---

Document updated: 2025-12-11 — SURGE Core Team
