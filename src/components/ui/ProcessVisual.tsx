"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
    {
        title: "1. Mint Achor",
        description: "Create your soulbound identity root. It is non-transferable and acts as your permanent on-chain container.",
        icon: "fingerprint",
        color: "text-lavender-dark",
        borderColor: "border-lavender-dark/30",
        glowColor: "bg-lavender-dark/20",
    },
    {
        title: "2. Link Wallets",
        description: "Connect your hot wallets. They inherit your reputation but not your risk. One identity, multiple keys.",
        icon: "link",
        color: "text-aqua-dark",
        borderColor: "border-aqua-dark/30",
        glowColor: "bg-aqua-dark/20",
    },
    {
        title: "3. Build Reputation",
        description: "Your score grows as you use your linked wallets across the Superchain. All history aggregates to your Anchor.",
        icon: "trending_up",
        color: "text-mint",
        borderColor: "border-mint/30",
        glowColor: "bg-mint/20",
    },
    {
        title: "4. Compromise!",
        description: "Oh no! A phishing link drains your active wallet. Usually, this means 'Game Over' for your history.",
        icon: "warning",
        color: "text-red-500",
        borderColor: "border-red-500/50",
        glowColor: "bg-red-500/20",
        isAlert: true,
    },
    {
        title: "5. Mark Wallet",
        description: "Use your secondary wallet to flag the compromised address. The Anchor effectively 'burns' the link to isolate the threat.",
        icon: "delete_forever",
        color: "text-orange-400",
        borderColor: "border-orange-400/30",
        glowColor: "bg-orange-400/20",
    },
    {
        title: "6. Preserve History",
        description: "Your Identity Anchor remains untouched. The compromised wallet is gone, but the reputation it earned stays with YOU.",
        icon: "shield_lock",
        color: "text-blue-400",
        borderColor: "border-blue-400/30",
        glowColor: "bg-blue-400/20",
    },
    {
        title: "7. Claim Heritage",
        description: "Mint a 'Heritage Badge' verifying your past achievements from the lost wallet, proving you were the owner.",
        icon: "history_edu",
        color: "text-purple-400",
        borderColor: "border-purple-400/30",
        glowColor: "bg-purple-400/20",
    },
    {
        title: "8. Continue",
        description: "Link a fresh wallet as your new Primary. Your score remains intact. You didn't start over. You SURGED.",
        icon: "forward",
        color: "text-white",
        borderColor: "border-white/30",
        glowColor: "bg-white/10",
    },
];

export const ProcessVisual = () => {
    return (
        <div className="relative w-full max-w-4xl mx-auto">
            {/* Animated Connection Line */}
            <div className="absolute left-[31px] md:left-1/2 top-10 bottom-10 w-1 md:-translate-x-1/2 overflow-hidden">
                <div className="w-full h-full bg-white/5 rounded-full"></div>
                <motion.div
                    initial={{ height: "0%" }}
                    whileInView={{ height: "100%" }}
                    transition={{ duration: 4, ease: "easeInOut" }}
                    viewport={{ once: true }}
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-lavender-dark via-aqua-dark via-red-500 via-mint to-white"
                />
            </div>

            <div className="flex flex-col gap-16 relative z-10 py-4">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group"
                    >
                        {/* Left Side Content (Odd Indices) */}
                        <div className={cn(
                            "flex-1 md:text-right order-2 md:order-1",
                            index % 2 === 0 ? "block" : "hidden md:block md:invisible" // Invisible spacer for alignment
                        )}>
                            <h3 className={cn("text-2xl font-bold mb-2", step.isAlert ? "text-red-500" : "text-white")}>{step.title}</h3>
                            <p className="text-text-muted text-lg">{step.description}</p>
                        </div>

                        {/* Center Icon */}
                        <div className="relative order-1 md:order-2 shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                className={cn(
                                    "size-16 rounded-full bg-black/40 flex items-center justify-center z-10 relative backdrop-blur-md border transition-colors duration-500",
                                    step.borderColor
                                )}
                            >
                                <span className={cn("material-symbols-outlined text-[32px] transition-colors", step.color)}>
                                    {step.icon}
                                </span>
                            </motion.div>
                            <div className={cn("absolute inset-0 blur-2xl rounded-full z-0 transition-all duration-500", step.glowColor)}></div>
                        </div>

                        {/* Right Side Content (Even Indices) */}
                        <div className={cn(
                            "flex-1 md:text-left order-2 md:order-3",
                            index % 2 !== 0 ? "block" : "hidden md:block md:invisible" // Invisible spacer for alignment
                        )}>
                            <h3 className={cn("text-2xl font-bold mb-2", step.isAlert ? "text-red-500" : "text-white")}>{step.title}</h3>
                            <p className="text-text-muted text-lg">{step.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
