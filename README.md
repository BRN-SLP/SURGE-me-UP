# SURGE me UP

**SURGE = Superchain User Recognition and Growth Engine**

A decentralized application (dApp) built on the Superchain that enables users to create, collect, and bridge achievement NFTs across multiple L2 networks.

## ✅ Status: LIVE ON MAINNET

Deployed and verified on:
- **Base** (Chain ID: 8453)
- **Optimism** (Chain ID: 10)
- **Celo** (Chain ID: 42220)
- **Zora** (Chain ID: 7777777)

## Features

- **Multi-Chain Support:** Fully deployed on 4 Superchain networks
- **Cross-Chain Bridging:** Native L2-L2 token bridging using OP Stack messaging
- **Reputation System:** Track user engagement and earn on-chain reputation
- **Event Factory:** Create custom achievement events with flexible distribution modes
- **Low Fees:** Leverages the efficiency of Superchain L2s
- **Reown AppKit Integration:** Seamless wallet connection

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, TailwindCSS 4
- **Blockchain:** Solidity 0.8.22, Hardhat, Viem, Wagmi
- **Wallet:** Reown AppKit
- **Smart Contracts:** 
  - `SURGEFactory`: Event creation and management
  - `SURGECore`: ERC721 NFT with claim logic
  - `SURGEBridge`: Cross-chain bridging
  - `SURGEReputation`: On-chain reputation tracking

## Getting Started

### Prerequisites

- Node.js v20+
- npm or yarn
- Wallet with Mainnet ETH on supported chains

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BRN-SLP/SURGE-me-UP.git
   cd SURGE-me-UP
   ```

2. Install dependencies:
   ```bash
   npm install
   cd smart-contracts && npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root:
   ```env
   NEXT_PUBLIC_PROJECT_ID=your_reown_project_id
   ```

### Development

```bash
npm run dev
```

### Smart Contract Deployment

All contracts are already deployed to Mainnet. Addresses are in:
- `src/config/surge-contracts.ts`
- `smart-contracts/deployments/*.json`

## Contract Addresses

See [walkthrough.md](https://github.com/BRN-SLP/SURGE-me-UP/blob/main/docs/walkthrough.md) for complete deployment addresses.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT

