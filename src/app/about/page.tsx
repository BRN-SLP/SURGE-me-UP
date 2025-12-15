"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Types
interface RoadmapPhase {
    phase: string;
    title: string;
    description: string;
    color: string;
    textColor: string;
    glow: string;
}

interface ValueItem {
    title: string;
    description: string;
    icon: string;
}

// Data
const roadmapData: RoadmapPhase[] = [
    {
        phase: "Phase 1",
        title: "Foundation",
        description: "Deploy IdentityAnchor & Registry contract on Base. Launch Primary Wallet management.",
        color: "bg-blue-600",
        textColor: "text-white",
        glow: "shadow-[0_0_30px_rgba(37,99,235,0.3)]",
    },
    {
        phase: "Phase 2",
        title: "Expansion",
        description: "Roll out to Optimism, Celo, and Zora. Implement cross-chain identity sync.",
        color: "bg-red-600",
        textColor: "text-white",
        glow: "shadow-[0_0_30px_rgba(220,38,38,0.3)]",
    },
    {
        phase: "Phase 3",
        title: "Ecosystem",
        description: "Deploy to all 19 Superchain networks. Developer SDK for 3rd party integration.",
        color: "bg-yellow-400",
        textColor: "text-black",
        glow: "shadow-[0_0_30px_rgba(250,204,21,0.3)]",
    },
    {
        phase: "Phase 4",
        title: "Maturity",
        description: "Advanced social recovery, reputation-weighted governance, and decentralization.",
        color: "bg-purple-600",
        textColor: "text-white",
        glow: "shadow-[0_0_30px_rgba(147,51,234,0.3)]",
    },
    {
        phase: "Phase 5",
        title: "Sovereignty",
        description: "Full DAO governance activation. Community-owned parameter control and treasury.",
        color: "bg-pink-600",
        textColor: "text-white",
        glow: "shadow-[0_0_30px_rgba(219,39,119,0.3)]",
    },
    {
        phase: "Phase 6",
        title: "Ubiquity",
        description: "Web2 standards integration (OIDC). Login with SURGE everywhere, even off-chain.",
        color: "bg-cyan-500",
        textColor: "text-black",
        glow: "shadow-[0_0_30px_rgba(6,182,212,0.3)]",
    },
];

const coreValues: ValueItem[] = [
    { title: "Protection First", description: "Security shouldn't mean inflexibility. We protect users from both attackers and accidents.", icon: "shield" },
    { title: "Universally Accessible", description: "Identity must work everywhere. No geo-barriers, no wealth gates.", icon: "public" },
    { title: "Open Protocol", description: "Not a platform, but a standard. Any chain can adopt. No lock-in.", icon: "code" },
    { title: "Fair by Design", description: "One person, one score. We refuse to reward wallet count over contribution.", icon: "balance" },
    { title: "User Sovereignty", description: "You control your identity. You decide which wallets to link.", icon: "person_pin" },
    { title: "Community Powered", description: "A public good built for the ecosystem. Owned by the collective, not a corporation.", icon: "groups" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 overflow-x-hidden text-text-main font-display">

            {/* 1. Origin Story Section */}
            <section className="w-full mx-auto px-14 mb-32 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-red-100 tracking-wider uppercase">The Origin Story</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold font-heading tracking-tighter text-white mb-8">
                        When Everything <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Disappeared</span>
                    </h1>

                    <div className="grid md:grid-cols-2 gap-12 text-lg leading-relaxed text-text-muted">
                        <div className="space-y-6">
                            <p>
                                SURGE wasn't born in a boardroom. It started with a single, devastating moment.
                                Despite years of experience and "knowing all the rules," our founder fell victim to a seed phrase compromise.
                            </p>
                            <p className="text-white border-l-2 border-red-500 pl-4 italic">
                                "The blockchain remembered everything. But without that private key, it was as if none of it ever happened."
                            </p>
                            <p>
                                In seconds, years of DeFi activity, DAO voting power, and community badges were gone.
                                From the perspective of every protocol, this experienced contributor became a ghost.
                            </p>
                        </div>
                        <div className="space-y-6">
                            <p>
                                We realized the uncomfortable truth: <strong>If this can happen to us, it's happening to thousands.</strong>
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <span className="material-symbols-outlined text-red-400">cancel</span>
                                    <span>No airdrop eligibility (too "new")</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="material-symbols-outlined text-red-400">cancel</span>
                                    <span>No DAO voting power (zero tokens)</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="material-symbols-outlined text-red-400">cancel</span>
                                    <span>No credit history or reputation</span>
                                </li>
                            </ul>
                            <p className="font-bold text-white mt-4">
                                SURGE is the answer. An identity layer that survives when keys die.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 2. Roadmap */}
            <section className="w-full mb-32 relative">
                <div className="px-14 mb-12">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
                        <span className="w-8 h-[2px] bg-mint"></span>
                        The Road Ahead
                    </h3>
                </div>

                <div className="w-full overflow-x-auto pt-10 pb-12 px-14 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 hover:[&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
                    <div className="flex gap-8 min-w-max">
                        {roadmapData.map((item, index) => (
                            <motion.div
                                key={item.phase}
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="relative w-[420px] h-[300px] p-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md group hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
                            >
                                <div className={cn(
                                    "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10",
                                    item.glow
                                )}></div>

                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider", item.color, item.textColor)}>
                                            {item.phase}
                                        </span>
                                    </div>
                                    <h4 className="text-3xl font-bold text-white mb-4">
                                        {item.title}
                                    </h4>
                                    <p className="text-slate-300 text-lg leading-relaxed font-light">
                                        {item.description}
                                    </p>
                                </div>

                                <div className={cn("h-1 w-1/3 rounded-full opacity-50 group-hover:w-full transition-all duration-500", item.color)}></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Core Values */}
            <section className="w-full mx-auto px-14">
                <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-12 flex items-center gap-3">
                    <span className="w-8 h-[2px] bg-purple-500"></span>
                    Core Values
                </h3>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {coreValues.map((val, i) => (
                        <motion.div
                            key={val.title}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
                            className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm"
                        >
                            <div className="size-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 text-white border border-white/10">
                                <span className="material-symbols-outlined text-[28px]">{val.icon}</span>
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{val.title}</h4>
                            <p className="text-text-muted leading-relaxed">{val.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>
        </div>
    );
}
