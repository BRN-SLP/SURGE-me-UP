import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "@layerzerolabs/toolbox-hardhat";
import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig | any = {
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
        // ===== MAINNET NETWORKS =====
        base: {
            url: process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 8453,
        },
        optimism: {
            url: process.env.OPTIMISM_RPC_URL || "https://mainnet.optimism.io",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 10,
        },
        celo: {
            url: process.env.CELO_RPC_URL || "https://forno.celo.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 42220,
        },
        zora: {
            url: process.env.ZORA_RPC_URL || "https://rpc.zora.energy",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 7777777,
        },

        // ===== TESTNET NETWORKS =====
        baseSepolia: {
            url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 84532,
        },
        optimismSepolia: {
            url: process.env.OP_SEPOLIA_RPC_URL || "https://sepolia.optimism.io",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11155420,
        },
        celoAlfajores: {
            url: process.env.CELO_SEPOLIA_RPC_URL || "https://alfajores-forno.celo-testnet.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 44787,
        },
    },
    etherscan: {
        // ✅ IMPORTANT: For Etherscan API V2, use a single API key string (not an object)
        // Get your API key from https://etherscan.io/myapikey
        // The same key works for Base, Optimism, Celo explorers
        apiKey: process.env.ETHERSCAN_API_KEY || "",

        customChains: [
            {
                network: "base",
                chainId: 8453,
                urls: {
                    apiURL: "https://api.basescan.org/api",
                    browserURL: "https://basescan.org",
                },
            },
            {
                network: "baseSepolia",
                chainId: 84532,
                urls: {
                    apiURL: "https://api-sepolia.basescan.org/api",
                    browserURL: "https://sepolia.basescan.org",
                },
            },
            {
                network: "optimism",
                chainId: 10,
                urls: {
                    apiURL: "https://api-optimistic.etherscan.io/api",
                    browserURL: "https://optimistic.etherscan.io",
                },
            },
            {
                network: "optimismSepolia",
                chainId: 11155420,
                urls: {
                    apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
                    browserURL: "https://sepolia-optimism.etherscan.io",
                },
            },
            {
                network: "celo",
                chainId: 42220,
                urls: {
                    apiURL: "https://api.celoscan.io/api",
                    browserURL: "https://celoscan.io",
                },
            },
            {
                network: "celoAlfajores",
                chainId: 44787,
                urls: {
                    apiURL: "https://api-alfajores.celoscan.io/api",
                    browserURL: "https://alfajores.celoscan.io",
                },
            },
            {
                network: "zora",
                chainId: 7777777,
                urls: {
                    apiURL: "https://explorer.zora.energy/api",
                    browserURL: "https://explorer.zora.energy",
                },
            },
        ],
    },
    // Enable Sourcify verification (decentralized verification)
    sourcify: {
        enabled: true,
    },
};

export default config;
