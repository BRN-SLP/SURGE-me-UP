"use client";

import { useIdentity } from '@/hooks/useIdentity';
import { useAppKit } from '@reown/appkit/react';
import { Loader2, AlertTriangle, ShieldCheck, Wallet, ArrowRight, Zap, Link as LinkIcon, Settings } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { CreateIdentityCard } from '@/components/identity/CreateIdentityCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Simple counter animation component
const CountUp = ({ to }: { to: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = to;
        const duration = 2000;
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);

            setCount(Math.floor(start + (end - start) * ease));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [to]);

    return <>{count.toLocaleString()}</>;
};

export default function IdentityPage() {
    const {
        identity,
        walletStatus,
        isLoading,
        status,
        isConnected,
        address,
        createIdentity,
    } = useIdentity();
    const { open } = useAppKit();

    // Not connected state
    if (!isConnected) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center text-center space-y-8 bg-surface text-text-main font-display">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="size-32 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center mb-4 relative"
                >
                    <div className="absolute inset-0 bg-lavender/20 blur-xl rounded-full"></div>
                    <Wallet className="w-16 h-16 text-white/60 relative z-10" />
                </motion.div>

                <div className="space-y-4 max-w-lg px-6">
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Access Identity Anchor</h2>
                    <p className="text-xl text-text-muted leading-relaxed">
                        Manage your persistent reputation. <br />
                        One identity across all Superchain networks.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => open()}
                    className="h-16 px-12 rounded-full bg-gradient-to-r from-lavender-dark to-aqua-dark text-white text-lg font-bold shadow-2xl hover:shadow-lavender/30 transition-all border border-white/10"
                >
                    Connect Wallet
                </motion.button>
            </div>
        );
    }

    // Loading state
    if (isLoading && !identity) {
        return (
            <div className="min-h-screen pt-32 flex items-center justify-center bg-surface">
                <Loader2 className="w-12 h-12 text-mint animate-spin" />
            </div>
        );
    }

    // No identity state
    if (!identity) {
        return (
            <div className="min-h-screen pt-32 px-14 flex items-center justify-center bg-surface pb-20">
                <div className="w-full max-w-2xl">
                    <CreateIdentityCard onCreateIdentity={createIdentity} isLoading={isLoading} />
                </div>
            </div>
        );
    }

    // Derived stats
    const tier = walletStatus?.individualScore && walletStatus.individualScore > 1000 ? "Verified Tier 1" : "Standard Tier";
    const tierColor = walletStatus?.individualScore && walletStatus.individualScore > 1000 ? "text-mint" : "text-white/70";
    const tierBorder = walletStatus?.individualScore && walletStatus.individualScore > 1000 ? "border-mint/30 bg-mint/10" : "border-white/10 bg-white/5";

    return (
        <div className="min-h-screen pt-32 pb-20 bg-surface text-text-main font-display selection:bg-mint-dark selection:text-white relative overflow-x-hidden">

            {/* Dynamic Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-20 left-20 w-[600px] h-[600px] bg-lavender/5 rounded-full blur-[120px] opacity-40 animate-pulse-slow"></div>
                <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-aqua/5 rounded-full blur-[120px] opacity-40 animate-pulse-slow delay-1000"></div>
            </div>

            <div className="w-full mx-auto px-14 relative z-10 space-y-12">

                {/* Header Area */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 rounded-full bg-mint animate-pulse"></span>
                            <span className="text-sm font-mono text-mint uppercase tracking-widest">Identity Active</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Identity Dashboard</h1>
                    </div>
                    <div className={cn("px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wider flex items-center gap-2", tierBorder, tierColor)}>
                        {tier === "Verified Tier 1" ? <ShieldCheck className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4 opacity-50" />}
                        {tier}
                    </div>
                </div>

                {/* Alerts */}
                <AnimatePresence>
                    {status === 'suspended' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 flex items-center gap-6 text-red-200 overflow-hidden"
                        >
                            <AlertTriangle className="w-10 h-10 text-red-400 shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-bold text-red-400 text-lg">Identity Suspended</h3>
                                <p className="text-base opacity-80">Your identity is suspended because no Primary wallet is set. Select a new Primary wallet immediately to reactivate protocol access.</p>
                            </div>
                            <Link href="/identity/manage">
                                <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors">
                                    Fix Now
                                </button>
                            </Link>
                        </motion.div>
                    )}

                    {status === 'pending' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 flex items-center gap-6 text-yellow-200 overflow-hidden"
                        >
                            <AlertTriangle className="w-10 h-10 text-yellow-400 shrink-0" />
                            <div className="flex-1">
                                <h3 className="font-bold text-yellow-400 text-lg">Security Alert</h3>
                                <p className="text-base opacity-80">Your Primary wallet is flagged for compromise. You have 23 days remaining to rotate keys.</p>
                            </div>
                            <Link href="/identity/manage">
                                <button className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-surface font-bold rounded-xl transition-colors">
                                    Manage
                                </button>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left: Reputation Core */}
                    <div className="lg:col-span-5 xl:col-span-4">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="sticky top-32"
                        >
                            <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 bg-slate-900/60 backdrop-blur-2xl shadow-2xl group">
                                {/* Ambient Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-lavender/20 rounded-full blur-[80px] group-hover:bg-lavender/30 transition-all duration-1000"></div>

                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10">
                                    <div className="mb-8">
                                        <div className="text-sm font-mono text-white/40 uppercase tracking-widest mb-4">Reputation Score</div>
                                        <div className="text-7xl md:text-8xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">
                                            <CountUp to={walletStatus?.individualScore || 0} />
                                        </div>
                                    </div>

                                    {/* Visual Metaphor: Orbiting Lines */}
                                    <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8 relative">
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_white]"></div>
                                    </div>

                                    <div className="text-sm text-text-muted max-w-[200px]">
                                        Your global reputation score aggregated across all linked wallets and Superchain networks.
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Actions & Wallets */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-8">

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                { title: "Link Wallet", icon: LinkIcon, color: "text-aqua", href: "/identity/link", desc: "Add new address" },
                                { title: "Manage Keys", icon: Settings, color: "text-lavender", href: "/identity/manage", desc: "Security settings" },
                                { title: "Heritage", icon: ShieldCheck, color: "text-mint", href: "/identity/badges", desc: "Claim badges" },
                            ].map((action, i) => (
                                <Link key={action.title} href={action.href}>
                                    <motion.div
                                        whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                                        className="h-full p-6 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm cursor-pointer group transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:border-white/20 transition-colors", action.color)}>
                                                <action.icon className="w-6 h-6" />
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-white transition-colors" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">{action.title}</h3>
                                            <p className="text-sm text-text-muted">{action.desc}</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>

                        {/* Linked Wallets List */}
                        <div className="pt-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-8 h-[2px] bg-white/20"></span>
                                Linked Wallets
                            </h3>

                            <div className="space-y-4">
                                {identity.linkedWallets.map((wallet, index) => {
                                    const isPrimaryWallet = wallet.toLowerCase() === identity.primaryWallet?.toLowerCase();

                                    return (
                                        <motion.div
                                            key={wallet}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={cn(
                                                "p-6 rounded-3xl border backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group transition-all duration-300",
                                                isPrimaryWallet
                                                    ? "bg-gradient-to-r from-mint/5 to-transparent border-mint/20 hover:border-mint/40"
                                                    : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn(
                                                    "size-12 rounded-2xl flex items-center justify-center shrink-0",
                                                    isPrimaryWallet ? "bg-mint/10 text-mint" : "bg-white/5 text-white/40"
                                                )}>
                                                    <Wallet className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <span className="font-mono text-lg text-white font-medium">
                                                            {wallet.slice(0, 6)}...{wallet.slice(-4)}
                                                        </span>
                                                        {isPrimaryWallet && (
                                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-mint/20 text-mint uppercase tracking-wider">Primary</span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-text-muted">Connected 2 months ago</div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 w-full md:w-auto">
                                                {/* Hidden actions that appear on hover optionally, keeping it clean for now */}
                                                <div className="px-4 py-2 rounded-xl bg-white/5 text-xs text-white/30 font-mono">
                                                    0x...{wallet.slice(-4)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
