import { ethers } from "hardhat";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying SURGE Identity contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

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

    await identityAnchor.deployed();
    console.log("   IdentityAnchor deployed to:", identityAnchor.address);

    // ============================================
    // 2. Deploy IdentityRegistry
    // ============================================
    console.log("\n2. Deploying IdentityRegistry...");

    const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    const identityRegistry = await IdentityRegistry.deploy(identityAnchor.address);

    await identityRegistry.deployed();
    console.log("   IdentityRegistry deployed to:", identityRegistry.address);

    // ============================================
    // 3. Deploy HeritageBadges
    // ============================================
    console.log("\n3. Deploying HeritageBadges...");

    const HeritageBadges = await ethers.getContractFactory("HeritageBadges");
    const heritageBadges = await HeritageBadges.deploy(
        identityRegistry.address,
        "https://surge-me-up.vercel.app/api/heritage/metadata/"
    );

    await heritageBadges.deployed();
    console.log("   HeritageBadges deployed to:", heritageBadges.address);

    // ============================================
    // 4. Configure: Set IdentityRegistry as minter for IdentityAnchor
    // ============================================
    console.log("\n4. Configuring IdentityAnchor...");

    const setRegistryTx = await identityAnchor.setIdentityRegistry(identityRegistry.address);
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
    console.log("IdentityAnchor:   ", identityAnchor.address);
    console.log("IdentityRegistry: ", identityRegistry.address);
    console.log("HeritageBadges:   ", heritageBadges.address);

    const network = await ethers.provider.getNetwork();
    console.log("\nNetwork:", network.name);
    console.log("Chain ID:", network.chainId);

    // Return addresses for programmatic use
    return {
        identityAnchor: identityAnchor.address,
        identityRegistry: identityRegistry.address,
        heritageBadges: heritageBadges.address,
    };
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
