import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-white/[0.08] bg-black/40 py-24 backdrop-blur-sm relative z-10">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
                    <div className="space-y-5 lg:max-w-xs">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-accent/20 border border-accent/40" />
                            <span className="text-lg font-light font-heading tracking-tight text-white">SURGE me UP</span>
                        </div>
                        <p className="text-sm text-neutral-400 leading-relaxed text-balance font-light">
                            Amplify your achievements with SURGE - the recognition engine for the Superchain ecosystem. Built for the future of on-chain identity.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        <div>
                            <h4 className="font-bold text-white mb-4">Product</h4>
                            <ul className="space-y-2 text-sm text-white/60">
                                <li><Link href="/generator" className="hover:text-[#0052FF] transition-colors">Create SURGE</Link></li>
                                <li><Link href="/gallery" className="hover:text-[#FF0420] transition-colors">Gallery</Link></li>
                                {/* <li><Link href="/explore" className="hover:text-[#35D07F] transition-colors">Explore</Link></li> */}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm text-white/60">
                                <li><Link href="/about" className="hover:text-[#0052FF] transition-colors">About</Link></li>
                                {/* <li><Link href="/docs" className="hover:text-[#FF0420] transition-colors">Documentation</Link></li> */}
                                {/* <li><Link href="/grants" className="hover:text-[#35D07F] transition-colors">Grants</Link></li> */}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-white/60">
                                {/* <li><Link href="/terms" className="hover:text-[#0052FF] transition-colors">Terms</Link></li> */}
                                {/* <li><Link href="/privacy" className="hover:text-[#FF0420] transition-colors">Privacy</Link></li> */}
                                <li><span className="opacity-50 cursor-not-allowed">Terms (Soon)</span></li>
                                <li><span className="opacity-50 cursor-not-allowed">Privacy (Soon)</span></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">Social</h4>
                            <ul className="space-y-2 text-sm text-white/60">
                                <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#1DA1F2] transition-colors">Twitter</a></li>
                                <li><a href="https://github.com/BRN-SLP/SURGE-me-UP" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                                <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#5865F2] transition-colors">Discord</a></li>
                            </ul>
                        </div>
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
