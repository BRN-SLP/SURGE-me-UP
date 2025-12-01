// SURGE Protocol Contract Configuration
// Auto-generated from deployed Mainnet contracts

import { Address } from 'viem';

// ============================================
// MAINNET CONTRACT ADDRESSES
// ============================================

export const SURGE_ADDRESSES = {
    base: {
        chainId: 8453 as const,
        reputation: '0x170fb7943d29299D6941029e5dF6C42281C90e47' as Address,
        factory: '0xEeB8fB619dD0cf0e185e590955Ba98487d6A3547' as Address,
        bridge: '0x43dB642E37750BE34fd5f1e34BFDd3aB5F9c7f22' as Address,
    },
    optimism: {
        chainId: 10 as const,
        reputation: '0x543B57fB141855e5590DBaDfbc1302F5239271f3' as Address,
        factory: '0x387FbEAc23967f967337dD9249A358c72214942B' as Address,
        bridge: '0x21D37b2Bb9893110a5FCf6f800a7e6D654913A79' as Address,
    },
    celo: {
        chainId: 42220 as const,
        reputation: '0x2Fe1d369299C0f525CAC9d618680301BbfB89712' as Address,
        factory: '0x98865Bc0219D9E002329c37994A0d7d475bAB4d7' as Address,
        bridge: '0xa48Fab6213fED674230D581b4649968a50AD19E7' as Address,
    },
    zora: {
        chainId: 7777777 as const,
        reputation: '0xa918772Ee4C1843B72c303feb4b77222cc07236D' as Address,
        factory: '0x543B57fB141855e5590DBaDfbc1302F5239271f3' as Address,
        bridge: '0xBc084dAAfd26FB35245940072b91Ebdf571C0153' as Address,
    },
} as const;

// Chain ID to network name mapping
export const CHAIN_ID_TO_NETWORK = {
    8453: 'base',
    10: 'optimism',
    42220: 'celo',
    7777777: 'zora',
} as const;

// Network display names
export const NETWORK_NAMES = {
    base: 'Base',
    optimism: 'Optimism',
    celo: 'Celo',
    zora: 'Zora',
} as const;

// ============================================
// CONTRACT ABIs
// ============================================

// SURGEFactory ABI (minimal - key functions only)
export const SURGE_FACTORY_ABI = [
    {
        inputs: [
            {
                components: [
                    { internalType: 'string', name: 'name', type: 'string' },
                    { internalType: 'string', name: 'description', type: 'string' },
                    { internalType: 'string', name: 'imageURI', type: 'string' },
                    { internalType: 'uint256', name: 'chainId', type: 'uint256' },
                    { internalType: 'uint8', name: 'tier', type: 'uint8' },
                    { internalType: 'uint256', name: 'maxSupply', type: 'uint256' },
                    { internalType: 'uint256', name: 'expiryTimestamp', type: 'uint256' },
                    { internalType: 'uint8', name: 'mode', type: 'uint8' },
                    { internalType: 'address', name: 'creator', type: 'address' },
                ],
                internalType: 'struct SURGECore.EventMetadata',
                name: '_metadata',
                type: 'tuple',
            },
            {
                components: [
                    { internalType: 'bytes32', name: 'merkleRoot', type: 'bytes32' },
                    { internalType: 'uint256', name: 'startTimestamp', type: 'uint256' },
                ],
                internalType: 'struct SURGEFactory.DistributionConfig',
                name: '_config',
                type: 'tuple',
            },
        ],
        name: 'createSURGEEvent',
        outputs: [{ internalType: 'address', name: '', type: 'address' }],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '_creator', type: 'address' }],
        name: 'getEventsByCreator',
        outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getTotalEvents',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

// SURGECore ABI (minimal - key functions only)
export const SURGE_CORE_ABI = [
    {
        inputs: [],
        name: 'claim',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'bytes32[]', name: '_proof', type: 'bytes32[]' },
            { internalType: 'bytes', name: '_signature', type: 'bytes' },
        ],
        name: 'claimWithSignature',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
        name: 'tokenURI',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getMetadata',
        outputs: [
            {
                components: [
                    { internalType: 'string', name: 'name', type: 'string' },
                    { internalType: 'string', name: 'description', type: 'string' },
                    { internalType: 'string', name: 'imageURI', type: 'string' },
                    { internalType: 'uint256', name: 'chainId', type: 'uint256' },
                    { internalType: 'uint8', name: 'tier', type: 'uint8' },
                    { internalType: 'uint256', name: 'maxSupply', type: 'uint256' },
                    { internalType: 'uint256', name: 'expiryTimestamp', type: 'uint256' },
                    { internalType: 'uint8', name: 'mode', type: 'uint8' },
                    { internalType: 'address', name: 'creator', type: 'address' },
                ],
                internalType: 'struct SURGECore.EventMetadata',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'getRemainingSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
        name: 'hasUserClaimed',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

// SURGEBridge ABI (minimal - key functions only)
export const SURGE_BRIDGE_ABI = [
    {
        inputs: [
            { internalType: 'address', name: '_eventContract', type: 'address' },
            { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
            { internalType: 'uint256', name: '_destChainId', type: 'uint256' },
        ],
        name: 'bridgeToChain',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: '_destChainId', type: 'uint256' }],
        name: 'estimateBridgeFee',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
        name: 'getUserTransactions',
        outputs: [{ internalType: 'bytes32[]', name: '', type: 'bytes32[]' }],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'bytes32', name: '_txHash', type: 'bytes32' }],
        name: 'getTransaction',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'sourceChainId', type: 'uint256' },
                    { internalType: 'uint256', name: 'destChainId', type: 'uint256' },
                    { internalType: 'address', name: 'sourceEvent', type: 'address' },
                    { internalType: 'address', name: 'destEvent', type: 'address' },
                    { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
                    { internalType: 'address', name: 'owner', type: 'address' },
                    { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
                    { internalType: 'uint8', name: 'status', type: 'uint8' },
                    { internalType: 'uint256', name: 'retryCount', type: 'uint256' },
                ],
                internalType: 'struct SURGEBridge.BridgeTransaction',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

// SURGEReputation ABI (minimal - key functions only)
export const SURGE_REPUTATION_ABI = [
    {
        inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
        name: 'getUserReputation',
        outputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'totalPoints', type: 'uint256' },
                    { internalType: 'uint256', name: 'totalClaims', type: 'uint256' },
                    { internalType: 'uint256', name: 'currentStreak', type: 'uint256' },
                    { internalType: 'uint256', name: 'longestStreak', type: 'uint256' },
                    { internalType: 'uint256', name: 'tier', type: 'uint256' },
                    { internalType: 'uint256', name: 'badges', type: 'uint256' },
                ],
                internalType: 'struct SURGEReputation.UserReputation',
                name: '',
                type: 'tuple',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
        name: 'getUserBadges',
        outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
        stateMutability: 'view',
        type: 'function',
    },
] as const;

// Helper function to get addresses for current chain
export function getSurgeAddresses(chainId: number) {
    const network = CHAIN_ID_TO_NETWORK[chainId as keyof typeof CHAIN_ID_TO_NETWORK];
    if (!network) {
        throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    return SURGE_ADDRESSES[network];
}

// Helper function to check if chain is supported
export function isSupportedChain(chainId: number): boolean {
    return chainId in CHAIN_ID_TO_NETWORK;
}

// Export all supported chain IDs
export const SUPPORTED_CHAIN_IDS = [8453, 10, 42220, 7777777] as const;
