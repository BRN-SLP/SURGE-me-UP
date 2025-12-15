"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function IdentityLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const tabs = [
        { name: 'Dashboard', href: '/identity' },
        { name: 'Link Wallet', href: '/identity/link' },
        { name: 'Manage', href: '/identity/manage' },
        { name: 'Badges', href: '/identity/badges' },
    ];

    return (
        <div className="bg-surface text-text-main font-display antialiased min-h-screen relative selection:bg-mint-dark selection:text-white flex flex-col">
            {/* Background Effects */}
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-surface"></div>
            </div>

            <div className="relative z-10 pt-48 pb-24 container mx-auto px-6 flex-grow">
                {/* Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-2 mb-8 bg-white/5 w-fit p-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={cn(
                                    "px-5 py-2 text-sm font-medium rounded-full transition-all duration-300",
                                    isActive
                                        ? "bg-gradient-to-r from-lavender-dark to-aqua-dark text-white shadow-lg shadow-aqua/20"
                                        : "text-text-muted hover:text-white hover:bg-white/10"
                                )}
                            >
                                {tab.name}
                            </Link>
                        );
                    })}
                </div>

                {children}
            </div>
        </div>
    );
}
