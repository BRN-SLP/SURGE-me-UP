"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Circle, Zap, CircleDot, Disc, Layers, Box } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(Draggable);

interface Network {
    id: string;
    name: string;
    color: string;
    icon: React.ReactNode;
}

const networks: Network[] = [
    { id: "base", name: "Base", color: "#0052FF", icon: <Circle className="w-8 h-8" /> },
    { id: "optimism", name: "Optimism", color: "#FF0420", icon: <Zap className="w-8 h-8" /> },
    { id: "celo", name: "Celo", color: "#FCFF52", icon: <CircleDot className="w-8 h-8" /> },
    { id: "zora", name: "Zora", color: "#111111", icon: <Disc className="w-8 h-8" /> },
    { id: "mode", name: "Mode", color: "#DFFE00", icon: <Layers className="w-8 h-8" /> },
];

interface NetworkSelectorProps {
    selectedNetwork: string;
    onSelect: (networkId: string) => void;
}

export function NetworkSelector({ selectedNetwork, onSelect }: NetworkSelectorProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const trayRef = useRef<HTMLDivElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useGSAP(() => {
        const draggables: globalThis.Draggable[] = [];

        networks.forEach((network) => {
            const el = document.getElementById(`network-icon-${network.id}`);
            if (!el) return;

            // Initial state: monochrome if not selected
            if (network.id !== selectedNetwork) {
                gsap.set(el, { filter: "grayscale(100%) opacity(0.6)" });
            } else {
                gsap.set(el, { filter: "grayscale(0%) opacity(1)", scale: 1.2 });
            }

            const d = Draggable.create(el, {
                type: "x,y",
                bounds: containerRef.current,
                inertia: true,
                onDragStart: () => {
                    setIsDragging(true);
                    gsap.to(el, { scale: 1.2, filter: "grayscale(0%) opacity(1)", duration: 0.2 });
                },
                onDragEnd: function () {
                    setIsDragging(false);
                    const dropZone = dropZoneRef.current;
                    if (this.hitTest(dropZone, "50%")) {
                        // Dropped in zone
                        onSelect(network.id);
                        gsap.to(this.target, {
                            x: 0,
                            y: 0,
                            scale: 1.2,
                            duration: 0.3,
                            ease: "back.out(1.7)"
                        });
                    } else {
                        // Return to tray
                        gsap.to(this.target, {
                            x: 0,
                            y: 0,
                            scale: 1,
                            filter: "grayscale(100%) opacity(0.6)",
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    }
                }
            });
            draggables.push(d[0]);
        });

        return () => {
            draggables.forEach(d => d.kill());
        };
    }, { scope: containerRef, dependencies: [selectedNetwork] });

    // Update styles when selection changes externally
    useEffect(() => {
        networks.forEach(n => {
            const el = document.getElementById(`network-icon-${n.id}`);
            if (el) {
                if (n.id === selectedNetwork) {
                    gsap.to(el, { filter: "grayscale(0%) opacity(1)", scale: 1.2, duration: 0.3 });
                } else {
                    gsap.to(el, { filter: "grayscale(100%) opacity(0.6)", scale: 1, duration: 0.3 });
                }
            }
        });
    }, [selectedNetwork]);

    return (
        <div ref={containerRef} className="relative w-full py-8 select-none">
            {/* Tray Area */}
            <div ref={trayRef} className="flex justify-center gap-6 mb-12 min-h-[60px]">
                {networks.map((network) => (
                    <div
                        key={network.id}
                        id={`network-icon-${network.id}`}
                        className={cn(
                            "cursor-grab active:cursor-grabbing p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm transition-colors",
                            "hover:bg-white/10 hover:border-white/20"
                        )}
                        title={network.name}
                    >
                        <div style={{ color: network.color }}>
                            {network.icon}
                        </div>
                    </div>
                ))}
            </div>

            {/* Drop Zone */}
            <div className="flex justify-center">
                <div
                    ref={dropZoneRef}
                    className={cn(
                        "w-full max-w-md h-24 rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center transition-all duration-300",
                        isDragging ? "border-accent/50 bg-accent/[0.05] scale-105" : ""
                    )}
                >
                    <span className="text-white/30 text-sm font-light uppercase tracking-widest">
                        {isDragging ? "Drop to Select" : "Drag Network Here"}
                    </span>
                </div>
            </div>
        </div>
    );
}
