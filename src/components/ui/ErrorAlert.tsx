import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface ErrorAlertProps {
    title: string;
    message: string;
    onRetry?: () => void;
    onDismiss?: () => void;
}

export function ErrorAlert({ title, message, onRetry, onDismiss }: ErrorAlertProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="glass-panel p-4 rounded-xl border border-red-500/20 bg-red-500/5">
            <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1">{title}</h4>
                    <p className="text-sm text-white/70">{message}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        >
                            Попробовать снова
                        </button>
                    )}
                </div>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        onDismiss?.();
                    }}
                    className="text-white/40 hover:text-white/70 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
