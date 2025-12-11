import { ethers } from "hardhat";

// Already deployed on Base Mainnet:
const IDENTITY_ANCHOR = "0x60ECC66e77663083d417F9b3Eb946B4b7fc99F6a";
const IDENTITY_REGISTRY = "0x7Be26Cc7823eBf117E55079f8fB83833452514a2";

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying HeritageBadges with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Deploy HeritageBadges
    console.log("\nDeploying HeritageBadges...");

    const HeritageBadges = await ethers.getContractFactory("HeritageBadges");
    const heritageBadges = await HeritageBadges.deploy(
        IDENTITY_REGISTRY,
        "https://surge-me-up.vercel.app/api/heritage/metadata/"
    );

    await heritageBadges.deployed();
    console.log("HeritageBadges deployed to:", heritageBadges.address);

    // Configure IdentityAnchor (if not already done)
    console.log("\nConfiguring IdentityAnchor...");

    const IdentityAnchor = await ethers.getContractFactory("IdentityAnchor");
    const anchor = IdentityAnchor.attach(IDENTITY_ANCHOR);

    // Check if already configured
    const currentRegistry = await anchor.identityRegistry();
    console.log("Current registry:", currentRegistry);

    if (currentRegistry === "0x0000000000000000000000000000000000000000") {
        console.log("Setting IdentityRegistry...");
        const tx = await anchor.setIdentityRegistry(IDENTITY_REGISTRY);
        await tx.wait();
        console.log("IdentityRegistry set!");
    } else {
        console.log("IdentityAnchor already configured.");
    }

    // Summary
    console.log("\n============================================");
    console.log("SURGE Identity System Deployment Complete!");
    console.log("============================================\n");

    console.log("Contract Addresses (Base Mainnet):");
    console.log("-------------------");
    console.log("IdentityAnchor:   ", IDENTITY_ANCHOR);
    console.log("IdentityRegistry: ", IDENTITY_REGISTRY);
    console.log("HeritageBadges:   ", heritageBadges.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
