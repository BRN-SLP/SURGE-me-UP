"use client";

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

                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                >
                    <defs>
                        <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                            <stop offset="0%" stopColor="#0052FF" />
                            <stop offset="30%" stopColor="#8844FF" />
                            <stop offset="60%" stopColor="#FF0420" />
                            <stop offset="80%" stopColor="#FF8844" />
                            <stop offset="100%" stopColor="#FCFF52" />
                        </linearGradient>
                    </defs>

                    {/* Wave forming S shape - filled wave surface */}
                    <path
                        d="M 8 12
                           Q 8 8, 12 6
                           Q 16 4, 20 4
                           Q 24 4, 28 6
                           Q 32 8, 32 12
                           Q 32 16, 28 18
                           L 25 19
                           Q 22 20, 20 20
                           L 15 21
                           Q 12 22, 12 26
                           Q 12 30, 15 32
                           Q 18 34, 22 34
                           Q 26 34, 30 32
                           Q 34 30, 34 26
                           L 34 36
                           Q 34 36, 30 38
                           Q 26 40, 20 40
                           Q 14 40, 10 38
                           Q 6 36, 6 30
                           Q 6 24, 10 22
                           L 13 21
                           Q 16 20, 18 20
                           L 23 19
                           Q 26 18, 28 14
                           Q 28 10, 25 8
                           Q 22 6, 18 6
                           Q 14 6, 10 8
                           Q 6 10, 6 14
                           Z"
                        fill="url(#logoGradient)"
                        className="group-hover:scale-105 transition-transform duration-300 origin-center"
                    />

                    {/* Wave crest sparkles */}
                    <circle cx="34" cy="8" r="2" fill="#FCFF52" opacity="0.9"
                        className="group-hover:opacity-100 transition-opacity duration-300" />
                </svg>
            </div>

            {showText && (
                <span className="font-heading font-bold text-2xl tracking-tight text-white">
                    SURGE me <span className="text-transparent bg-clip-text bg-gradient-to-r from-base via-optimism to-celo animate-gradient-text bg-[length:200%_auto]">UP</span>
                </span>
            )}
        </div>
    );
}
