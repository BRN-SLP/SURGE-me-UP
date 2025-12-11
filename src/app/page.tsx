"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFadeIn, useFloating, useHeroScroll, useStagger, useParallax, useScrollGradientText } from "@/lib/gsap-hooks";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { SURGEExplainer } from "@/components/ui/SURGEExplainer";
import { SuperchainEcosystem } from "@/components/ui/SuperchainEcosystem";
import { ProcessTimeline } from "@/components/ui/ProcessTimeline";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useFadeIn(0);
    const subtitleRef = useFadeIn(0.2);
    const buttonsRef = useFadeIn(0.4);

    const surgeGradientRef = useScrollGradientText();

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

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden">
            {/* Hero Section */}
            <section ref={containerRef} className="flex-1 flex flex-col items-center justify-center px-4 py-32 text-center relative z-10 min-h-screen">

                {/* Gradient Background Accents */}
                <div ref={blob1Ref} className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent/[0.04] rounded-full blur-[100px] -z-10" />
                <div ref={blob2Ref} className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-secondary/[0.03] rounded-full blur-[120px] -z-10" />

                <div className="relative z-10 max-w-5xl mx-auto space-y-12">
                    {/* Badge */}
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            <span>Now Live on 8 Networks</span>
                        </div>
                    </div>

                    <h1 ref={heroRef} className="text-7xl md:text-9xl font-heading font-light tracking-tighter text-white leading-[0.95]">
                        <span ref={surgeGradientRef} className="font-semibold gradient-text">SURGE</span>
                        <span className="text-neutral-300"> me </span>
                        <span className="text-accent font-medium text-glow">UP</span>
                    </h1>

                    <p ref={subtitleRef} className="text-xl md:text-2xl text-neutral-300 max-w-3xl mx-auto leading-relaxed font-light">
                        Amplify your achievements with SURGE – the recognition engine built on{" "}
                        <span className="font-semibold text-[#FF0420]">Superchain</span>.
                        <br />
                        <span className="text-neutral-400 text-lg mt-4 block">
                            Supporting{" "}
                            <span className="text-base font-semibold">Base</span>,{" "}
                            <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#FF0420] to-white">Optimism</span>,{" "}
                            <span className="text-celo font-semibold">Celo</span>,{" "}
                            <span className="text-zora font-semibold">Zora</span>, and more.
                        </span>
                    </p>

                    <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
                        <Link href="/generator">
                            <Button size="lg" variant="default" className="group">
                                <span className="flex items-center">Start Generating <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button variant="outline" size="lg">
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section ref={statsRef} className="py-24 px-4 relative z-10 border-y border-accent/10 bg-neutral-900/30">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <AnimatedCounter
                        target={8}
                        label="Superchain Networks"
                        description="Base, OP, Celo, Zora, Ink, Lisk, Unichain, Soneium"
                    />
                    <AnimatedCounter
                        target={0}
                        suffix=" — Just Launched!"
                        label="SURGEs Minted"
                        description="Be among the first to mint"
                    />
                    <AnimatedCounter
                        target={0}
                        prefix="$"
                        label="Minting Fee"
                        description="Free minting on all networks"
                    />
                </div>
            </section>

            {/* What is SURGE Section */}
            <section className="py-32 px-4 relative z-10">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div ref={explainerHeaderRef} className="text-center space-y-6">
                        <h2 className="text-4xl md:text-6xl font-heading font-light text-white tracking-tight">
                            Preserve Your <span className="gradient-text font-medium">Memories</span>
                        </h2>
                        <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light">
                            Turn moments into digital collectibles that last forever on-chain
                        </p>
                    </div>
                    <SURGEExplainer />
                </div>
            </section>

            {/* Ecosystem Section */}
            <section className="py-32 px-4 relative z-10 bg-neutral-900/20">
                <div ref={ecosystemHeaderRef} className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-heading font-light text-white tracking-tight mb-4">
                        Superchain <span className="text-accent">Ecosystem</span>
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
                        How It <span className="text-secondary">Works</span>
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
                    <div className="max-w-4xl mx-auto glow-card p-16 md:p-20 relative overflow-hidden group">
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-center mb-6">
                                <div className="p-3 rounded-full bg-accent/10 border border-accent/30">
                                    <Zap className="w-8 h-8 text-accent" />
                                </div>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-heading font-light text-white tracking-tight">
                                Ready to <span className="gradient-text font-medium">Mint</span>?
                            </h2>
                            <p className="text-lg text-neutral-400 max-w-2xl mx-auto font-light">
                                Join creators building on-chain recognition across the Superchain ecosystem.
                            </p>
                            <Link href="/generator">
                                <Button size="lg" variant="default" className="mt-4">
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
