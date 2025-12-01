import { ethers } from "hardhat";

async function main() {
    const address = "0x1a44076050125825900e58834354796d720731cd";
    console.log(`Checking code at ${address}...`);
    const code = await ethers.provider.getCode(address);
    if (code === "0x") {
        console.log("No code found at address.");
    } else {
        console.log("Code found! Length:", code.length);
        // Try to call eid() if possible, but just code presence is a good sign for now.
        // EndpointV2 usually has an eid() function or similar.
        // Let's try to get the EID if we can, but ABI is needed.
        // We'll just trust code presence + prefix match for now.
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
