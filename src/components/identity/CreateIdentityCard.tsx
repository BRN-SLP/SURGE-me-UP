'use client';

import { useAppKit } from '@reown/appkit/react';
import { Fingerprint, Link, Shield } from 'lucide-react';

interface CreateIdentityCardProps {
    onCreateIdentity?: () => void;
    isLoading?: boolean;
}

export function CreateIdentityCard({ onCreateIdentity, isLoading }: CreateIdentityCardProps) {
    const { open } = useAppKit();

    return (
        <div className="max-w-lg mx-auto my-16 md:my-24">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-8 md:p-12 text-center">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-base/10 border border-base/20 flex items-center justify-center">
                    <Fingerprint className="w-8 h-8 text-base" />
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                    Create Your SURGE Identity
                </h2>

                {/* Description */}
                <p className="text-white/60 mb-8 max-w-sm mx-auto">
                    Link multiple wallets, protect your reputation, and preserve your on-chain history across the Superchain.
                </p>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <FeatureItem
                        icon={Link}
                        title="Multi-Wallet"
                        description="Link all your wallets"
                    />
                    <FeatureItem
                        icon={Shield}
                        title="Protected"
                        description="Recover from compromises"
                    />
                    <FeatureItem
                        icon={Fingerprint}
                        title="Unified Score"
                        description="Aggregate reputation"
                    />
                </div>

                {/* CTA */}
                <button
                    onClick={onCreateIdentity}
                    disabled={isLoading}
                    className="w-full max-w-xs mx-auto px-6 py-3 bg-primary hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-black font-medium rounded-xl transition-all shadow-lg shadow-white/5"
                >
                    {isLoading ? 'Creating...' : 'Create Identity'}
                </button>

                {/* Secondary link */}
                <div className="mt-4">
                    <button
                        onClick={() => open()}
                        className="text-sm text-white/50 hover:text-white/70 transition-colors"
                    >
                        Already have an identity? <span className="text-base font-medium">Link This Wallet</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

interface FeatureItemProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

function FeatureItem({ icon: Icon, title, description }: FeatureItemProps) {
    return (
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <Icon className="w-5 h-5 text-base mx-auto mb-2" />
            <div className="text-sm font-medium text-white mb-1">{title}</div>
            <div className="text-xs text-white/50">{description}</div>
        </div>
    );
}
