"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CursorGradient() {
    const canvasRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        let rafId: number;

        // Brand colors from Superchain networks
        const colors = [
            { color: "rgb(0, 82, 255)", name: "base" },        // Base blue
            { color: "rgb(255, 0, 0)", name: "optimism" },     // Optimism red
            { color: "rgb(252, 204, 22)", name: "celo" },      // Celo yellow/gold
            { color: "rgb(138, 99, 210)", name: "zora" },      // Zora purple
        ];

        //Track mouse position
        const handleMouseMove = (e: MouseEvent) => {
            targetRef.current.x = e.clientX;
            targetRef.current.y = e.clientY;
        };

        // Animate cursor position with GSAP quickTo for performance
        const animatePosition = () => {
            // Smooth lerp to target
            cursorRef.current.x += (targetRef.current.x - cursorRef.current.x) * 0.1;
            cursorRef.current.y += (targetRef.current.y - cursorRef.current.y) * 0.1;

            // Update gradient positions
            const gradients = canvas.querySelectorAll('.gradient-blob') as NodeListOf<HTMLDivElement>;
            gradients.forEach((blob, index) => {
                const speed = 0.8 + (index * 0.2); // Different speeds for depth
                const offsetX = cursorRef.current.x * speed;
                const offsetY = cursorRef.current.y * speed;

                gsap.set(blob, {
                    x: offsetX - window.innerWidth / 2,
                    y: offsetY - window.innerHeight / 2,
                });
            });

            rafId = requestAnimationFrame(animatePosition);
        };

        // Start animation loop
        window.addEventListener("mousemove", handleMouseMove);
        animatePosition();

        // Cleanup
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    // Respect user's reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        if (mediaQuery.matches && canvasRef.current) {
            canvasRef.current.style.display = "none";
        }
    }, []);

    return (
        <div
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
        >
            {/* Multiple gradient blobs for depth */}
            <div className="gradient-blob absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 bg-gradient-radial from-base/40 via-base/20 to-transparent" />
            <div className="gradient-blob absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-25 bg-gradient-radial from-optimism/30 via-optimism/15 to-transparent" style={{ mixBlendMode: 'screen' }} />
            <div className="gradient-blob absolute w-[700px] h-[700px] rounded-full blur-[110px] opacity-20 bg-gradient-radial from-celo/35 via-celo/18 to-transparent" />
            <div className="gradient-blob absolute w-[500px] h-[500px] rounded-full blur-[90px] opacity-30 bg-gradient-radial from-zora/25 via-zora/12 to-transparent" style={{ mixBlendMode: 'screen' }} />

            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-black/90" />
        </div>
    );
}
