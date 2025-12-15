"use client";

import { useEffect, useRef } from "react";

interface AIParticlesProps {
    isActive: boolean;
    color?: string; // Hex color for particles
}

export function AIParticles({ isActive, color = "#FFFFFF" }: AIParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];

        // Resize canvas
        const resize = () => {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.clientWidth;
                canvas.height = parent.clientHeight;
            }
        };
        resize();
        window.addEventListener("resize", resize);

        // Particle class
        class Particle {
            x: number;
            y: number;
            vx: number;
            vy: number;
            size: number;
            life: number;
            maxLife: number;

            constructor(w: number, h: number) {
                this.x = w / 2;
                this.y = h / 2;
                // Explode outwards
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 2 + 1;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.size = Math.random() * 2 + 1;
                this.life = 0;
                this.maxLife = Math.random() * 50 + 50;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life++;
                this.size *= 0.98; // Shrink
            }

            draw(ctx: CanvasRenderingContext2D) {
                ctx.fillStyle = color;
                ctx.globalAlpha = 1 - this.life / this.maxLife;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Animation Loop
        const animate = () => {
            if (!isActive && particles.length === 0) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spawn new particles if active
            if (isActive) {
                for (let i = 0; i < 2; i++) {
                    particles.push(new Particle(canvas.width, canvas.height));
                }
            }

            // Update and draw existing particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.update();
                p.draw(ctx);

                if (p.life >= p.maxLife || p.size < 0.2) {
                    particles.splice(i, 1);
                }
            }

            // Connect particles (neural network effect)
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 60) {
                        ctx.globalAlpha = (1 - dist / 60) * 0.3;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isActive, color]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none fade-in duration-500"
            style={{ opacity: isActive ? 1 : 0 }}
        />
    );
}
