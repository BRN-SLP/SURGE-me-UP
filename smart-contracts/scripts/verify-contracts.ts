import { run, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    const networkName = network.name;
    console.log(`\n🔍 Verifying contracts on ${networkName}...`);

    // Load deployment
    const deploymentPath = path.join(__dirname, "..", "deployments", `${networkName}.json`);
    if (!fs.existsSync(deploymentPath)) {
        console.error(`❌ Deployment file not found: ${deploymentPath}`);
        return;
    }

    const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
    const { contracts, treasury } = deployment;

    console.log(`   Treasury: ${treasury}`);

    // Verify SURGEReputation
    if (contracts.reputation) {
        console.log(`\n📝 Verifying SURGEReputation at ${contracts.reputation}...`);
        try {
            await run("verify:verify", {
                address: contracts.reputation,
                constructorArguments: [treasury],
            });
        } catch (error: any) {
            console.log(`   ⚠️  ${error.message}`);
        }
    }

    // Verify SURGEFactory
    if (contracts.factory) {
        console.log(`\n📝 Verifying SURGEFactory at ${contracts.factory}...`);
        try {
            await run("verify:verify", {
                address: contracts.factory,
                constructorArguments: [treasury],
            });
        } catch (error: any) {
            console.log(`   ⚠️  ${error.message}`);
        }
    }

    // Verify SURGEBridge
    if (contracts.bridge) {
        console.log(`\n📝 Verifying SURGEBridge at ${contracts.bridge}...`);
        try {
            await run("verify:verify", {
                address: contracts.bridge,
                constructorArguments: [contracts.factory, treasury],
            });
        } catch (error: any) {
            console.log(`   ⚠️  ${error.message}`);
        }
    }

    console.log("\n✨ Verification process complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
