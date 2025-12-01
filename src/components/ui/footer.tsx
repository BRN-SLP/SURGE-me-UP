import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-white/[0.08] bg-black/40 py-24 backdrop-blur-sm relative z-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between gap-10">
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-accent/20 border border-accent/40" />
                            <span className="text-lg font-light font-heading tracking-tight text-white">SURGE me UP</span>
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed max-w-xs text-balance font-light">
                            Amplify your achievements with SURGE - the recognition engine for the Superchain ecosystem. Built for the future of on-chain identity.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <h4 className="font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/generator" className="hover:text-base transition-colors">Create SURGE</Link></li>
                            <li><Link href="/gallery" className="hover:text-optimism transition-colors">Gallery</Link></li>
                            {/* <li><Link href="/explore" className="hover:text-celo transition-colors">Explore</Link></li> */}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><Link href="/about" className="hover:text-base transition-colors">About</Link></li>
                            {/* <li><Link href="/docs" className="hover:text-optimism transition-colors">Documentation</Link></li> */}
                            {/* <li><Link href="/grants" className="hover:text-celo transition-colors">Grants</Link></li> */}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            {/* <li><Link href="/terms" className="hover:text-base transition-colors">Terms</Link></li> */}
                            {/* <li><Link href="/privacy" className="hover:text-optimism transition-colors">Privacy</Link></li> */}
                            <li><span className="opacity-50 cursor-not-allowed">Terms (Soon)</span></li>
                            <li><span className="opacity-50 cursor-not-allowed">Privacy (Soon)</span></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Social</h4>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-base transition-colors">Twitter</a></li>
                            <li><a href="https://github.com/BRN-SLP/SURGE-me-UP" target="_blank" rel="noopener noreferrer" className="hover:text-optimism transition-colors">GitHub</a></li>
                            <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-celo transition-colors">Discord</a></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-20 border-t border-white/[0.08] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-neutral-500 font-light">
                    <p>© {new Date().getFullYear()} SURGE me UP. All rights reserved.</p>
                    <p className="flex items-center gap-2">
                        Powered by
                        <span className="text-accent font-normal">
                            Superchain
                        </span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
