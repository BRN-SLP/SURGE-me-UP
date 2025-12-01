"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wallet, Sparkles, Share2, X } from "lucide-react";

export function OnboardingModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem("surge-onboarding-seen");
        if (!hasSeenOnboarding) {
            // Small delay to show after page load
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("surge-onboarding-seen", "true");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="glass-panel max-w-lg w-full p-8 rounded-3xl border border-white/10 relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold font-heading mb-2">Welcome to SURGE me UP! 🌊</h2>
                    <p className="text-white/60">Create unique digital collectibles in 3 simple steps</p>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <Wallet className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">1. Connect Wallet</h3>
                            <p className="text-sm text-white/60">Connect your wallet to Base or Optimism network for low fees.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">2. Design with AI</h3>
                            <p className="text-sm text-white/60">Choose a template or describe your idea, and our AI will generate unique artwork.</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                        <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                            <Share2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white mb-1">3. Mint & Share</h3>
                            <p className="text-sm text-white/60">Mint your SURGE on-chain and share the claim link with your community.</p>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={handleClose}
                    className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-base via-optimism to-celo hover:opacity-90 transition-opacity"
                >
                    Start Creating
                </Button>
            </div>
        </div>
    );
}
