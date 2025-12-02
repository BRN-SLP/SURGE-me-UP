#!/bin/bash

# SURGE Contract Verification Script - Fixed Constructor Args
# This script verifies all deployed SURGE contracts on their respective networks

cd "$(dirname "$0")"/..

echo "🔍 Starting contract verification process..."
echo ""

# Deployer and treasury address
DEPLOYER="0x3504273b762a746369E77da2070e08b9bDd36db4"

# Function to verify a contract
verify_contract() {
    local NETWORK=$1
    local CONTRACT_NAME=$2
    local CONTRACT_ADDRESS=$3
    shift 3
    local CONSTRUCTOR_ARGS="$@"
    
    echo "📝 Verifying $CONTRACT_NAME on $NETWORK..."
    echo "   Address: $CONTRACT_ADDRESS"
    
    if [ -z "$CONSTRUCTOR_ARGS" ]; then
        npx hardhat verify --network $NETWORK $CONTRACT_ADDRESS 2>&1 | grep -v "Help us improve"
    else
        npx hardhat verify --network $NETWORK $CONTRACT_ADDRESS $CONSTRUCTOR_ARGS 2>&1 | grep -v "Help us improve"
    fi
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo "✅ $CONTRACT_NAME verified successfully on $NETWORK"
    else
        echo "⚠️  $CONTRACT_NAME verification may have failed or is already verified"
    fi
    echo ""
}

# BASE MAINNET
echo "🔵 BASE MAINNET (Chain ID: 8453)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
REPUTATION_BASE="0x170fb7943d29299D6941029e5dF6C42281C90e47"
FACTORY_BASE="0xEeB8fB619dD0cf0e185e590955Ba98487d6A3547"
BRIDGE_BASE="0x43dB642E37750BE34fd5f1e34BFDd3aB5F9c7f22"

verify_contract "base" "SURGEReputation" "$REPUTATION_BASE"
verify_contract "base" "SURGEFactory" "$FACTORY_BASE" "$DEPLOYER"
verify_contract "base" "SURGEBridge" "$BRIDGE_BASE" "$FACTORY_BASE" "$DEPLOYER"

# OPTIMISM MAINNET
echo "🔴 OPTIMISM MAINNET (Chain ID: 10)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
REPUTATION_OP="0x543B57fB141855e5590DBaDfbc1302F5239271f3"
FACTORY_OP="0x387FbEAc23967f967337dD9249A358c72214942B"
BRIDGE_OP="0x21D37b2Bb9893110a5FCf6f800a7e6D654913A79"

verify_contract "optimism" "SURGEReputation" "$REPUTATION_OP"
verify_contract "optimism" "SURGEFactory" "$FACTORY_OP" "$DEPLOYER"
verify_contract "optimism" "SURGEBridge" "$BRIDGE_OP" "$FACTORY_OP" "$DEPLOYER"

# CELO MAINNET
echo "🟡 CELO MAINNET (Chain ID: 42220)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
REPUTATION_CELO="0x2Fe1d369299C0f525CAC9d618680301BbfB89712"
FACTORY_CELO="0x98865Bc0219D9E002329c37994A0d7d475bAB4d7"
BRIDGE_CELO="0xa48Fab6213fED674230D581b4649968a50AD19E7"

verify_contract "celo" "SURGEReputation" "$REPUTATION_CELO"
verify_contract "celo" "SURGEFactory" "$FACTORY_CELO" "$DEPLOYER"
verify_contract "celo" "SURGEBridge" "$BRIDGE_CELO" "$FACTORY_CELO" "$DEPLOYER"

# ZORA MAINNET
echo "⚫ ZORA MAINNET (Chain ID: 7777777)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
REPUTATION_ZORA="0xa918772Ee4C1843B72c303feb4b77222cc07236D"
FACTORY_ZORA="0x543B57fB141855e5590DBaDfbc1302F5239271f3"
BRIDGE_ZORA="0xBc084dAAfd26FB35245940072b91Ebdf571C0153"

verify_contract "zora" "SURGEReputation" "$REPUTATION_ZORA"
verify_contract "zora" "SURGEFactory" "$FACTORY_ZORA" "$DEPLOYER"
verify_contract "zora" "SURGEBridge" "$BRIDGE_ZORA" "$FACTORY_ZORA" "$DEPLOYER"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Verification process complete!"
echo ""
echo "📋 Summary:"
echo "   - Base: 3 contracts"
echo "   - Optimism: 3 contracts"
echo "   - Celo: 3 contracts"
echo "   - Zora: 3 contracts"
echo "   Total: 12 contracts"
echo ""
