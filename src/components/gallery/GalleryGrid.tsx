"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, Calendar, Network, Share2, Twitter, Copy, Heart, Download } from "lucide-react";
import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";

interface SavedSURGE {
    id: string;
    title: string;
    image: string;
    date: string;
    network: 'base' | 'optimism';
    createdAt: string;
}

export function GalleryGrid() {
    const [surges, setSurges] = useState<SavedSURGE[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [likedSurges, setLikedSurges] = useState<string[]>([]);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        const saved = localStorage.getItem('my-surges');
        const savedLikes = localStorage.getItem('liked-surges');

        if (saved) {
            try {
                setSurges(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved SURGEs", e);
            }
        }

        if (savedLikes) {
            try {
                setLikedSurges(JSON.parse(savedLikes));
            } catch (e) {
                console.error("Failed to parse saved likes", e);
            }
        }

        setIsLoading(false);
    }, []);

    const toggleLike = (id: string) => {
        setLikedSurges(prev => {
            const newLikes = prev.includes(id)
                ? prev.filter(p => p !== id)
                : [...prev, id];

            localStorage.setItem('liked-surges', JSON.stringify(newLikes));

            // Track like/unlike event
            if (!prev.includes(id)) {
                trackEvent({ name: "SHARE_CLICK", properties: { platform: "like", surgeId: id } });
            }

            return newLikes;
        });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-96 rounded-3xl bg-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    if (surges.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No SURGEs Yet</h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                    You haven't created any SURGEs on this device yet. Start your collection by creating your first achievement!
                </p>
                <Link href="/generator">
                    <Button className="btn-primary text-lg">
                        Create SURGE
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {surges.map((surge, index) => (
                <Card key={`${surge.id}-${index}`} className="glass-panel border-white/10 bg-white/5 overflow-hidden group hover:border-white/20 transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden bg-black/20">
                        <img
                            src={surge.image}
                            alt={surge.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                            <div className="flex gap-2 mb-4">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-[#1DA1F2] text-white border-none"
                                    onClick={() => {
                                        trackEvent({ name: "SHARE_CLICK", properties: { platform: "twitter", surgeId: surge.id } });
                                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my SURGE "${surge.title}"! 🌊`)}&url=${encodeURIComponent(window.location.origin)}`, '_blank');
                                    }}
                                    title="Share on Twitter"
                                >
                                    <Twitter className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white border-none"
                                    onClick={() => {
                                        const link = document.createElement('a');
                                        link.href = surge.image;
                                        link.download = `surge-${surge.title.replace(/\s+/g, '-').toLowerCase()}.png`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                    }}
                                    title="Download Image"
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={`h-8 w-8 rounded-full border-none transition-colors ${likedSurges.includes(surge.id)
                                        ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                    onClick={() => toggleLike(surge.id)}
                                    title={likedSurges.includes(surge.id) ? "Unlike" : "Like"}
                                >
                                    <Heart className={`w-4 h-4 ${likedSurges.includes(surge.id) ? "fill-current" : ""}`} />
                                </Button>
                            </div>

                            {/* TODO: Update with SURGE event contract addresses */}
                            {/* <a
                                href={`https://basescan.org/token/[event-address]?a=${surge.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackEvent({ name: "EXPLORER_VIEW", properties: { network: surge.network, surgeId: surge.id } })}
                                className="text-white hover:text-blue-400 flex items-center gap-2 text-sm font-medium"
                            >
                                View on Explorer <ExternalLink className="w-4 h-4" />
                            </a> */}
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-white mb-2 truncate">{surge.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(surge.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1.5 capitalize">
                                <Network className="w-4 h-4" />
                                <span>{surge.network}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
