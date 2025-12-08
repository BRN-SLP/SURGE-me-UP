"use client";

import { useStagger } from "@/lib/gsap-hooks";

// BAUHAUS geometric icon - same style as NetworkSelector
function BauhausNetworkIcon({ color }: { color: string }) {
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="20" fill={color} />
            <rect x="14" y="14" width="20" height="20" fill="white" transform="rotate(45 24 24)" />
        </svg>
    );
}

interface NetworkData {
    name: string;
    color: string;
    description: string;
    stats: { tps: string; fee: string };
}

const networks: NetworkData[] = [
    {
        name: "Base",
        color: "#0052FF",
        description: "Built by Coinbase, secure and low-cost Ethereum L2",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Optimism",
        color: "#FF0420",
        description: "The original Optimistic Rollup, scaling Ethereum",
        stats: { tps: "~2000", fee: "$0.02" }
    },
    {
        name: "Zora",
        color: "#5E3FBE",
        description: "The best place to mint and collect NFTs",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Ink",
        color: "#7C3AED",
        description: "High-performance L2 for web3 creators",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Lisk",
        color: "#0ABBED",
        description: "Accessible blockchain for real-world apps",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Unichain",
        color: "#FF007A",
        description: "DeFi-native L2 built by Uniswap",
        stats: { tps: "~2000", fee: "$0.001" }
    },
    {
        name: "Soneium",
        color: "#FFD700",
        description: "Sony's blockchain for creative industries",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Celo",
        color: "#35D07F",
        description: "Mobile-first blockchain for payments",
        stats: { tps: "~1000", fee: "$0.001" }
    }
];

export function SuperchainEcosystem() {
    const cardsRef = useStagger(0.08, 0.1);

    return (
        <div className="space-y-12">
            {/* BAUHAUS section header */}
            <div className="flex items-center gap-4">
                <div className="flex gap-2">
                    <div className="w-4 h-4 bg-red-500" />
                    <div className="w-4 h-4 bg-yellow-400 rotate-45" />
                    <div className="w-4 h-4 bg-blue-500 rounded-full" />
                </div>
                <h2 className="text-2xl font-bold uppercase tracking-[0.2em] text-white">
                    Superchain Network
                </h2>
                <div className="flex-1 h-[2px] bg-white/10" />
            </div>

            {/* Network Grid - BAUHAUS style cards */}
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {networks.map((network) => (
                    <div
                        key={network.name}
                        className="group relative p-6 border-2 border-white/10 hover:border-white/30 transition-all duration-300 bg-black/40 hover:bg-black/60"
                    >
                        {/* Color accent bar */}
                        <div
                            className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-2"
                            style={{ backgroundColor: network.color }}
                        />

                        <div className="space-y-4 pt-2">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <BauhausNetworkIcon color={network.color} />
                                <h3
                                    className="text-xl font-bold uppercase tracking-wider"
                                    style={{ color: network.color }}
                                >
                                    {network.name}
                                </h3>
                            </div>

                            {/* Description */}
                            <p className="text-white/60 text-sm leading-relaxed min-h-[40px]">
                                {network.description}
                            </p>

                            {/* Stats - minimal */}
                            <div className="flex gap-4 pt-3 border-t border-white/10">
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40">TPS</div>
                                    <div className="text-sm font-bold text-white">{network.stats.tps}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-white/40">Fee</div>
                                    <div className="text-sm font-bold text-white">{network.stats.fee}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
