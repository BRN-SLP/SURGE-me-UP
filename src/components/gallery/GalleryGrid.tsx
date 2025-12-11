"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, Calendar, Twitter, Heart, Copy, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";

interface CreatedSURGEEvent {
    title: string;
    description: string;
    network: 'base' | 'optimism' | 'celo' | 'zora' | 'ink' | 'lisk' | 'unichain' | 'soneium';
    imageUrl?: string;
    createdAt: string;
    txHash?: string;
    eventAddress?: string; // Deployed contract address for claim link
}

export function GalleryGrid() {
    const [events, setEvents] = useState<CreatedSURGEEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [likedEvents, setLikedEvents] = useState<string[]>([]);
    const [copiedLink, setCopiedLink] = useState<string | null>(null);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        const savedEvents = localStorage.getItem('my-surge-events');
        const savedLikes = localStorage.getItem('liked-surges');

        if (savedEvents) {
            try {
                setEvents(JSON.parse(savedEvents));
            } catch (e) {
                console.error("Failed to parse saved events", e);
            }
        }

        if (savedLikes) {
            try {
                setLikedEvents(JSON.parse(savedLikes));
            } catch (e) {
                console.error("Failed to parse saved likes", e);
            }
        }

        setIsLoading(false);
    }, []);

    const toggleLike = (eventId: string) => {
        setLikedEvents(prev => {
            const newLikes = prev.includes(eventId)
                ? prev.filter(p => p !== eventId)
                : [...prev, eventId];

            localStorage.setItem('liked-surges', JSON.stringify(newLikes));

            if (!prev.includes(eventId)) {
                trackEvent({ name: "SHARE_CLICK", properties: { platform: "like", eventId } });
            }

            return newLikes;
        });
    };

    const handleShare = (event: CreatedSURGEEvent) => {
        const text = `Check out my SURGE event "${event.title}" on ${event.network}! 🌊✨`;
        const url = window.location.origin;

        trackEvent({ name: "SHARE_CLICK", properties: { platform: "twitter", eventTitle: event.title } });

        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            '_blank'
        );
    };

    const handleCopyClaimLink = (event: CreatedSURGEEvent) => {
        if (event.eventAddress) {
            const claimUrl = `${window.location.origin}/claim/${event.eventAddress}`;
            navigator.clipboard.writeText(claimUrl);
            setCopiedLink(event.eventAddress);
            setTimeout(() => setCopiedLink(null), 2000);
            trackEvent({ name: "SHARE_CLICK", properties: { platform: "claim_link", eventTitle: event.title } });
        }
    };

    const getNetworkColor = (network: string) => {
        switch (network) {
            case 'base': return 'from-base to-base-neon';
            case 'optimism': return 'from-optimism to-optimism-neon';
            case 'celo': return 'from-celo to-celo-neon text-black'; // Celo yellow needs dark text
            case 'zora': return 'from-zora to-zora-neon';
            case 'ink': return 'from-ink to-ink-neon';
            case 'lisk': return 'from-lisk to-lisk-neon';
            case 'unichain': return 'from-unichain to-unichain-neon';
            case 'soneium': return 'from-soneium to-soneium-neon';
            default: return 'from-gray-600 to-gray-500';
        }
    };

    const getExplorerUrl = (network: string, txHash?: string) => {
        if (!txHash) return null;

        switch (network) {
            case 'base': return `https://basescan.org/tx/${txHash}`;
            case 'optimism': return `https://optimistic.etherscan.io/tx/${txHash}`;
            case 'celo': return `https://celoscan.io/tx/${txHash}`;
            case 'zora': return `https://explorer.zora.energy/tx/${txHash}`;
            case 'ink': return `https://explorer.inkonchain.com/tx/${txHash}`;
            case 'lisk': return `https://blockscout.lisk.com/tx/${txHash}`;
            case 'unichain': return `https://unichain.blockscout.com/tx/${txHash}`;
            case 'soneium': return `https://soneium.blockscout.com/tx/${txHash}`;
            default: return null;
        }
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

    if (events.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-3">No Events Yet</h3>
                <p className="text-white/60 mb-8 max-w-md mx-auto">
                    Start creating SURGE events and they'll appear here.
                </p>
                <Link href="/generator">
                    <Button className="bg-gradient-to-r from-base via-optimism to-celo text-white">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create Your First Event
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-heading font-bold text-white">My SURGE Events</h2>
                    <p className="text-white/60 mt-1">{events.length} event{events.length !== 1 ? 's' : ''} created</p>
                </div>
                <Link href="/generator">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Create New Event
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => {
                    const eventId = `${event.title}-${event.createdAt}`;
                    const isLiked = likedEvents.includes(eventId);
                    const explorerUrl = getExplorerUrl(event.network, event.txHash);

                    return (
                        <Card key={index} className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden group hover:border-white/20 transition-all duration-300">
                            {event.imageUrl && (
                                <div className="aspect-square overflow-hidden relative">
                                    <img
                                        src={event.imageUrl}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r ${getNetworkColor(event.network)} text-white text-xs font-bold uppercase backdrop-blur-sm`}>
                                        {event.network}
                                    </div>
                                    <button
                                        onClick={() => toggleLike(eventId)}
                                        className="absolute top-3 left-3 p-2 rounded-full bg-black/50 backdrop-blur-sm hover:bg-black/70 transition-colors"
                                    >
                                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                                    </button>
                                </div>
                            )}

                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="font-heading font-bold text-lg text-white mb-2 line-clamp-2">
                                        {event.title}
                                    </h3>
                                    <p className="text-white/60 text-sm line-clamp-2">
                                        {event.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-white/50">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(event.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    {event.eventAddress && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => handleCopyClaimLink(event)}
                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white"
                                        >
                                            <LinkIcon className="w-3 h-3 mr-1" />
                                            {copiedLink === event.eventAddress ? "Copied!" : "Claim Link"}
                                        </Button>
                                    )}
                                    {explorerUrl && (
                                        <a
                                            href={explorerUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                                            >
                                                <ExternalLink className="w-3 h-3 mr-1" />
                                                Explorer
                                            </Button>
                                        </a>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleShare(event)}
                                        className="border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                                    >
                                        <Twitter className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
