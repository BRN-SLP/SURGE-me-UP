"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Generator", href: "/generator" },
    { name: "Identity", href: "/identity" },
    { name: "Docs", href: "/docs" },
];

export function Navbar() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-heading text-xl font-bold tracking-tighter text-white">
                            SURGE<span className="text-accent">.</span>
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-accent uppercase tracking-wider",
                                    pathname === item.href
                                        ? "text-white"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="builder-solid" size="sm">
                        Connect Wallet
                    </Button>
                </div>
            </div>
        </header>
    );
}
