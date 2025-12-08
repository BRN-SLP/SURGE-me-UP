import { ethers } from "hardhat";

/**
 * Configure SURGEBridge cross-chain paths
 * This script sets bridgeAddresses mapping on the current network's bridge
 * to enable cross-chain NFT transfers to all other supported networks.
 * 
 * Usage: npx hardhat run scripts/configure-bridge-paths.ts --network <network>
 */

// Bridge addresses per chain ID (from all-deployments.json)
const BRIDGE_ADDRESSES: { [chainId: number]: string } = {
    8453: "0x43dB642E37750BE34fd5f1e34BFDd3aB5F9c7f22",     // Base
    10: "0x21D37b2Bb9893110a5FCf6f800a7e6D654913A79",       // Optimism
    42220: "0xa48Fab6213fED674230D581b4649968a50AD19E7",    // Celo
    7777777: "0xBc084dAAfd26FB35245940072b91Ebdf571C0153",  // Zora
    57073: "0xBc084dAAfd26FB35245940072b91Ebdf571C0153",    // Ink
    1135: "0xBc084dAAfd26FB35245940072b91Ebdf571C0153",     // Lisk
    130: "0xBc084dAAfd26FB35245940072b91Ebdf571C0153",      // Unichain
    1868: "0xBc084dAAfd26FB35245940072b91Ebdf571C0153",     // Soneium
};

const CHAIN_NAMES: { [chainId: number]: string } = {
    8453: "Base",
    10: "Optimism",
    42220: "Celo",
    7777777: "Zora",
    57073: "Ink",
    1135: "Lisk",
    130: "Unichain",
    1868: "Soneium",
};

async function main() {
    const network = (global as any).hre.network.name;
    const chainId = (await ethers.provider.getNetwork()).chainId;

    console.log(`\n🌉 Configuring SURGEBridge on ${network} (Chain ID: ${chainId})`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    // Get the bridge address for current network
    const currentBridgeAddress = BRIDGE_ADDRESSES[Number(chainId)];
    if (!currentBridgeAddress) {
        throw new Error(`No bridge address found for chain ID ${chainId}`);
    }

    console.log(`📍 Bridge address: ${currentBridgeAddress}`);

    // Get contract instance
    const bridge = await ethers.getContractAt("SURGEBridge", currentBridgeAddress);

    // Get deployer
    const [deployer] = await ethers.getSigners();
    console.log(`👤 Caller: ${deployer.address}`);

    // Check owner
    const owner = await bridge.owner();
    if (owner.toLowerCase() !== deployer.address.toLowerCase()) {
        console.log(`⚠️  Warning: Caller is not owner. Owner is ${owner}`);
    }

    console.log(`\n📝 Setting bridge addresses for other chains...\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    // Set bridge address for each other chain
    for (const [remoteChainId, remoteBridgeAddress] of Object.entries(BRIDGE_ADDRESSES)) {
        const remoteId = Number(remoteChainId);

        // Skip current chain
        if (remoteId === Number(chainId)) {
            continue;
        }

        const chainName = CHAIN_NAMES[remoteId] || `Chain ${remoteId}`;

        try {
            // Check if already set
            const currentAddress = await bridge.bridgeAddresses(remoteId);

            if (currentAddress.toLowerCase() === remoteBridgeAddress.toLowerCase()) {
                console.log(`   ⏭️  ${chainName} (${remoteId}): Already configured`);
                skipCount++;
                continue;
            }

            // Set the bridge address
            console.log(`   🔗 Setting ${chainName} (${remoteId}): ${remoteBridgeAddress.slice(0, 10)}...`);
            const tx = await bridge.setBridgeAddress(remoteId, remoteBridgeAddress);
            await tx.wait();
            console.log(`      ✅ Done (tx: ${tx.hash.slice(0, 10)}...)`);
            successCount++;

        } catch (error: any) {
            console.log(`   ❌ ${chainName} (${remoteId}): ${error.message.slice(0, 50)}`);
            errorCount++;
        }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ Configured: ${successCount}`);
    console.log(`⏭️  Skipped:    ${skipCount}`);
    console.log(`❌ Errors:     ${errorCount}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
