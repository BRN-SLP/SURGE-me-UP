// SURGE Protocol Contract Interaction Hooks
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import {
    SURGE_FACTORY_ABI,
    SURGE_CORE_ABI,
    SURGE_BRIDGE_ABI,
    SURGE_REPUTATION_ABI,
    getSurgeAddresses,
} from '@/config/surge-contracts';
import type { Address } from 'viem';
import type { EventMetadata, DistributionConfig } from '@/types/surge';

// ============================================
// SURGE FACTORY HOOKS
// ============================================

/**
 * Hook to create a new SURGE event
 */
export function useCreateSurgeEvent() {
    const { chain } = useAccount();
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const createEvent = async (metadata: EventMetadata, config: DistributionConfig) => {
        if (!chain) throw new Error('No chain connected');

        const addresses = getSurgeAddresses(chain.id);

        // @ts-ignore - wagmi v2 type inference with complex ABI structs
        return writeContract({
            address: addresses.factory,
            abi: SURGE_FACTORY_ABI,
            functionName: 'createSURGEEvent',
            args: [metadata, config] as any,
        });
    };

    return {
        createEvent,
        hash,
        isPending,
        isConfirming,
        isSuccess,
    };
}

/**
 * Hook to get events created by an address
 */
export function useCreatorEvents(creator?: Address) {
    const { chain } = useAccount();

    const { data: events } = useReadContract({
        address: chain ? getSurgeAddresses(chain.id).factory : undefined,
        abi: SURGE_FACTORY_ABI,
        functionName: 'getEventsByCreator',
        args: creator ? [creator] : undefined,
        query: {
            enabled: !!creator && !!chain,
        },
    });

    return events as Address[] | undefined;
}

/**
 * Hook to get total number of events
 */
export function useTotalEvents() {
    const { chain } = useAccount();

    const { data: total } = useReadContract({
        address: chain ? getSurgeAddresses(chain.id).factory : undefined,
        abi: SURGE_FACTORY_ABI,
        functionName: 'getTotalEvents',
        query: {
            enabled: !!chain,
        },
    });

    return total as bigint | undefined;
}

// ============================================
// SURGE CORE (EVENT) HOOKS
// ============================================

/**
 * Hook to claim a token from an event
 */
export function useClaimToken(eventAddress?: Address) {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const claim = async () => {
        if (!eventAddress) throw new Error('No event address provided');

        return writeContract({
            address: eventAddress,
            abi: SURGE_CORE_ABI,
            functionName: 'claim',
        });
    };

    return {
        claim,
        hash,
        isPending,
        isConfirming,
        isSuccess,
    };
}

/**
 * Hook to claim a token with signature/merkle proof
 */
export function useClaimWithSignature(eventAddress?: Address) {
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const claimWithSignature = async (proof: `0x${string}`[], signature: `0x${string}`) => {
        if (!eventAddress) throw new Error('No event address provided');

        return writeContract({
            address: eventAddress,
            abi: SURGE_CORE_ABI,
            functionName: 'claimWithSignature',
            args: [proof, signature],
        });
    };

    return {
        claimWithSignature,
        hash,
        isPending,
        isConfirming,
        isSuccess,
    };
}

/**
 * Hook to get event metadata
 */
export function useEventMetadata(eventAddress?: Address) {
    const { data: metadata } = useReadContract({
        address: eventAddress,
        abi: SURGE_CORE_ABI,
        functionName: 'getMetadata',
        query: {
            enabled: !!eventAddress,
        },
    });

    return metadata as EventMetadata | undefined;
}

/**
 * Hook to get remaining supply of an event
 */
export function useRemainingSupply(eventAddress?: Address) {
    const { data: remaining } = useReadContract({
        address: eventAddress,
        abi: SURGE_CORE_ABI,
        functionName: 'getRemainingSupply',
        query: {
            enabled: !!eventAddress,
        },
    });

    return remaining as bigint | undefined;
}

