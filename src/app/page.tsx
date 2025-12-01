"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFadeIn, useFloating, useHeroScroll, useStagger, useParallax, useMagnetic } from "@/lib/gsap-hooks";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SURGEExplainer } from "@/components/ui/SURGEExplainer";
import { SuperchainEcosystem } from "@/components/ui/SuperchainEcosystem";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";

import { GradientText, HighlightText } from "@/components/ui/TextHighlight";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useFadeIn(0);
    const subtitleRef = useFadeIn(0.2);
    const buttonsRef = useFadeIn(0.4);

    // Subtle floating background elements
    const blob1Ref = useFloating(6, 10);
    const blob2Ref = useFloating(7, -10);

    // Scroll-triggered refs
    const statsRef = useStagger(0.1, 0.15);
    const explainerHeaderRef = useFadeIn(0);
    const ecosystemHeaderRef = useFadeIn(0);
    const timelineHeaderRef = useFadeIn(0);
    const ctaRef = useParallax(0.1);

    // Subtle Scroll Animation
    useHeroScroll(containerRef, heroRef, [blob1Ref, blob2Ref]);

    const primaryBtnRef = useMagnetic();
    const secondaryBtnRef = useMagnetic();

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden dot-pattern bg-dot">
            {/* Hero Section */}
            <section ref={containerRef} className="flex-1 flex flex-col items-center justify-center px-4 py-32 text-center relative z-10 min-h-screen">

                {/* Subtle Background Accents */}
                <div ref={blob1Ref} className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/[0.02] rounded-full blur-[80px] -z-10 opacity-40" />
                <div ref={blob2Ref} className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/[0.015] rounded-full blur-[100px] -z-10 opacity-30" />

                <div className="relative z-10 max-w-5xl mx-auto space-y-12">
                    <h1 ref={heroRef} className="text-7xl md:text-9xl font-heading font-light tracking-tighter text-white leading-[0.95]">
                        SURGE me <span className="text-accent font-normal">UP</span>
                    </h1>

                    <p ref={subtitleRef} className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto leading-relaxed font-light tracking-wide">
                        Amplify your achievements with <span className="text-accent font-normal">SURGE</span> – the recognition engine built on <span className="text-accent font-normal">Superchain</span>.
                        <br />
                        <span className="text-neutral-400 text-lg mt-4 block">Support for Base, Optimism, and Celo.</span>
                    </p>

                    <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link href="/generator">
                            <Button ref={primaryBtnRef} size="lg" className="group">
                                <span className="flex items-center">Start Generating <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button ref={secondaryBtnRef} variant="outline" size="lg">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section ref={statsRef} className="py-24 px-4 relative z-10 border-y border-white/[0.06]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <AnimatedCounter
                        target={6}
                        label="Superchain Networks"
                        description="Expanding ecosystem support"
                    />
                    <AnimatedCounter
                        target={15000}
                        suffix="+"
                        label="SURGEs Minted"
                        description="Achievements amplified on-chain"
                    />
                    <AnimatedCounter
                        target={0}
                        prefix="$"
                        label="Minting Fee"
                        description="Free minting on testnets"
                    />
                </div>
            </section>

            {/* What is SURGE Section */}
            <section className="py-32 px-4 relative z-10">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div ref={explainerHeaderRef} className="text-center space-y-6">
                        <h2 className="text-4xl md:text-6xl font-heading font-light text-white tracking-tight">
                            Preserve Your Memories
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light">
                            Turn moments into digital collectibles that last forever
                        </p>
                    </div>
                    <SURGEExplainer />
                </div>
            </section>

            {/* Ecosystem Section */}
            <section className="py-32 px-4 relative z-10">
                <div ref={ecosystemHeaderRef} className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-heading font-light text-white tracking-tight mb-4">
                        Superchain Ecosystem
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light">
                        Built for the future of interoperable blockchains
                    </p>
                </div>
                <div className="max-w-7xl mx-auto">
                    <SuperchainEcosystem />
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-32 px-4 relative z-10">
                <div ref={timelineHeaderRef} className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-heading font-light text-white tracking-tight mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light">
                        Create and mint your SURGE in four simple steps
                    </p>
                </div>
                <div className="max-w-7xl mx-auto">
                    <ProcessTimeline />
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-4 relative z-10 text-center">
                <div ref={ctaRef} className="relative">
                    <div className="max-w-4xl mx-auto minimal-card p-16 md:p-20 rounded-2xl border border-white/[0.08] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-accent/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 space-y-8">
                            <h2 className="text-5xl md:text-7xl font-heading font-light text-white tracking-tight">
                                Ready to Mint?
                            </h2>
                            <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light">
                                Join thousands of creators preserving memories on the Superchain.
                            </p>
                            <Link href="/generator">
                                <Button size="lg" className="mt-4">
                                    Create Your First SURGE
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
