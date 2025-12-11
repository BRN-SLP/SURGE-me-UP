'use client';

import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface AlertBannerProps {
    type: 'info' | 'warning' | 'danger';
    title?: string;
    message: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const alertConfig = {
    info: {
        icon: Info,
        bgClass: 'bg-blue-500/5 border-blue-500/20',
        iconClass: 'text-blue-400',
        titleClass: 'text-blue-400',
        textClass: 'text-blue-300/80',
    },
    warning: {
        icon: AlertTriangle,
        bgClass: 'bg-amber-500/5 border-amber-500/20',
        iconClass: 'text-amber-400',
        titleClass: 'text-amber-400',
        textClass: 'text-amber-300/80',
    },
    danger: {
        icon: AlertCircle,
        bgClass: 'bg-red-500/5 border-red-500/20',
        iconClass: 'text-red-400',
        titleClass: 'text-red-400',
        textClass: 'text-red-300/80',
    },
};

export function AlertBanner({ type, title, message, action, className }: AlertBannerProps) {
    const config = alertConfig[type];
    const Icon = config.icon;

    return (
        <div
            className={cn(
                'rounded-xl border p-4 flex items-start gap-4',
                config.bgClass,
                className
            )}
        >
            <div className={cn('flex-shrink-0 mt-0.5', config.iconClass)}>
                <Icon className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
                {title && (
                    <div className={cn('font-semibold mb-1', config.titleClass)}>
                        {title}
                    </div>
                )}
                <div className={cn('text-sm', config.textClass)}>
                    {message}
                </div>
            </div>

            {action && (
                <button
                    onClick={action.onClick}
                    className={cn(
                        'flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-all',
                        type === 'danger'
                            ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                            : type === 'warning'
                                ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-400'
                                : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    )}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
