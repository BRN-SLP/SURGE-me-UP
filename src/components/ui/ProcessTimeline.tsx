"use client";

import { useStagger } from "@/lib/gsap-hooks";
import { Palette, Sparkles, Wallet, CheckCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

export function ProcessTimeline() {
    const timelineRef = useStagger(0.3, 0.2);
    const pathRef = useRef<SVGPathElement>(null);
    const markerRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        if (!pathRef.current || !markerRef.current || !containerRef.current) return;

        const path = pathRef.current;
        const marker = markerRef.current;

        // Draw the path progressively
        const pathLength = path.getTotalLength();
        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        });

        // Animate the path drawing
        gsap.to(path, {
            strokeDashoffset: 0,
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                end: "bottom 30%",
                scrub: 1.5,
            },
        });

        // Animate marker along the path
        gsap.to(marker, {
            motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5],
                autoRotate: false,
            },
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 70%",
                end: "bottom 30%",
                scrub: 1.5,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="space-y-12">
            <div ref={containerRef} className="relative max-w-4xl mx-auto">
                {/* SVG Path connecting steps */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 1 }}
                >
                    <path
                        ref={pathRef}
                        d="M 50% 8% Q 70% 25%, 50% 35% T 50% 65% T 50% 92%"
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0052FF" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#FF0420" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#FCCC16" stopOpacity="0.6" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Animated marker */}
                <div
                    ref={markerRef}
                    className="absolute w-3 h-3 rounded-full bg-accent shadow-[0_0_20px_rgba(31,59,85,0.8)]"
                    style={{ zIndex: 2 }}
                />

                <div ref={timelineRef} className="space-y-12 relative" style={{ zIndex: 3 }}>
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className={`flex flex-col md:flex-row gap-8 items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                }`}
                        >
                            {/* Content */}
                            <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                <div className={`minimal-card p-8 rounded-xl border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300 group ${step.gradient}`}>
                                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
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
                                <div className={`w-16 h-16 rounded-full border-2 border-accent/40 bg-black/80 backdrop-blur-sm flex items-center justify-center`}>
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
