"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, Calendar, Twitter, Heart, Copy, Link as LinkIcon } from "lucide-react";
import Link from "next/link";
import { useAnalytics } from "@/hooks/useAnalytics";
import { AnimatePresence } from "framer-motion";
import { MinimalCard } from "./MinimalCard";
import { FilterPills } from "./FilterPills";

interface CreatedSURGEEvent {
    title: string;
    description: string;
    network: 'base' | 'optimism' | 'celo' | 'zora' | 'ink' | 'lisk' | 'unichain' | 'soneium';
    imageUrl?: string;
    createdAt: string;
    txHash?: string;
    eventAddress?: string; // Deployed contract address for claim link
}

import { motion } from "framer-motion";

export function GalleryGrid() {
    const [selectedNetwork, setSelectedNetwork] = useState("all");
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

    const getExplorerUrl = (network: string, txHash?: string) => {
        if (!txHash) return null;
        // ... (Keep existing switch case logic or simplify if already imported helpers exist, but sticking to inline for now)
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

    const filteredEvents = events.filter(e =>
        selectedNetwork === "all" ? true : e.network === selectedNetwork
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-[4/5] rounded-3xl bg-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    if (events.length === 0) {
        return (
            <div className="text-center py-24">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/5">
                    <Sparkles className="w-12 h-12 text-white/20" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">No Events Yet</h3>
                <p className="text-white/60 mb-10 max-w-md mx-auto text-lg">
                    Your collection is empty. Start creating SURGE events on the Superchain today.
                </p>
                <Link href="/generator">
                    <Button className="h-14 px-8 rounded-full text-lg font-bold bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 transition-opacity">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Create First Event
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-12">

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    {/* Optional: Add stats or title here if not in parent page */}
                </div>
                <FilterPills selected={selectedNetwork} onSelect={setSelectedNetwork} />
                <Link href="/generator" className="hidden md:block">
                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/10 rounded-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        New Event
                    </Button>
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredEvents.map((event) => {
                        const eventId = `${event.title}-${event.createdAt}`;
                        const isLiked = likedEvents.includes(eventId);

                        return (
                            <MinimalCard
                                key={eventId}
                                title={event.title}
                                description={event.description}
                                createdAt={event.createdAt}
                                imageUrl={event.imageUrl || ''}
                                network={event.network}
                                isLiked={isLiked}
                                onLike={() => toggleLike(eventId)}
                                onShare={() => handleShare(event)}
                                onCopyLink={event.eventAddress ? () => handleCopyClaimLink(event) : undefined}
                                explorerUrl={getExplorerUrl(event.network, event.txHash)}
                                linkCopied={copiedLink === event.eventAddress}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Empty Filter State */}
            {filteredEvents.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <p className="text-white/40">No events found for {selectedNetwork}.</p>
                </motion.div>
            )}
        </div>
    );
}



