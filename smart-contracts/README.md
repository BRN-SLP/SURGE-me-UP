# SURGE Protocol - Smart Contracts

**SURGE** = **S**uperchain **U**ser **R**ecognition and **G**rowth **E**ngine

Multi-tier achievement recognition platform for Superchain ecosystem.

## 📋 Overview

SURGE Protocol consists of 4 core smart contracts:

1. **SURGECore.sol** - ERC-721 NFT contract for individual SURGE events
2. **SURGEFactory.sol** - Registry and creator tier management  
3. **SURGEBridge.sol** - Cross-chain bridge coordinator (L2→L2 messaging)
4. **SURGEReputation.sol** - Reputation system with flagging and appeals

## 🚀 Quick Start

### Prerequisites

```bash
npm install
```

### Compile Contracts

```bash
npx hardhat compile
```

### Run Tests

```bash
npx hardhat test
```

## 📡 Deployment

### Phase 1 Networks

- **Base** (8453)
- **Optimism** (10)  
- **Celo** (42220)
- **Zora** (7777777)

### Deploy to Single Network

```bash
npx hardhat run scripts/deploy-surge-protocol.ts --network <network_name>
```

### Deploy to All Phase 1 Networks

```bash
bash scripts/deploy-phase1.sh
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```bash
PRIVATE_KEY=your_deployer_private_key

# RPC URLs
BASE_RPC_URL=https://mainnet.base.org
OPTIMISM_RPC_URL=https://mainnet.optimism.io
CELO_RPC_URL=https://forno.celo.org
ZORA_RPC_URL=https://rpc.zora.energy

# Block Explorer API Keys
BASESCAN_API_KEY=your_basescan_key
OPTIMISTIC_ETHERSCAN_API_KEY=your_optimism_key
CELOSCAN_API_KEY=your_celo_key
# Zora doesn't require API key
```

## 📚 Contract Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ SURGEFactory │────▶│  SURGECore   │◀────│ SURGEBridge  │
│  (Registry)  │     │   (ERC721)   │     │ (L2→L2 Msg)  │
└───────┬──────┘     └──────┬───────┘     └──────────────┘
        │                   │                               
        │            ┌──────▼────────┐                     
        └───────────▶│SURGEReputation│                     
                     │   (Scoring)    │                     
                     └────────────────┘                     
```

### Tier System

| Tier | Supply Limit | Features |
|------|--------------|----------|
| **Official** | Unlimited | Full access, no commissions |
| **Verified** | 50,000 | Community-verified creators |
| **Community** | 5,000 | Open to anyone |

### Distribution Modes

1. **Public** - Anyone can mint
2. **Whitelist** - Merkle tree proof required
3. **Mint Links** - Unique claim links (QR codes)
4. **Social Verify** - Twitter/Farcaster (placeholder)
5. **Email Verify** - Email verification (placeholder)

## 🌉 Cross-Chain Bridge

Uses OP Stack L2→L2 Cross Domain Messenger (`0x4200000000000000000000000000000000000023`)

### Bridge Flow

```
Source Chain                    Destination Chain
┌──────────┐                   ┌──────────┐
│ Lock NFT │──────────────────▶│ Mint NFT │
└──────────┘                   └──────────┘
     │                                │
     ▼                                ▼
 SURGEBridge     L2→L2 Msg      SURGEBridge
```

## 🛡️ Security

- **Access Control**: Role-based permissions (Admin, Moderator, Factory)
- **Rate Limiting**: Flag spam prevention
- **Auto-ban**: Automatic banning after threshold
- **Appeals**: Creators can appeal bans

## 📝 Testing

```bash
# Run all tests
npx hardhat test

# Run with coverage
npx hardhat coverage

# Run gas reports
REPORT_GAS=true npx hardhat test
```

## 🔍 Verification

Contracts are automatically verified during deployment. Manual verification:

```bash
npx hardhat verify --network <network> <contract_address> <constructor_args>
```

## 📊 Deployment Info

Deployment addresses are saved in `deployments/` directory:
- `<network>.json` - Individual network deployment
- `all-deployments.json` - Master file with all deployments

## 🤝 Contributing

1. Write tests for new features
2. Ensure 100% coverage for critical paths
3. Run linter: `npx hardhat check`
4. Update documentation

## 📄 License

MIT

---

**Built for Superchain** 🔴🔵🟡🟣
