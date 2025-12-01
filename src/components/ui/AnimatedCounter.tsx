"use client";

import { useCountUp } from "@/lib/gsap-hooks";

interface AnimatedCounterProps {
    target: number;
    duration?: number;
    suffix?: string;
    prefix?: string;
    label: string;
    description?: string;
}

export function AnimatedCounter({
    target,
    duration = 2,
    suffix = "",
    prefix = "",
    label,
    description
}: AnimatedCounterProps) {
    const counterRef = useCountUp(target, duration, suffix);

    return (
        <div className="flex flex-col items-center justify-center p-8 minimal-card rounded-xl border border-white/[0.08] hover:border-white/[0.12] transition-all duration-300">
            <div className="text-5xl md:text-6xl font-light font-heading mb-3 text-white">
                {prefix}<span ref={counterRef}>0{suffix}</span>
            </div>
            <div className="text-lg font-normal text-white mb-2">{label}</div>
            {description && (
                <div className="text-sm text-neutral-400 text-center max-w-xs font-light">{description}</div>
            )}
        </div>
    );
}
