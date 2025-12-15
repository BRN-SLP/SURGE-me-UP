import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.22",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        celo: {
            url: process.env.CELO_RPC_URL || "https://forno.celo.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 42220,
        },
        celoAlfajores: {
            url: process.env.CELO_ALFAJORES_RPC_URL || "https://alfajores-forno.celo-testnet.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 44787,
        },
    },
    etherscan: {
        // ✅ Используем единый Etherscan API ключ
        apiKey: process.env.ETHERSCAN_API_KEY || "",

        customChains: [
            {
                network: "celo",
                chainId: 42220,
                urls: {
                    // ✅ Etherscan V2 unified endpoint с chainId
                    apiURL: "https://api.etherscan.io/v2/api?chainid=42220",
                    browserURL: "https://celoscan.io",
                },
            },
            {
                network: "celoAlfajores",
                chainId: 44787,
                urls: {
                    // ✅ Etherscan V2 unified endpoint с chainId
                    apiURL: "https://api.etherscan.io/v2/api?chainid=44787",
                    browserURL: "https://alfajores.celoscan.io",
                },
            },
        ],
    },
    sourcify: {
        enabled: true,
    },
};

export default config;
