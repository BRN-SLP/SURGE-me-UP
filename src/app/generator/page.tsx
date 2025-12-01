"use client";

import { GeneratorForm } from "@/components/generator/GeneratorForm";
import dynamic from 'next/dynamic';

const SocialProof = dynamic(() => import('@/components/ui/SocialProof').then(mod => mod.SocialProof), {
    loading: () => <div className="h-96 animate-pulse bg-white/5 rounded-3xl" />
});

const OnboardingModal = dynamic(() => import('@/components/ui/OnboardingModal').then(mod => mod.OnboardingModal), {
    ssr: false // No need to SSR the modal as it's client-side only interaction
});

export default function GeneratorPage() {
    return (
        <div className="container mx-auto px-4 py-32 relative z-10">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        AI Model Ready
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight">
                        Create Your <span className="text-gradient-optimism">Legacy</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Generate unique SURGE artwork using our fine-tuned Pro AI model.
                    </p>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-base via-optimism to-celo rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition duration-1000"></div>
                    <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Terminal Header */}
                        <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                            <div className="ml-4 text-xs text-white/30 font-mono">generator.exe</div>
                        </div>
                        <div className="p-6 md:p-8">
                            <GeneratorForm />
                        </div>
                    </div>
                </div>

                <SocialProof />
                <OnboardingModal />
            </div>
        </div>
    );
}
