"use client";

import { useState } from 'react';
import { useIdentity } from '@/hooks/useIdentity';
import { useAppKit } from '@reown/appkit/react';
import { ArrowLeft, Wallet, Award, Loader2, Check, Lock } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

// Mock badge data
const mockAvailableBadges = [
    {
        id: 'veteran',
        name: 'Veteran Wallet',
        icon: '🏅',
        description: '3 years 4 months of activity',
        sourceWallet: '0xCCC...3333',
        rarity: 'Legendary'
    },
    {
        id: 'maestro',
        name: 'Contract Maestro',
        icon: '🎯',
        description: '5,247 unique interactions',
        sourceWallet: '0xCCC...3333',
        rarity: 'Epic'
    },
    {
        id: 'crosschain',
        name: 'Cross-Chain Native',
        icon: '🌐',
        description: 'Active on 6 networks',
        sourceWallet: '0xCCC...3333',
        rarity: 'Rare'
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

    if (!isConnected) return <ConnectGuard open={open} />;
    if (!identity) return <IdentityGuard />;

    const handleClaimBadge = async (badgeId: string) => {
        setClaimingBadge(badgeId);
        await new Promise(r => setTimeout(r, 2000));
        setClaimedIds(prev => [...prev, badgeId]);
        setClaimingBadge(null);
    };

    const availableBadges = mockAvailableBadges.filter(b => !claimedIds.includes(b.id));

    return (
        <div className="min-h-screen pt-32 pb-20 bg-surface text-text-main font-display selection:bg-mint-dark selection:text-white relative overflow-x-hidden">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full mx-auto px-14 relative z-10 max-w-7xl">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
                    <div className="flex items-center gap-4">
                        <Link href="/identity" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Heritage Badges</h1>
                            <p className="text-text-muted">Recover reputation from your historic on-chain activity.</p>
                        </div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm font-bold flex items-center gap-2">
                        <div className="size-2 rounded-full bg-amber-500 animate-pulse"></div>
                        BETA ACCESS
                    </div>
                </div>

                {/* Available Section */}
                <div className="mb-16">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-amber-500"></span>
                        Available Artifacts
                    </h2>

                    {availableBadges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {availableBadges.map((badge, index) => (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group relative rounded-[2.5rem] bg-white/5 border border-white/10 p-8 hover:bg-white/10 transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
                                >
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="px-3 py-1 rounded-full bg-black/20 text-white/50 text-xs font-mono border border-white/5">
                                            {badge.sourceWallet}
                                        </div>
                                        <div className="text-amber-500 text-xs font-bold uppercase tracking-widest">{badge.rarity}</div>
                                    </div>

                                    <div className="flex flex-col items-center text-center mb-8">
                                        <div className="text-6xl mb-6 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-500">{badge.icon}</div>
                                        <h3 className="text-2xl font-bold text-white mb-2">{badge.name}</h3>
                                        <p className="text-text-muted">{badge.description}</p>
                                    </div>

                                    <button
                                        onClick={() => handleClaimBadge(badge.id)}
                                        disabled={claimingBadge !== null}
                                        className="w-full h-14 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-2xl transition-all shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
                                    >
                                        {claimingBadge === badge.id ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Minting...
                                            </>
                                        ) : (
                                            'Claim Artifact'
                                        )}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-12 text-center">
                            <p className="text-white/30">No new badges detected from linked wallets.</p>
                        </div>
                    )}
                </div>

                {/* Collection Section */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-white/20"></span>
                        Vault
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {/* Recently claimed */}
                        {mockAvailableBadges.filter(b => claimedIds.includes(b.id)).map((badge) => (
                            <motion.div
                                key={badge.id}
                                layoutId={badge.id}
                                className="aspect-square rounded-3xl bg-surface border border-white/10 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-mint/5 pointer-events-none"></div>
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{badge.icon}</div>
                                <div className="font-bold text-white text-sm">{badge.name}</div>
                                <div className="absolute bottom-4 text-[10px] font-bold text-mint uppercase tracking-wider flex items-center gap-1">
                                    <Check className="w-3 h-3" /> New
                                </div>
                            </motion.div>
                        ))}

                        {/* Old Claimed */}
                        {mockClaimedBadges.map((badge) => (
                            <div key={badge.id} className="aspect-square rounded-3xl bg-surface border border-white/5 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:bg-white/5 transition-all">
                                <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100">{badge.icon}</div>
                                <div className="font-bold text-white/60 group-hover:text-white text-sm transition-colors">{badge.name}</div>
                            </div>
                        ))}

                        {/* Locked Slot Metaphor */}
                        <div className="aspect-square rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/10">
                            <Lock className="w-8 h-8 mb-2" />
                            <span className="text-xs uppercase tracking-widest font-bold">Locked</span>
                        </div>
                        <div className="aspect-square rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-white/10">
                            <Lock className="w-8 h-8 mb-2" />
                            <span className="text-xs uppercase tracking-widest font-bold">Locked</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ConnectGuard({ open }: { open: () => void }) {
    return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
            <button onClick={() => open()} className="h-12 px-8 rounded-full bg-white text-black font-bold">Connect Wallet</button>
        </div>
    )
}

function IdentityGuard() {
    return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
            <h2 className="text-white">Profile Not Found</h2>
        </div>
    )
}
