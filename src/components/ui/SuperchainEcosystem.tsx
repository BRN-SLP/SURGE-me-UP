import { useStagger } from "@/lib/gsap-hooks";
import { Circle, Zap, CircleDot, Disc, Layers, Box } from "lucide-react";

export function SuperchainEcosystem() {
    const cardsRef = useStagger(0.1, 0.1);

    const networks = [
        {
            name: "Base",
            color: "#0052FF",
            description: "Built by Coinbase, Base is a secure, low-cost Ethereum L2",
            logo: <Circle className="w-8 h-8" strokeWidth={1.5} />,
            status: "active",
            stats: { tps: "~1000", fee: "$0.01" }
        },
        {
            name: "Optimism",
            color: "#FF0420",
            description: "The original Optimistic Rollup, scaling Ethereum sustainably",
            logo: <Zap className="w-8 h-8" strokeWidth={1.5} />,
            status: "active",
            stats: { tps: "~2000", fee: "$0.02" }
        },
        {
            name: "Celo",
            color: "#FCFF52",
            description: "Mobile-first blockchain for real-world payments",
            logo: <CircleDot className="w-8 h-8" strokeWidth={1.5} />,
            status: "active",
            stats: { tps: "~1000", fee: "$0.001" }
        },
        {
            name: "Zora",
            color: "#111111",
            description: "The best place to mint and collect NFTs",
            logo: <Disc className="w-8 h-8" strokeWidth={1.5} />,
            status: "soon",
            stats: { tps: "Coming", fee: "Soon" }
        },
        {
            name: "Mode",
            color: "#DFFE00",
            description: "The Modular DeFi L2 rewarding growth",
            logo: <Layers className="w-8 h-8" strokeWidth={1.5} />,
            status: "soon",
            stats: { tps: "Coming", fee: "Soon" }
        },
        {
            name: "Fraxtal",
            color: "#000000",
            description: "Modular rollup with fractal scaling",
            logo: <Box className="w-8 h-8" strokeWidth={1.5} />,
            status: "soon",
            stats: { tps: "Coming", fee: "Soon" }
        }
    ];

    return (
        <div className="space-y-12">
            <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {networks.map((network, index) => (
                    <div
                        key={network.name}
                        className={`group relative glass-panel p-8 rounded-3xl border transition-all duration-500 hover:scale-105 overflow-hidden ${network.status === 'active'
                            ? 'border-white/10 hover:border-white/30'
                            : 'border-white/5 opacity-80 hover:opacity-100'
                            }`}
                        style={{
                            background: `linear-gradient(135deg, ${network.color}10 0%, transparent 100%)`
                        }}
                    >
                        {/* Glow effect */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                            style={{
                                background: `radial-gradient(circle at center, ${network.color}20 0%, transparent 70%)`
                            }}
                        />

                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-start">
                                {/* Logo */}
                                <div className="text-white/80 group-hover:text-white group-hover:scale-110 transition-all duration-500">
                                    {network.logo}
                                </div>

                                {network.status === 'soon' && (
                                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-white/70 border border-white/10">
                                        Soon
                                    </span>
                                )}
                            </div>

                            {/* Network Name */}
                            <h3
                                className="text-3xl font-heading font-bold"
                                style={{ color: network.status === 'active' ? network.color : 'white' }}
                            >
                                {network.name}
                            </h3>

                            {/* Description */}
                            <p className="text-white/70 leading-relaxed min-h-[48px]">
                                {network.description}
                            </p>

                            {/* Stats */}
                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                <div className="flex-1">
                                    <div className="text-sm text-white/50 mb-1">Speed</div>
                                    <div className="text-lg font-bold text-white">{network.stats.tps}</div>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-white/50 mb-1">Avg Fee</div>
                                    <div className="text-lg font-bold text-white">{network.stats.fee}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
