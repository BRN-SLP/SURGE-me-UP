"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface ReviewStepProps {
    formData: any;
    handleCreateEvent: () => void;
    isCreatingEvent: boolean;
    isConfirmingEvent: boolean;
}

export function ReviewStep({ formData, handleCreateEvent, isCreatingEvent, isConfirmingEvent }: ReviewStepProps) {
    const isLoading = isCreatingEvent || isConfirmingEvent;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold text-white">Ready to Surge?</h2>
                <p className="text-white/60">Review your identity details before minting on-chain.</p>
            </div>

            <div className="relative max-w-sm mx-auto perspective-1000">
                {/* Card Preview */}
                <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl backdrop-blur-xl group hover:scale-[1.02] transition-transform duration-500">

                    {/* Image Area */}
                    <div className="relative aspect-square w-full bg-black/50">
                        {formData.imageUrl && (
                            <Image
                                src={formData.imageUrl}
                                alt={formData.title}
                                fill
                                className="object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>

                        {/* Overlay Text */}
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-widest uppercase text-white mb-2">
                                {formData.network}
                            </div>
                            <h3 className="text-2xl font-bold text-white leading-tight mb-1">{formData.title}</h3>
                            <p className="text-sm text-white/70 line-clamp-2">{formData.description}</p>
                        </div>
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-6 grid grid-cols-2 gap-4 border-t border-white/10 bg-black/20">
                        <div>
                            <div className="text-[10px] uppercase tracking-wider text-white/40">Supply</div>
                            <div className="text-white font-mono font-medium">{formData.maxSupply}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] uppercase tracking-wider text-white/40">Mode</div>
                            <div className="text-white font-mono font-medium">{formData.distributionMode === 0 ? "Public" : "Whitelist"}</div>
                        </div>
                    </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-b from-purple-500/20 to-cyan-500/20 blur-2xl -z-10 rounded-[3rem]"></div>
            </div>

            <div className="flex justify-center pt-4">
                <Button
                    onClick={handleCreateEvent}
                    disabled={isLoading}
                    className="h-16 px-12 rounded-full text-lg font-bold tracking-wide bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(34,211,238,0.6)] hover:scale-105 transition-all duration-300 group"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                            Minting Identity...
                        </>
                    ) : (
                        <>
                            Mint Identity <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </Button>
            </div>
            <p className="text-center text-xs text-white/30">Gas fees apply. Contract verification included.</p>
        </motion.div>
    );
}
