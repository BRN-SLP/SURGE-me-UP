import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
    // We'll test Base Sepolia -> Optimism Sepolia
    const sourceNetwork = "baseSepolia";
    const destNetwork = "optimismSepolia";

    console.log(`\n🧪 Starting Bridge Test: ${sourceNetwork} -> ${destNetwork}`);

    // Load deployments
    const deploymentsDir = path.join(__dirname, "..", "deployments");
    const sourceDeployment = JSON.parse(fs.readFileSync(path.join(deploymentsDir, `${sourceNetwork}.json`), "utf8"));
    const destDeployment = JSON.parse(fs.readFileSync(path.join(deploymentsDir, `${destNetwork}.json`), "utf8"));

    const [deployer] = await ethers.getSigners();
    console.log(`📍 Tester: ${deployer.address}`);

    // 1. Create a Test Event on Source
    console.log("\n📝 [1/4] Creating Test Event on Source...");
    const SURGEFactory = await ethers.getContractFactory("SURGEFactory");
    const factory = SURGEFactory.attach(sourceDeployment.contracts.factory);

    console.log("   Debug: Checking parameters...");
    console.log("   chainId:", sourceDeployment.chainId);

    const eventMetadata = [
        "Bridge Test Event",
        "Testing cross-chain bridge",
        "ipfs://test",
        sourceDeployment.chainId,
        2,
        100,
        Math.floor(Date.now() / 1000) + 86400,
        0,
        deployer.address
    ];

    const distributionConfig = [
        "0x0000000000000000000000000000000000000000000000000000000000000000", // merkleRoot
        Math.floor(Date.now() / 1000) // startTimestamp
    ];

    // Check if we already have an event to reuse (optional, but good for saving gas)
    // For now, let's create a new one to be clean
    console.log("   Debug: eventMetadata:", JSON.stringify(eventMetadata));
    console.log("   Debug: distributionConfig:", JSON.stringify(distributionConfig));

    console.log("   Debug: Calling createSURGEEvent with arrays...");

    try {
        const data = factory.interface.encodeFunctionData("createSURGEEvent", [eventMetadata, distributionConfig]);
        console.log("   Debug: Encoded data successfully");
    } catch (e) {
        console.error("   Debug: Encoding failed:", e);
    }

    const tx = await factory.createSURGEEvent(eventMetadata, distributionConfig, { gasLimit: 5000000 });
    console.log(`   ⏳ Creating event: ${tx.hash}`);
    const receipt = await tx.wait();

    // Find SURGEEventCreated event
    const eventCreated = receipt.events?.find((e: any) => e.event === "SURGEEventCreated");
    const eventAddress = eventCreated?.args?.eventContract;
    console.log(`   ✅ Event created: ${eventAddress}`);

    // 2. Mint a Token
    console.log("\n✨ [2/4] Minting Token...");
    const SURGECore = await ethers.getContractFactory("SURGECore");
    const eventContract = SURGECore.attach(eventAddress);

    const mintTx = await eventContract.claim(deployer.address);
    console.log(`   ⏳ Minting: ${mintTx.hash}`);
    await mintTx.wait();
    console.log(`   ✅ Token #1 minted`);

    // 3. Set Bridge Contract & Approve
    console.log("\n🔓 [3/4] Setting Bridge & Approving...");
    const bridgeAddress = sourceDeployment.contracts.bridge;

    console.log(`   Configuring bridge on event: ${bridgeAddress}`);
    const setBridgeTx = await eventContract.setBridgeContract(bridgeAddress);
    await setBridgeTx.wait();
    console.log(`   ✅ Bridge contract set`);

    const approveTx = await eventContract.approve(bridgeAddress, 1);
    await approveTx.wait();
    console.log(`   ✅ Bridge approved`);

    // 4. Bridge to Destination
    console.log("\nfw [4/4] Bridging to Destination...");
    const SURGEBridge = await ethers.getContractFactory("SURGEBridge");
    const bridge = SURGEBridge.attach(bridgeAddress);

    const destChainId = destDeployment.chainId;
    const bridgeFee = await bridge.estimateBridgeFee(destChainId);
    console.log(`   💰 Bridge Fee: ${ethers.utils.formatEther(bridgeFee)} ETH`);

    const bridgeTx = await bridge.bridgeToChain(
        eventAddress,
        1, // Token ID
        destChainId,
        { value: bridgeFee }
    );
    console.log(`   ⏳ Bridging: ${bridgeTx.hash}`);
    const bridgeReceipt = await bridgeTx.wait();

    const bridgeInitiated = bridgeReceipt.events?.find((e: any) => e.event === "BridgeInitiated");
    const txHash = bridgeInitiated?.args?.txHash;

    console.log(`   ✅ Bridge Initiated!`);
    console.log(`   🔑 Bridge Tx Hash: ${txHash}`);
    console.log(`\n🎉 Test sequence complete on source chain!`);
    console.log(`   Wait for L2->L2 message to arrive on ${destNetwork}...`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
