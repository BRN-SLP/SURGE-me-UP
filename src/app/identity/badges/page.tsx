'use client';

import { useState } from 'react';
import { useIdentity } from '@/hooks/useIdentity';
import { useAppKit } from '@reown/appkit/react';
import { AlertBanner } from '@/components/identity/AlertBanner';
import { ArrowLeft, Wallet, Award, Loader2, Check } from 'lucide-react';
import Link from 'next/link';

// Mock badge data
const mockAvailableBadges = [
    {
        id: 'veteran',
        name: 'Veteran Wallet',
        icon: '🏅',
        description: '3 years 4 months of activity',
        sourceWallet: '0xCCC...3333',
    },
    {
        id: 'maestro',
        name: 'Contract Maestro',
        icon: '🎯',
        description: '5,247 unique interactions',
        sourceWallet: '0xCCC...3333',
    },
    {
        id: 'crosschain',
        name: 'Cross-Chain Native',
        icon: '🌐',
        description: 'Active on 6 networks',
        sourceWallet: '0xCCC...3333',
    },
];

const mockClaimedBadges = [
    {
        id: 'volume',
        name: 'Volume Warrior',
        icon: '🎖️',
        description: '15.2 ETH volume',
        sourceWallet: '0xDDD...4444',
        claimedAt: 'Dec 2025',
    },
    {
        id: 'collector',
        name: 'Event Collector',
        icon: '💎',
        description: '42 SURGE badges',
        sourceWallet: '0xDDD...4444',
        claimedAt: 'Dec 2025',
    },
];

export default function HeritageBadgesPage() {
    const { identity, isConnected, address } = useIdentity();
    const { open } = useAppKit();
    const [claimingBadge, setClaimingBadge] = useState<string | null>(null);
    const [claimedIds, setClaimedIds] = useState<string[]>([]);
    const [destinationWallet, setDestinationWallet] = useState('');

    // Not connected / no identity guards
    if (!isConnected) {
        return (
            <div className="container mx-auto px-6 py-16 md:py-24">
                <div className="max-w-lg mx-auto text-center">
                    <Wallet className="w-16 h-16 mx-auto mb-6 text-white/40" />
                    <h2 className="text-2xl font-semibold text-white mb-3">Connect Your Wallet</h2>
                    <button onClick={() => open()} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all">
                        Connect Wallet
                    </button>
                </div>
            </div>
        );
    }

    if (!identity) {
        return (
            <div className="container mx-auto px-6 py-16">
                <AlertBanner type="warning" message="You need a SURGE Identity to view heritage badges." action={{ label: 'Create Identity', onClick: () => window.location.href = '/identity' }} />
            </div>
        );
    }

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const handleClaimBadge = async (badgeId: string) => {
        setClaimingBadge(badgeId);
        await new Promise(r => setTimeout(r, 2000));
        setClaimedIds(prev => [...prev, badgeId]);
        setClaimingBadge(null);
    };

    const handleClaimAll = async () => {
        for (const badge of mockAvailableBadges) {
            if (!claimedIds.includes(badge.id)) {
                await handleClaimBadge(badge.id);
            }
        }
    };

    const availableBadges = mockAvailableBadges.filter(b => !claimedIds.includes(b.id));

    return (
        <div className="container mx-auto px-6 py-8 md:py-12">
            {/* Back Button */}
            <Link href="/identity" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-white">Heritage Badges</h1>
                    <p className="text-white/50">Identity #{identity.identityId}</p>
                </div>
            </div>

            {/* Intro */}
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 mb-8">
                <p className="text-white/70">
                    Heritage badges prove your historical on-chain experience from compromised wallets.
                    They are minted to your active wallets and help show veteran status and expertise.
                </p>
            </div>

            {/* Available to Claim */}
            {availableBadges.length > 0 && (
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">Available to Claim</h2>
                        <span className="text-sm text-white/50">{availableBadges.length} badge{availableBadges.length !== 1 ? 's' : ''}</span>
                    </div>

                    <div className="text-sm text-white/50 mb-4">
                        From compromised wallet: <code className="text-white">{mockAvailableBadges[0].sourceWallet}</code>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {availableBadges.map((badge) => (
                            <div
                                key={badge.id}
                                className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-center"
                            >
                                <div className="text-4xl mb-3">{badge.icon}</div>
                                <div className="font-semibold text-white mb-1">{badge.name}</div>
                                <div className="text-sm text-white/50 mb-4">{badge.description}</div>
                                <button
                                    onClick={() => handleClaimBadge(badge.id)}
                                    disabled={claimingBadge !== null}
                                    className="w-full px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 disabled:opacity-50 text-amber-400 font-medium rounded-lg border border-amber-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    {claimingBadge === badge.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Claiming...
                                        </>
                                    ) : (
                                        'Claim Badge'
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Destination Wallet */}
                    <div className="flex flex-col sm:flex-row gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm text-white/50 block mb-2">Destination wallet:</label>
                            <select
                                value={destinationWallet}
                                onChange={(e) => setDestinationWallet(e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="">
                                    {identity.primaryWallet ? `${formatAddress(identity.primaryWallet)} (Primary)` : 'Select wallet...'}
                                </option>
                                {identity.linkedWallets.filter(w => w !== identity.primaryWallet).map(w => (
                                    <option key={w} value={w}>{formatAddress(w)}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleClaimAll}
                            disabled={claimingBadge !== null || availableBadges.length === 0}
                            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white font-medium rounded-lg transition-all"
                        >
                            Claim All Available Badges
                        </button>
                    </div>
                </div>
            )}

            {/* No Available Badges */}
            {availableBadges.length === 0 && mockClaimedBadges.length === 0 && claimedIds.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-12 text-center mb-8">
                    <Award className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <h3 className="text-lg font-semibold text-white mb-2">No Badges Available</h3>
                    <p className="text-white/50">
                        Heritage badges become available when a compromised wallet is finalized.
                    </p>
                </div>
            )}

            {/* Already Claimed */}
            {(mockClaimedBadges.length > 0 || claimedIds.length > 0) && (
                <div>
                    <h2 className="text-lg font-semibold text-white mb-4">Already Claimed</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Recently claimed in this session */}
                        {mockAvailableBadges.filter(b => claimedIds.includes(b.id)).map((badge) => (
                            <div
                                key={badge.id}
                                className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center"
                            >
                                <div className="text-3xl mb-2">{badge.icon}</div>
                                <div className="font-medium text-white text-sm mb-1">{badge.name}</div>
                                <div className="text-xs text-white/40">{badge.description}</div>
                                <div className="text-xs text-emerald-400 mt-2 flex items-center justify-center gap-1">
                                    <Check className="w-3 h-3" /> Just claimed
                                </div>
                            </div>
                        ))}
                        {/* Previously claimed */}
                        {mockClaimedBadges.map((badge) => (
                            <div
                                key={badge.id}
                                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center"
                            >
                                <div className="text-3xl mb-2">{badge.icon}</div>
                                <div className="font-medium text-white text-sm mb-1">{badge.name}</div>
                                <div className="text-xs text-white/40 mb-2">{badge.description}</div>
                                <div className="text-xs text-white/30">
                                    From: {badge.sourceWallet}
                                </div>
                                <div className="text-xs text-white/30">
                                    Claimed: {badge.claimedAt}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
