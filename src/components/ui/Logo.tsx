"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <div className="relative group">
                {/* Glow effect - enhanced for dark backgrounds */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-base via-optimism to-celo opacity-70 blur-md group-hover:opacity-100 transition-opacity duration-500" />

                <Image
                    src="/logos/surge_logo_new.png"
                    alt="SURGE me UP Logo"
                    width={30}
                    height={30}
                    className="relative z-10 group-hover:scale-105 transition-transform duration-300"
                    priority
                />
            </div>

            {showText && (
                <span className="font-heading font-bold text-xl tracking-tight text-white">
                    SURGE me <span className="text-white bg-clip-text bg-gradient-to-r from-[#0052FF] via-[#FF0420] to-[#FCCC16] font-extrabold">UP</span>
                </span>
            )}
        </div>
    );
}
