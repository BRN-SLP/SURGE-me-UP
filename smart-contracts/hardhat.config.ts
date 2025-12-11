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
        ink: {
            url: process.env.INK_RPC_URL || "https://rpc-gel.inkonchain.com",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 57073,
        },
        lisk: {
            url: process.env.LISK_RPC_URL || "https://rpc.api.lisk.com",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1135,
        },
        unichain: {
            url: process.env.UNICHAIN_RPC_URL || "https://mainnet.unichain.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 130,
        },
        soneium: {
            url: process.env.SONEIUM_RPC_URL || "https://rpc.soneium.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1868,
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
        // Etherscan V2 API - single key for all networks
        apiKey: process.env.BASESCAN_API_KEY || "",

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
            {
                network: "ink",
                chainId: 57073,
                urls: {
                    apiURL: "https://explorer.inkonchain.com/api",
                    browserURL: "https://explorer.inkonchain.com",
                },
            },
            {
                network: "lisk",
                chainId: 1135,
                urls: {
                    apiURL: "https://blockscout.lisk.com/api",
                    browserURL: "https://blockscout.lisk.com",
                },
            },
            {
                network: "unichain",
                chainId: 130,
                urls: {
                    apiURL: "https://unichain.blockscout.com/api",
                    browserURL: "https://unichain.blockscout.com",
                },
            },
            {
                network: "soneium",
                chainId: 1868,
                urls: {
                    apiURL: "https://soneium.blockscout.com/api",
                    browserURL: "https://soneium.blockscout.com",
                },
            },
        ],
    },
    sourcify: {
        enabled: true,
    },
};

export default config;
