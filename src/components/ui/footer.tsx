import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-accent/10 bg-neutral-900/60 py-20 backdrop-blur-md relative z-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
                    <div className="space-y-5 lg:max-w-xs">
                        <div className="flex items-center gap-3">
                            <div className="h-7 w-7 rounded-full bg-accent/20 border border-accent/40 shadow-glow-sm" />
                            <span className="text-xl font-medium font-heading tracking-tight text-white">SURGE me UP</span>
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed text-balance font-light">
                            Amplify your achievements with SURGE - the recognition engine for the Superchain ecosystem. Built for the future of on-chain identity.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        <div>
                            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Product</h4>
                            <ul className="space-y-3 text-sm text-neutral-400">
                                <li><Link href="/generator" className="hover:text-accent transition-colors duration-200">Create SURGE</Link></li>
                                <li><Link href="/gallery" className="hover:text-accent transition-colors duration-200">Gallery</Link></li>
                                <li><Link href="/identity" className="hover:text-secondary transition-colors duration-200">Identity</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Resources</h4>
                            <ul className="space-y-3 text-sm text-neutral-400">
                                <li><Link href="/about" className="hover:text-accent transition-colors duration-200">About</Link></li>
                                <li><a href="https://github.com/BRN-SLP/SURGE-me-UP" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-200">Documentation</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Networks</h4>
                            <ul className="space-y-3 text-sm text-neutral-400">
                                <li><span className="text-base">Base</span></li>
                                <li><span className="text-optimism">Optimism</span></li>
                                <li><span className="text-celo">Celo</span></li>
                                <li><span className="text-zora">Zora</span></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Social</h4>
                            <ul className="space-y-3 text-sm text-neutral-400">
                                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors duration-200">Twitter</a></li>
                                <li><a href="https://github.com/BRN-SLP/SURGE-me-UP" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors duration-200">GitHub</a></li>
                                <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#5865F2] transition-colors duration-200">Discord</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="section-divider mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500">
                    <p>© {new Date().getFullYear()} SURGE me UP. All rights reserved.</p>
                    <p className="flex items-center gap-2">
                        Powered by
                        <span className="text-accent font-medium">
                            Superchain
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
