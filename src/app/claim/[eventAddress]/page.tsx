"use client";

import { useParams } from "next/navigation";
import { useAccount, useSwitchChain } from "wagmi";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { useClaimToken, useEventMetadata, useRemainingSupply, useHasUserClaimed } from "@/hooks/useSurgeContracts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { CheckCircle2, Network, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Address } from "viem";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ClaimPage() {
    const params = useParams();
    const eventAddress = params.eventAddress as Address;
    const { address: userAddress, isConnected, chain } = useAccount();
    const { switchChain } = useSwitchChain();
    const { trackEvent } = useAnalytics();

    // Fetch event data
    const metadata = useEventMetadata(eventAddress);
    const remainingSupply = useRemainingSupply(eventAddress);
    const hasUserClaimed = useHasUserClaimed(eventAddress);

    // Claim hook
    const { claim, isPending, isConfirming, isSuccess, hash } = useClaimToken(eventAddress);

    const [error, setError] = useState<{ title: string; message: string } | null>(null);

    // Track page view
    useEffect(() => {
        if (eventAddress) {
            trackEvent({
                name: "NAVIGATION",
                properties: {
                    page: "claim",
                    eventAddress
                }
            });
        }
    }, [eventAddress, trackEvent]);

    const handleClaim = async () => {
        if (!isConnected || !userAddress) {
            setError({
                title: "Wallet Not Connected",
                message: "Please connect your wallet to claim this SURGE token."
            });
            return;
        }

        setError(null);

        try {
            await claim();
            trackEvent({
                name: "MINT_SURGE_SUCCESS",
                properties: { eventAddress, userAddress }
            });
        } catch (err: any) {
            console.error("[CLAIM_ERROR]", err);
            setError({
                title: "Claim Failed",
                message: err.message || "Failed to claim SURGE token. Please try again."
            });
            trackEvent({
                name: "MINT_SURGE_ERROR",
                properties: { eventAddress, error: err.message }
            });
        }
    };

    // Loading state
    if (!metadata) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface text-white">
                <LoadingState message="Loading event details..." />
            </div>
        );
    }

    // Logic
    const isExpired = metadata.expiryTimestamp > 0 && Date.now() / 1000 > Number(metadata.expiryTimestamp);
    const isSoldOut = remainingSupply !== undefined && remainingSupply === BigInt(0);

    const getNetworkName = (chainId: number) => {
        switch (chainId) {
            case 8453: return "Base";
            case 10: return "Optimism";
            case 42220: return "Celo";
            case 7777777: return "Zora";
            case 57073: return "Ink";
            case 1135: return "Lisk";
            case 130: return "Unichain";
            case 1868: return "Soneium";
            default: return `Chain ${chainId}`;
        }
    };

    const networkName = getNetworkName(Number(metadata.chainId));
    const isWrongNetwork = chain && Number(chain.id) !== Number(metadata.chainId);

    const getExplorerBaseUrl = (name: string) => {
        switch (name.toLowerCase()) {
            case 'base': return "https://basescan.org";
            case 'optimism': return "https://optimistic.etherscan.io";
            case 'celo': return "https://celoscan.io";
            default: return "https://etherscan.io";
        }
    };

    // Calculations for progress bar
    const maxSupply = Number(metadata.maxSupply);
    const remaining = remainingSupply ? Number(remainingSupply) : 0;
    const minted = maxSupply - remaining;
    const progressPercent = maxSupply > 0 ? (minted / maxSupply) * 100 : 0;

    return (
        <div className="min-h-screen bg-surface text-text-main font-display selection:bg-mint-dark selection:text-white relative overflow-x-hidden pt-32 pb-20">
            {/* Ambient Background Flow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lavender/10 rounded-full blur-[120px] opacity-30 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-aqua/10 rounded-full blur-[120px] opacity-30 animate-pulse-slow delay-1000"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full mx-auto px-14 relative z-10"
            >
                {/* Back Link */}
                <Link href="/gallery" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors group mb-8">
                    <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    <span className="text-base font-medium">Back to Gallery</span>
                </Link>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left Column: Image & Status */}
                    <div className="lg:col-span-5 space-y-8">
                         {metadata.imageURI ? (
                            <motion.div 
                                whileHover={{ scale: 1.02, rotate: 1 }}
                                className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group"
                            >
                                <img
                                    src={metadata.imageURI}
                                    alt={metadata.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </motion.div>
                        ) : (
                            <div className="aspect-square rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/20">
                                <span className="material-symbols-outlined text-6xl">image</span>
                            </div>
                        )}

                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-text-muted font-medium">Network</span>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/5 text-sm font-bold text-white">
                                    <Network className="w-4 h-4" />
                                    {networkName}
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-text-muted font-medium">Status</span>
                                {isExpired ? (
                                    <span className="text-red-400 font-bold bg-red-400/10 px-3 py-1 rounded-full">Expired</span>
                                ) : isSoldOut ? (
                                    <span className="text-yellow-400 font-bold bg-yellow-400/10 px-3 py-1 rounded-full">Sold Out</span>
                                ) : (
                                    <span className="text-mint font-bold bg-mint/10 px-3 py-1 rounded-full animate-pulse-slow">Live & Active</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info & Action */}
                    <div className="lg:col-span-7 space-y-10">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6">{metadata.name}</h1>
                            <p className="text-xl text-text-muted leading-relaxed max-w-2xl">{metadata.description}</p>
                        </div>

                        {/* Stats Bar */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-4xl font-mono font-bold text-white mb-1">
                                        {remainingSupply?.toString() || "0"}
                                    </div>
                                    <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Remaining</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-mono font-bold text-white/50 mb-1">
                                        {metadata.maxSupply.toString()}
                                    </div>
                                    <div className="text-sm font-medium text-text-muted uppercase tracking-wider">Total Supply</div>
                                </div>
                            </div>
                            <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-lavender to-mint rounded-full relative"
                                >
                                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="pt-8 border-t border-white/5">
                            <AnimatePresence mode="wait">
                                {isSuccess && hash ? (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-mint/10 border border-mint/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
                                    >
                                        <div className="size-20 rounded-full bg-mint text-surface flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-bold text-white mb-2">Token Claimed!</h3>
                                            <p className="text-mint-light/80 mb-6">This badge is now permanently in your collection.</p>
                                            <div className="flex gap-4 justify-center md:justify-start">
                                                <Link href="/gallery">
                                                    <Button className="bg-surface hover:bg-surface/80 text-white rounded-full px-8">View Gallery</Button>
                                                </Link>
                                                <a href={`${getExplorerBaseUrl(networkName)}/tx/${hash}`} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="outline" className="border-mint/30 text-mint hover:bg-mint/10 rounded-full px-8">
                                                        Transaction <ExternalLink className="w-4 h-4 ml-2" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-6">
                                        {error && (
                                            <ErrorAlert 
                                                title={error.title} 
                                                message={error.message} 
                                                onDismiss={() => setError(null)}
                                            />
                                        )}
                                        
                                        {!isConnected ? (
                                             <Button className="w-full h-20 text-2xl font-bold rounded-2xl bg-white text-surface hover:bg-gray-200 transition-colors shadow-lg shadow-white/10" disabled>
                                                Connect Wallet to Claim
                                            </Button>
                                        ) : isWrongNetwork ? (
                                            <Button 
                                                onClick={() => switchChain({ chainId: Number(metadata.chainId) })}
                                                className="w-full h-20 text-2xl font-bold rounded-2xl bg-yellow-400 text-black hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20"
                                            >
                                                Switch Network to {networkName}
                                            </Button>
                                        ) : hasUserClaimed ? (
                                            <div className="p-8 rounded-3xl border border-blue-500/30 bg-blue-500/10 text-center">
                                                <h3 className="text-xl font-bold text-blue-400 mb-2">Already Owned</h3>
                                                <p className="text-white/60 mb-6">You have already claimed this drop.</p>
                                                <Link href="/gallery">
                                                    <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-full px-8">Check Gallery</Button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={handleClaim}
                                                disabled={isPending || isConfirming || isExpired || isSoldOut}
                                                className={cn(
                                                    "w-full h-24 rounded-3xl font-bold text-2xl md:text-3xl text-white shadow-2xl transition-all relative overflow-hidden group",
                                                    isExpired || isSoldOut 
                                                    ? "bg-white/5 text-white/30 cursor-not-allowed" 
                                                    : "bg-gradient-to-r from-lavender-dark to-aqua-dark hover:brightness-110 shadow-aqua/20"
                                                )}
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-3">
                                                    {isPending || isConfirming ? (
                                                        <>Processing <Loader2 className="w-8 h-8 animate-spin" /></>
                                                    ) : isExpired ? (
                                                        "Event Expired"
                                                    ) : isSoldOut ? (
                                                        "Sold Out"
                                                    ) : (
                                                        <>Claim Now <span className="material-symbols-outlined text-4xl">bolt</span></>
                                                    )}
                                                </span>
                                                {/* Shimmer Effect */}
                                                {!isExpired && !isSoldOut && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                                )}
                                            </motion.button>
                                        )}
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
