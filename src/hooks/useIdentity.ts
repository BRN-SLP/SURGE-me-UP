'use client';

import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { useState, useEffect, useCallback } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { SURGE_ADDRESSES } from '@/config/surge-contracts';

// ============================================
// TYPES
// ============================================

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

// ============================================
// CONTRACT ABI (minimal)
// ============================================

const IDENTITY_REGISTRY_ABI = [
    // Read functions
    'function walletToIdentity(address) view returns (uint256)',
    'function getIdentity(uint256) view returns (address[] linkedWallets, address primaryWallet, bool isSuspended, uint256 createdAt, uint256 lastPrimaryChangeAt)',
    'function getWalletStatus(address) view returns (bool isLinked, bool isPendingCompromise, bool isCompromised, uint256 linkedAt, uint256 compromiseInitiatedAt, uint256 compromisedAt, uint256 activityCountsUntil)',
    'function getAggregatedScore(uint256) view returns (uint256)',
    'function getIndividualScore(address) view returns (uint256)',
    'function isWalletActive(address) view returns (bool)',
    // Write functions
    'function createIdentity() returns (uint256)',
    'function linkWallet(uint256 identityId, address newWallet, bytes existingWalletSig, bytes newWalletSig)',
    'function setPrimaryWallet(uint256 identityId, address newPrimary)',
    'function markAsCompromised(uint256 identityId, address walletToMark)',
];

// ============================================
// HOOK
// ============================================

export function useIdentity() {
    const { address, isConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('eip155');

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

    // Base chainId
    const BASE_CHAIN_ID = 8453;

    // Ensure wallet is on Base network
    const ensureBaseNetwork = useCallback(async () => {
        if (!walletProvider) throw new Error('Wallet not connected');

        const provider = walletProvider as any;

        try {
            // Get current chainId
            const currentChainId = await provider.request({ method: 'eth_chainId' });
            const currentChainIdDecimal = parseInt(currentChainId as string, 16);

            if (currentChainIdDecimal !== BASE_CHAIN_ID) {
                // Request network switch
                try {
                    await provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
                    });
                } catch (switchError: unknown) {
                    // If chain not added, add it
                    if ((switchError as { code?: number })?.code === 4902) {
                        await provider.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: `0x${BASE_CHAIN_ID.toString(16)}`,
                                chainName: 'Base',
                                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                                rpcUrls: ['https://mainnet.base.org'],
                                blockExplorerUrls: ['https://basescan.org'],
                            }],
                        });
                    } else {
                        throw switchError;
                    }
                }
            }
        } catch (err) {
            console.error('Failed to switch network:', err);
            throw new Error('Please switch to Base network to continue');
        }
    }, [walletProvider]);

    // Get contract instance
    const getContract = useCallback(async (withSigner = false) => {
        if (!walletProvider) throw new Error('Wallet not connected');

        // Ensure we're on Base before getting contract
        if (withSigner) {
            await ensureBaseNetwork();
        }

        const provider = new BrowserProvider(walletProvider as any);
        const registryAddress = SURGE_ADDRESSES.base.identityRegistry;

        if (withSigner) {
            const signer = await provider.getSigner();
            return new Contract(registryAddress, IDENTITY_REGISTRY_ABI, signer);
        }

        return new Contract(registryAddress, IDENTITY_REGISTRY_ABI, provider);
    }, [walletProvider, ensureBaseNetwork]);

    // Fetch identity data from contract
    const fetchIdentity = useCallback(async () => {
        if (!address || !walletProvider) {
            setIdentity(null);
            setWalletStatus(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const contract = await getContract(false);

            // Get identity ID for this wallet
            const identityId = await contract.walletToIdentity(address);

            if (identityId.toString() === '0') {
                // No identity found
                setIdentity(null);
                setWalletStatus(null);
                return;
            }

            // Get identity details
            const [linkedWallets, primaryWallet, isSuspended, createdAt] = await contract.getIdentity(identityId);

            // Get wallet status
            const status = await contract.getWalletStatus(address);

            // Get scores
            const totalScore = await contract.getAggregatedScore(identityId);
            const individualScore = await contract.getIndividualScore(address);

            // Set identity data
            setIdentity({
                identityId: Number(identityId),
                linkedWallets: linkedWallets as string[],
                primaryWallet: primaryWallet as string,
                isSuspended: isSuspended as boolean,
                createdAt: Number(createdAt) * 1000, // Convert to ms
                totalScore: Number(totalScore),
                individualScore: Number(individualScore),
            });

            // Set wallet status
            setWalletStatus({
                isLinked: status.isLinked as boolean,
                isPendingCompromise: status.isPendingCompromise as boolean,
                isCompromised: status.isCompromised as boolean,
                linkedAt: Number(status.linkedAt) * 1000,
                compromiseInitiatedAt: Number(status.compromiseInitiatedAt) * 1000,
                compromisedAt: Number(status.compromisedAt) * 1000,
                activityCountsUntil: Number(status.activityCountsUntil) * 1000,
                individualScore: Number(individualScore),
            });
        } catch (err) {
            console.error('Failed to fetch identity:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch identity');
            setIdentity(null);
            setWalletStatus(null);
        } finally {
            setIsLoading(false);
        }
    }, [address, walletProvider, getContract]);

    // Create identity
    const createIdentity = async () => {
        if (!address) throw new Error('Wallet not connected');

        setIsLoading(true);
        setError(null);

        try {
            const contract = await getContract(true);
            const tx = await contract.createIdentity();
            await tx.wait();
            await fetchIdentity();
        } catch (err) {
            console.error('Failed to create identity:', err);
            setError(err instanceof Error ? err.message : 'Failed to create identity');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Link wallet
    const linkWallet = async (newWallet: string, signatures: { existing: string; new: string }) => {
        if (!identity) throw new Error('No identity found');

        setIsLoading(true);
        setError(null);

        try {
            const contract = await getContract(true);
            const tx = await contract.linkWallet(
                identity.identityId,
                newWallet,
                signatures.existing,
                signatures.new
            );
            await tx.wait();
            await fetchIdentity();
        } catch (err) {
            console.error('Failed to link wallet:', err);
            setError(err instanceof Error ? err.message : 'Failed to link wallet');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Set primary wallet
    const setPrimaryWallet = async (newPrimary: string) => {
        if (!identity) throw new Error('No identity found');

        setIsLoading(true);
        setError(null);

        try {
            const contract = await getContract(true);
            const tx = await contract.setPrimaryWallet(identity.identityId, newPrimary);
            await tx.wait();
            await fetchIdentity();
        } catch (err) {
            console.error('Failed to set primary wallet:', err);
            setError(err instanceof Error ? err.message : 'Failed to set primary wallet');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Mark as compromised
    const markAsCompromised = async (walletToMark: string) => {
        if (!identity) throw new Error('No identity found');

        setIsLoading(true);
        setError(null);

        try {
            const contract = await getContract(true);
            const tx = await contract.markAsCompromised(identity.identityId, walletToMark);
            await tx.wait();
            await fetchIdentity();
        } catch (err) {
            console.error('Failed to mark as compromised:', err);
            setError(err instanceof Error ? err.message : 'Failed to mark as compromised');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    // Effects
    useEffect(() => {
        if (isConnected && address && walletProvider) {
            fetchIdentity();
        } else {
            setIdentity(null);
            setWalletStatus(null);
        }
    }, [isConnected, address, walletProvider, fetchIdentity]);

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
