"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Network {
    id: string;
    name: string;
    color: string;
    bgColor: string;
}

// BAUHAUS-inspired network palette
const networks: Network[] = [
    { id: "base", name: "Base", color: "#0052FF", bgColor: "#0052FF" },
    { id: "optimism", name: "Optimism", color: "#FF0420", bgColor: "#FF0420" },
    { id: "zora", name: "Zora", color: "#5E3FBE", bgColor: "#5E3FBE" },
    { id: "ink", name: "Ink", color: "#7C3AED", bgColor: "#7C3AED" },
    { id: "lisk", name: "Lisk", color: "#0ABBED", bgColor: "#0ABBED" },
    { id: "unichain", name: "Unichain", color: "#FF007A", bgColor: "#FF007A" },
    { id: "soneium", name: "Soneium", color: "#FFD700", bgColor: "#1E1E1E" },
    { id: "celo", name: "Celo", color: "#FCFF52", bgColor: "#35D07F" },
];

interface NetworkSelectorProps {
    selectedNetwork: string;
    onSelect: (networkId: string) => void;
}

// BAUHAUS geometric icon component
function BauhausIcon({ color, isSelected }: { color: string; isSelected: boolean }) {
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            {/* Primary circle */}
            <circle
                cx="16"
                cy="16"
                r="14"
                fill={isSelected ? color : "transparent"}
                stroke={color}
                strokeWidth={isSelected ? "0" : "2"}
            />
            {/* Inner geometric shape */}
            <rect
                x="10"
                y="10"
                width="12"
                height="12"
                fill={isSelected ? "white" : color}
                transform="rotate(45 16 16)"
            />
        </svg>
    );
}

export function NetworkSelector({ selectedNetwork, onSelect }: NetworkSelectorProps) {
    return (
        <div className="w-full">
            {/* BAUHAUS-style section header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 bg-red-500 rotate-45" />
                <span className="text-sm font-bold uppercase tracking-[0.3em] text-white/70">
                    Select Network
                </span>
                <div className="flex-1 h-[2px] bg-white/10" />
            </div>

            {/* Compact Network Grid - BAUHAUS style */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {networks.map((network) => {
                    const isSelected = selectedNetwork === network.id;
                    return (
                        <button
                            key={network.id}
                            onClick={() => onSelect(network.id)}
                            className={cn(
                                "group relative flex flex-col items-center gap-2 p-3 rounded-none border-2 transition-all duration-200",
                                "hover:scale-105 hover:z-10",
                                isSelected
                                    ? "border-white bg-white/10"
                                    : "border-transparent hover:border-white/30 bg-black/20"
                            )}
                            style={{
                                boxShadow: isSelected ? `0 0 20px ${network.color}60` : undefined,
                            }}
                        >
                            {/* BAUHAUS geometric logo */}
                            <div
                                className={cn(
                                    "w-10 h-10 flex items-center justify-center transition-all duration-200",
                                    !isSelected && "opacity-50 group-hover:opacity-100"
                                )}
                            >
                                <BauhausIcon color={network.color} isSelected={isSelected} />
                            </div>

                            {/* Network name - bold sans-serif */}
                            <span
                                className={cn(
                                    "text-[10px] font-bold uppercase tracking-wider transition-colors duration-200",
                                    isSelected ? "text-white" : "text-white/40 group-hover:text-white/70"
                                )}
                            >
                                {network.name}
                            </span>

                            {/* Selection indicator - geometric */}
                            {isSelected && (
                                <div
                                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent"
                                    style={{ borderTopColor: network.color }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
