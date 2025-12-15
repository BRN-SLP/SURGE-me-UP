"use client";

import { motion } from "framer-motion";
import { Heart, ExternalLink, Link as LinkIcon, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MinimalCardProps {
    title: string;
    description: string;
    createdAt: string;
    imageUrl: string;
    network: string;
    isLiked: boolean;
    onLike: () => void;
    onShare: () => void;
    onCopyLink?: () => void;
    explorerUrl?: string | null;
    linkCopied?: boolean;
}

const networkColors: Record<string, string> = {
    base: "from-blue-500 to-blue-400",
    optimism: "from-red-500 to-red-400",
    celo: "from-yellow-400 to-yellow-300",
    zora: "from-purple-500 to-purple-400",
    ink: "from-violet-500 to-violet-400",
    lisk: "from-cyan-500 to-cyan-400",
    unichain: "from-pink-500 to-pink-400",
    soneium: "from-indigo-500 to-indigo-400",
};

export function MinimalCard({
    title,
    description,
    createdAt,
    imageUrl,
    network,
    isLiked,
    onLike,
    onShare,
    onCopyLink,
    explorerUrl,
    linkCopied
}: MinimalCardProps) {
    const color = networkColors[network] || "from-gray-500 to-gray-400";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/5 shadow-lg backdrop-blur-sm"
        >
            {/* Full Image */}
            <div className="aspect-[4/5] relative bg-black/50">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                {/* Top Actions (Network & Like) */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-[-10px] group-hover:translate-y-0">
                    <div className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r shadow-lg",
                        color
                    )}>
                        {network}
                    </div>

                    <button
                        onClick={(e) => { e.stopPropagation(); onLike(); }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all active:scale-90"
                    >
                        <Heart
                            className={cn(
                                "w-4 h-4 transition-colors",
                                isLiked ? "fill-red-500 text-red-500" : "text-white"
                            )}
                        />
                    </button>
                </div>

                {/* Bottom Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:line-clamp-none transition-all">{title}</h3>
                    <p className="text-sm text-white/50 mb-4 line-clamp-1 group-hover:line-clamp-2 transition-all opacity-80">{description}</p>

                    {/* Action Buttons Row */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                        {onCopyLink && (
                            <Button
                                size="sm"
                                variant="secondary"
                                className={cn("h-8 flex-1 text-xs bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md font-medium", linkCopied && "bg-green-500/20 text-green-400")}
                                onClick={onCopyLink}
                            >
                                <LinkIcon className="w-3 h-3 mr-1.5" />
                                {linkCopied ? "Copied" : "Link"}
                            </Button>
                        )}

                        {explorerUrl && (
                            <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button size="sm" variant="secondary" className="w-full h-8 text-xs bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md font-medium">
                                    <ExternalLink className="w-3 h-3 mr-1.5" />
                                    Scan
                                </Button>
                            </a>
                        )}

                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-md"
                            onClick={onShare}
                        >
                            <Twitter className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
