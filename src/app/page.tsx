"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { ProcessVisual } from "@/components/ui/ProcessVisual";

export default function Home() {
    return (
        <div className="text-text-main font-display antialiased overflow-x-hidden selection:bg-mint-dark selection:text-white min-h-screen flex flex-col">

            <div className="relative z-10 flex flex-col flex-grow">
                <section className="flex-grow flex flex-col justify-center pt-48 pb-32 lg:pt-64 lg:pb-48 relative overflow-hidden">
                    <div className="w-full mx-auto px-14 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                            <div className="flex flex-col gap-8 flex-1 text-center lg:text-left z-10 max-w-2xl relative">
                                <div className="absolute -left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-lavender-dark/20 to-transparent hidden lg:block"></div>
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-mint/20 shadow-sm w-fit mx-auto lg:mx-0 backdrop-blur-sm animate-fade-in-up">
                                        <span className="relative flex h-2.5 w-2.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint"></span>
                                        </span>
                                        <span className="text-xs font-bold text-mint-light uppercase tracking-wider">Live on Superchain</span>
                                    </div>
                                    <h1 className="text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-text-header">
                                        Your On-Chain Identity. <br />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#d8b4fe] to-[#67e8f9] inline-block relative drop-shadow-[0_0_20px_rgba(165,243,252,0.3)]">
                                            Protected. Portable. Permanent.
                                            <svg className="absolute w-full h-4 -bottom-2 left-0 text-aqua/30" preserveAspectRatio="none" viewBox="0 0 100 10">
                                                <path d="M0 5 Q 50 15 100 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
                                            </svg>
                                        </span>
                                    </h1>
                                    <p className="text-xl text-text-muted leading-relaxed max-w-lg mx-auto lg:mx-0 font-light">
                                        Preserve your reputation across wallets and chains. Even if your keys are compromised.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                    <Link href="/identity" className="h-14 px-8 w-full sm:w-auto rounded-full bg-gradient-to-r from-lavender-dark to-aqua-dark hover:brightness-110 text-surface text-base font-bold transition-all hover:-translate-y-1 shadow-lg shadow-aqua/20 flex items-center justify-center gap-2">
                                        Start Your Legacy
                                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                                    </Link>
                                    <Link href="/about" className="h-14 px-8 w-full sm:w-auto rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-text-header text-base font-semibold transition-all flex items-center justify-center hover:-translate-y-1 backdrop-blur-sm">
                                        Read the Legend
                                    </Link>
                                </div>

                            </div>

                            {/* Hero Card Animation */}
                            <ClientOnly>
                                <div className="flex-1 w-full max-w-[500px] lg:max-w-none relative perspective-1000">
                                    <div className="relative w-full max-w-[540px] mx-auto animate-float">
                                        <div className="absolute -top-16 -right-8 size-24 rounded-full bg-gradient-to-br from-mint/10 to-aqua/10 blur-xl animate-pulse-slow"></div>
                                        <div className="absolute top-1/2 -left-12 size-16 rounded-xl bg-surface/40 backdrop-blur border border-white/10 rotate-12 animate-float-delayed z-0"></div>
                                        <div className="relative aspect-[4/3] rounded-3xl shadow-2xl overflow-hidden border border-white/10 bg-slate-800/30 backdrop-blur-md group transition-all duration-500 hover:shadow-lavender/10">
                                            <div className="absolute inset-0 opacity-60 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtf51yQD480bcAbwVM9v26UBbZL3jmdC2LzvgZMGhCFy8dQQm16PlXnXXi2O18hYbKEQPR-BvEzyey0-Q62ulkj9mhKl4UO4YF-cTXgnj1owplqha51GS_NRqP1o6HZ0W23nQSMEQsY9KTys4MobNdX94vGc3xIuBCZzl_L49vZC_vzUXfkupbr3-6LlJcyqJ-focVZBPJ9YI7MQqfZZN6oQrskbIyrhgn8VeQOQCz-QYyAhEf0tiuwqldFw3VLzN5DvkC3_oNhJzB")' }}></div>
                                            <div className="absolute inset-0 bg-gradient-to-b from-surface/80 to-surface"></div>
                                            <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-xl bg-white/5 backdrop-blur-md flex items-center justify-center border border-white/10">
                                                            <span className="material-symbols-outlined text-white text-[24px]">bolt</span>
                                                        </div>
                                                        <span className="text-white font-bold tracking-widest text-sm">SURGE ID</span>
                                                    </div>
                                                    <div className="size-12 rounded-full border border-white/10 relative flex items-center justify-center bg-white/5 backdrop-blur-sm">
                                                        <div className="absolute inset-0 border-t-2 border-mint rounded-full animate-spin"></div>
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-4xl font-mono text-white tracking-widest opacity-90 drop-shadow-md">
                                                            •••• •••• •••• 4291
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <div className="text-xs text-white/50 uppercase tracking-wider mb-1">Holder</div>
                                                            <div className="text-white font-medium font-mono">0x71...39A</div>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                                                            <div className="size-2 rounded-full bg-mint animate-pulse"></div>
                                                            <span className="text-xs font-bold text-white uppercase">Verified</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Shimmer Effect */}
                                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-lavender/20 via-aqua/20 via-mint/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
                                        </div>

                                        {/* Floating Badges */}
                                        <div className="absolute -right-6 top-12 bg-[#0f172a] p-3 pr-5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-float z-20">
                                            <div className="size-10 rounded-full bg-mint/10 flex items-center justify-center text-mint">
                                                <span className="material-symbols-outlined text-[20px]">history</span>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Since</div>
                                                <div className="text-lg font-bold text-text-header">2021</div>
                                            </div>
                                        </div>
                                        <div className="absolute -left-6 bottom-16 bg-[#0f172a] p-3 pr-5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3 animate-float-delayed z-20">
                                            <div className="size-10 rounded-full bg-aqua/10 flex items-center justify-center text-aqua">
                                                <span className="material-symbols-outlined text-[20px]">hub</span>
                                            </div>
                                            <div>
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Networks</div>
                                                <div className="text-lg font-bold text-text-header">All 19</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ClientOnly>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur-sm relative z-10">
                    <div className="w-full mx-auto px-14 py-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-white/5">
                            <div className="flex flex-col items-center text-center gap-2 group cursor-default px-4 hover:scale-105 transition-transform duration-300">
                                <p className="text-text-muted text-sm font-semibold uppercase tracking-wider group-hover:text-mint transition-colors">Users Protected</p>
                                <p className="text-5xl font-extrabold text-white tracking-tight">120k+</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 group cursor-default px-4 pt-8 md:pt-0 hover:scale-105 transition-transform duration-300">
                                <p className="text-text-muted text-sm font-semibold uppercase tracking-wider group-hover:text-aqua transition-colors">History Preserved</p>
                                <p className="text-5xl font-extrabold text-white tracking-tight">3 Years</p>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 group cursor-default px-4 pt-8 md:pt-0 hover:scale-105 transition-transform duration-300">
                                <p className="text-text-muted text-sm font-semibold uppercase tracking-wider group-hover:text-lavender-dark transition-colors">Superchain Networks</p>
                                <p className="text-5xl font-extrabold text-white tracking-tight">19+</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* The Problems We Solve */}
                <section className="py-24 relative overflow-hidden">
                    <div className="w-full mx-auto px-14 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                            <div className="max-w-2xl">
                                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-header mb-4">
                                    Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c084fc] to-[#22d3ee] inline-block">Identity Continuity</span> Matters
                                </h2>
                                <p className="text-lg text-text-muted font-light">
                                    The current "1 Wallet = 1 Person" model is broken. We fixed it.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Feature 1: Identity Continuity */}
                            <div className="bg-[#1e293b]/30 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden group hover:bg-white/[0.03] transition-all duration-500 border border-white/5 hover:border-red-500/30">
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-12 rounded-xl bg-white/5 text-white border border-white/10 flex items-center justify-center shadow-sm group-hover:bg-red-500/10 group-hover:text-red-500 transition-colors duration-500">
                                            <span className="material-symbols-outlined text-[24px]">hourglass_top</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-text-header">Identity Continuity</h3>
                                    </div>
                                    <p className="text-text-muted text-lg leading-relaxed">
                                        Your on-chain history shouldn't die just because a wallet does. We decouple your reputation from your keys.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 2: Multi-Wallet Support */}
                            <div className="bg-[#1e293b]/30 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden group hover:bg-white/[0.03] transition-all duration-500 border border-white/5">
                                <div className="h-full flex flex-col relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-12 rounded-xl bg-white/5 text-white border border-white/10 flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-[24px]">hub</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-text-header">Multi-Wallet Support</h3>
                                    </div>
                                    <p className="text-text-muted text-lg leading-relaxed">
                                        Link as many addresses as you need. Consolidate your reputation from hot wallets, cold storage, and burners into one profile.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 3: Portable Reputation */}
                            <div className="bg-[#1e293b]/30 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden group hover:bg-white/[0.03] transition-all duration-500 border border-white/5">
                                <div className="h-full flex flex-col relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-12 rounded-xl bg-white/5 text-white border border-white/10 flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-[24px]">travel_explore</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-text-header">Portable Reputation</h3>
                                    </div>
                                    <p className="text-text-muted text-lg leading-relaxed">
                                        Your score travels with you across 19+ Superchain networks. Don't start from zero when you bridge to a new chain.
                                    </p>
                                </div>
                            </div>

                            {/* Feature 4: Recovery Built-In */}
                            <div className="bg-[#1e293b]/30 backdrop-blur-md rounded-3xl p-8 relative overflow-hidden group hover:bg-white/[0.03] transition-all duration-500 border border-white/5">
                                <div className="h-full flex flex-col relative z-10">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="size-12 rounded-xl bg-white/5 text-white border border-white/10 flex items-center justify-center shadow-sm">
                                            <span className="material-symbols-outlined text-[24px]">medical_services</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-text-header">Recovery Built-In</h3>
                                    </div>
                                    <p className="text-text-muted text-lg leading-relaxed">
                                        Compromise a wallet? Mark it. Isolate it. Keep going. Your Identity Anchor remains safe even if a linked wallet falls.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Process Section */}
                <section className="py-32 relative bg-transparent">
                    <div className="w-full mx-auto px-6 md:px-14">
                        <div className="text-center mb-20">
                            <span className="text-mint font-bold uppercase tracking-wider text-sm mb-2 block animate-pulse">The Mechanism</span>
                            <h2 className="text-4xl md:text-5xl font-bold text-text-header">How SURGE Works</h2>
                        </div>

                        <ProcessVisual />
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24">
                    <div className="w-full mx-auto px-14">
                        <div className="rounded-[2.5rem] overflow-hidden relative shadow-2xl bg-gradient-to-br from-indigo-950/50 via-slate-900/50 to-cyan-950/50 border border-white/10">
                            <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                            <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-900 rounded-full blur-[100px] opacity-40"></div>
                            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-900 rounded-full blur-[100px] opacity-40"></div>
                            <div className="relative z-10 flex flex-col items-center justify-center p-12 lg:p-20 text-center">
                                <div className="max-w-2xl flex flex-col items-center">
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to Surge?</h2>
                                    <p className="text-slate-300 text-xl mb-10 font-light max-w-lg mx-auto">
                                        Join 120,000+ users who decided their identity belongs to them, not their keys.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                                        <Link href="/identity" className="h-14 px-10 flex items-center justify-center rounded-full bg-gradient-to-r from-lavender-dark to-aqua-dark hover:brightness-110 text-white text-base font-bold transition-all hover:-translate-y-1 shadow-xl shadow-aqua/20 w-full sm:w-auto">
                                            Mint ID Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div >
    );
}
