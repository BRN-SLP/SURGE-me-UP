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
        <nav className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-black/60 backdrop-blur-sm">
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo Area */}
                <Link href="/" className="group">
                    <Logo />
                </Link>

                {/* Right Side: Navigation & Connect */}
                <div className="flex items-center gap-4">
                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            href="/generator"
                            onClick={() => trackEvent({ name: "NAVIGATION_CLICK", properties: { to: "/generator" } })}
                            className="px-4 py-2 text-sm font-light text-neutral-400 hover:text-white hover:bg-white/[0.03] rounded-md transition-all duration-200"
                        >
                            Generator
                        </Link>
                        <Link
                            href="/gallery"
                            onClick={() => trackEvent({ name: "NAVIGATION_CLICK", properties: { to: "/gallery" } })}
                            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                            Collection
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => trackEvent({ name: "NAVIGATION_CLICK", properties: { to: "/about" } })}
                            className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                            About
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="hidden md:block h-6 w-px bg-white/[0.08]" />

                    {/* Connect Wallet Button */}
                    <button
                        onClick={() => open()}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-light text-white hover:text-white bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.12] hover:border-white/[0.2] transition-all duration-200"
                    >
                        <Wallet className="w-3.5 h-3.5" />
                        <span>
                            {isConnected && address ? formatAddress(address) : "Connect"}
                        </span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
