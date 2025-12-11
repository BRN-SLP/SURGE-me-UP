'use client';

import { useAppKitAccount } from '@reown/appkit/react';
import { useState, useEffect } from 'react';

export interface IdentityData {
    identityId: number;
    linkedWallets: string[];
    primaryWallet: string;
    isSuspended: boolean;
    createdAt: number;
    totalScore: number;
    individualScore: number;
}

export interface WalletStatusData {
    isLinked: boolean;
    isPendingCompromise: boolean;
    isCompromised: boolean;
    linkedAt: number;
    compromiseInitiatedAt: number;
    compromisedAt: number;
    activityCountsUntil: number;
    individualScore: number;
}

export function useIdentity() {
    const { address, isConnected } = useAppKitAccount();
    const [identity, setIdentity] = useState<IdentityData | null>(null);
    const [walletStatus, setWalletStatus] = useState<WalletStatusData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if current wallet is primary
    const isPrimary = identity?.primaryWallet?.toLowerCase() === address?.toLowerCase();

    // Get status label
    const getStatusLabel = (): 'active' | 'pending' | 'compromised' | 'suspended' | 'none' => {
        if (!identity) return 'none';
        if (identity.isSuspended) return 'suspended';
        if (walletStatus?.isCompromised) return 'compromised';
        if (walletStatus?.isPendingCompromise) return 'pending';
        return 'active';
    };

    // Fetch identity data (mock for now - will connect to contract later)
    const fetchIdentity = async () => {
        if (!address) {
            setIdentity(null);
            setWalletStatus(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Replace with actual contract calls
            // For now, simulate API response
            const mockIdentity: IdentityData = {
                identityId: 12345,
                linkedWallets: [address],
                primaryWallet: address,
                isSuspended: false,
                createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000, // 1 year ago
                totalScore: 847,
                individualScore: 847,
            };

            const mockStatus: WalletStatusData = {
                isLinked: true,
                isPendingCompromise: false,
                isCompromised: false,
                linkedAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
                compromiseInitiatedAt: 0,
                compromisedAt: 0,
                activityCountsUntil: 0,
                individualScore: 847,
            };

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 500));

            setIdentity(mockIdentity);
            setWalletStatus(mockStatus);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch identity');
        } finally {
            setIsLoading(false);
        }
    };

    // Create identity (mock)
    const createIdentity = async () => {
        if (!address) throw new Error('Wallet not connected');

        setIsLoading(true);
        try {
            // TODO: Call IdentityRegistry.createIdentity()
            await new Promise(resolve => setTimeout(resolve, 1000));
            await fetchIdentity();
        } finally {
            setIsLoading(false);
        }
    };

    // Link wallet (mock)
    const linkWallet = async (newWallet: string, signatures: { existing: string; new: string }) => {
        if (!identity) throw new Error('No identity found');

        setIsLoading(true);
        try {
            // TODO: Call IdentityRegistry.linkWallet()
            await new Promise(resolve => setTimeout(resolve, 1000));
            await fetchIdentity();
        } finally {
            setIsLoading(false);
        }
    };

    // Set primary wallet (mock)
    const setPrimaryWallet = async (newPrimary: string) => {
        if (!identity) throw new Error('No identity found');

        setIsLoading(true);
        try {
            // TODO: Call IdentityRegistry.setPrimaryWallet()
            await new Promise(resolve => setTimeout(resolve, 1000));
            await fetchIdentity();
        } finally {
            setIsLoading(false);
        }
    };

    // Mark as compromised (mock)
    const markAsCompromised = async (walletToMark: string) => {
        if (!identity) throw new Error('No identity found');

        setIsLoading(true);
        try {
            // TODO: Call IdentityRegistry.markAsCompromised()
            await new Promise(resolve => setTimeout(resolve, 1000));
            await fetchIdentity();
        } finally {
            setIsLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        if (isConnected && address) {
            fetchIdentity();
        } else {
            setIdentity(null);
            setWalletStatus(null);
        }
    }, [isConnected, address]);

    return {
        identity,
        walletStatus,
        isLoading,
        error,
        isPrimary,
        status: getStatusLabel(),
        isConnected,
        address,
        // Actions
        createIdentity,
        linkWallet,
        setPrimaryWallet,
        markAsCompromised,
        refetch: fetchIdentity,
    };
}
