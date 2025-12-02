# Smart Contract Verification Guide

This guide explains how to verify SURGE smart contracts on Base, Optimism, Celo, and Zora using Etherscan API V2.

## Prerequisites

1. Install dependencies:
```bash
npm install -D @nomicfoundation/hardhat-verify
```

2. Get an Etherscan API key:
   - Visit https://etherscan.io/myapikey
   - Create an account and generate an API key
   - The same key works for Base, Optimism, Celo explorers

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env and add your ETHERSCAN_API_KEY and PRIVATE_KEY
```

## Configuration

See `hardhat.config.example.ts` for the complete configuration example.

### Key Points for Etherscan V2 API

**✅ CORRECT** - Single API key string:
```typescript
etherscan: {
  apiKey: process.env.ETHERSCAN_API_KEY || "",
  customChains: [...]
}
```

**❌ WRONG** - Object with keys per network (V1 style):
```typescript
etherscan: {
  apiKey: {
    base: "KEY",
    optimism: "KEY",
    // This causes "deprecated V1 endpoint" errors
  }
}
```

## Verification Commands

### Basic Verification
```bash
# Base
npx hardhat verify --network base <CONTRACT_ADDRESS>

# Optimism
npx hardhat verify --network optimism <CONTRACT_ADDRESS>

# Celo
npx hardhat verify --network celo <CONTRACT_ADDRESS>

# Zora
npx hardhat verify --network zora <CONTRACT_ADDRESS>
```

### With Constructor Arguments
```bash
# Example: SURGEFactory with treasury address
npx hardhat verify --network base \
  0xYourFactoryAddress \
  0xYourTreasuryAddress

# Example: SURGEBridge with factory and treasury
npx hardhat verify --network base \
  0xYourBridgeAddress \
  0xYourFactoryAddress \
  0xYourTreasuryAddress
```

### Using Verification Script
```bash
# Verify all contracts on all mainnets
bash scripts/verify-all-mainnets.sh
```

## Networks Supported

| Network | Chain ID | Explorer |
|---------|----------|----------|
| Base | 8453 | https://basescan.org |
| Base Sepolia | 84532 | https://sepolia.basescan.org |
| Optimism | 10 | https://optimistic.etherscan.io |
| Optimism Sepolia | 11155420 | https://sepolia-optimism.etherscan.io |
| Celo | 42220 | https://celoscan.io |
| Celo Alfajores | 44787 | https://alfajores.celoscan.io |
| Zora | 7777777 | https://explorer.zora.energy |

## Sourcify Verification

Sourcify verification is automatically enabled and provides decentralized contract verification:

```typescript
sourcify: {
  enabled: true,
}
```

Verified contracts appear on:
- https://repo.sourcify.dev/contracts/full_match/{chainId}/{address}/

## Troubleshooting

### "Deprecated V1 endpoint" Error
**Cause**: Using object structure for `apiKey` instead of string.
**Solution**: Use single string `apiKey: "YOUR_KEY"` as shown above.

### Zora Verification Issues
**Note**: Zora's Blockscout explorer doesn't fully support Etherscan V2 API yet.
**Solution**: Contracts are still verified on Sourcify, which provides full transparency.

### "Contract already verified"
If you see this message, the contract is already verified. You can:
- Check the explorer link in the output
- Use `--force` flag to re-verify: `npx hardhat verify --force --network base <address>`

### Missing Constructor Arguments
**Error**: "Constructor arguments mismatch"
**Solution**: Provide constructor arguments in the correct order:
```bash
npx hardhat verify --network base <address> <arg1> <arg2> <arg3>
```

## Example: Complete Verification Flow

1. Deploy contracts:
```bash
npx hardhat run scripts/deploy.ts --network base
```

2. Note the deployed addresses from console output

3. Verify each contract:
```bash
# SURGEReputation (no constructor args)
npx hardhat verify --network base 0xYourReputationAddress

# SURGEFactory (treasury arg)
npx hardhat verify --network base 0xYourFactoryAddress 0xTreasuryAddress

# SURGEBridge (factory and treasury args)
npx hardhat verify --network base 0xYourBridgeAddress 0xFactoryAddress 0xTreasuryAddress
```

4. Check verification status on explorer

## Additional Resources

- [Hardhat Verify Documentation](https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify)
- [Etherscan API V2 Migration Guide](https://docs.etherscan.io/v2-migration)
- [Sourcify Documentation](https://docs.sourcify.dev/)
