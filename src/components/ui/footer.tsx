export function Footer() {
    return (
        <footer className="w-full border-t border-white/10 bg-background py-12">
            <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex flex-col gap-4">
                    <div className="font-heading text-xl font-bold tracking-tighter text-white">
                        SURGE<span className="text-accent">.</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Superchain User Recognition and Growth Engine.
                        <br />
                        Powering the next generation of on-chain identity.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Platform</h4>
                    <a href="/generator" className="text-sm text-muted-foreground hover:text-accent transition-colors">Generator</a>
                    <a href="/identity" className="text-sm text-muted-foreground hover:text-accent transition-colors">Identity</a>
                    <a href="/gallery" className="text-sm text-muted-foreground hover:text-accent transition-colors">Gallery</a>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Developers</h4>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Documentation</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">GitHub</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Status</a>
                </div>

                <div className="flex flex-col gap-2">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Legal</h4>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Privacy Policy</a>
                    <a href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">Terms of Service</a>
                </div>
            </div>
            <div className="container mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                <p>&copy; 2025 SURGE Protocol. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <span>v2.0.0-builder</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span>Systems Operational</span>
                </div>
            </div>
        </footer>
    );
}
