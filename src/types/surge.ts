// SURGE Protocol TypeScript Type Definitions
// Types matching smart contract structs

import { Address } from 'viem';

// ============================================
// ENUMS
// ============================================

export enum DistributionMode {
    Public = 0,
    Whitelist = 1,
    Signature = 2,
}

export enum CreatorTier {
    Community = 0,
    Verified = 1,
    Official = 2,
}

export enum BridgeStatus {
    Pending = 0,
    Completed = 1,
    Failed = 2,
    Retrying = 3,
}

// ============================================
// CORE TYPES
// ============================================

export interface EventMetadata {
    name: string;
    description: string;
    imageURI: string;
    chainId: bigint;
    tier: CreatorTier;
    maxSupply: bigint;
    expiryTimestamp: bigint;
    mode: DistributionMode;
    creator: Address;
}

export interface DistributionConfig {
    merkleRoot: `0x${string}`;
    startTimestamp: bigint;
}

export interface BridgeTransaction {
    sourceChainId: bigint;
    destChainId: bigint;
    sourceEvent: Address;
    destEvent: Address;
    tokenId: bigint;
    owner: Address;
    timestamp: bigint;
    status: BridgeStatus;
    retryCount: bigint;
}

export interface UserReputation {
    totalPoints: bigint;
    totalClaims: bigint;
    currentStreak: bigint;
    longestStreak: bigint;
    tier: bigint;
    badges: bigint;
}

export interface CreatorProfile {
    creator: Address;
    tier: CreatorTier;
    reputationScore: bigint;
    isBlacklisted: boolean;
    eventsCreated: bigint;
    totalClaims: bigint;
    registeredAt: bigint;
}

// ============================================
// FRONTEND-SPECIFIC TYPES
// ============================================

export interface SurgeEvent {
    address: Address;
    metadata: EventMetadata;
    remainingSupply: bigint;
    hasUserClaimed: boolean;
}

export interface UserSurgeData {
    address: Address;
    balance: bigint;
    reputation: UserReputation | null;
    badges: bigint[];
    events: SurgeEvent[];
    bridgeTransactions: BridgeTransaction[];
}

export interface CreateEventFormData {
    name: string;
    description: string;
    imageURI: string;
    maxSupply: number;
    expiryDate: Date | null;
    mode: DistributionMode;
    merkleRoot?: `0x${string}`;
    startDate: Date;
}

export interface BridgeFormData {
    eventAddress: Address;
    tokenId: bigint;
    destinationChainId: number;
}

// ============================================
// NETWORK TYPES
// ============================================

export type SupportedNetwork = 'base' | 'optimism' | 'celo' | 'zora';

export type NetworkConfig = {
    chainId: number;
    name: string;
    rpcUrl: string;
    blockExplorer: string;
    nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
};

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ContractCallResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    txHash?: `0x${string}`;
}

export interface EventListResponse {
    events: SurgeEvent[];
    total: number;
    hasMore: boolean;
}

// ============================================
// HELPER TYPES
// ============================================

export type ChainId = 8453 | 10 | 42220 | 7777777;

export type ContractAddresses = {
    reputation: Address;
    factory: Address;
    bridge: Address;
};

// Helper type for form validation
export type ValidationError = {
    field: string;
    message: string;
};

export type FormState<T> = {
    data: T;
    errors: ValidationError[];
    isSubmitting: boolean;
    isValid: boolean;
};
