import { ethers } from "hardhat";

const REGISTRY_ADDRESS = "0xf91918058ACfFc39256189BFf59E6226Ab07a9d7";

async function main() {
    const [signer] = await ethers.getSigners();
    console.log("Testing with account:", signer.address);

    // Get contract instance
    const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
    const registry = IdentityRegistry.attach(REGISTRY_ADDRESS);

    // Check if already has identity
    const existingId = await registry.walletToIdentity(signer.address);
    console.log("Existing identity ID:", existingId.toString());

    if (existingId.toString() === "0") {
        console.log("\nCreating new identity...");
        const tx = await registry.createIdentity();
        console.log("Transaction hash:", tx.hash);

        const receipt = await tx.wait();
        console.log("Transaction confirmed in block:", receipt.blockNumber);

        const newId = await registry.walletToIdentity(signer.address);
        console.log("\n✅ Identity created! ID:", newId.toString());

        // Get identity details
        const identity = await registry.getIdentity(newId);
        console.log("Primary wallet:", identity.primaryWallet);
        console.log("Is suspended:", identity.isSuspended);
    } else {
        console.log("\n✅ Identity already exists! ID:", existingId.toString());

        // Get identity details
        const identity = await registry.getIdentity(existingId);
        console.log("Linked wallets:", identity.linkedWallets);
        console.log("Primary wallet:", identity.primaryWallet);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
