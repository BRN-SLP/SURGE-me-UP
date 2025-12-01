"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFadeIn, useStagger } from "@/lib/gsap-hooks";
import { useRef } from "react";

export default function AboutPage() {
    const headerRef = useFadeIn(0);
    const contentRef = useStagger(0.2, 0.1);

    return (
        <div className="container py-32 px-4 md:px-6 max-w-5xl mx-auto relative">
            {/* Background Glow */}
            <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-optimism/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-celo/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div ref={headerRef} className="flex flex-col items-center text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight text-white">
                    About SURGE me UP
                </h1>
                <p className="text-xl text-white/60 max-w-2xl font-light">
                    Building the future of on-chain recognition on the Superchain.
                </p>
            </div>

            <div ref={contentRef} className="grid gap-8">
                <Card className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-heading text-white">Our Mission</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-white/70 leading-relaxed">
                            SURGE me UP is designed to simplify the creation and distribution of recognition tokens across the Superchain ecosystem. By leveraging the power of <span className="text-base-neon font-medium">Base</span>, <span className="text-optimism-neon font-medium">Optimism</span>, and <span className="text-celo-neon font-medium">Celo</span>, we provide a unified platform for communities to celebrate achievements without the friction of high fees or complex bridging.
                        </p>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-heading text-white">Roadmap</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-12 relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-base via-optimism to-celo opacity-30" />

                        <div className="flex gap-6 relative group">
                            <div className="flex flex-col items-center z-10">
                                <div className="w-10 h-10 rounded-full bg-base/20 border border-base flex items-center justify-center shadow-[0_0_15px_rgba(0,82,255,0.3)] group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-3 h-3 rounded-full bg-base" />
                                </div>
                            </div>
                            <div className="pb-4 pt-1">
                                <h3 className="font-bold text-xl text-white mb-2">Phase 1: Launch</h3>
                                <p className="text-white/60">
                                    Initial release with AI-powered generator, support for Base, Optimism, and Celo, and basic minting functionality.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 relative group">
                            <div className="flex flex-col items-center z-10">
                                <div className="w-10 h-10 rounded-full bg-optimism/20 border border-optimism flex items-center justify-center shadow-[0_0_15px_rgba(255,4,32,0.3)] group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-3 h-3 rounded-full bg-optimism" />
                                </div>
                            </div>
                            <div className="pb-4 pt-1">
                                <h3 className="font-bold text-xl text-white mb-2">Phase 2: Advanced Features</h3>
                                <p className="text-white/60">
                                    Integration with more Superchain networks (Zora, Mode, Fraxtal), batch minting, and advanced analytics for event organizers.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 relative group">
                            <div className="flex flex-col items-center z-10">
                                <div className="w-10 h-10 rounded-full bg-celo/20 border border-celo flex items-center justify-center shadow-[0_0_15px_rgba(252,255,82,0.3)] group-hover:scale-110 transition-transform duration-300">
                                    <div className="w-3 h-3 rounded-full bg-celo" />
                                </div>
                            </div>
                            <div className="pt-1">
                                <h3 className="font-bold text-xl text-white mb-2">Phase 3: Ecosystem Growth</h3>
                                <p className="text-white/60">
                                    API for third-party integrations, mobile app, and decentralized governance.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                    <Card className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-heading text-white">Technology Stack</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-white/70">
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-base" /> Next.js 14 & React
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-optimism" /> TailwindCSS & GSAP
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-celo" /> Wagmi & Viem
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-white" /> Hugging Face AI
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="text-2xl font-heading text-white">Join the Community</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/70 mb-6">
                                Be part of the Superchain revolution. Follow us for updates and community events.
                            </p>
                            <div className="flex gap-4">
                                <a href="#" className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                                    Twitter
                                </a>
                                <a href="#" className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                                    Discord
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

