"use client";

import Link from "next/link";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { Wallet } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

export function Navbar() {
    const { open } = useAppKit();
    const { address, isConnected } = useAppKitAccount();
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        if (isConnected && address) {
            trackEvent({
                name: "WALLET_CONNECTED",
                properties: { address }
            });
        }
    }, [isConnected, address, trackEvent]);

    const formatAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-neutral-900/80 backdrop-blur-md">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo Area */}
                <Link href="/" className="group flex-shrink-0">
                    <Logo className="hidden sm:flex" />
                    <Logo showText={false} className="flex sm:hidden" />
                </Link>

                {/* Right Side: Navigation & Connect */}
                <div className="flex items-center gap-4">
                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href="/"
                            onClick={() => trackEvent({ name: "NAVIGATION_CLICK", properties: { to: "/" } })}
                            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all duration-200"
                        >
                            Home
                        </Link>
                        <Link
                            href="/generator"
                            onClick={() => trackEvent({ name: "NAVIGATION_CLICK", properties: { to: "/generator" } })}
                            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all duration-200"
                        >
                            Generator
                        </Link>
                        <Link
                            href="/gallery"
                            onClick={() => trackEvent({ name: "NAVIGATION_CLICK", properties: { to: "/gallery" } })}
                            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all duration-200"
                        >
                            Collection
                        </Link>
                        <Link
                            href="/identity"
                            onClick={() => trackEvent({ name: "NAVIGATION_CLICK", properties: { to: "/identity" } })}
                            className="px-4 py-2 text-sm font-medium text-secondary hover:text-secondary hover:bg-secondary/10 rounded-lg transition-all duration-200"
                        >
                            Identity
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => trackEvent({ name: "NAVIGATION_CLICK", properties: { to: "/about" } })}
                            className="px-4 py-2 text-sm font-medium text-neutral-400 hover:text-accent hover:bg-accent/5 rounded-lg transition-all duration-200"
                        >
                            About
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block h-6 w-px bg-white/[0.08]" />

                    {/* Connect Wallet Button */}
                    <button
                        onClick={() => open()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent hover:text-accent bg-accent/5 hover:bg-accent/10 border border-accent/30 hover:border-accent/60 hover:shadow-glow-sm transition-all duration-300"
                    >
                        <Wallet className="w-4 h-4" />
                        <span>
                            {isConnected && address ? formatAddress(address) : "Connect"}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
