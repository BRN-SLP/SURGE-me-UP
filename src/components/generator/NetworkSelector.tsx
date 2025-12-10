"use client";

import React, { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import Image from "next/image";
import { cn } from "@/lib/utils";

gsap.registerPlugin(Draggable);

interface Network {
    id: string;
    name: string;
    color: string;
    logo: string;
}

// All 8 Superchain networks with SVG logos
const networks: Network[] = [
    { id: "base", name: "Base", color: "#0052FF", logo: "/assets/chain-logos/base.svg" },
    { id: "optimism", name: "Optimism", color: "#FF0420", logo: "/assets/chain-logos/optimism.svg" },
    { id: "zora", name: "Zora", color: "#5E3FBE", logo: "/assets/chain-logos/zora.svg" },
    { id: "celo", name: "Celo", color: "#35D07F", logo: "/assets/chain-logos/celo.svg" },
    { id: "ink", name: "Ink", color: "#7C3AED", logo: "/assets/chain-logos/ink.svg" },
    { id: "lisk", name: "Lisk", color: "#0ABBED", logo: "/assets/chain-logos/lisk.svg" },
    { id: "unichain", name: "Unichain", color: "#FF007A", logo: "/assets/chain-logos/unichain.svg" },
    { id: "soneium", name: "Soneium", color: "#8B5CF6", logo: "/assets/chain-logos/soneium.svg" },
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
    const [draggedNetwork, setDraggedNetwork] = useState<string | null>(null);

    const selectedNetworkData = networks.find(n => n.id === selectedNetwork) || networks[0];

    useGSAP(() => {
        const draggables: globalThis.Draggable[] = [];

        networks.forEach((network) => {
            const el = document.getElementById(`network-icon-${network.id}`);
            if (!el) return;

            // Initial state: ALL icons monochrome (including selected)
            gsap.set(el, { filter: "grayscale(100%) brightness(0.7)", scale: 1 });

            const d = Draggable.create(el, {
                type: "x,y",
                bounds: containerRef.current,
                inertia: true,
                onDragStart: () => {
                    setIsDragging(true);
                    setDraggedNetwork(network.id);
                    // Show color when dragging
                    gsap.to(el, { scale: 1.2, filter: "grayscale(0%) brightness(1)", duration: 0.2 });
                    // Pulse the drop zone with this network's color
                    gsap.to(dropZoneRef.current, {
                        boxShadow: `0 0 40px ${network.color}60`,
                        borderColor: network.color,
                        duration: 0.3
                    });
                },
                onDrag: function () {
                    // Check proximity to drop zone for visual feedback
                    if (this.hitTest(dropZoneRef.current, "20%")) {
                        gsap.to(dropZoneRef.current, {
                            scale: 1.05,
                            boxShadow: `0 0 60px ${network.color}80`,
                            duration: 0.2
                        });
                    } else {
                        gsap.to(dropZoneRef.current, {
                            scale: 1,
                            boxShadow: `0 0 40px ${network.color}40`,
                            duration: 0.2
                        });
                    }
                },
                onDragEnd: function () {
                    setIsDragging(false);
                    setDraggedNetwork(null);
                    const dropZone = dropZoneRef.current;

                    // Reset drop zone styling
                    gsap.to(dropZone, {
                        scale: 1,
                        boxShadow: "none",
                        borderColor: "rgba(255,255,255,0.1)",
                        duration: 0.3
                    });

                    if (this.hitTest(dropZone, "50%")) {
                        // Dropped in zone - select this network
                        onSelect(network.id);
                    }

                    // Always return icon to tray in monochrome state
                    gsap.to(this.target, {
                        x: 0,
                        y: 0,
                        scale: 1,
                        filter: "grayscale(100%) brightness(0.7)",
                        duration: 0.5,
                        ease: "back.out(1.7)"
                    });
                }
            });
            draggables.push(d[0]);
        });

        return () => {
            draggables.forEach(d => d.kill());
        };
    }, { scope: containerRef, dependencies: [selectedNetwork] });

    // Ensure all icons stay monochrome (no selected state highlighting in tray)
    useEffect(() => {
        networks.forEach(n => {
            const el = document.getElementById(`network-icon-${n.id}`);
            if (el) {
                gsap.to(el, { filter: "grayscale(100%) brightness(0.7)", scale: 1, duration: 0.3 });
            }
        });
    }, [selectedNetwork]);

    return (
        <div ref={containerRef} className="relative w-full py-8 select-none">
            {/* Tray Area - Chain icons row */}
            <div ref={trayRef} className="flex flex-wrap justify-center gap-3 mb-8 min-h-[48px]">
                {networks.map((network) => (
                    <div
                        key={network.id}
                        id={`network-icon-${network.id}`}
                        className={cn(
                            "cursor-grab active:cursor-grabbing p-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-300",
                            "hover:bg-white/10 hover:border-white/20"
                        )}
                        title={`Drag ${network.name} to select`}
                        onMouseEnter={() => {
                            const el = document.getElementById(`network-icon-${network.id}`);
                            if (el) {
                                // Hover: show color and slight zoom
                                gsap.to(el, { filter: "grayscale(0%) brightness(1)", scale: 1.1, duration: 0.2 });
                            }
                        }}
                        onMouseLeave={() => {
                            const el = document.getElementById(`network-icon-${network.id}`);
                            if (el && draggedNetwork !== network.id) {
                                // Return to monochrome when not dragging
                                gsap.to(el, { filter: "grayscale(100%) brightness(0.7)", scale: 1, duration: 0.2 });
                            }
                        }}
                    >
                        {/* Circular container with overflow hidden for proper clipping */}
                        <div className="w-10 h-10 relative rounded-full overflow-hidden">
                            <Image
                                src={network.logo}
                                alt={network.name}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Drop Zone - Large Circle */}
            <div className="flex justify-center">
                <div
                    ref={dropZoneRef}
                    className={cn(
                        "w-24 h-24 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center transition-all duration-500 relative",
                        isDragging ? "border-solid" : ""
                    )}
                    style={{
                        background: selectedNetwork
                            ? `radial-gradient(circle, ${selectedNetworkData.color}30 0%, ${selectedNetworkData.color}10 50%, transparent 70%)`
                            : "rgba(255,255,255,0.02)"
                    }}
                >
                    {/* Glow effect ring */}
                    <div
                        className="absolute inset-0 rounded-full opacity-50 blur-xl transition-all duration-500"
                        style={{
                            background: selectedNetwork
                                ? `radial-gradient(circle, ${selectedNetworkData.color}40 0%, transparent 70%)`
                                : "transparent"
                        }}
                    />

                    {/* Selected chain logo in circular frame or placeholder */}
                    {selectedNetwork ? (
                        <div className="relative z-10 w-12 h-12 rounded-full overflow-hidden">
                            <Image
                                src={selectedNetworkData.logo}
                                alt={selectedNetworkData.name}
                                fill
                                className="object-cover drop-shadow-2xl"
                                unoptimized
                            />
                        </div>
                    ) : (
                        <span className="relative z-10 text-white/30 text-xs font-light uppercase tracking-widest text-center px-4">
                            {isDragging ? "Drop Here" : "Drag Network"}
                        </span>
                    )}

                    {/* Network name label */}
                    {selectedNetwork && (
                        <div
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-medium tracking-wide whitespace-nowrap"
                            style={{ color: selectedNetworkData.color }}
                        >
                            {selectedNetworkData.name}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
