import { AnimatedCounter } from "./AnimatedCounter";

export function SocialProof() {
    return (
        <div className="py-20 space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <AnimatedCounter
                    target={12450}
                    label="SURGEs Created"
                    description="Unique achievements amplified on-chain"
                    suffix="+"
                />
                <AnimatedCounter
                    target={340}
                    label="Active Communities"
                    description="Trusting us with their events"
                    suffix="+"
                />
                <AnimatedCounter
                    target={3}
                    label="Networks Supported"
                    description="Base, Optimism, and more coming"
                />
            </div>

            <div className="text-center space-y-8">
                <h3 className="text-xl font-semibold text-white/40 uppercase tracking-widest">Trusted by Builders</h3>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Placeholder logos using text for now */}
                    <div className="text-2xl font-bold text-white hover:text-blue-400 transition-colors">ETHGlobal</div>
                    <div className="text-2xl font-bold text-white hover:text-blue-500 transition-colors">Base</div>
                    <div className="text-2xl font-bold text-white hover:text-red-500 transition-colors">Optimism</div>
                    <div className="text-2xl font-bold text-white hover:text-purple-500 transition-colors">Polygon</div>
                </div>
            </div>
        </div>
    );
}
