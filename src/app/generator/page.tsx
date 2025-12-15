"use client";

import { GeneratorForm } from "@/components/generator/GeneratorForm";
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";

const SocialProofCarousel = dynamic(() => import('@/components/ui/SocialProofCarousel').then(mod => mod.SocialProofCarousel), {
    loading: () => <div className="h-48 animate-pulse bg-white/5 rounded-3xl" />
});

const OnboardingModal = dynamic(() => import('@/components/ui/OnboardingModal').then(mod => mod.OnboardingModal), {
    ssr: false
});

export default function GeneratorPage() {
    return (
        <div className="bg-surface text-text-main font-display antialiased overflow-x-hidden min-h-screen flex flex-col relative selection:bg-mint-dark selection:text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-surface"></div>
            </div>

            <div className="relative z-10 container mx-auto px-6 pt-24 pb-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-6 space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-mint backdrop-blur-md animate-fade-in-up">
                            <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-mint"></span>
                            </span>
                            AI Model Ready
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">SURGE Identity</span>
                        </h1>
                        <p className="text-text-muted text-base max-w-xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            Generate unique SURGE artwork using our fine-tuned Pro AI model.
                        </p>
                    </div>

                    <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        {/* Card Header Decoration */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lavender-dark via-aqua to-mint opacity-50" />
                        <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
                            <div className="text-[10px] text-white/40 font-mono tracking-widest uppercase flex items-center gap-2">
                                <span className="material-symbols-outlined text-[12px]">terminal</span>
                                Generator.exe
                            </div>
                            <div className="flex gap-1.5">
                                <div className="size-2 rounded-full bg-white/10"></div>
                                <div className="size-2 rounded-full bg-white/10"></div>
                            </div>
                        </div>
                        <div className="p-0">
                            {/* GeneratorForm handles its own padding now */}
                            <GeneratorForm />
                        </div>
                    </div>

                    <div className="mt-8">
                        <SocialProofCarousel />
                    </div>
                    <OnboardingModal />
                </div>
            </div>
        </div>
    );
}
