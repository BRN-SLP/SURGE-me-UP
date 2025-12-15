"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
}

const NetworkBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = 0;
        let height = 0;

        // Configuration
        const particleCount = 80;
        const connectionDistance = 150;
        const mouseDistance = 200;
        const particleSpeed = 0.8; // Doubled speed

        // Colors - purple/lavender particles, cyan/aqua lines
        const colors = {
            particle: "167, 139, 250", // Lavender
            line: "94, 234, 212", // Aqua
        };

        const particles: Particle[] = [];

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * particleSpeed,
                vy: (Math.random() - 0.5) * particleSpeed,
                size: Math.random() * 2 + 1,
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            particles.forEach((p, i) => {
                // Move particle
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Mouse interaction - use ref directly for real-time updates
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    const force = (mouseDistance - distance) / mouseDistance;
                    p.vx += (dx / distance) * force * 0.05;
                    p.vy += (dy / distance) * force * 0.05;

                    // Draw line to mouse
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${colors.line}, ${force * 0.7})`;
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = `rgba(${colors.line}, 0.5)`;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                }

                // Speed cap
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                if (speed > 4) { // Increased cap for faster movement
                    p.vx = (p.vx / speed) * 4;
                    p.vy = (p.vy / speed) * 4;
                }

                // Draw particle with glow
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${colors.particle}, 0.65)`;
                ctx.shadowBlur = 10;
                ctx.shadowColor = `rgba(${colors.particle}, 0.6)`;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const opacity = 1 - distance / connectionDistance;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(${colors.line}, ${opacity * 0.4})`;
                        ctx.lineWidth = 1.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <canvas
                ref={canvasRef}
                className="w-full h-full opacity-100"
                style={{ display: 'block' }}
            />
        </div>
    );
};

export default NetworkBackground;
