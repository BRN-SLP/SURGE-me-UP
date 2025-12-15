"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { AIParticles } from "@/components/ui/particles/AIParticles";

interface VisualsStepProps {
    formData: any;
    setFormData: (data: any) => void;
    handleGenerateAI: () => void;
    isGenerating: boolean;
    generationProgress: string;
    themes: string[];
}

export function VisualsStep({ formData, setFormData, handleGenerateAI, isGenerating, generationProgress, themes }: VisualsStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Visual Identity</h2>
                <p className="text-white/60">Let our AI craft a unique visual for your identity based on your theme.</p>
            </div>

            <div className="grid gap-6">
                {/* Theme Selector */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Artistic Style</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {themes.map((theme) => (
                            <button
                                key={theme}
                                onClick={() => setFormData({ ...formData, theme })}
                                className={`p-3 rounded-xl border text-sm font-medium transition-all text-left capitalize ${formData.theme === theme
                                    ? "bg-white text-black border-white shadow-lg scale-[1.02]"
                                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {theme}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Visual Keywords (Optional)</label>
                    <Input
                        placeholder="e.g. Cyberpunk, Neon, Mountains, geometric..."
                        value={formData.keywords}
                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        className="bg-black/40 border-white/20 focus:border-white/40 h-12 text-white"
                    />
                </div>

                {/* Generation Area */}
                <div className="mt-4 p-1 rounded-2xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-white/10">
                    <div className="bg-black/40 backdrop-blur-xl rounded-[14px] p-6 text-center space-y-6 min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
                        
                        {/* AI Particles Visualizer */}
                        <AIParticles isActive={isGenerating} color="#A855F7" />
                        
                        {formData.imageUrl ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative w-64 h-64 rounded-xl overflow-hidden shadow-2xl border border-white/20 group"
                            >
                                <Image
                                    src={formData.imageUrl}
                                    alt="Generated Identity"
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => setFormData({ ...formData, imageUrl: '' })} >
                                        <span className="material-symbols-outlined text-sm mr-2">refresh</span> Regenerate
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="w-64 h-64 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center">
                                <ImageIcon className="text-white/20 w-12 h-12" />
                            </div>
                        )}

                        {!formData.imageUrl && (
                            <div className="max-w-xs mx-auto space-y-4 relative z-10">
                                <Button
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold tracking-wide shadow-lg shadow-purple-500/20"
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {generationProgress || "Dreaming..."}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4 fill-current" />
                                            Generate with AI
                                        </>
                                    )}
                                </Button>
                                <p className="text-xs text-white/40">Powered by Stable Diffusion XL</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
