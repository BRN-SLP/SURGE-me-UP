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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={onClose}>
            <div
                className="glass-panel p-4 sm:p-6 rounded-2xl border border-white/10 w-full max-w-sm max-h-[90vh] overflow-y-auto animate-in zoom-in-95 relative"
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
                <div className="flex justify-center mb-2">
                    <div className="relative">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                        <div className="absolute inset-0 bg-green-500/20 blur-lg animate-pulse" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-white text-center mb-0.5">
                    SURGE Created!
                </h2>
                <p className="text-white/60 text-center text-xs mb-3">
                    Your unique SURGE is ready
                </p>

                {/* SURGE Preview - Compact */}
                <div className="mb-3 rounded-xl overflow-hidden border border-white/10 bg-white/5 mx-auto" style={{ maxWidth: '200px' }}>
                    <img
                        src={surgeImage}
                        alt={surgeTitle}
                        className="w-full h-auto max-h-[25vh] object-contain"
                    />
                </div>

                {/* Claim URL Section - Compact */}
                {claimUrl && (
                    <div className="mb-3 p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-1.5 mb-1.5">
                            <LinkIcon className="w-3 h-3 text-green-500" />
                            <span className="text-xs font-medium text-white">Share link to mint:</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <input
                                type="text"
                                value={claimUrl}
                                readOnly
                                className="flex-1 px-2 py-1.5 text-[10px] bg-black/30 border border-white/10 rounded text-white/80 font-mono truncate"
                            />
                            <Button
                                onClick={handleCopyClaimLink}
                                variant="outline"
                                size="sm"
                                className="border-white/20 hover:bg-white/10 shrink-0 text-xs px-2 py-1 h-7"
                            >
                                <Copy className="w-3 h-3 mr-1" />
                                {claimLinkCopied ? "✓" : "Copy"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Actions - Compact grid */}
                <div className="space-y-2 mb-3">
                    <Button
                        onClick={onDownload}
                        className="w-full gap-1.5 h-9"
                        size="sm"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Download SURGE
                    </Button>

                    <div className="grid grid-cols-3 gap-1.5">
                        <Button
                            onClick={handleShareTwitter}
                            variant="outline"
                            className="gap-1 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 text-xs px-2 h-8"
                            size="sm"
                        >
                            <Twitter className="w-3 h-3" />
                            X
                        </Button>
                        <Button
                            onClick={handleShareWarpcast}
                            variant="outline"
                            className="gap-1 hover:bg-[#472A91]/10 hover:text-[#472A91] hover:border-[#472A91]/50 text-xs px-2 h-8"
                            size="sm"
                        >
                            <Share2 className="w-3 h-3" />
                            Warp
                        </Button>
                        <Button
                            onClick={handleCopyLink}
                            variant="outline"
                            className="gap-1 text-xs px-2 h-8"
                            size="sm"
                        >
                            <Copy className="w-3 h-3" />
                            {copied ? "✓" : "Copy"}
                        </Button>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-2">
                    <Button
                        onClick={onCreateAnother}
                        variant="outline"
                        className="flex-1 h-9 text-sm"
                        size="sm"
                    >
                        New SURGE
                    </Button>
                    <Button
                        onClick={onClose}
                        className="flex-1 h-9 text-sm"
                        size="sm"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}
