#!/bin/bash

# Configure SURGE Protocol Bridges on testnets
# Usage: bash scripts/configure-testnets.sh

echo "╔═══════════════════════════════════════════════╗"
echo "║  SURGE Protocol - Bridge Configuration       ║"
echo "║  Networks: Base Sepolia, OP Sepolia, Celo    ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Testnet networks
NETWORKS=("baseSepolia" "optimismSepolia" "celoSepolia")

echo "🔗 Starting bridge configuration..."
echo ""

# Configure each network
for network in "${NETWORKS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}⚙️  Configuring: $network${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if npx hardhat run scripts/configure-bridges.ts --network "$network"; then
        echo -e "${GREEN}✅ $network configured${NC}"
    else
        echo -e "${RED}❌ $network configuration failed${NC}"
    fi
    
    echo ""
    
    # Wait between calls
    if [ "$network" != "${NETWORKS[-1]}" ]; then
        echo -e "${YELLOW}⏸️  Waiting 5 seconds...${NC}"
        sleep 5
        echo ""
    fi
done

echo "✨ All Done!"
