import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-surface relative overflow-hidden selection:bg-mint-dark selection:text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-surface"></div>
                {/* CSS Node Network Metaphor (Simplified) */}
                <div
                    className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            </div>

            <div className="container mx-auto px-4 py-32 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight text-white">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF0000] to-[#FF334B]">Collection</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Your personal gallery of created SURGEs. Achievements preserved on the Superchain.
                        </p>
                    </div>

                    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <GalleryGrid />
                    </div>
                </div>
            </div>
        </div>
    );
}
