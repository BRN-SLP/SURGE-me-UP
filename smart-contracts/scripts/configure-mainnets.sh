#!/bin/bash

# Configure SURGE Protocol Bridges on Mainnets
# Usage: bash scripts/configure-mainnets.sh

echo "╔═══════════════════════════════════════════════╗"
echo "║  SURGE Protocol - Mainnet Bridge Config      ║"
echo "║  Networks: Base, Optimism, Celo              ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Mainnet networks
NETWORKS=("base" "optimism" "celo" "zora")

echo "🔗 Starting bridge configuration..."
echo ""

# Configure each network
for network in "${NETWORKS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}⚙️  Configuring: $network${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if npx hardhat run scripts/configure-bridges-mainnet.ts --network "$network"; then
        echo -e "${GREEN}✅ $network configured${NC}"
    else
        echo -e "${RED}❌ $network configuration failed${NC}"
    fi
    
    echo ""
    
    # Wait between calls
    if [ "$network" != "${NETWORKS[-1]}" ]; then
        echo -e "${YELLOW}⏸️  Waiting 10 seconds...${NC}"
        sleep 10
        echo ""
    fi
done

echo "✨ All Done!"
