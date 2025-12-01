import { Loader2, Sparkles } from "lucide-react";

interface LoadingStateProps {
    message?: string;
    submessage?: string;
    variant?: "default" | "ai" | "minimal";
}

export function LoadingState({
    message = "Loading...",
    submessage,
    variant = "default"
}: LoadingStateProps) {
    if (variant === "minimal") {
        return (
            <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                <span className="text-sm text-white/70">{message}</span>
            </div>
        );
    }

    if (variant === "ai") {
        return (
            <div className="glass-panel p-8 rounded-3xl border border-white/10 text-center">
                <div className="relative inline-block mb-4">
                    <Sparkles className="w-12 h-12 text-blue-500 animate-pulse" />
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{message}</h3>
                {submessage && (
                    <p className="text-white/60 text-sm">{submessage}</p>
                )}
                <div className="mt-4 flex justify-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <div className="text-center">
                <p className="text-white font-medium">{message}</p>
                {submessage && (
                    <p className="text-white/60 text-sm mt-1">{submessage}</p>
                )}
            </div>
        </div>
    );
}
