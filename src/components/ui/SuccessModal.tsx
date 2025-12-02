import { CheckCircle2, Download, Share2, Twitter, Copy, Link as LinkIcon } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    surgeImage: string;
    surgeTitle: string;
    onDownload: () => void;
    onCreateAnother: () => void;
    eventAddress?: string; // NEW: deployed event contract address
}

export function SuccessModal({
    isOpen,
    onClose,
    surgeImage,
    surgeTitle,
    onDownload,
    onCreateAnother,
    eventAddress // NEW
}: SuccessModalProps) {
    const [copied, setCopied] = useState(false);
    const [claimLinkCopied, setClaimLinkCopied] = useState(false);

    if (!isOpen) return null;

    // Generate claim URL if event address is available
    const claimUrl = eventAddress
        ? `${typeof window !== 'undefined' ? window.location.origin : ''}/claim/${eventAddress}`
        : null;
    const shareUrl = claimUrl || (typeof window !== 'undefined' ? window.location.href : '');

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCopyClaimLink = () => {
        if (claimUrl) {
            navigator.clipboard.writeText(claimUrl);
            setClaimLinkCopied(true);
            setTimeout(() => setClaimLinkCopied(false), 2000);
        }
    };

    const handleShareTwitter = () => {
        const text = `Just minted a new SURGE "${surgeTitle}" on SURGE me UP! 🌊✨\n\nRide the wave on Superchain:`;
        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
            '_blank'
        );
    };

    const handleShareWarpcast = () => {
        const text = `Just minted a new SURGE "${surgeTitle}" on SURGE me UP! 🌊✨`;
        window.open(
            `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl)}`,
            '_blank'
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div
                className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 w-full max-w-md max-h-[95vh] overflow-y-auto animate-in zoom-in-95 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Success Icon */}
                <div className="flex justify-center mb-4">
                    <div className="relative">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                        <div className="absolute inset-0 bg-green-500/20 blur-xl animate-pulse" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-1">
                    SURGE Created Successfully!
                </h2>
                <p className="text-white/70 text-center text-sm mb-4">
                    Your unique SURGE is ready to use
                </p>

                {/* SURGE Preview - Smaller */}
                <div className="mb-4 rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                    <img
                        src={surgeImage}
                        alt={surgeTitle}
                        className="w-full h-auto max-h-[35vh] object-contain"
                    />
                </div>

                {/* Claim URL Section - NEW */}
                {claimUrl && (
                    <div className="mb-4 p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                            <LinkIcon className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-semibold text-white">Share this link to let others mint:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={claimUrl}
                                readOnly
                                className="flex-1 px-3 py-2 text-xs bg-black/30 border border-white/10 rounded-lg text-white/80 font-mono truncate"
                            />
                            <Button
                                onClick={handleCopyClaimLink}
                                variant="outline"
                                size="sm"
                                className="border-white/20 hover:bg-white/10 shrink-0"
                            >
                                <Copy className="w-3 h-3 mr-1" />
                                {claimLinkCopied ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="space-y-2.5 mb-4">
                    <Button
                        onClick={onDownload}
                        className="w-full gap-2"
                        size="lg"
                    >
                        <Download className="w-4 h-4" />
                        Download SURGE
                    </Button>

                    <div className="grid grid-cols-2 gap-2.5">
                        <Button
                            onClick={handleShareTwitter}
                            variant="outline"
                            className="gap-2 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50"
                            size="sm"
                        >
                            <Twitter className="w-4 h-4" />
                            Twitter
                        </Button>
                        <Button
                            onClick={handleShareWarpcast}
                            variant="outline"
                            className="gap-2 hover:bg-[#472A91]/10 hover:text-[#472A91] hover:border-[#472A91]/50"
                            size="sm"
                        >
                            <Share2 className="w-4 h-4" />
                            Warpcast
                        </Button>
                    </div>
                    <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="w-full gap-2"
                        size="sm"
                    >
                        <Copy className="w-4 h-4" />
                        {copied ? "Link Copied!" : "Copy Link"}
                    </Button>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2.5">
                    <Button
                        onClick={onCreateAnother}
                        variant="outline"
                        className="flex-1"
                        size="sm"
                    >
                        Create Another
                    </Button>
                    <Button
                        onClick={onClose}
                        className="flex-1"
                        size="sm"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}
