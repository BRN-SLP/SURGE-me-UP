"use client";

import { GeneratorForm } from "@/components/generator/GeneratorForm";
import dynamic from 'next/dynamic';
import { Card } from "@/components/ui/card";

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
                    <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight text-white">
                        Create Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-optimism to-optimism-neon">Legacy</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Generate unique SURGE artwork using our fine-tuned Pro AI model.
                    </p>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-base via-optimism to-celo opacity-50" />
                    <div className="h-10 bg-white/5 border-b border-white/5 flex items-center px-4 justify-between">
                        <div className="text-xs text-white/40 font-mono tracking-widest uppercase">
                            // Generator.exe
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white/10"></div>
                            <div className="w-2 h-2 rounded-full bg-white/10"></div>
                        </div>
                    </div>
                    <div className="p-6 md:p-8">
                        <GeneratorForm />
                    </div>
                </Card>

                <SocialProof />
                <OnboardingModal />
            </div>
        </div>
    );
}
