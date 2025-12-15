"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { SurgeButton } from "@/components/ui/SurgeButton";

export default function DesignSystem() {
    return (
        <div className="min-h-screen bg-surface text-text-main p-10 font-sans">
            <div className="max-w-[1280px] mx-auto space-y-16">

                {/* Header */}
                <div className="space-y-4 border-b border-white/10 pb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-mint">
                        V 2.0.0
                    </div>
                    <h1 className="text-5xl font-bold text-text-header tracking-tight">SURGE Design System</h1>
                    <p className="text-text-muted text-xl max-w-2xl">
                        A comprehensive guide to the visual language of the SURGE me UP platform.
                        Defined by "Elegant Futurism", depth, and motion.
                    </p>
                </div>

                {/* Colors */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-bold text-text-header border-l-4 border-lavender pl-4">Color Palette</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Surface Colors */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white/80">Surface</h3>
                            <div className="space-y-2">
                                <div className="bg-surface h-24 rounded-xl border border-white/10 flex items-end p-4 shadow-lg">
                                    <span className="font-mono text-xs text-white/50">bg-surface / #0f172a</span>
                                </div>
                            </div>
                        </div>

                        {/* Primary Gradients */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white/80">Brand Logic</h3>
                            <div className="space-y-2">
                                <div className="bg-gradient-to-br from-lavender-dark to-aqua-dark h-24 rounded-xl flex items-end p-4 shadow-lg">
                                    <span className="font-mono text-xs text-white mix-blend-overlay font-bold">Primary Gradient</span>
                                </div>
                                <div className="bg-gradient-to-r from-mint-dark to-mint h-24 rounded-xl flex items-end p-4 shadow-lg">
                                    <span className="font-mono text-xs text-white mix-blend-overlay font-bold">Success / Mint</span>
                                </div>
                            </div>
                        </div>

                        {/* Accents */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white/80">Accents</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-lavender h-20 rounded-lg flex items-end p-3"><span className="text-[10px] text-surface font-bold">Lavender</span></div>
                                <div className="bg-aqua h-20 rounded-lg flex items-end p-3"><span className="text-[10px] text-surface font-bold">Aqua</span></div>
                                <div className="bg-mint h-20 rounded-lg flex items-end p-3"><span className="text-[10px] text-surface font-bold">Mint</span></div>
                                <div className="bg-lavender-light h-20 rounded-lg flex items-end p-3"><span className="text-[10px] text-surface font-bold">Lav-Light</span></div>
                            </div>
                        </div>

                        {/* Text Colors */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white/80">Typography Colors</h3>
                            <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/5">
                                <p className="text-text-header text-2xl font-bold">Text Header</p>
                                <p className="text-text-main text-xl">Text Main Body</p>
                                <p className="text-text-muted">Text Muted Description</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Typography */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-bold text-text-header border-l-4 border-aqua pl-4">Typography</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-6">
                            <div className="pb-4 border-b border-white/5">
                                <span className="text-xs font-mono text-mint mb-2 block">Font Family: Space Grotesk</span>
                                <h1 className="text-6xl font-bold text-white tracking-tight">Display Heading</h1>
                            </div>
                            <div>
                                <h1 className="text-5xl font-bold text-white mb-4">Heading 1</h1>
                                <h2 className="text-4xl font-bold text-white mb-4">Heading 2</h2>
                                <h3 className="text-3xl font-bold text-white mb-4">Heading 3</h3>
                                <h4 className="text-2xl font-bold text-white mb-4">Heading 4</h4>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="pb-4 border-b border-white/5">
                                <span className="text-xs font-mono text-mint mb-2 block">Font Family: Noto Sans</span>
                                <p className="text-xl text-text-main">Body Text Large</p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-base text-text-main leading-relaxed">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                <p className="text-sm text-text-muted leading-relaxed">
                                    <span className="text-white font-medium">Small Muted:</span> Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                    Excepteur sint occaecat cupidatat non proident.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Components */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-bold text-text-header border-l-4 border-mint pl-4">Core Components</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* Buttons */}
                        <div className="space-y-6 p-8 rounded-3xl bg-white/5 border border-white/5">
                            <h3 className="text-xl font-bold text-white mb-4">Standard Buttons</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                {/* Using imported SurgeButton (Need to import it at top) */}
                                <div className="flex flex-col gap-4">
                                    <span className="text-xs text-muted-foreground uppercase">Stroke (Default)</span>
                                    <SurgeButton>Explore SVG</SurgeButton>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="text-xs text-muted-foreground uppercase">Neon (Primary)</span>
                                    <SurgeButton variant="neon">Connect Wallet</SurgeButton>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <span className="text-xs text-muted-foreground uppercase">Glass (Secondary)</span>
                                    <SurgeButton variant="glass">Learn More</SurgeButton>
                                </div>
                            </div>
                        </div>

                        {/* Cards */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-white mb-4">Cards / Surfaces</h3>
                            <div className="relative p-8 rounded-3xl bg-slate-900/50 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <span className="material-symbols-outlined text-[100px] text-white">bolt</span>
                                </div>
                                <div className="relative z-10">
                                    <div className="size-12 rounded-xl bg-gradient-to-br from-lavender to-aqua mb-6 flex items-center justify-center text-surface shadow-lg">
                                        <span className="material-symbols-outlined">star</span>
                                    </div>
                                    <h4 className="text-2xl font-bold text-white mb-2">Glass Card</h4>
                                    <p className="text-text-muted">A distinct card style with heavy backdrop blur, subtle ordering, and gradient accents.</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Elements */}
                        <div className="space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5 md:col-span-2">
                            <h3 className="text-xl font-bold text-white mb-4">Inputs & Form</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted ml-1">Label Name</label>
                                    <input type="text" placeholder="Enter your username..." className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/20 focus:outline-none focus:border-lavender/50 focus:ring-1 focus:ring-lavender/50 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-muted ml-1">Select Option</label>
                                    <div className="relative">
                                        <select className="w-full h-12 bg-black/20 border border-white/10 rounded-xl px-4 text-white appearance-none focus:outline-none focus:border-aqua/50 transition-all">
                                            <option>Option 1</option>
                                            <option>Option 2</option>
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">expand_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Animations */}
                <section className="space-y-8">
                    <h2 className="text-3xl font-bold text-text-header border-l-4 border-white pl-4">Animations</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-col gap-4">
                            <div className="size-16 bg-lavender rounded-xl animate-float"></div>
                            <span className="text-xs font-mono text-text-muted">animate-float</span>
                        </div>
                        <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-col gap-4">
                            <div className="size-16 bg-aqua rounded-full animate-pulse-slow"></div>
                            <span className="text-xs font-mono text-text-muted">animate-pulse-slow</span>
                        </div>
                        <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-col gap-4">
                            <div className="size-16 bg-mint rounded-lg animate-spin" style={{ animationDuration: '3s' }}></div>
                            <span className="text-xs font-mono text-text-muted">spin</span>
                        </div>
                        <div className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-col gap-4 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <span className="text-xl font-bold text-white">Hover me</span>
                            <span className="text-xs font-mono text-text-muted">shimmer</span>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
