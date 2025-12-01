#!/bin/bash

# Deploy SURGE Protocol to testnets for testing
# Usage: bash scripts/deploy-testnets.sh

echo "╔═══════════════════════════════════════════════╗"
echo "║  SURGE Protocol - Testnet Deployment         ║"
echo "║  Networks: Base Sepolia, OP Sepolia, Celo    ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Testnet networks (FIXED: celoSepolia not celoAlfajores)
NETWORKS=("baseSepolia" "optimismSepolia" "celoSepolia")

# Counters
SUCCESS_COUNT=0
FAIL_COUNT=0
FAILED_NETWORKS=()

echo "🧪 Starting deployment to ${#NETWORKS[@]} testnet networks..."
echo ""

# Deploy to each network
for network in "${NETWORKS[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}📡 Deploying to: $network${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Run deployment
    if npx hardhat run scripts/deploy-surge-protocol.ts --network "$network"; then
        echo -e "${GREEN}✅ $network deployment successful${NC}"
        ((SUCCESS_COUNT++))
    else
        echo -e "${RED}❌ $network deployment failed${NC}"
        ((FAIL_COUNT++))
        FAILED_NETWORKS+=("$network")
    fi
    
    echo ""
    
    # Wait between deployments
    if [ "$network" != "${NETWORKS[-1]}" ]; then
        echo -e "${YELLOW}⏸️  Waiting 10 seconds before next deployment...${NC}"
        sleep 10
        echo ""
    fi
done

# Print final summary
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║       TESTNET DEPLOYMENT SUMMARY              ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""
echo "Total Networks: ${#NETWORKS[@]}"
echo -e "${GREEN}✅ Successful: $SUCCESS_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo ""

if [ $FAIL_COUNT -gt 0 ]; then
    echo -e "${YELLOW}Failed networks:${NC}"
    for failed in "${FAILED_NETWORKS[@]}"; do
        echo "  - $failed"
    done
    echo ""
fi

echo "📝 Deployment details saved in: ./deployments/"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 ALL TESTNET DEPLOYMENTS SUCCESSFUL! 🎉   ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════╝${NC}"
    echo ""
    echo "📌 NEXT STEPS:"
    echo "1. Test event creation on each testnet"
    echo "2. Test claiming mechanisms"
    echo "3. Test cross-chain bridging"
    echo "4. Verify all contracts on block explorers"
    echo "5. If all tests pass → Deploy to mainnet"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  Some deployments failed. Please review and retry.${NC}"
    echo ""
    exit 1
fi
