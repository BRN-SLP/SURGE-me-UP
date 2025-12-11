# Task 2 — SURGE Identity UI/UX Specification (for AI Design Agent)

## Objective

Design a complete, clear, **simple-for-user** UI/UX for the SURGE Identity System:

- Multi-wallet identity
- Compromised wallet handling
- Primary wallet
- Suspended identity
- Heritage badges

The goal: hide all complex mechanics behind intuitive flows.

---

## Output Required

The agent should deliver:

1. **Information Architecture** (IA) in text.
2. **Wireframes** descriptions for all key pages.
3. **High-level visual spec** (colors, components, states).
4. **User Flows** in clear step-by-step form (can include mermaid diagrams).
5. **Copy suggestions**: texts for warnings, tooltips, buttons.

Format: single Markdown file with sections, that a designer/dev can use to build Figma and frontend.

---

## 1. Information Architecture

Define and describe the following pages/sections:

- `/identity` — main Identity Dashboard
- `/identity/link` — wallet linking flow
- `/identity/manage` — manage wallets, statuses, primary
- `/identity/badges` — heritage badges view + claim
- `/identity/recover` — placeholder for future “no-access recovery”
- `/verify/{wallet}` — public verification page

Explain how they appear in navigation:

- Add **Identity** to main nav:
  - `[Home] [Create] [Gallery] [Identity] [About] [Connect Wallet]`
- Wallet dropdown must show:
  - connected wallet
  - identityId (if exists)
  - score (if this wallet is primary)

---

## 2. Identity Dashboard (`/identity`)

### Layout Requirements

Sections to include:

1. **Identity Header**
   - Shows:
     - Identity #ID
     - If current wallet is primary:
       - “Total Identity Score: XXX”
     - If not primary:
       - “Your Wallet Score: YYY”
       - “Total Identity Score available on Primary wallet 0x…”
   - Badge for status: `Active | Suspended`.

2. **Score Overview**
   - Big number (score).
   - Simple breakdown: e.g. “Experience, Diversity, Activity”.
   - Small chart or progress bar.

3. **Linked Wallets Section**
   - Card list (grid on desktop, list on mobile).
   - Each card must show:
     - Address (shortened).
     - Status (Active / Pending Compromise / Compromised).
     - Tags:
       - PRIMARY (if primaryWallet).
     - Individual score contribution.
     - `Linked since` date.
     - Actions:
       - `[Set as Primary]` (if allowed).
       - `[Manage]` (goes to /identity/manage filtered).

4. **Alerts / Banners**
   - If **Primary in pending_compromise**:
     - Big red/orange banner:
       - “ACTION REQUIRED: Your Primary wallet is pending compromise. X days left to set a new Primary or identity will be suspended.”
   - If **Identity is suspended**:
     - Prominent banner:
       - “Identity Suspended. Set new Primary wallet to reactivate.”

5. **Quick Actions**
   - Buttons:
     - `[Link New Wallet]`
     - `[Manage Wallets]`
     - `[View Heritage Badges]`

Provide a textual wireframe (rough layout), e.g.:

[ Identity Header ]
[ Score Overview ]
[ Alerts (if any) ]
[ Linked Wallets Grid ]
[ Quick Actions ]

text

---

## 3. Wallet Linking Flow (`/identity/link`)

### Step 1: Intro Screen

- Explain what linking does:
  - Aggregate history.
  - Enables recovery.
  - **One-way & permanent**: a wallet can only belong to one identity.
- CTA:
  - `[Connect Wallet to Link]`

### Step 2: Dual Signature Flow

Describe a simple 2-step process:

1. User selects which identity to attach to (already connected wallet = existing linked wallet).
2. User connects new wallet in same browser (or via WalletConnect).
3. UI shows:

Verify Wallet Ownership

Identity: #12345

Step 1: Existing wallet (0xAAAA...)
[✓] Signature received

Step 2: New wallet (0xBBBB...)
[Sign Message] button

Note: Both wallets must sign to confirm linking. This action is permanent.

text

- After both signatures success → call `linkWallet`.

### Step 3: Confirmation Screen

- Show:
  - “Wallet 0xBBBB... linked to Identity #12345”.
  - Individual + total score updates.
- CTAs:
  - `[Back to Dashboard]`
  - `[Link Another Wallet]`

---

## 4. Manage Wallets (`/identity/manage`)

This page focuses on:

- Primary wallet selection.
- Mark as Compromised flow.
- Pending compromise overview.
- Suspended justification.

### Sections

1. **Primary Wallet Block**

Show:

Primary Wallet

Current: 0xAAAA...1111 [PRIMARY]

Receives rewards & airdrops

Exposes aggregated Identity Score

Used for external verification

Change Primary:
[Select wallet dropdown]

Cooldown: X days remaining
[Change Primary] (disabled if cooldown active)

text

- If cooldown active:
  - Display a small countdown and disabled button.
- If no Primary (e.g. just marked compromised):
  - Emphasize “No primary wallet set. Identity will be suspended after compromise finalization if you don't select one.”

2. **Mark as Compromised Block**

- Allow choosing wallet from list:
  - Dropdown excluding current wallet (you cannot mark yourself, only another linked wallet).
- Big warning text:

Mark Wallet as Compromised

If your wallet is hacked or unsafe, you can mark it as compromised.
This will immediately:

Block this wallet from using SURGE

Stop counting new activity from this wallet

Remove it as Primary (if it was)

Start 30-day dispute period (you can cancel from another linked wallet)

History BEFORE marking will be preserved.
Action becomes irreversible after 30 days.

[Select wallet ▼] [Mark as Compromised]

text

3. **Pending Compromise Section**

- List all wallets in `PENDING_COMPROMISE`:

