"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Mock data for initial population
const MOCK_MINTS = [
    { title: "Superchain Builder", network: "base", date: "2m ago" },
    { title: "Optimism Governance", network: "optimism", date: "5m ago" },
    { title: "Base Camp 2024", network: "base", date: "12m ago" },
    { title: "Zora Creator", network: "zora", date: "15m ago" },
    { title: "Celo Green Badge", network: "celo", date: "22m ago" },
    { title: "Lisk Pioneer", network: "lisk", date: "30m ago" },
    { title: "Unichain Early", network: "unichain", date: "45m ago" },
];

export function SocialProofCarousel() {
    const [mints, setMints] = useState(MOCK_MINTS);

    useEffect(() => {
        // Merge with local storage events
        const local = JSON.parse(localStorage.getItem('my-surge-events') || '[]');
        if (local.length > 0) {
            const formatted = local.map((e: any) => ({
                title: e.title,
                network: e.network,
                date: "Just now"
            })).reverse();
            setMints([...formatted, ...MOCK_MINTS]);
        }
    }, []);

    const networkColors: Record<string, string> = {
        base: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
        optimism: "from-red-500/20 to-red-600/20 border-red-500/30",
        zora: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
        celo: "from-green-500/20 to-green-600/20 border-green-500/30",
        ink: "from-violet-500/20 to-violet-600/20 border-violet-500/30",
        lisk: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30",
        unichain: "from-pink-500/20 to-pink-600/20 border-pink-500/30",
        soneium: "from-indigo-500/20 to-indigo-600/20 border-indigo-500/30",
    };

    const getNetworkColor = (network: string) => networkColors[network] || networkColors.base;

    return (
        <div className="w-full py-12 relative overflow-hidden">
            <div className="text-center mb-8">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Live Activity</h3>
            </div>

            {/* Gradient Masks */}
            <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none"></div>

            {/* Marquee Track */}
            <div className="flex overflow-hidden group">
                <motion.div
                    className="flex gap-4 animate-marquee"
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30
                    }}
                >
                    {[...mints, ...mints, ...mints].map((mint, i) => (
                        <div
                            key={i}
                            className={`flex flex-col w-64 p-4 rounded-xl border bg-gradient-to-br backdrop-blur-md ${getNetworkColor(mint.network)}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="text-[10px] uppercase font-bold text-white/60 bg-black/20 px-2 py-0.5 rounded-full inline-block">
                                    {mint.network}
                                </div>
                                <span className="text-[10px] text-white/40">{mint.date}</span>
                            </div>
                            <h4 className="text-white font-bold truncate">{mint.title}</h4>
                            <div className="flex items-center gap-1 mt-2 text-xs text-white/50">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                Minted
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
