#!/bin/bash

# Deploy SURGE Protocol to New Superchain Networks
# Usage: bash scripts/deploy-new-chains.sh

echo "╔═══════════════════════════════════════════════╗"
echo "║  SURGE Protocol - New Chain Deployment        ║"
echo "║  Networks: Ink, Lisk, Unichain, Soneium       ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# New Superchain networks
NETWORKS=("ink" "lisk" "unichain" "soneium")

echo "🚀 Starting deployment to new Superchain networks..."
echo ""

# Check deployer balance on each network first
echo "💰 Checking deployer balances..."
for network in "${NETWORKS[@]}"; do
    echo -e "${BLUE}Checking $network...${NC}"
    npx hardhat run --network "$network" -e "
        const [deployer] = await ethers.getSigners();
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log('Balance:', ethers.utils.formatEther(balance), 'ETH');
    " 2>/dev/null || echo -e "${YELLOW}Could not check balance for $network${NC}"
done

echo ""
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Deploy to each network
for network in "${NETWORKS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}🌍 Deploying to: $network${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if npx hardhat run scripts/deploy-surge-protocol.ts --network "$network"; then
        echo -e "${GREEN}✅ $network deployed successfully${NC}"
    else
        echo -e "${RED}❌ $network deployment failed${NC}"
        read -p "Continue to next network? (y/n) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
    
    echo ""
    
    # Wait between deployments to avoid rate limits
    if [ "$network" != "${NETWORKS[-1]}" ]; then
        echo -e "${YELLOW}⏸️  Waiting 15 seconds...${NC}"
        sleep 15
        echo ""
    fi
done

echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║    ✨ New Chain Deployments Complete! ✨       ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "📌 Next steps:"
echo "1. Update frontend NetworkSelector with new chains"
echo "2. Configure bridge paths between all chains"
echo "3. Test end-to-end flow on each network"
