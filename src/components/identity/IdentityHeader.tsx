'use client';

import { cn } from '@/lib/utils';
import { StatusChip } from './StatusChip';
import type { IdentityData } from '@/hooks/useIdentity';

interface IdentityHeaderProps {
    identity: IdentityData;
    isPrimary: boolean;
    status: 'active' | 'pending' | 'compromised' | 'suspended' | 'none';
    className?: string;
}

export function IdentityHeader({ identity, isPrimary, status, className }: IdentityHeaderProps) {
    const displayScore = isPrimary ? identity.totalScore : identity.individualScore;
    const scoreLabel = isPrimary ? 'Total Identity Score' : 'Your Wallet Score';

    return (
        <div
            className={cn(
                'rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 md:p-8',
                className
            )}
        >
            {/* Top Row */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <span className="text-sm text-white/50">Identity</span>
                    <span className="text-lg font-semibold text-white">#{identity.identityId}</span>
                </div>
                <StatusChip status={status === 'none' ? 'active' : status} />
            </div>

            {/* Score Display */}
            <div className="flex flex-col md:flex-row md:items-end gap-6">
                {/* Main Score */}
                <div className="flex-shrink-0">
                    {status === 'suspended' ? (
                        <div className="text-center md:text-left">
                            <div className="text-4xl md:text-5xl font-bold text-neutral-500 mb-2">
                                LOCKED
                            </div>
                            <div className="text-sm text-neutral-500">
                                Identity Suspended - Select new Primary to reactivate
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-5xl md:text-6xl font-bold text-white mb-1">
                                {displayScore}
                            </div>
                            <div className="text-sm text-white/50">{scoreLabel}</div>
                        </>
                    )}
                </div>

                {/* Score Breakdown (only for primary) */}
                {isPrimary && status !== 'suspended' && (
                    <div className="flex-1 grid grid-cols-3 gap-4 md:gap-6 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
                        <ScoreCategory label="Experience" value={320} total={400} />
                        <ScoreCategory label="Diversity" value={280} total={400} />
                        <ScoreCategory label="Activity" value={247} total={400} />
                    </div>
                )}

                {/* Non-primary notice */}
                {!isPrimary && status !== 'suspended' && (
                    <div className="flex-1 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
                        <div className="text-sm text-white/50">
                            Total Identity Score ({identity.totalScore}) visible on Primary wallet
                        </div>
                        <div className="text-xs text-indigo-400 mt-1 font-mono">
                            {identity.primaryWallet?.slice(0, 10)}...{identity.primaryWallet?.slice(-6)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface ScoreCategoryProps {
    label: string;
    value: number;
    total: number;
}

function ScoreCategory({ label, value, total }: ScoreCategoryProps) {
    const percentage = (value / total) * 100;

    return (
        <div>
            <div className="text-xs text-white/40 mb-1">{label}</div>
            <div className="text-lg font-semibold text-white mb-1">{value}</div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