/**
 * Hook to check if user has claimed from event
 */
export function useHasUserClaimed(eventAddress?: Address) {
    const { address: userAddress } = useAccount();

    const { data: hasClaimed } = useReadContract({
        address: eventAddress,
        abi: SURGE_CORE_ABI,
        functionName: 'hasUserClaimed',
        args: userAddress ? [userAddress] : undefined,
        query: {
            enabled: !!eventAddress && !!userAddress,
        },
    });

    return hasClaimed as boolean | undefined;
}

/**
 * Hook to get user's token balance for an event
 */
export function useEventBalance(eventAddress?: Address) {
    const { address: userAddress } = useAccount();

    const { data: balance } = useReadContract({
        address: eventAddress,
        abi: SURGE_CORE_ABI,
        functionName: 'balanceOf',
        args: userAddress ? [userAddress] : undefined,
        query: {
            enabled: !!eventAddress && !!userAddress,
        },
    });

    return balance as bigint | undefined;
}

// ============================================
// SURGE BRIDGE HOOKS
// ============================================

/**
 * Hook to bridge a token to another chain
 */
export function useBridgeToken() {
    const { chain } = useAccount();
    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const bridge = async (
        eventAddress: Address,
        tokenId: bigint,
        destChainId: number,
        fee: bigint
    ) => {
        if (!chain) throw new Error('No chain connected');

        const addresses = getSurgeAddresses(chain.id);

        return writeContract({
            address: addresses.bridge,
            abi: SURGE_BRIDGE_ABI,
            functionName: 'bridgeToChain',
            args: [eventAddress, tokenId, BigInt(destChainId)],
            value: fee,
        });
    };

    return {
        bridge,
        hash,
        isPending,
        isConfirming,
        isSuccess,
    };
}

/**
 * Hook to estimate bridge fee
 */
export function useBridgeFee(destChainId?: number) {
    const { chain } = useAccount();

    const { data: fee } = useReadContract({
        address: chain ? getSurgeAddresses(chain.id).bridge : undefined,
        abi: SURGE_BRIDGE_ABI,
        functionName: 'estimateBridgeFee',
        args: destChainId !== undefined ? [BigInt(destChainId)] : undefined,
        query: {
            enabled: !!chain && destChainId !== undefined,
        },
    });

    return fee as bigint | undefined;
}

/**
 * Hook to get user's bridge transactions
 */
export function useUserBridgeTransactions() {
    const { address: userAddress, chain } = useAccount();

    const { data: txHashes } = useReadContract({
        address: chain ? getSurgeAddresses(chain.id).bridge : undefined,
        abi: SURGE_BRIDGE_ABI,
        functionName: 'getUserTransactions',
        args: userAddress ? [userAddress] : undefined,
        query: {
            enabled: !!userAddress && !!chain,
        },
    });

    return txHashes as `0x${string}`[] | undefined;
}

// ============================================
// SURGE REPUTATION HOOKS
// ============================================

/**
 * Hook to get user's reputation data
 */
export function useUserReputation() {
    const { address: userAddress, chain } = useAccount();

    const { data: reputation } = useReadContract({
        address: chain ? getSurgeAddresses(chain.id).reputation : undefined,
        abi: SURGE_REPUTATION_ABI,
        functionName: 'getUserReputation',
        args: userAddress ? [userAddress] : undefined,
        query: {
            enabled: !!userAddress && !!chain,
        },
    });

    return reputation;
}

/**
 * Hook to get user's badges
 */
export function useUserBadges() {
    const { address: userAddress, chain } = useAccount();

    const { data: badges } = useReadContract({
        address: chain ? getSurgeAddresses(chain.id).reputation : undefined,
        abi: SURGE_REPUTATION_ABI,
        functionName: 'getUserBadges',
        args: userAddress ? [userAddress] : undefined,
        query: {
            enabled: !!userAddress && !!chain,
        },
    });

    return badges as bigint[] | undefined;
}
