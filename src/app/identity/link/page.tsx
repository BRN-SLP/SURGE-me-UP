"use client";

import { useState } from 'react';
import { useIdentity } from '@/hooks/useIdentity';
import { useAppKit } from '@reown/appkit/react';
import { ArrowLeft, Check, Link as LinkIcon, Wallet, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'intro' | 'signing' | 'confirmation';

export default function LinkWalletPage() {
    const { identity, isConnected, address } = useIdentity();
    const { open } = useAppKit();
    const [step, setStep] = useState<Step>('intro');
    const [existingSigned, setExistingSigned] = useState(false);
    const [newWallet, setNewWallet] = useState<string | null>(null);
    const [newSigned, setNewSigned] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Not connected check
    if (!isConnected) return <ConnectWalletState open={open} />;
    if (!identity) return <NoIdentityState />;

    const handleSignExisting = async () => {
        setIsProcessing(true);
        // Simulate signing
        await new Promise(r => setTimeout(r, 1500));
        setExistingSigned(true);
        setIsProcessing(false);
    };

    const handleConnectNew = async () => {
        setIsProcessing(true);
        // Simulate connecting new wallet
        await new Promise(r => setTimeout(r, 1000));
        setNewWallet('0xBBBB...2222');
        setIsProcessing(false);
    };

    const handleSignNew = async () => {
        setIsProcessing(true);
        // Simulate signing new
        await new Promise(r => setTimeout(r, 1500));
        setNewSigned(true);
        setIsProcessing(false);
        setTimeout(() => setStep('confirmation'), 500);
    };

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <div className="min-h-screen pt-32 pb-20 bg-surface text-text-main font-display selection:bg-mint-dark selection:text-white overflow-x-hidden">
            <div className="w-full mx-auto px-14 max-w-5xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-16">
                    <Link href="/identity" className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Link New Wallet</h1>
                        <p className="text-text-muted">Merge identities and boost your reputation score.</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">

                    {/* Intro Step */}
                    {step === 'intro' && (
                        <motion.div
                            key="intro"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-12 relative overflow-hidden backdrop-blur-md"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                                <LinkIcon className="w-64 h-64 rotate-12" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 relative z-10">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lavender/10 text-lavender text-sm font-bold mb-6">
                                        <span className="w-2 h-2 rounded-full bg-lavender animate-pulse"></span>
                                        Protocol Action
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                        Unify Your On-Chain <br /> Identity
                                    </h2>
                                    <p className="text-xl text-text-muted leading-relaxed mb-8">
                                        Surge allows you to link multiple EVM addresses to a single identity.
                                        This enables score aggregation and provides a recovery mechanism.
                                    </p>

                                    <div className="space-y-4 mb-8">
                                        <FeatureItem text="Aggregate badges and history" />
                                        <FeatureItem text="Enable emergency recovery access" />
                                        <FeatureItem text="Increase Trust Score immediately" />
                                    </div>

                                    <div className="flex gap-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setStep('signing')}
                                            className="h-14 px-8 bg-gradient-to-r from-lavender to-blue-500 text-white font-bold rounded-full shadow-lg shadow-lavender/20 flex items-center gap-2"
                                        >
                                            Begin Process <ArrowRight className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Visual Metaphor */}
                                <div className="flex items-center justify-center">
                                    <div className="relative w-full aspect-square max-w-sm">
                                        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-20 h-20 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center animate-float">
                                            <Wallet className="w-8 h-8 text-white/60" />
                                        </div>
                                        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-20 h-20 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
                                            <Wallet className="w-8 h-8 text-white/60" />
                                        </div>
                                        {/* Connector */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <motion.path
                                                d="M 35 50 L 65 50"
                                                stroke="white"
                                                strokeWidth="0.5"
                                                strokeDasharray="4 4"
                                                className="opacity-30"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </svg>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-lavender/20 blur-2xl"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-lavender/50 flex items-center justify-center bg-surface z-10 shadow-[0_0_30px_rgba(167,139,250,0.3)]">
                                            <LinkIcon className="w-6 h-6 text-lavender" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Signing Step */}
                    {step === 'signing' && (
                        <motion.div
                            key="signing"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-3xl mx-auto"
                        >
                            {/* Step Indicator */}
                            <div className="flex justify-center mb-12">
                                <div className="flex items-center gap-4 text-sm font-mono">
                                    <div className="flex items-center gap-2 text-mint">
                                        <span className="size-6 rounded-full border border-mint flex items-center justify-center">1</span>
                                        <span>Current Wallet</span>
                                    </div>
                                    <div className="w-12 h-px bg-white/20"></div>
                                    <div className={cn("flex items-center gap-2", newSigned ? "text-mint" : "text-white/40")}>
                                        <span className="size-6 rounded-full border border-current flex items-center justify-center">2</span>
                                        <span>New Wallet</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Card 1 */}
                                <div className={cn("p-8 rounded-3xl border transition-all duration-500", existingSigned ? "bg-mint/5 border-mint/20 opacity-50 grayscale" : "bg-white/5 border-white/10")}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                                <Wallet className="w-6 h-6 text-white/60" />
                                            </div>
                                            <div>
                                                <div className="font-mono text-xl text-white">{address ? formatAddress(address) : '...'}</div>
                                                <div className="text-xs text-text-muted">Primary Authentication</div>
                                            </div>
                                        </div>
                                        {existingSigned && <div className="size-8 rounded-full bg-mint text-surface flex items-center justify-center"><Check className="w-5 h-5" /></div>}
                                    </div>
                                    {!existingSigned && (
                                        <button
                                            onClick={handleSignExisting}
                                            disabled={isProcessing}
                                            className="w-full h-14 rounded-2xl bg-white text-black font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? <Loader2 className="animate-spin" /> : "Sign Verification Message"}
                                        </button>
                                    )}
                                </div>

                                {/* Link Chain */}
                                <div className="flex justify-center h-8 relative">
                                    <div className="h-full w-px bg-white/10 absolute left-1/2 -translate-x-1/2"></div>
                                    {existingSigned && !newSigned && (
                                        <motion.div
                                            initial={{ y: -10, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            className="w-6 h-6 rounded-full bg-mint flex items-center justify-center text-black z-10"
                                        >
                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Card 2 */}
                                <motion.div
                                    className={cn("p-8 rounded-3xl border transition-all duration-500", !existingSigned ? "opacity-30 border-white/5 bg-transparent" : "bg-white/5 border-white/10")}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center">
                                                <LinkIcon className="w-6 h-6 text-white/60" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-xl text-white">Secondary Wallet</div>
                                                <div className="text-xs text-text-muted">Target to Link</div>
                                            </div>
                                        </div>
                                        {newSigned && <div className="size-8 rounded-full bg-mint text-surface flex items-center justify-center"><Check className="w-5 h-5" /></div>}
                                    </div>

                                    {!existingSigned ? (
                                        <div className="h-14 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-white/20 font-mono text-sm">Waiting for Step 1...</div>
                                    ) : !newWallet ? (
                                        <button
                                            onClick={handleConnectNew}
                                            disabled={isProcessing}
                                            className="w-full h-14 rounded-2xl border-2 border-dashed border-aqua/30 text-aqua font-bold hover:bg-aqua/10 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? <Loader2 className="animate-spin" /> : "Connect New Wallet"}
                                        </button>
                                    ) : (
                                        <>
                                            <div className="mb-6 p-4 rounded-xl bg-aqua/10 border border-aqua/20 text-aqua font-mono text-center">
                                                {newWallet}
                                            </div>
                                            {!newSigned && (
                                                <button
                                                    onClick={handleSignNew}
                                                    disabled={isProcessing}
                                                    className="w-full h-14 rounded-2xl bg-aqua text-black font-bold hover:brightness-110 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    {isProcessing ? <Loader2 className="animate-spin" /> : "Sign Confirmation"}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {/* Confirmation Step */}
                    {step === 'confirmation' && (
                        <motion.div
                            key="confirmation"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto rounded-[2.5rem] bg-gradient-to-br from-mint/10 to-aqua/10 border border-white/10 p-12 text-center"
                        >
                            <div className="size-24 rounded-full bg-gradient-to-r from-mint to-aqua mx-auto mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(94,234,212,0.4)]">
                                <Check className="w-12 h-12 text-black" />
                            </div>

                            <h2 className="text-4xl font-bold text-white mb-4">Identity Updated</h2>
                            <p className="text-lg text-text-muted mb-10">
                                <span className="text-white font-mono">{newWallet}</span> has been securely linked to your profile.
                            </p>

                            <div className="flex items-center justify-center gap-8 mb-12">
                                <div className="text-center opacity-50">
                                    <div className="text-sm font-mono uppercase mb-2">Old Score</div>
                                    <div className="text-4xl font-bold font-mono">847</div>
                                </div>
                                <ArrowRight className="text-mint w-8 h-8" />
                                <div className="text-center">
                                    <div className="text-sm font-mono uppercase mb-2 text-mint">New Score</div>
                                    <div className="text-5xl font-bold font-mono text-transparent bg-clip-text bg-gradient-to-r from-mint to-aqua">1,159</div>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4">
                                <Link href="/identity">
                                    <button className="h-12 px-8 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-colors">
                                        Return to Dashboard
                                    </button>
                                </Link>
                                <button
                                    onClick={() => {
                                        setStep('intro');
                                        setExistingSigned(false);
                                        setNewWallet(null);
                                        setNewSigned(false);
                                    }}
                                    className="h-12 px-8 rounded-full border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
                                >
                                    Link Another
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

// Sub-components for cleaner file
function ConnectWalletState({ open }: { open: () => void }) {
    return (
        <div className="min-h-screen pt-32 flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold text-white">Connect Your Wallet</h2>
            <button onClick={() => open()} className="h-12 px-8 rounded-full bg-gradient-to-r from-lavender-dark to-aqua-dark text-white font-bold">Connect</button>
        </div>
    );
}

function NoIdentityState() {
    return (
        <div className="min-h-screen pt-32 text-center">
            <h3 className="text-xl font-bold text-white mb-4">No Identity Found</h3>
            <Link href="/identity"><button className="h-12 px-8 bg-white text-black font-bold rounded-full">Create Identity</button></Link>
        </div>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="size-6 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-mint" />
            </div>
            <span className="text-text-muted">{text}</span>
        </div>
    )
}
