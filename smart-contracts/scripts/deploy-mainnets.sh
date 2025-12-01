#!/bin/bash

# Deploy SURGE Protocol to Mainnets (Base, Optimism, Zora)
# Usage: bash scripts/deploy-mainnets.sh

echo "╔═══════════════════════════════════════════════╗"
echo "║  SURGE Protocol - Mainnet Deployment         ║"
echo "║  Networks: Base, Optimism, Zora              ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Mainnet networks (Skipping Celo as it is already deployed)
NETWORKS=("base" "optimism" "zora")

echo "🚀 Starting Mainnet deployment..."
echo ""

# Deploy to each network
for network in "${NETWORKS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}🌍 Deploying to: $network${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if npx hardhat run scripts/deploy-surge-protocol.ts --network "$network"; then
        echo -e "${GREEN}✅ $network deployed successfully${NC}"
    else
        echo -e "${RED}❌ $network deployment failed${NC}"
        # Ask to continue? No, just exit to be safe
        exit 1
    fi
    
    echo ""
    
    # Wait between deployments to avoid rate limits or nonce issues
    if [ "$network" != "${NETWORKS[-1]}" ]; then
        echo -e "${YELLOW}⏸️  Waiting 10 seconds...${NC}"
        sleep 10
        echo ""
    fi
done

echo "✨ All Mainnet Deployments Complete!"
