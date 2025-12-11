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
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    const steps = [
        {
            icon: <Palette className="h-8 w-8" />,
            title: "Design Your SURGE",
            description: "Choose your event details, select a theme style, and add custom keywords",
            color: "#0ae448"
        },
        {
            icon: <Sparkles className="h-8 w-8" />,
            title: "Generate with AI",
            description: "Our advanced AI creates stunning artwork in seconds using your specifications",
            color: "#00d9ff"
        },
        {
            icon: <Wallet className="h-8 w-8" />,
            title: "Choose Network",
            description: "Select from 8 Superchain networks based on your preference",
            color: "#ff0080"
        },
        {
            icon: <CheckCircle className="h-8 w-8" />,
            title: "Mint & Share",
            description: "Mint your SURGE on-chain and share it with your community instantly",
            color: "#0ae448"
        }
    ];

    useEffect(() => {
        if (!pathRef.current || !markerRef.current || !containerRef.current) return;

        const timer = setTimeout(() => {
            const path = pathRef.current;
            const marker = markerRef.current;
            const container = containerRef.current;

            if (!path || !marker || !container) return;

            const positions = stepRefs.current
                .filter(el => el !== null)
                .map(el => {
                    const rect = el!.getBoundingClientRect();
                    const containerRect = container.getBoundingClientRect();
                    return {
                        x: rect.left + rect.width / 2 - containerRect.left,
                        y: rect.top + rect.height / 2 - containerRect.top
                    };
                });

            if (positions.length < 4) return;

            const offsetX = 120;
            const pathData = `
                M ${positions[0].x} ${positions[0].y}
                C ${positions[0].x + offsetX} ${positions[0].y + 40},
                  ${positions[1].x - offsetX} ${positions[1].y - 60},
                  ${positions[1].x} ${positions[1].y}
                S ${positions[2].x + offsetX} ${positions[2].y - 60},
                  ${positions[2].x} ${positions[2].y}
                S ${positions[3].x - offsetX} ${positions[3].y - 60},
                  ${positions[3].x} ${positions[3].y}
            `;

            path.setAttribute('d', pathData);

            const pathLength = path.getTotalLength();
            gsap.set(path, {
                strokeDasharray: pathLength,
                strokeDashoffset: pathLength,
            });

            gsap.to(path, {
                strokeDashoffset: 0,
                duration: 3,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: container,
                    start: "top 70%",
                    end: "bottom 30%",
                    scrub: 2,
                },
            });

            gsap.to(marker, {
                motionPath: {
                    path: path,
                    align: path,
                    alignOrigin: [0.5, 0.5],
                    autoRotate: false,
                },
                duration: 3,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: container,
                    start: "top 70%",
                    end: "bottom 30%",
                    scrub: 2,
                },
            });
        }, 500);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="space-y-12">
            <div ref={containerRef} className="relative max-w-4xl mx-auto">
                {/* SVG Path */}
                <svg
                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                    style={{ zIndex: 1 }}
                >
                    <path
                        ref={pathRef}
                        d=""
                        fill="none"
                        stroke="url(#pathGradientLZ)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        opacity="0.8"
                    />
                    <defs>
                        <linearGradient id="pathGradientLZ" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0ae448" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#00d9ff" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ff0080" stopOpacity="0.8" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Animated marker */}
                <div
                    ref={markerRef}
                    className="absolute w-4 h-4 rounded-full bg-accent shadow-glow border-2 border-white/50"
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
                                <div className="lz-card p-8 rounded-xl group">
                                    <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                                        <div
                                            className="p-4 rounded-xl bg-white/[0.03] border transition-all duration-300"
                                            style={{
                                                borderColor: `${step.color}40`,
                                                color: step.color,
                                                boxShadow: `0 0 15px ${step.color}30`
                                            }}
                                        >
                                            {step.icon}
                                        </div>
                                        <h3
                                            className={`text-xl font-heading font-medium text-white ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                                        >
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className={`text-neutral-400 leading-relaxed font-light ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Step number */}
                            <div
                                ref={(el) => { stepRefs.current[index] = el; }}
                                className="relative z-10 flex-shrink-0"
                            >
                                <div
                                    className="w-16 h-16 rounded-full border-2 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
                                    style={{
                                        borderColor: `${step.color}60`,
                                        boxShadow: `0 0 20px ${step.color}30`
                                    }}
                                >
                                    <span className="text-xl font-medium text-white">{index + 1}</span>
                                </div>
                            </div>

                            {/* Spacer */}
                            <div className="flex-1 hidden md:block" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
