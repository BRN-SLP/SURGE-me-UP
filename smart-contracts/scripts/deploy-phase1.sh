#!/bin/bash

# Deploy SURGE Protocol to Phase 1 networks (Base, Optimism, Celo, Zora)
# Usage: bash scripts/deploy-phase1.sh

echo "╔═══════════════════════════════════════════════╗"
echo "║  SURGE Protocol - Phase 1 Deployment         ║"
echo "║  Networks: Base, Optimism, Celo, Zora        ║"
echo "╚═══════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Phase 1 networks
NETWORKS=("base" "optimism" "celo" "zora")

# Counters
SUCCESS_COUNT=0
FAIL_COUNT=0
FAILED_NETWORKS=()

echo "🚀 Starting deployment to ${#NETWORKS[@]} Phase 1 networks..."
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
    
    # Wait between deployments to avoid rate limiting
    if [ "$network" != "${NETWORKS[-1]}" ]; then
        echo -e "${YELLOW}⏸️  Waiting 15 seconds before next deployment...${NC}"
        sleep 15
        echo ""
    fi
done

# Print final summary
echo ""
echo "╔═══════════════════════════════════════════════╗"
echo "║         PHASE 1 DEPLOYMENT SUMMARY            ║"
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
    echo -e "${GREEN}║  🎉 ALL PHASE 1 DEPLOYMENTS SUCCESSFUL! 🎉  ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════╝${NC}"
    echo ""
    echo "📌 NEXT STEPS:"
    echo "1. Configure bridge addresses between chains"
    echo "2. Set up cross-chain communication"
    echo "3. Add moderators to Reputation contracts"
    echo "4. Test cross-chain bridging"
    echo "5. Update frontend with contract addresses"
    echo ""
    exit 0
else
    echo -e "${YELLOW}⚠️  Some deployments failed. Please review and retry failed networks.${NC}"
    echo ""
    echo "To retry a single network:"
    echo "  npx hardhat run scripts/deploy-surge-protocol.ts --network <network_name>"
    echo ""
    exit 1
fi
