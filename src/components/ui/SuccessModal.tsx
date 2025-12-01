import { CheckCircle2, Download, Share2, Twitter, Copy } from "lucide-react";
import { Button } from "./button";
import { useState } from "react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    surgeImage: string;
    surgeTitle: string;
    onDownload: () => void;
    onCreateAnother: () => void;
}

export function SuccessModal({
    isOpen,
    onClose,
    surgeImage,
    surgeTitle,
    onDownload,
    onCreateAnother
}: SuccessModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="glass-panel p-8 rounded-3xl border border-white/10 max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
                {/* Success Icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                        <div className="absolute inset-0 bg-green-500/20 blur-xl animate-pulse" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white text-center mb-2">
                    SURGE Created Successfully!
                </h2>
                <p className="text-white/70 text-center mb-6">
                    Your unique SURGE is ready to use
                </p>

                {/* SURGE Preview */}
                <div className="mb-6 rounded-2xl overflow-hidden border border-white/10">
                    <img
                        src={surgeImage}
                        alt={surgeTitle}
                        className="w-full h-auto max-h-[50vh] object-contain"
                    />
                </div>

                {/* Actions */}
                <div className="space-y-3 mb-6">
                    <Button
                        onClick={onDownload}
                        className="w-full gap-2"
                        size="lg"
                    >
                        <Download className="w-4 h-4" />
                        Download SURGE
                    </Button>

                    <div className="grid grid-cols-2 gap-3">
                        <Button
                            onClick={handleShareTwitter}
                            variant="outline"
                            className="gap-2 hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50"
                        >
                            <Twitter className="w-4 h-4" />
                            Twitter
                        </Button>
                        <Button
                            onClick={handleShareWarpcast}
                            variant="outline"
                            className="gap-2 hover:bg-[#472A91]/10 hover:text-[#472A91] hover:border-[#472A91]/50"
                        >
                            <Share2 className="w-4 h-4" />
                            Warpcast
                        </Button>
                    </div>
                    <Button
                        onClick={handleCopyLink}
                        variant="outline"
                        className="w-full gap-2"
                    >
                        <Copy className="w-4 h-4" />
                        {copied ? "Link Copied!" : "Copy Link"}
                    </Button>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3">
                    <Button
                        onClick={onCreateAnother}
                        variant="outline"
                        className="flex-1"
                    >
                        Create Another
                    </Button>
                    <Button
                        onClick={onClose}
                        className="flex-1"
                    >
                        Done
                    </Button>
                </div>
            </div>
        </div>
    );
}
