"use client";

import { useStagger } from "@/lib/gsap-hooks";
import { Sparkles, Shield, Clock, Globe } from "lucide-react";

export function SURGEExplainer() {
    const featuresRef = useStagger(0.1, 0.1);

    const features = [
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "AI-Generated Art",
            description: "Create unique badges with advanced AI image generation"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "On-Chain Proof",
            description: "Permanent, verifiable records stored on the blockchain"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Instant Minting",
            description: "Fast and affordable NFT creation across multiple L2s"
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Cross-Chain",
            description: "Seamlessly mint across Base, Optimism, and Celo"
        }
    ];

    return (
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="minimal-card p-8 rounded-xl border border-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-4 rounded-xl bg-accent/20 border border-accent/40 text-accent shadow-[0_0_20px_rgba(31,59,85,0.3)] group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(31,59,85,0.5)] transition-all duration-300">
                            {feature.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-heading font-normal text-white mb-2 group-hover:text-accent transition-colors duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-neutral-400 font-light leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
