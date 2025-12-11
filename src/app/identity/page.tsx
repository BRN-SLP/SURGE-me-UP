'use client';

import { useIdentity } from '@/hooks/useIdentity';
import { useAppKit } from '@reown/appkit/react';
import { IdentityHeader } from '@/components/identity/IdentityHeader';
import { WalletCard } from '@/components/identity/WalletCard';
import { AlertBanner } from '@/components/identity/AlertBanner';
import { CreateIdentityCard } from '@/components/identity/CreateIdentityCard';
import { Link as LinkIcon, Settings, Award, Loader2, Wallet } from 'lucide-react';
import Link from 'next/link';

export default function IdentityPage() {
    const {
        identity,
        walletStatus,
        isLoading,
        isPrimary,
        status,
        isConnected,
        address,
        createIdentity,
        setPrimaryWallet,
    } = useIdentity();
    const { open } = useAppKit();

    // Not connected state
    if (!isConnected) {
        return (
            <div className="container mx-auto px-6 py-16 md:py-24">
                <div className="max-w-lg mx-auto text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Wallet className="w-8 h-8 text-white/40" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white mb-3">
                        Connect Your Wallet
                    </h2>
                    <p className="text-white/60 mb-6">
                        Connect your wallet to view or create your SURGE Identity
                    </p>
                    <button
                        onClick={() => open()}
                        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all"
                    >
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    // Loading state
    if (isLoading && !identity) {
        return (
            <div className="container mx-auto px-6 py-16 md:py-24">
                <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                </div>
            </div>
        );
    }

    // No identity state
    if (!identity) {
        return (
            <div className="container mx-auto px-6">
                <CreateIdentityCard
                    onCreateIdentity={createIdentity}
                    isLoading={isLoading}
                />
            </div>
        );
    }

    // Build mock wallet statuses for all linked wallets
    const walletStatuses = identity.linkedWallets.map((wallet) => ({
        address: wallet,
        isPrimary: wallet.toLowerCase() === identity.primaryWallet?.toLowerCase(),
        isCurrentWallet: wallet.toLowerCase() === address?.toLowerCase(),
        status: {
            isLinked: true,
            isPendingCompromise: false,
            isCompromised: false,
            linkedAt: identity.createdAt,
            compromiseInitiatedAt: 0,
            compromisedAt: 0,
            activityCountsUntil: 0,
            individualScore: wallet.toLowerCase() === address?.toLowerCase()
                ? (walletStatus?.individualScore || 0)
                : Math.floor(Math.random() * 300) + 100,
        },
    }));

    return (
        <div className="container mx-auto px-6 py-8 md:py-12">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold text-white">
                    Identity Dashboard
                </h1>
            </div>

            {/* Identity Header */}
            <IdentityHeader
                identity={identity}
                isPrimary={isPrimary}
                status={status}
                className="mb-6"
            />

            {/* Alerts */}
            {status === 'suspended' && (
                <AlertBanner
                    type="danger"
                    title="Identity Suspended"
                    message="Your identity is suspended because no Primary wallet is set. Select a new Primary wallet to reactivate."
                    action={{
                        label: 'Set Primary',
                        onClick: () => { },
                    }}
                    className="mb-6"
                />
            )}

            {status === 'pending' && (
                <AlertBanner
                    type="warning"
                    title="Action Required"
                    message="Your Primary wallet is pending compromise. You have 23 days remaining to set a new Primary or your identity will be suspended."
                    action={{
                        label: 'Set New Primary',
                        onClick: () => { },
                    }}
                    className="mb-6"
                />
            )}

            {/* Linked Wallets Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Linked Wallets</h2>
                    <span className="text-sm text-white/50">
                        {identity.linkedWallets.length} wallet{identity.linkedWallets.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {walletStatuses.map((wallet) => (
                        <WalletCard
                            key={wallet.address}
                            address={wallet.address}
                            isPrimary={wallet.isPrimary}
                            status={wallet.status}
                            isCurrentWallet={wallet.isCurrentWallet}
                            onSetPrimary={() => setPrimaryWallet(wallet.address)}
                            onManage={() => { }}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-white/10 pt-8">
                <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-3">
                    <Link
                        href="/identity/link"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all"
                    >
                        <LinkIcon className="w-4 h-4" />
                        Link New Wallet
                    </Link>
                    <Link
                        href="/identity/manage"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 font-medium rounded-xl border border-white/10 transition-all"
                    >
                        <Settings className="w-4 h-4" />
                        Manage Wallets
                    </Link>
                    <Link
                        href="/identity/badges"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 font-medium rounded-xl border border-white/10 transition-all"
                    >
                        <Award className="w-4 h-4" />
                        Heritage Badges
                    </Link>
                </div>
            </div>
        </div>
    );
}
