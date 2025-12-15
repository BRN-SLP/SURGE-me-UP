import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-black/50 backdrop-blur-md py-12 mt-20">
            <div className="container w-full max-w-none mx-auto px-14 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 bg-gradient-to-br from-lavender-dark to-aqua-dark rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-300">
                            <span className="material-symbols-outlined text-[18px]">bolt</span>
                        </div>
                        <span className="font-heading font-bold text-xl tracking-tight text-white">SURGE</span>
                    </Link>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The Superchain recognition engine. Amplify your on-chain achievements with verifiable reputation and soulbound badges.
                    </p>
                    <div className="flex gap-4 mt-2">
                        <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">alternate_email</span>
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">groups</span>
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[20px]">forum</span>
                        </a>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Platform</h4>
                    <Link href="/generator" className="text-sm text-muted-foreground hover:text-accent transition-colors">Generator</Link>
                    <Link href="/identity" className="text-sm text-muted-foreground hover:text-accent transition-colors">Identity</Link>
                    <Link href="/gallery" className="text-sm text-muted-foreground hover:text-accent transition-colors">Gallery</Link>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Developers</h4>
                    <Link href="/about" className="text-sm text-muted-foreground hover:text-accent transition-colors">Documentation</Link>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">GitHub</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Status</a>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Legal</h4>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Privacy Policy</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Terms of Service</a>
                </div>
            </div>

            <div className="container w-full max-w-none mx-auto px-14 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                <p>&copy; 2025 SURGE Protocol. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <span>v2.0.0-builder</span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse"></span>
                        <span className="text-mint">Systems Operational</span>
                    </span>
                </div>
            </div>
        </footer>
    );
}
