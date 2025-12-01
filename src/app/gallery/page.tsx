import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default function GalleryPage() {
    return (
        <div className="container mx-auto px-4 py-32 relative z-10">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight">
                        My <span className="text-gradient-optimism">Collection</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Your personal gallery of created SURGEs. Achievements preserved on the Superchain.
                    </p>
                </div>

                <GalleryGrid />
            </div>
        </div>
    );
}
