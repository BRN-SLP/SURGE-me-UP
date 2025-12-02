"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function LiquidGradient() {
    // Mouse position motion values
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for cursor following
    // Damping/stiffness control the "liquid" feel
    const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };

    // Create multiple springs with slightly different configs for parallax/depth effect
    const x1 = useSpring(mouseX, { ...springConfig, damping: 30 });
    const y1 = useSpring(mouseY, { ...springConfig, damping: 30 });

    const x2 = useSpring(mouseX, { ...springConfig, damping: 40, mass: 0.8 });
    const y2 = useSpring(mouseY, { ...springConfig, damping: 40, mass: 0.8 });

    const x3 = useSpring(mouseX, { ...springConfig, damping: 20, mass: 0.4 });
    const y3 = useSpring(mouseY, { ...springConfig, damping: 20, mass: 0.4 });

    // Ensure component only mounts on client to avoid hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);

        // Initialize center position
        if (typeof window !== 'undefined') {
            mouseX.set(window.innerWidth / 2);
            mouseY.set(window.innerHeight / 2);
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-black">
            {/* Liquid Gradient Container */}
            <div className="absolute inset-0 z-0 filter blur-[100px] opacity-50">
                {/* Blob 1: Base Blue - Follows closely */}
                <motion.div
                    className="absolute w-[600px] h-[600px] rounded-full bg-[#0052FF]"
                    style={{
                        x: x1,
                        y: y1,
                        translateX: "-50%",
                        translateY: "-50%",
                        mixBlendMode: "screen"
                    }}
                />

                {/* Blob 2: Optimism Red - Heavier, slower */}
                <motion.div
                    className="absolute w-[500px] h-[500px] rounded-full bg-[#FF0420]"
                    style={{
                        x: x2,
                        y: y2,
                        translateX: "-40%", // Offset slightly
                        translateY: "-40%",
                        mixBlendMode: "screen"
                    }}
                />

                {/* Blob 3: Celo Yellow - Faster, lighter */}
                <motion.div
                    className="absolute w-[400px] h-[400px] rounded-full bg-[#FCFF52]"
                    style={{
                        x: x3,
                        y: y3,
                        translateX: "-60%",
                        translateY: "-60%",
                        mixBlendMode: "screen"
                    }}
                />

                {/* Blob 4: Zora Purple - Static/Ambient anchor */}
                <div
                    className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8A63D2] opacity-20 animate-pulse"
                    style={{ mixBlendMode: "screen" }}
                />
            </div>

            {/* Noise texture overlay for texture */}
            <div className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: 'url("/noise.png")' }}
            />
        </div>
    );
}
