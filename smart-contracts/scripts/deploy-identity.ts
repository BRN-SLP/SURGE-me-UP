import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying SURGE Identity contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    // ============================================
    // 1. Deploy IdentityAnchor
    // ============================================
    console.log("\n1. Deploying IdentityAnchor...");

    const IdentityAnchor = await ethers.getContractFactory("IdentityAnchor");
    const identityAnchor = await IdentityAnchor.deploy(
        "SURGE Identity Anchor",
        "SURGE-ID",
        "https://surge-me-up.vercel.app/api/identity/metadata/"
    );

    await identityAnchor.waitForDeployment();
    const anchorAddress = await identityAnchor.getAddress();
    console.log("   IdentityAnchor deployed to:", anchorAddress);

    // ============================================
    // 2. Deploy IdentityRegistry
    // ============================================
    console.log("\n2. Deploying IdentityRegistry...");

    const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    const identityRegistry = await IdentityRegistry.deploy(anchorAddress);

    await identityRegistry.waitForDeployment();
    const registryAddress = await identityRegistry.getAddress();
    console.log("   IdentityRegistry deployed to:", registryAddress);

    // ============================================
    // 3. Deploy HeritageBadges
    // ============================================
    console.log("\n3. Deploying HeritageBadges...");

    const HeritageBadges = await ethers.getContractFactory("HeritageBadges");
    const heritageBadges = await HeritageBadges.deploy(
        registryAddress,
        "https://surge-me-up.vercel.app/api/heritage/metadata/"
    );

    await heritageBadges.waitForDeployment();
    const badgesAddress = await heritageBadges.getAddress();
    console.log("   HeritageBadges deployed to:", badgesAddress);

    // ============================================
    // 4. Configure: Set IdentityRegistry as minter for IdentityAnchor
    // ============================================
    console.log("\n4. Configuring IdentityAnchor...");

    const setRegistryTx = await identityAnchor.setIdentityRegistry(registryAddress);
    await setRegistryTx.wait();
    console.log("   IdentityRegistry set as authorized minter for IdentityAnchor");

    // ============================================
    // Summary
    // ============================================
    console.log("\n============================================");
    console.log("SURGE Identity System Deployment Complete!");
    console.log("============================================\n");

    console.log("Contract Addresses:");
    console.log("-------------------");
    console.log("IdentityAnchor:   ", anchorAddress);
    console.log("IdentityRegistry: ", registryAddress);
    console.log("HeritageBadges:   ", badgesAddress);

    console.log("\nNetwork:", (await ethers.provider.getNetwork()).name);
    console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId.toString());

    // Return addresses for programmatic use
    return {
        identityAnchor: anchorAddress,
        identityRegistry: registryAddress,
        heritageBadges: badgesAddress,
    };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
