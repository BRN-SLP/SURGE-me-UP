'use client';

import { cn } from '@/lib/utils';
import { StatusChip } from './StatusChip';
import type { WalletStatusData } from '@/hooks/useIdentity';

interface WalletCardProps {
    address: string;
    isPrimary: boolean;
    status: WalletStatusData;
    isCurrentWallet: boolean;
    onSetPrimary?: () => void;
    onManage?: () => void;
    className?: string;
}

function formatAddress(addr: string): string {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
}

export function WalletCard({
    address,
    isPrimary,
    status,
    isCurrentWallet,
    onSetPrimary,
    onManage,
    className,
}: WalletCardProps) {
    const getCardStatus = (): 'active' | 'primary' | 'pending' | 'compromised' => {
        if (status.isCompromised) return 'compromised';
        if (status.isPendingCompromise) return 'pending';
        if (isPrimary) return 'primary';
        return 'active';
    };

    const cardStatus = getCardStatus();

    const borderColors = {
        active: 'border-white/10 hover:border-white/20',
        primary: 'border-indigo-500/30 hover:border-indigo-500/50',
        pending: 'border-amber-500/30 hover:border-amber-500/50',
        compromised: 'border-red-500/30 hover:border-red-500/50',
    };

    const bgColors = {
        active: 'bg-white/[0.02]',
        primary: 'bg-indigo-500/5',
        pending: 'bg-amber-500/5',
        compromised: 'bg-red-500/5',
    };

    return (
        <div
            className={cn(
                'rounded-xl border p-4 transition-all duration-200',
                borderColors[cardStatus],
                bgColors[cardStatus],
                isCurrentWallet && 'ring-1 ring-white/20',
                className
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-3">
                <code className="text-sm font-mono text-white/90">
                    {formatAddress(address)}
                </code>
                <StatusChip status={cardStatus} size="sm" />
            </div>

            {/* Score */}
            <div className="mb-3">
                <div className="text-xs text-white/50 mb-1">Individual Score</div>
                <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${Math.min((status.individualScore / 1000) * 100, 100)}%` }}
                        />
                    </div>
                    <span className="text-sm font-medium text-white/80">
                        {status.individualScore} pts
                    </span>
                </div>
            </div>

            {/* Meta */}
            <div className="text-xs text-white/50 mb-4">
                Linked: {formatDate(status.linkedAt)}
                {isCurrentWallet && (
                    <span className="ml-2 text-indigo-400">(current)</span>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                {onManage && (
                    <button
                        onClick={onManage}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all"
                    >
                        Manage
                    </button>
                )}
                {onSetPrimary && !isPrimary && !status.isCompromised && !status.isPendingCompromise && (
                    <button
                        onClick={onSetPrimary}
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/30 transition-all"
                    >
                        Set Primary
                    </button>
                )}
                {status.isCompromised && (
                    <button
                        className="flex-1 px-3 py-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/30 transition-all"
                    >
                        Claim Badges
                    </button>
                )}
            </div>
        </div>
    );
}
