"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useEnsName } from "wagmi";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Navbar() {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const { data: ensName } = useEnsName({ address: address as `0x${string}` });

    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Helper to truncate address
    const truncatedAddress = address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "";

    return (
        <header className="fixed top-0 z-50 w-full glass-effect transition-all duration-300 border-b border-white/5 bg-surface/80 backdrop-blur-md">
            <div className="w-full mx-auto px-14 h-20 flex items-center justify-between">
                {/* ... (Logo and Nav) ... */}

                {/* Navbar Content intentionally omitted for brevity in replacement, focusing on logic */}
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-lavender-dark to-aqua-dark text-surface shadow-lg shadow-lavender/20 group-hover:scale-105 transition-transform duration-300">
                        <span className="material-symbols-outlined text-[24px]">bolt</span>
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-text-header">SURGE</span>
                </Link>

                <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 shadow-sm backdrop-blur-md">
                    <Link
                        href="/"
                        className={cn(
                            "px-5 py-2 text-base font-medium rounded-full transition-all duration-300",
                            pathname === "/" ? "text-text-header bg-white/10" : "text-text-muted hover:text-text-header hover:bg-white/10"
                        )}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className={cn(
                            "px-5 py-2 text-base font-medium rounded-full transition-all duration-300",
                            pathname === "/about" ? "text-text-header bg-white/10" : "text-text-muted hover:text-text-header hover:bg-white/10"
                        )}
                    >
                        About
                    </Link>
                    <Link
                        href="/generator"
                        className={cn(
                            "px-5 py-2 text-base font-medium rounded-full transition-all duration-300",
                            pathname === "/generator" ? "text-text-header bg-white/10" : "text-text-muted hover:text-text-header hover:bg-white/10"
                        )}
                    >
                        Generator
                    </Link>
                    <Link
                        href="/gallery"
                        className={cn(
                            "px-5 py-2 text-base font-medium rounded-full transition-all duration-300",
                            pathname === "/gallery" ? "text-text-header bg-white/10" : "text-text-muted hover:text-text-header hover:bg-white/10"
                        )}
                    >
                        Gallery
                    </Link>
                    <Link
                        href="/identity"
                        className={cn(
                            "px-5 py-2 text-base font-medium rounded-full transition-all duration-300",
                            pathname?.startsWith("/identity") ? "text-text-header bg-white/10" : "text-text-muted hover:text-text-header hover:bg-white/10"
                        )}
                    >
                        Identity
                    </Link>
                </nav>

                {mounted && isConnected ? (
                    <button
                        onClick={() => open()}
                        className="flex items-center justify-center h-10 px-6 rounded-full bg-white/10 border border-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 group gap-2"
                    >
                        <span>{ensName || truncatedAddress}</span>
                        <span className="material-symbols-outlined text-[16px] text-mint group-hover:text-white transition-colors">account_circle</span>
                    </button>
                ) : (
                    <button
                        onClick={() => open()}
                        className="flex items-center justify-center h-10 px-6 rounded-full bg-gradient-to-r from-lavender-dark to-aqua-dark hover:brightness-110 text-white text-sm font-bold transition-all duration-300 shadow-lg shadow-aqua/20 transform hover:-translate-y-0.5 group"
                    >
                        <span>Connect Wallet</span>
                        <span className="material-symbols-outlined text-[16px] ml-2 text-white group-hover:scale-110 transition-transform">account_balance_wallet</span>
                    </button>
                )}
            </div>
        </header>
    );
}
