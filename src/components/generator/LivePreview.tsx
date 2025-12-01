"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useReveal } from "@/lib/gsap-hooks";
import { Sparkles, Circle, Zap, CircleDot } from "lucide-react";

interface LivePreviewProps {
    title: string;
    date: string;
    network: "base" | "celo" | "optimism";
    theme: "sketch" | "modern" | "flat" | "pixel" | "monochrome" | "abstract";
    keywords: string;
    imageUrl?: string;
    isGenerating?: boolean;
}

export function LivePreview({
    title,
    date,
    network,
    theme,
    imageUrl,
    isGenerating = false,
}: LivePreviewProps) {
    const imageRevealRef = useReveal(0.6);

    const NetworkLogo = () => {
        const logoConfig = {
            base: {
                Icon: Circle,
                gradient: "from-[#0052FF] to-[#3374FF]",
                color: "#0052FF"
            },
            optimism: {
                Icon: Zap,
                gradient: "from-[#FF0420] to-[#FF334B]",
                color: "#FF0420"
            },
            celo: {
                Icon: CircleDot,
                gradient: "from-[#FCFF52] to-[#FEFF85]",
                color: "#FCFF52"
            }
        };

        const config = logoConfig[network];
        const Icon = config.Icon;

        return (
            <div className={`bg-gradient-to-br ${config.gradient} p-4 rounded-full shadow-2xl`}>
                <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
        );
    };

    return (
        <Card className={cn(
            "w-full max-w-md aspect-square flex items-center justify-center bg-muted/20 backdrop-blur-sm overflow-hidden relative",
            imageUrl ? "p-4" : "p-8"
        )}>
            {isGenerating ? (
                // Loading State - inline in preview
                <div className="w-full h-full flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
                    <Sparkles className="w-16 h-16 text-blue-400 mb-6 animate-pulse" />
                    <h3 className="text-2xl font-bold text-white mb-2">
                        Creating your SURGE
                    </h3>
                    <p className="text-white/60 text-center px-4 mb-6">
                        This may take 10-30 seconds
                    </p>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            ) : imageUrl ? (
                // AI Generated Image
                <div ref={imageRevealRef} className="w-full h-full flex items-center justify-center">
                    <img
                        src={imageUrl}
                        alt={title || "SURGE Preview"}
                        className="max-w-full max-h-full object-contain rounded-lg"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => {
                            console.error('Image failed to load:', imageUrl);
                            console.error('Error event:', e);
                        }}
                        onLoad={() => {
                            console.log('Image loaded successfully:', imageUrl);
                        }}
                    />
                </div>
            ) : (
                // Placeholder preview with Network Logo
                <div
                    className="w-full h-full rounded-full flex flex-col items-center justify-center text-center transition-all duration-500 shadow-2xl relative overflow-hidden bg-gradient-to-br from-base/30 via-optimism/30 to-celo/30 p-8"
                >
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />

                    <div className="relative z-10 space-y-4 flex flex-col items-center justify-center w-full">
                        <NetworkLogo />
                        <h2 className="text-2xl font-bold font-heading tracking-wide break-words w-full px-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-white">
                            {title || "Event Title"}
                        </h2>
                        <p className="text-sm font-medium opacity-90 font-mono drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-white">
                            {date || "YYYY-MM-DD"}
                        </p>
                        <div className="text-xs uppercase tracking-widest opacity-80 mt-4 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-bold text-white">
                            {network} SURGE
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