Pending Compromise

Wallet: 0xCCCC...3333
Marked: Dec 10, 2025
Finalizes: Jan 9, 2026 (29 days left)

Status: BLOCKED (cannot login or use platform)

[Cancel Compromise] button
(only if viewing from another linked wallet)

text

4. **Suspended Identity Explanation**

- If `isSuspended == true`:

Identity Suspended

Your identity is suspended because:

A compromised wallet was finalized

No Primary wallet was set

To reactivate your identity:

Select a new Primary wallet from linked wallets

Confirm the change

[Select Primary & Reactivate]

text

---

## 5. Heritage Badges (`/identity/badges`)

### Layout

Sections:

1. **Intro Text**

Explain:

- Heritage badges = proof of historical activity from compromised wallets.
- They are minted to active wallets (usually Primary).
- They help show veteran status and experience.

2. **Available to Claim**

List cards:

From compromised wallet: 0xAAA...1111

[Card] Veteran Wallet — “3 years 4 months of activity”
[Claim]

[Card] Contract Maestro — “5247 unique contract interactions”
[Claim]

[Card] Cross-Chain Native — “Active on 6 Superchain networks”
[Claim]

text

- Each card:
  - Title.
  - Short description.
  - Source wallet reference.
  - [Claim] button.

3. **Already Claimed**

Show grid of badges user already claimed.

---

## 6. Public Verification (`/verify/{wallet}`)

Design a read-only public page.

### If wallet has identity

Show:

SURGE Identity Verification

Wallet: 0xCCC...1234

✓ Linked to SURGE Identity #12345
Status: Active
Is Primary: Yes

Total Identity Score: 847
Linked wallets: 3
Member since: Jan 2023

Heritage Badges:

Veteran Wallet

Contract Maestro (Diamond)

Cross-Chain Native

text

If wallet is **not primary**, still show identity but clarify:

This wallet is linked but NOT primary.
External reputation checks should query the primary wallet: 0x...

text

If wallet is **compromised**:

Status: Compromised (do not use for authentication or rewards)
Identity must be validated via an active primary wallet.

text

---

## 7. Visual Style & States

### Colors (minimal, modern)

Use the palette (you can treat this as design tokens):

- Primary: `#4F46E5` (Indigo)
- Text dark: `#0F172A`
- Background light: `#F8FAFC`
- Secondary text: `#64748B`
- Success (active): `#10B981`
- Warning (pending): `#F59E0B`
- Danger (compromised): `#EF4444`
- Suspended/disabled: `#6B7280`

Status chips:

- Active: green pill.
- Pending: amber pill.
- Compromised: red pill.
- Suspended: gray pill.

### Components

Define:

1. **Wallet Card**
   - Address (monospace).
   - Status chip.
   - Score (individual).
   - Linked at date.
   - Badges:
     - PRIMARY.

2. **Identity Header**
   - Big score (when primary).
   - MEDIUM score or “Wallet Score” when not primary.
   - Identity ID.

3. **Alert Banner**
   - Types: info / warning / danger.
   - Used for:
     - Pending compromise + days left.
     - Suspended identity.

4. **Buttons**
   - Primary (indigo).
   - Secondary (outline).
   - Destructive (red).

---

## 8. User Flows (step-by-step)

Agent must describe flows for:

### 1. First-time Identity Creation

1. User connects wallet.
2. If no identity:
   - Modal: “Create your SURGE Identity?”
   - On confirm → call createIdentity.
   - Show short onboarding (what identity is, Primary, linking).
3. Land on `/identity`.

### 2. Linking Second Wallet

1. User opens `/identity/link` from dashboard.
2. Reads explanation, clicks “Start linking”.
3. Signs from existing wallet.
4. Connects new wallet, signs message.
5. Sees confirmation and score changes.

### 3. Mark as Compromised → Cancel → Finalize

Flow 1: mark

- From safe wallet, go to `/identity/manage`.
- Choose target wallet, read warning.
- Confirm “Mark as Compromised”.
- Target wallet immediately blocked.

Flow 2: cancel

- From another active wallet, see pending list.
- Click “Cancel Compromise”.
- Confirm in modal.
- Wallet returns to Active.

Flow 3: finalize

- After 30 days, either:
  - Auto-finalized by cron/off-chain or explicit call.
- Wallet moves to Compromised.
- Identity may become Suspended if no Primary.
- Heritage badges become claimable.

### 4. Change Primary

1. From `/identity/manage`:
   - If cooldown passed → allow selecting newPrimary from dropdown.
   - Block selection of pending/compromised wallets.
2. On confirm:
   - Show success state.
   - Update identity header & API output.

### 5. Claim Heritage Badges

1. After wallet is Compromised, show notification.
2. User goes to `/identity/badges`.
3. Sees list of available badges.
4. Chooses active wallet to receive (default: Primary).
5. Confirms transaction.
6. Badge minted; card moves into “Claimed”.

---

## 9. Copy & UX Tone

- Tone: calm, security-aware, non-alarmist, but clear.
- Must **explain consequences** before irreversible actions:
  - Mark as compromised.
  - Letting dispute period end without new Primary.
- Avoid deep technical jargon in UI:
  - Use “Your identity”, “Your history”, “Your reputation”.
  - Technical terms (identityId, SBT) can be in tooltips / “Learn more”.

---

## 10. Constraints / Nice-to-haves

- Design should be:
  - Desktop-first, then adapted to mobile.
  - Simple, minimal, “2025 SaaS” style (think Linear / Vercel / Rainbow).
- Keep number of steps low:
  - No more than 3 screens per flow.
- Use progressive disclosure:
  - Advanced explanations behind tooltips or accordion blocks.

---
