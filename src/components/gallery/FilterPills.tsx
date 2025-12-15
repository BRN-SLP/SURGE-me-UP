"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilterPillsProps {
    selected: string;
    onSelect: (network: string) => void;
}

const NETWORKS = ["all", "base", "optimism", "celo", "zora", "ink", "lisk", "unichain", "soneium"];

export function FilterPills({ selected, onSelect }: FilterPillsProps) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar justify-center">
            {NETWORKS.map((network) => {
                const isSelected = selected === network;

                return (
                    <button
                        key={network}
                        onClick={() => onSelect(network)}
                        className={cn(
                            "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 capitalize",
                            isSelected
                                ? "text-white bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20"
                                : "text-white/40 hover:text-white hover:bg-white/5 border border-transparent"
                        )}
                    >
                        {isSelected && (
                            <motion.div
                                layoutId="activePill"
                                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 -z-10"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        {network}
                    </button>
                );
            })}
        </div>
    );
}
