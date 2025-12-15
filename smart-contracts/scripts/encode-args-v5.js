
const { ethers } = require("ethers");

const abiCoder = ethers.utils.defaultAbiCoder;

const args = [
    "SURGE Identity Anchor",
    "SURGE-ID",
    "https://surge-me-up.vercel.app/api/identity/metadata/"
];

const encoded = abiCoder.encode(["string", "string", "string"], args);
console.log("ABI_ENCODED_START");
console.log(encoded);
console.log("ABI_ENCODED_END");
