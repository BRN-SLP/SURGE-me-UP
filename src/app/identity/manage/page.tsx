'use client';

import { useState } from 'react';
import { useIdentity } from '@/hooks/useIdentity';
import { useAppKit } from '@reown/appkit/react';
import { AlertBanner } from '@/components/identity/AlertBanner';
import { StatusChip } from '@/components/identity/StatusChip';
import { ArrowLeft, Wallet, Loader2, AlertTriangle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ManageWalletsPage() {
    const { identity, walletStatus, isConnected, address, isLoading, status } = useIdentity();
    const { open } = useAppKit();
    const [selectedWallet, setSelectedWallet] = useState<string>('');
    const [confirmText, setConfirmText] = useState('');
    const [showCompromiseModal, setShowCompromiseModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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
                <AlertBanner type="warning" message="You need a SURGE Identity to manage wallets." action={{ label: 'Create Identity', onClick: () => window.location.href = '/identity' }} />
            </div>
        );
    }

    const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

    const handleMarkCompromised = async () => {
        if (confirmText !== 'CONFIRM') return;
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsProcessing(false);
        setShowCompromiseModal(false);
        setConfirmText('');
        // In real app, would call markAsCompromised
    };

    // Calculate cooldown remaining (mock)
    const cooldownDays = 12;
    const cooldownActive = cooldownDays > 0;

    return (
        <div className="container mx-auto px-6 py-8 md:py-12">
            {/* Back Button */}
            <Link href="/identity" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white/80 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            <h1 className="text-2xl md:text-3xl font-semibold text-white mb-8">Manage Identity Wallets</h1>
            <p className="text-white/50 mb-8">Identity #{identity.identityId}</p>

            {/* Suspended Banner */}
            {status === 'suspended' && (
                <AlertBanner
                    type="danger"
                    title="Identity Suspended"
                    message="Your identity is suspended because no Primary wallet is set. Select a new Primary wallet to reactivate."
                    className="mb-8"
                />
            )}

            <div className="grid gap-8 lg:grid-cols-2">
                {/* Primary Wallet Section */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Primary Wallet</h2>

                    <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <code className="text-white font-mono">{identity.primaryWallet ? formatAddress(identity.primaryWallet) : 'None'}</code>
                            <StatusChip status="primary" size="sm" />
                        </div>
                        <ul className="text-sm text-white/60 space-y-1">
                            <li>• Receives rewards & airdrops</li>
                            <li>• Exposes aggregated Identity Score</li>
                            <li>• Used for external verification</li>
                        </ul>
                    </div>

                    <div className="mb-4">
                        <label className="text-sm text-white/50 block mb-2">Change Primary Wallet:</label>
                        <select
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                            defaultValue=""
                        >
                            <option value="" disabled>Select wallet...</option>
                            {identity.linkedWallets.filter(w => w.toLowerCase() !== identity.primaryWallet?.toLowerCase()).map(w => (
                                <option key={w} value={w}>{formatAddress(w)}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-white/50">
                            <Clock className="w-4 h-4" />
                            {cooldownActive ? `Cooldown: ${cooldownDays} days remaining` : 'Cooldown: Ready'}
                        </div>
                        <button
                            disabled={cooldownActive}
                            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/30 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all"
                        >
                            Change Primary
                        </button>
                    </div>
                </div>

                {/* Mark as Compromised Section */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                        Mark Wallet as Compromised
                    </h2>

                    <div className="text-sm text-white/60 space-y-2 mb-4">
                        <p>If a wallet is hacked or unsafe, you can mark it as compromised. This will immediately:</p>
                        <ul className="list-disc list-inside space-y-1 text-white/50">
                            <li>Block this wallet from using SURGE</li>
                            <li>Stop counting new activity from this wallet</li>
                            <li>Remove it as Primary (if it was)</li>
                            <li>Start 30-day dispute period</li>
                        </ul>
                    </div>

                    <AlertBanner
                        type="warning"
                        message="History BEFORE marking will be preserved. Action becomes irreversible after 30 days."
                        className="mb-4"
                    />

                    <div className="mb-4">
                        <label className="text-sm text-white/50 block mb-2">Select wallet to mark:</label>
                        <select
                            value={selectedWallet}
                            onChange={(e) => setSelectedWallet(e.target.value)}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
                        >
                            <option value="" disabled>Select wallet...</option>
                            {identity.linkedWallets.filter(w => w.toLowerCase() !== address?.toLowerCase()).map(w => (
                                <option key={w} value={w}>{formatAddress(w)} (Active)</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setShowCompromiseModal(true)}
                        disabled={!selectedWallet}
                        className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-red-400 font-medium rounded-lg border border-red-500/30 transition-all"
                    >
                        🚫 Mark as Compromised
                    </button>
                </div>

                {/* Pending Compromises */}
                <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                    <h2 className="text-lg font-semibold text-white mb-4">Pending Compromises</h2>

                    <div className="text-center py-8 text-white/40">
                        No pending compromises
                    </div>
                </div>
            </div>

            {/* Compromise Modal */}
            {showCompromiseModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
                    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-400" />
                            Confirm Mark as Compromised
                        </h3>

                        <p className="text-white/70 mb-4">
                            You are about to mark <code className="text-white">{formatAddress(selectedWallet)}</code> as compromised.
                        </p>

                        <div className="text-sm text-white/60 space-y-2 mb-4">
                            <p>This will:</p>
                            <ul className="list-disc list-inside">
                                <li>Immediately block this wallet</li>
                                <li>Start 30-day dispute period</li>
                                <li>Preserve history up to this moment</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <label className="text-sm text-white/50 block mb-2">Type "CONFIRM" to proceed:</label>
                            <input
                                type="text"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                placeholder="CONFIRM"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowCompromiseModal(false); setConfirmText(''); }}
                                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-medium rounded-lg border border-white/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleMarkCompromised}
                                disabled={confirmText !== 'CONFIRM' || isProcessing}
                                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/30 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Mark as Compromised'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
