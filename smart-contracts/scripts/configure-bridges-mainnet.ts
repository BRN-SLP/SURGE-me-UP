import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    const network = (global as any).hre.network.name;
    console.log(`\n🌉 Configuring Bridges for ${network} (Mainnet)...`);

    // Load deployments
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    const networks = ["base", "optimism", "celo", "zora"];
    const deployments: any = {};

    for (const net of networks) {
        const filePath = path.join(deploymentsDir, `${net}.json`);
        if (fs.existsSync(filePath)) {
            deployments[net] = JSON.parse(fs.readFileSync(filePath, "utf8"));
        } else {
            console.warn(`⚠️  Deployment file for ${net} not found. Skipping.`);
        }
    }

    const currentDeployment = deployments[network];
    if (!currentDeployment) {
        console.error(`❌ No deployment found for current network: ${network}`);
        return;
    }

    const bridgeAddress = currentDeployment.contracts.bridge;
    const SURGEBridge = await ethers.getContractFactory("SURGEBridge");
    const bridge = SURGEBridge.attach(bridgeAddress);

    console.log(`📍 Bridge Contract: ${bridgeAddress}`);

    // Configure other chains
    for (const net of networks) {
        if (net === network) continue; // Skip self

        const targetDeployment = deployments[net];
        if (!targetDeployment) continue;

        const targetChainId = targetDeployment.chainId;
        const targetBridgeAddress = targetDeployment.contracts.bridge;

        console.log(`   🔗 Configuring bridge for ${net} (Chain ID: ${targetChainId})...`);
        console.log(`      Target Address: ${targetBridgeAddress}`);

        try {
            // Check if already configured
            const existingAddress = await bridge.bridgeAddresses(targetChainId);
            if (existingAddress.toLowerCase() === targetBridgeAddress.toLowerCase()) {
                console.log(`      ✅ Already configured. Skipping.`);
                continue;
            }

            const tx = await bridge.setBridgeAddress(targetChainId, targetBridgeAddress);
            console.log(`      ⏳ Transaction sent: ${tx.hash}`);
            await tx.wait();
            console.log(`      ✅ Configured!`);
        } catch (error: any) {
            console.error(`      ❌ Failed to configure: ${error.message}`);
        }
    }

    console.log("\n✨ Bridge configuration complete for this network!\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
