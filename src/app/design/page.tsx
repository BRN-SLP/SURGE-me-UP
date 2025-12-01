"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BrandHighlighter } from "@/components/ui/BrandHighlighter";
import { ArrowRight, Sparkles, Zap, Layers, Coins } from "lucide-react";

export default function DesignSystem() {
    return (
        <div className="min-h-screen bg-black text-white p-10 space-y-20">
            <header className="space-y-4">
                <h1 className="text-5xl font-heading font-bold">Design System</h1>
                <p className="text-xl text-white/60">Superchain Identity & Components</p>
            </header>

            {/* Colors */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold border-b border-white/10 pb-4">Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <div className="h-24 rounded-xl bg-base w-full shadow-[0_0_20px_rgba(0,82,255,0.3)]"></div>
                        <p className="font-mono text-sm">Base Blue <br /><span className="text-white/50">#0052FF</span></p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 rounded-xl bg-optimism w-full shadow-[0_0_20px_rgba(255,4,32,0.3)]"></div>
                        <p className="font-mono text-sm">Optimism Red <br /><span className="text-white/50">#FF0420</span></p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 rounded-xl bg-celo w-full shadow-[0_0_20px_rgba(252,255,82,0.3)]"></div>
                        <p className="font-mono text-sm">Celo Gold <br /><span className="text-white/50">#FCFF52</span></p>
                    </div>
                    <div className="space-y-2">
                        <div className="h-24 rounded-xl bg-black border border-white/10 w-full"></div>
                        <p className="font-mono text-sm">Background <br /><span className="text-white/50">#000000</span></p>
                    </div>
                </div>
            </section>

            {/* Typography */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold border-b border-white/10 pb-4">Typography</h2>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-7xl font-heading font-bold">Heading 1</h1>
                        <p className="font-mono text-sm text-white/50">text-7xl font-heading font-bold</p>
                    </div>
                    <div>
                        <h2 className="text-5xl font-heading font-bold">Heading 2</h2>
                        <p className="font-mono text-sm text-white/50">text-5xl font-heading font-bold</p>
                    </div>
                    <div>
                        <h3 className="text-3xl font-heading font-bold">Heading 3</h3>
                        <p className="font-mono text-sm text-white/50">text-3xl font-heading font-bold</p>
                    </div>
                    <div>
                        <p className="text-xl leading-relaxed text-white/80 max-w-2xl">
                            Body Large. Generate and mint exclusive SURGEs on the Superchain. Support for Base, Optimism, and Celo.
                        </p>
                        <p className="font-mono text-sm text-white/50 mt-2">text-xl leading-relaxed text-white/80</p>
                    </div>
                    <div>
                        <p className="text-base leading-relaxed text-white/60 max-w-2xl">
                            Body Default. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                        </p>
                        <p className="font-mono text-sm text-white/50 mt-2">text-base leading-relaxed text-white/60</p>
                    </div>
                </div>
            </section>

            {/* Buttons */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold border-b border-white/10 pb-4">Buttons</h2>
                <div className="flex flex-wrap gap-6 items-center">
                    <Button size="lg" className="bg-base hover:bg-base-neon text-white btn-glow-base rounded-full">
                        Primary Base
                    </Button>
                    <Button size="lg" className="bg-optimism hover:bg-optimism-neon text-white btn-glow-optimism rounded-full">
                        Primary Optimism
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                        Secondary Outline
                    </Button>
                    <Button variant="ghost" size="lg" className="hover:bg-white/10">
                        Ghost Button
                    </Button>
                    <Button size="icon" className="rounded-full bg-white/10 hover:bg-white/20">
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </div>
            </section>

            {/* Cards */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold border-b border-white/10 pb-4">Cards & Panels</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-base" />
                                Glass Panel
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/60">Standard glassmorphism card used for content containers.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-base/20 to-transparent border-base/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-base" />
                                Base Card
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/60">Card variant with Base branding accents.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-optimism/20 to-transparent border-optimism/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5 text-optimism" />
                                Optimism Card
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/60">Card variant with Optimism branding accents.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Inputs */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold border-b border-white/10 pb-4">Inputs</h2>
                <div className="max-w-md space-y-4">
                    <Input
                        placeholder="Default Input"
                        className="bg-black/40 border-white/20 focus:border-white/40 h-12 text-white"
                    />
                    <Input
                        placeholder="Input with Value"
                        defaultValue="Superchain Summit 2024"
                        className="bg-black/40 border-white/20 focus:border-white/40 h-12 text-white"
                    />
                </div>
            </section>

            {/* Brand Highlighter */}
            <section className="space-y-8">
                <h2 className="text-3xl font-bold border-b border-white/10 pb-4">Brand Highlighter</h2>
                <div className="text-2xl font-light">
                    <BrandHighlighter text="This is a Base highlight." /> <br />
                    <BrandHighlighter text="This is an Optimism highlight." /> <br />
                    <BrandHighlighter text="This is a Celo highlight." /> <br />
                    <BrandHighlighter text="This is a Superchain highlight." />
                </div>
            </section>
        </div>
    );
}
