import { ethers } from "hardhat";

async function main() {
    const address = "0x4200000000000000000000000000000000000023";
    console.log(`Checking code at ${address} on ${process.env.HARDHAT_NETWORK}...`);

    const code = await ethers.provider.getCode(address);
    console.log(`Code length: ${code.length}`);

    if (code === "0x") {
        console.log("❌ No code at this address!");
    } else {
        console.log("✅ Code exists!");
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
