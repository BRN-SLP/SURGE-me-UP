"use client";

import { motion } from "framer-motion";
import { NetworkSelector } from "../NetworkSelector";
import { HelpButton } from "@/components/ui/HelpButton";

interface NetworkStepProps {
    selectedNetwork: string;
    onSelect: (networkId: string) => void;
    isConnected: boolean;
    chain?: { id: number; name: string };
    getTargetChainId: () => number;
}

export function NetworkStep({ selectedNetwork, onSelect, isConnected, chain, getTargetChainId }: NetworkStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Choose Your Network</h2>
                <p className="text-white/60">Select the blockchain where your identity will live. Base and Optimism are recommended for low fees.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-4">
                    <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Network</label>
                    <HelpButton content="Drag a network logo into the box to select it." />
                </div>

                <NetworkSelector
                    selectedNetwork={selectedNetwork}
                    onSelect={onSelect}
                />

                {/* Network Status Indicator */}
                {isConnected && chain && (() => {
                    const targetChainId = getTargetChainId();
                    const isNetworkMatched = chain.id === targetChainId;

                    if (!isNetworkMatched) {
                        return (
                            <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2 mt-4 animate-pulse">
                                <span className="material-symbols-outlined text-sm">warning</span>
                                <span>Connected to {chain.name}. Switch wallet to {selectedNetwork} to continue.</span>
                            </div>
                        );
                    }

                    return (
                        <div className="flex items-center gap-2 text-xs text-green-400 mt-4 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            <span>Connected to {chain.name}</span>
                        </div>
                    );
                })()}
            </div>
        </motion.div>
    );
}
