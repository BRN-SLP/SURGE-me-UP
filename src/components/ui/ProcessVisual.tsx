"use client";

import { motion } from "framer-motion";

export const ProcessVisual = () => {
    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Animated Connection Line */}
            <div className="absolute left-[31px] md:left-1/2 top-0 bottom-0 w-1 md:-translate-x-1/2 overflow-hidden h-full">
                <div className="w-full h-full bg-white/5 rounded-full"></div>
                <motion.div
                    initial={{ height: "0%" }}
                    whileInView={{ height: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-lavender-dark via-aqua-dark to-mint"
                />
            </div>

            <div className="flex flex-col gap-24 relative z-10 py-12">
                {/* Step 1 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center gap-8 md:gap-16"
                >
                    <div className="flex-1 md:text-right order-2 md:order-1">
                        <h3 className="text-2xl font-bold text-white mb-2">1. Mint Anchor</h3>
                        <p className="text-text-muted text-lg">Create your soulbound identity root. It can never be transferred, lost, or stolen.</p>
                    </div>
                    <div className="relative order-1 md:order-2 shrink-0">
                        {/* FLAT DESIGN: Single layer, thin border, no shadow */}
                        <div className="size-16 rounded-full bg-black/40 border border-lavender-dark/30 flex items-center justify-center z-10 relative backdrop-blur-md">
                            <span className="material-symbols-outlined text-lavender-dark text-[32px]">fingerprint</span>
                        </div>
                        {/* Keeps the glow but subtler */}
                        <div className="absolute inset-0 bg-lavender-dark/20 blur-2xl rounded-full z-0"></div>
                    </div>
                    <div className="flex-1 order-3 hidden md:block" />
                </motion.div>

                {/* Step 2 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row items-center gap-8 md:gap-16"
                >
                    <div className="flex-1 hidden md:block order-1" />
                    <div className="relative order-1 md:order-2 shrink-0">
                        <div className="size-16 rounded-full bg-black/40 border border-aqua-dark/30 flex items-center justify-center z-10 relative backdrop-blur-md">
                            <span className="material-symbols-outlined text-aqua-dark text-[32px]">link</span>
                        </div>
                        <div className="absolute inset-0 bg-aqua-dark/20 blur-2xl rounded-full z-0"></div>
                    </div>
                    <div className="flex-1 order-3">
                        <h3 className="text-2xl font-bold text-white mb-2">2. Link Wallets</h3>
                        <p className="text-text-muted text-lg">Connect your hot wallets. They inherit your reputation but not your risk.</p>
                    </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col md:flex-row items-center gap-8 md:gap-16"
                >
                    <div className="flex-1 md:text-right order-2 md:order-1">
                        <h3 className="text-2xl font-bold text-white mb-2">3. Recover History</h3>
                        <p className="text-text-muted text-lg">Lost a key? Burn the link. Your reputation stays effective on your Anchor.</p>
                    </div>
                    <div className="relative order-1 md:order-2 shrink-0">
                        <div className="size-16 rounded-full bg-black/40 border border-mint/30 flex items-center justify-center z-10 relative backdrop-blur-md">
                            <span className="material-symbols-outlined text-mint text-[32px]">shield_lock</span>
                        </div>
                        <div className="absolute inset-0 bg-mint/20 blur-2xl rounded-full z-0"></div>
                    </div>
                    <div className="flex-1 order-3 hidden md:block" />
                </motion.div>
            </div>
        </div>
    );
};
