'use client';

import { cn } from '@/lib/utils';

interface StatusChipProps {
    status: 'active' | 'primary' | 'pending' | 'compromised' | 'suspended';
    size?: 'sm' | 'md';
    className?: string;
}

const statusConfig = {
    active: {
        label: 'Active',
        icon: '●',
        className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    primary: {
        label: 'Primary',
        icon: '⭐',
        className: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    },
    pending: {
        label: 'Pending Compromise',
        icon: '◐',
        className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    compromised: {
        label: 'Compromised',
        icon: '🚫',
        className: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
    suspended: {
        label: 'Suspended',
        icon: '◐',
        className: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
    },
};

export function StatusChip({ status, size = 'md', className }: StatusChipProps) {
    const config = statusConfig[status];

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border font-medium',
                size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
                config.className,
                className
            )}
        >
            <span className="text-[0.7em]">{config.icon}</span>
            {config.label}
        </span>
    );
}
