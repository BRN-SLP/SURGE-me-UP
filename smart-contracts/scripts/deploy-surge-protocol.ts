import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Deploy SURGE Protocol contracts to a network
 * Usage: npx hardhat run scripts/deploy-surge-protocol.ts --network <network_name>
 * 
 * Deploys in order:
 * 1. SURGEReputation
 * 2. SURGEFactory (with Reputation address)
 * 3. SURGEBridge (with Factory address)
 */
async function main() {
    const network = (global as any).hre.network.name;
    console.log(`\n🚀 Deploying SURGE Protocol to ${network}...`);
    console.log(`📅 Timestamp: ${new Date().toISOString()}\n`);

    // Get deployer account
    const [deployer] = await ethers.getSigners();
    const balance = await ethers.provider.getBalance(deployer.address);

    console.log(`📍 Deployer address: ${deployer.address}`);
    console.log(`💰 Deployer balance: ${ethers.utils.formatEther(balance)} ETH\n`);

    const deployedContracts: any = {};

    // ============ DEPLOY SURGE REPUTATION ============
    console.log("📝 [1/3] Deploying SURGEReputation...");
    const SURGEReputation = await ethers.getContractFactory("SURGEReputation");
    const reputation = await SURGEReputation.deploy();
    await reputation.deployed();
    const reputationAddress = reputation.address;
    console.log(`   ✅ SURGEReputation deployed: ${reputationAddress}\n`);
    deployedContracts.reputation = reputationAddress;

    // Wait for block confirmation
    await new Promise(resolve => setTimeout(resolve, 5000));

    // ============ DEPLOY SURGE FACTORY ============
    console.log("📝 [2/3] Deploying SURGEFactory...");
    const treasuryAddress = deployer.address; // For now, treasury is deployer
    const SURGEFactory = await ethers.getContractFactory("SURGEFactory");
    const factory = await SURGEFactory.deploy(treasuryAddress);
    await factory.deployed();
    const factoryAddress = factory.address;
    console.log(`   ✅ SURGEFactory deployed: ${factoryAddress}\n`);
    deployedContracts.factory = factoryAddress;

    // Grant Factory role to Factory contract in Reputation
    console.log("   🔗 Granting FACTORY_ROLE to Factory...");
    const factoryRole = await reputation.FACTORY_ROLE();
    const grantTx = await reputation.grantRole(factoryRole, factoryAddress);
    await grantTx.wait();
    console.log("   ✅ FACTORY_ROLE granted\n");

    // Wait for block confirmation
    await new Promise(resolve => setTimeout(resolve, 5000));

    // ============ DEPLOY SURGE BRIDGE ============
    console.log("📝 [3/3] Deploying SURGEBridge...");
    const SURGEBridge = await ethers.getContractFactory("SURGEBridge");
    const bridge = await SURGEBridge.deploy(factoryAddress, treasuryAddress);
    await bridge.deployed();
    const bridgeAddress = bridge.address;
    console.log(`   ✅ SURGEBridge deployed: ${bridgeAddress}\n`);
    deployedContracts.bridge = bridgeAddress;

    // ============ SAVE DEPLOYMENT INFO ============
    const chainId = (await ethers.provider.getNetwork()).chainId.toString();
    const deploymentInfo = {
        network,
        chainId,
        deployer: deployer.address,
        treasury: treasuryAddress,
        timestamp: new Date().toISOString(),
        contracts: deployedContracts
    };

    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    // Save to network-specific file
    const filePath = path.join(deploymentsDir, `${network}.json`);
    fs.writeFileSync(filePath, JSON.stringify(deploymentInfo, null, 2));
    console.log(`📄 Deployment info saved: ${filePath}\n`);

    // Update master deployments file
    const masterFilePath = path.join(deploymentsDir, "all-deployments.json");
    let allDeployments: any = {};
    if (fs.existsSync(masterFilePath)) {
        allDeployments = JSON.parse(fs.readFileSync(masterFilePath, "utf8"));
    }
    allDeployments[network] = deploymentInfo;
    fs.writeFileSync(masterFilePath, JSON.stringify(allDeployments, null, 2));

    // ============ VERIFICATION ============
    console.log("⏰ Waiting 30 seconds before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000));

    console.log("\n🔍 Verifying contracts on block explorer...\n");

    try {
        await (global as any).hre.run("verify:verify", {
            address: reputationAddress,
            constructorArguments: [],
        });
        console.log("✅ SURGEReputation verified\n");
    } catch (error: any) {
        console.log(`⚠️  SURGEReputation verification: ${error.message}\n`);
    }

    try {
        await (global as any).hre.run("verify:verify", {
            address: factoryAddress,
            constructorArguments: [treasuryAddress],
        });
        console.log("✅ SURGEFactory verified\n");
    } catch (error: any) {
        console.log(`⚠️  SURGEFactory verification: ${error.message}\n`);
    }

    try {
        await (global as any).hre.run("verify:verify", {
            address: bridgeAddress,
            constructorArguments: [factoryAddress, treasuryAddress],
        });
        console.log("✅ SURGEBridge verified\n");
    } catch (error: any) {
        console.log(`⚠️  SURGEBridge verification: ${error.message}\n`);
    }

    // ============ SUMMARY ============
    console.log("╔═══════════════════════════════════════════════╗");
    console.log("║       SURGE PROTOCOL DEPLOYMENT COMPLETE       ║");
    console.log("╚═══════════════════════════════════════════════╝");
    console.log(`Network:          ${network}`);
    console.log(`Chain ID:         ${chainId}`);
    console.log(`Deployer:         ${deployer.address}`);
    console.log(`Treasury:         ${treasuryAddress}`);
    console.log(`─────────────────────────────────────────────────`);
    console.log(`SURGEReputation:  ${reputationAddress}`);
    console.log(`SURGEFactory:     ${factoryAddress}`);
    console.log(`SURGEBridge:      ${bridgeAddress}`);
    console.log(`─────────────────────────────────────────────────`);
    console.log(`Saved to:         ${filePath}`);
    console.log("╚═══════════════════════════════════════════════╝\n");

    console.log("📌 Next steps:");
    console.log("1. Configure bridge addresses for cross-chain support");
    console.log("2. Set up moderators for Reputation contract");
    console.log("3. Verify creator tiers in Factory contract");
    console.log("4. Test event creation flow\n");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
