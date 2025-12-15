
const { ethers } = require("hardhat");

async function main() {
    // Check if v5 or v6
    let abiCoder;
    if (ethers.AbiCoder) {
        abiCoder = new ethers.AbiCoder();
    } else {
        abiCoder = ethers.utils.defaultAbiCoder;
    }

    const args = [
        "SURGE Identity Anchor",
        "SURGE-ID",
        "https://surge-me-up.vercel.app/api/identity/metadata/"
    ];

    const encoded = abiCoder.encode(["string", "string", "string"], args);
    console.log("ABI_ENCODED_START");
    console.log(encoded);
    console.log("ABI_ENCODED_END");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
