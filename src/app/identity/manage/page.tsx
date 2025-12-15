"use client";

import { useState } from 'react';
import { useIdentity } from '@/hooks/useIdentity';
import { useAppKit } from '@reown/appkit/react';
import { ArrowLeft, Wallet, Loader2, AlertTriangle, Clock, ShieldAlert, BadgeCheck, Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

export default function ManageWalletsPage() {
    const { identity, walletStatus, isConnected, address, isLoading, status } = useIdentity();
    const { open } = useAppKit();
    const [selectedWallet, setSelectedWallet] = useState<string>('');
    const [confirmText, setConfirmText] = useState('');
    const [showCompromiseModal, setShowCompromiseModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Guards
    if (!isConnected) return <ConnectGuard open={open} />;
    if (!identity) return <IdentityGuard />;

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const handleMarkCompromised = async () => {
        if (confirmText !== 'CONFIRM') return;
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsProcessing(false);
        setShowCompromiseModal(false);
        setConfirmText('');
    };

    const cooldownDays = 12;

    return (
        <div className="min-h-screen pt-32 pb-20 bg-surface text-text-main font-display selection:bg-mint-dark selection:text-white relative overflow-x-hidden">

            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full mx-auto px-14 relative z-10 max-w-7xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-12">
                    <Link href="/identity" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Manage Wallets</h1>
                        <p className="text-text-muted">Security settings and primary address configuration.</p>
                    </div>
                </div>

                {/* Status Alert */}
                {status === 'suspended' && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-4 text-red-200"
                    >
                        <div className="size-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-400">Identity Suspended</h3>
                            <p className="text-sm opacity-80">Please select a new Primary Wallet to reactivate your identity score.</p>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Primary Configuration */}
                    <div className="space-y-6">
                        <SectionHeader title="Primary Configuration" icon={BadgeCheck} color="text-mint" />

                        <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <BadgeCheck className="w-32 h-32 rotate-12" />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-lg font-bold text-white mb-6">Current Primary</h3>

                                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-xl bg-mint/10 flex items-center justify-center text-mint">
                                            <Wallet className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-mono text-white tracking-wide">
                                                {identity.primaryWallet ? formatAddress(identity.primaryWallet) : 'None'}
                                            </div>
                                            <div className="text-xs text-text-muted">ID: {identity.identityId}</div>
                                        </div>
                                    </div>
                                    <div className="px-2 py-1 bg-mint/20 text-mint text-xs font-bold rounded uppercase tracking-wider">Active</div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Set New Primary</label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-14 pl-4 pr-10 bg-black/20 border border-white/10 rounded-xl text-white appearance-none focus:outline-none focus:border-mint/50 transition-all font-mono"
                                            defaultValue=""
                                        >
                                            <option value="" disabled>Select address...</option>
                                            {identity.linkedWallets.filter(w => w.toLowerCase() !== identity.primaryWallet?.toLowerCase()).map(w => (
                                                <option key={w} value={w}>{formatAddress(w)}</option>
                                            ))}
                                        </select>
                                        <ArrowLeft className="w-4 h-4 text-white/40 absolute right-4 top-1/2 -translate-y-1/2 -rotate-90 pointer-events-none" />
                                    </div>

                                    <div className="flex items-center justify-between pt-4">
                                        <div className="flex items-center gap-2 text-xs text-mint/80">
                                            <Clock className="w-3 h-3" />
                                            <span>{cooldownDays} days restriction</span>
                                        </div>
                                        <button className="px-6 py-3 bg-white text-black hover:bg-gray-200 font-bold rounded-xl transition-colors text-sm">
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Zone */}
                    <div className="space-y-6">
                        <SectionHeader title="Security Zone" icon={ShieldAlert} color="text-red-400" />

                        <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 backdrop-blur-md p-8 relative overflow-hidden">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white mb-2">Emergency Compromise</h3>
                                <p className="text-text-muted text-sm leading-relaxed">
                                    Marking a wallet as compromised will immediately remove it from your reputation score and freeze its ability to act on behalf of your identity.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <select
                                        value={selectedWallet}
                                        onChange={(e) => setSelectedWallet(e.target.value)}
                                        className="w-full h-14 pl-4 pr-10 bg-red-500/10 border border-red-500/30 rounded-xl text-white appearance-none focus:outline-none focus:border-red-500 transition-all font-mono"
                                    >
                                        <option value="" disabled>Select compromised wallet...</option>
                                        {identity.linkedWallets.map(w => (
                                            <option key={w} value={w}>{formatAddress(w)}</option>
                                        ))}
                                    </select>
                                    <AlertTriangle className="w-4 h-4 text-red-500/50 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>

                                <button
                                    onClick={() => setShowCompromiseModal(true)}
                                    disabled={!selectedWallet}
                                    className="w-full h-14 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2"
                                >
                                    <ShieldAlert className="w-5 h-5" /> Initiate Compromise Protocol
                                </button>
                            </div>
                        </div>

                        {/* Wallet List Condensed */}
                        <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-md p-8">
                            <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">All Linked Wallets</h3>
                            <div className="space-y-2">
                                {identity.linkedWallets.map(w => (
                                    <div key={w} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                                        <span className="font-mono text-white/80 text-sm">{formatAddress(w)}</span>
                                        <div className="size-2 rounded-full bg-green-500"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showCompromiseModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-md rounded-3xl border border-red-500/30 bg-surface p-8 shadow-2xl relative overflow-hidden"
                        >
                            {/* Flash Animation */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse"></div>

                            <div className="text-center mb-8">
                                <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 text-red-500">
                                    <AlertTriangle className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Confirm Compromise</h3>
                                <p className="text-white/60">
                                    You are blocking <br /> <span className="text-white font-mono">{formatAddress(selectedWallet)}</span>
                                </p>
                            </div>

                            <div className="bg-red-500/10 rounded-xl p-4 mb-6 border border-red-500/20">
                                <ul className="text-sm text-red-200 space-y-2">
                                    <li className="flex gap-2"><span>⚠️</span> Wallet removed from reputation score</li>
                                    <li className="flex gap-2"><span>⚠️</span> 30-day reversible dispute period</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">Type "CONFIRM"</label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="CONFIRM"
                                    className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-red-500 transition-colors uppercase"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => { setShowCompromiseModal(false); setConfirmText(''); }}
                                    className="flex-1 h-12 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMarkCompromised}
                                    disabled={confirmText !== 'CONFIRM' || isProcessing}
                                    className="flex-1 h-12 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? <Loader2 className="animate-spin" /> : 'Confirm'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function SectionHeader({ title, icon: Icon, color }: { title: string, icon: any, color: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className={cn("size-8 rounded-lg bg-white/5 flex items-center justify-center", color)}>
                <Icon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>
    )
}

function ConnectGuard({ open }: { open: () => void }) {
    return (
        <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
            <button onClick={() => open()} className="h-12 px-8 rounded-full bg-white text-black font-bold">Connect</button>
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
