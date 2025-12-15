
const ethers = require("ethers");

async function main() {
    const abiCoder = new ethers.AbiCoder();
    const args = [
        "SURGE Identity Anchor",
        "SURGE-ID",
        "https://surge-me-up.vercel.app/api/identity/metadata/"
    ];

    const encoded = abiCoder.encode(["string", "string", "string"], args);
    console.log("ABI-Encoded Arguments:");
    console.log(encoded);
}

main();
