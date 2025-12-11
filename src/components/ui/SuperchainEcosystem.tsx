"use client";

import { useStagger } from "@/lib/gsap-hooks";
import Image from "next/image";

interface NetworkData {
    name: string;
    color: string;
    description: string;
    logo: string;
    stats: { tps: string; fee: string };
}

const networks: NetworkData[] = [
    {
        name: "Base",
        color: "#0052FF",
        description: "Built by Coinbase, secure and low-cost Ethereum L2",
        logo: "/assets/chain-logos/base.png",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Optimism",
        color: "#FF0420",
        description: "The original Optimistic Rollup, scaling Ethereum",
        logo: "/assets/chain-logos/optimism.png",
        stats: { tps: "~2000", fee: "$0.02" }
    },
    {
        name: "Zora",
        color: "#5E3FBE",
        description: "The best place to mint and collect NFTs",
        logo: "/assets/chain-logos/zora.png",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Ink",
        color: "#7C3AED",
        description: "High-performance L2 for web3 creators",
        logo: "/assets/chain-logos/ink.png",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Lisk",
        color: "#0ABBED",
        description: "Accessible blockchain for real-world apps",
        logo: "/assets/chain-logos/lisk.png",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Unichain",
        color: "#FF007A",
        description: "DeFi-native L2 built by Uniswap",
        logo: "/assets/chain-logos/unichain.png",
        stats: { tps: "~2000", fee: "$0.001" }
    },
    {
        name: "Soneium",
        color: "#8B5CF6",
        description: "Sony's blockchain for creative industries",
        logo: "/assets/chain-logos/soneium.png",
        stats: { tps: "~1000", fee: "$0.01" }
    },
    {
        name: "Celo",
        color: "#35D07F",
        description: "Mobile-first blockchain for payments",
        logo: "/assets/chain-logos/celo.png",
        stats: { tps: "~1000", fee: "$0.001" }
    }
];

export function SuperchainEcosystem() {
    const cardsRef = useStagger(0.08, 0.1);

    return (
        <div>
            {/* Network Grid */}
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {networks.map((network) => (
                    <div
                        key={network.name}
                        className="group relative p-6 bg-neutral-900/60 border border-white/[0.08] hover:border-white/20 rounded-xl transition-all duration-300 hover:bg-neutral-900/80 overflow-hidden"
                        style={{
                            boxShadow: `0 0 0 rgba(${hexToRgb(network.color)}, 0)`,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 25px rgba(${hexToRgb(network.color)}, 0.3)`;
                            e.currentTarget.style.borderColor = network.color;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = `0 0 0 rgba(${hexToRgb(network.color)}, 0)`;
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        }}
                    >
                        {/* Color accent bar */}
                        <div
                            className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-[3px]"
                            style={{
                                backgroundColor: network.color,
                                boxShadow: `0 0 10px ${network.color}`,
                            }}
                        />

                        <div className="space-y-4 pt-2">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 relative rounded-full overflow-hidden border-2 transition-all duration-300"
                                    style={{ borderColor: `${network.color}40` }}
                                >
                                    <Image
                                        src={network.logo}
                                        alt={network.name}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <h3
                                    className="text-lg font-bold tracking-wide"
                                    style={{ color: network.color }}
                                >
                                    {network.name}
                                </h3>
                            </div>

                            {/* Description */}
                            <p className="text-neutral-400 text-sm leading-relaxed min-h-[40px]">
                                {network.description}
                            </p>

                            {/* Stats */}
                            <div className="flex gap-6 pt-3 border-t border-white/[0.06]">
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">TPS</div>
                                    <div className="text-sm font-semibold text-white">{network.stats.tps}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Fee</div>
                                    <div className="text-sm font-semibold text-accent">{network.stats.fee}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '255, 255, 255';
}
