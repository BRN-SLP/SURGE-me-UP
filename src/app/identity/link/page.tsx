'use client';

import { useState } from 'react';
import { useIdentity } from '@/hooks/useIdentity';
import { useAppKit } from '@reown/appkit/react';
import { AlertBanner } from '@/components/identity/AlertBanner';
import { ArrowLeft, Check, Link as LinkIcon, Wallet, Loader2 } from 'lucide-react';
import Link from 'next/link';

type Step = 'intro' | 'signing' | 'confirmation';

export default function LinkWalletPage() {
    const { identity, isConnected, address, isLoading } = useIdentity();
    const { open } = useAppKit();
    const [step, setStep] = useState<Step>('intro');
    const [existingSigned, setExistingSigned] = useState(false);
    const [newWallet, setNewWallet] = useState<string | null>(null);
    const [newSigned, setNewSigned] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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
                        Connect your wallet to link a new wallet to your identity
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

    // No identity state
    if (!identity) {
        return (
            <div className="container mx-auto px-6 py-16">
                <div className="max-w-lg mx-auto">
                    <AlertBanner
                        type="warning"
                        title="No Identity Found"
                        message="You need to create a SURGE Identity before you can link additional wallets."
                        action={{
                            label: 'Create Identity',
                            onClick: () => window.location.href = '/identity',
                        }}
                    />
                </div>
            </div>
        );
    }

    const handleSignExisting = async () => {
        setIsProcessing(true);
        // Mock signature
        await new Promise(r => setTimeout(r, 1500));
        setExistingSigned(true);
        setIsProcessing(false);
    };

    const handleConnectNew = async () => {
        setIsProcessing(true);
        // Mock new wallet connection
        await new Promise(r => setTimeout(r, 1000));
        setNewWallet('0xBBBB...2222');
        setIsProcessing(false);
    };

    const handleSignNew = async () => {
        setIsProcessing(true);
        // Mock signature
        await new Promise(r => setTimeout(r, 1500));
        setNewSigned(true);
        setIsProcessing(false);
        // After both signed, show confirmation
        setTimeout(() => setStep('confirmation'), 500);
    };

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    return (
        <div className="container mx-auto px-6 py-8 md:py-12">
            {/* Back Button */}
            <Link
                href="/identity"
                className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <div className="max-w-2xl mx-auto">
                {/* Step: Introduction */}
                {step === 'intro' && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-base/10 border border-base/20 flex items-center justify-center">
                                <LinkIcon className="w-8 h-8 text-base" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                                Link a Wallet to Your Identity
                            </h1>
                        </div>

                        <div className="space-y-4 mb-8">
                            <FeatureRow
                                icon="✓"
                                iconColor="text-emerald-400"
                                text="Aggregates all your on-chain history"
                            />
                            <FeatureRow
                                icon="✓"
                                iconColor="text-emerald-400"
                                text="Enables recovery if a wallet is compromised"
                            />
                            <FeatureRow
                                icon="✓"
                                iconColor="text-emerald-400"
                                text="Combines scores from all linked wallets"
                            />
                        </div>

                        <AlertBanner
                            type="warning"
                            message="This action is permanent — wallets cannot be unlinked. Each wallet can only belong to ONE identity. Both wallets must sign to confirm the link."
                            className="mb-8"
                        />

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                onClick={() => setStep('signing')}
                                className="flex-1 px-6 py-3 bg-primary hover:bg-white/90 text-black font-medium rounded-xl transition-all shadow-lg shadow-white/5"
                            >
                                Start Linking Process
                            </button>
                            <Link
                                href="/identity"
                                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/80 font-medium rounded-xl border border-white/10 text-center transition-all"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                )}

                {/* Step: Signing */}
                {step === 'signing' && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-semibold text-white mb-2">
                                Verify Wallet Ownership
                            </h1>
                            <p className="text-white/50">
                                Identity #{identity.identityId}
                            </p>
                        </div>

                        {/* Step 1: Existing Wallet */}
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 mb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-white/50">Step 1: Existing Wallet</div>
                                {existingSigned && (
                                    <span className="text-emerald-400 text-sm flex items-center gap-1">
                                        <Check className="w-4 h-4" /> Signed
                                    </span>
                                )}
                            </div>
                            <div className="font-mono text-white mb-4">
                                {address ? formatAddress(address) : '...'} <span className="text-base text-sm">(currently connected)</span>
                            </div>
                            {!existingSigned && (
                                <button
                                    onClick={handleSignExisting}
                                    disabled={isProcessing}
                                    className="w-full px-4 py-2 bg-primary hover:bg-white/90 disabled:opacity-50 text-black font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Signing...
                                        </>
                                    ) : (
                                        'Sign Message'
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Arrow */}
                        <div className="flex justify-center my-4">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/30">
                                ↓
                            </div>
                        </div>

                        {/* Step 2: New Wallet */}
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="text-sm text-white/50">Step 2: New Wallet</div>
                                {newSigned && (
                                    <span className="text-emerald-400 text-sm flex items-center gap-1">
                                        <Check className="w-4 h-4" /> Signed
                                    </span>
                                )}
                            </div>

                            {!newWallet ? (
                                <>
                                    <p className="text-white/60 text-sm mb-4">
                                        Connect the wallet you want to link
                                    </p>
                                    <button
                                        onClick={handleConnectNew}
                                        disabled={!existingSigned || isProcessing}
                                        className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white font-medium rounded-lg border border-white/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Connecting...
                                            </>
                                        ) : (
                                            <>
                                                <Wallet className="w-4 h-4" />
                                                Connect New Wallet
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="font-mono text-white mb-4">
                                        {newWallet}
                                    </div>
                                    {!newSigned && (
                                        <button
                                            onClick={handleSignNew}
                                            disabled={isProcessing}
                                            className="w-full px-4 py-2 bg-primary hover:bg-white/90 disabled:opacity-50 text-black font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Signing...
                                                </>
                                            ) : (
                                                'Sign Message to Confirm Link'
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        <p className="text-center text-sm text-white/40 mt-6">
                            Both wallets must sign to confirm this permanent link.
                        </p>
                    </div>
                )}

                {/* Step: Confirmation */}
                {step === 'confirmation' && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12 text-center shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                            <Check className="w-8 h-8 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-semibold text-white mb-2">
                            Wallet Linked!
                        </h1>
                        <p className="text-white/60 mb-8">
                            {newWallet} is now linked to Identity #{identity.identityId}
                        </p>

                        {/* Score Update */}
                        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 mb-8">
                            <div className="text-sm text-white/50 mb-4">Your Identity Score</div>
                            <div className="flex items-center justify-center gap-6">
                                <div>
                                    <div className="text-lg text-white/50">Before</div>
                                    <div className="text-2xl font-semibold text-white">847 pts</div>
                                </div>
                                <div className="text-2xl text-white/30">→</div>
                                <div>
                                    <div className="text-lg text-emerald-400">After</div>
                                    <div className="text-2xl font-semibold text-emerald-400">1,159 pts</div>
                                    <div className="text-sm text-emerald-400/80">(+312)</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/identity"
                                className="flex-1 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl text-center transition-all"
                            >
                                Back to Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    setStep('intro');
                                    setExistingSigned(false);
                                    setNewWallet(null);
                                    setNewSigned(false);
                                }}
                                className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white/80 font-medium rounded-xl border border-white/10 transition-all"
                            >
                                Link Another Wallet
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function FeatureRow({ icon, iconColor, text }: { icon: string; iconColor: string; text: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className={iconColor}>{icon}</span>
            <span className="text-white/80">{text}</span>
        </div>
    );
}
