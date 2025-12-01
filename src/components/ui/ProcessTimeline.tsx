"use client";

import { useStagger } from "@/lib/gsap-hooks";
import { Palette, Sparkles, Wallet, CheckCircle } from "lucide-react";

export function ProcessTimeline() {
    const timelineRef = useStagger(0.3, 0.2);

    const steps = [
        {
            icon: <Palette className="h-8 w-8" />,
            title: "Design Your SURGE",
            description: "Choose your event details, select a theme style, and add custom keywords",
            color: "accent",
            gradient: ""
        },
        {
            icon: <Sparkles className="h-8 w-8" />,
            title: "Generate with AI",
            description: "Our advanced AI creates stunning artwork in seconds using your specifications",
            color: "accent",
            gradient: ""
        },
        {
            icon: <Wallet className="h-8 w-8" />,
            title: "Choose Network",
            description: "Select Base, Optimism, or Celo based on your preference and community",
            color: "accent",
            gradient: ""
        },
        {
            icon: <CheckCircle className="h-8 w-8" />,
            title: "Mint & Share",
            description: "Mint your SURGE on-chain and share it with your community instantly",
            color: "accent",
            gradient: ""
        }
    ];

    return (
        <div className="space-y-12">
            <div ref={timelineRef} className="relative max-w-4xl mx-auto">
                {/* Timeline line */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-white/[0.08] hidden md:block" />

                <div className="space-y-12">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                }`}
                        >
                            {/* Content */}
                            <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                <div className={`minimal-card p-8 rounded-xl border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 group ${step.gradient}`}>
                                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? "md:flex-row-reverse md:justify-end" : ""}`}>
                                        <div className={`p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] transition-all duration-300 text-accent`}>
                                            {step.icon}
                                        </div>
                                        <h3 className={`text-xl font-heading font-normal text-white ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className={`text-neutral-400 leading-relaxed font-light ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Step number */}
                            <div className="relative z-10 flex-shrink-0">
                                <div className={`w-16 h-16 rounded-full border-2 border-accent/40 bg-white/[0.02] flex items-center justify-center`}>
                                    <span className="text-xl font-light text-white">{index + 1}</span>
                                </div>
                            </div>

                            {/* Spacer for alternating layout */}
                            <div className="flex-1 hidden md:block" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
