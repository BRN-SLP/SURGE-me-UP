"use client";

import { useParams } from "next/navigation";
import { useAccount, useSwitchChain } from "wagmi";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { useClaimToken, useEventMetadata, useRemainingSupply, useHasUserClaimed } from "@/hooks/useSurgeContracts";
import { useAnalytics } from "@/hooks/useAnalytics";
import { CheckCircle2, Clock, Users, Network, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { Address } from "viem";

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

    // Handle claim
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
                properties: {
                    eventAddress,
                    userAddress
                }
            });
        } catch (err: any) {
            console.error("[CLAIM_ERROR]", err);
            setError({
                title: "Claim Failed",
                message: err.message || "Failed to claim SURGE token. Please try again."
            });

            trackEvent({
                name: "MINT_SURGE_ERROR",
                properties: {
                    eventAddress,
                    error: err.message
                }
            });
        }
    };

    // Loading state
    if (!metadata) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-background/50">
                <LoadingState message="Loading event details..." />
            </div>
        );
    }

    // Check if expired
    const isExpired = metadata.expiryTimestamp > 0 && Date.now() / 1000 > Number(metadata.expiryTimestamp);
    const isSoldOut = remainingSupply !== undefined && remainingSupply === BigInt(0);

    // Get network info
    const getNetworkName = (chainId: number) => {
        switch (chainId) {
            case 8453: return "Base";
            case 10: return "Optimism";
            case 42220: return "Celo";
            case 7777777: return "Zora";
            default: return `Chain ${chainId}`;
        }
    };

    const networkName = getNetworkName(Number(metadata.chainId));
    const isWrongNetwork = chain && Number(chain.id) !== Number(metadata.chainId);

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Event Card */}
                <Card className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-base/20 via-optimism/20 to-celo/20 border-b border-white/10">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                                <CardTitle className="text-3xl font-heading text-white">{metadata.name}</CardTitle>
                                <p className="text-white/70">{metadata.description}</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                <Network className="w-4 h-4 text-white" />
                                <span className="text-sm font-medium text-white">{networkName}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        {/* Event Image */}
                        {metadata.imageURI && (
                            <div className="relative rounded-xl overflow-hidden aspect-square max-w-md mx-auto border border-white/10">
                                <img
                                    src={metadata.imageURI}
                                    alt={metadata.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-white/60">Supply</span>
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    {remainingSupply !== undefined ? `${remainingSupply.toString()}/${metadata.maxSupply.toString()}` : "Loading..."}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                    <span className="text-sm text-white/60">Status</span>
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    {isExpired ? "Expired" : isSoldOut ? "Sold Out" : "Active"}
                                </p>
                            </div>
                        </div>

                        {/* Claim Section */}
                        <div className="space-y-4">
                            {error && (
                                <ErrorAlert
                                    title={error.title}
                                    message={error.message}
                                    onRetry={error.title === "Claim Failed" ? handleClaim : undefined}
                                    onDismiss={() => setError(null)}
                                />
                            )}

                            {isSuccess && hash && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-6 h-6 text-green-400" />
                                        <p className="text-lg font-bold text-green-400">Successfully Claimed!</p>
                                    </div>
                                    <p className="text-white/70">You've successfully claimed your SURGE token.</p>
                                    <div className="flex gap-3">
                                        <Link href="/gallery">
                                            <Button className="bg-white text-black hover:bg-white/90">
                                                View in Gallery
                                            </Button>
                                        </Link>
                                        <a
                                            href={`https://${networkName.toLowerCase() === 'base' ? 'basescan.org' : 'etherscan.io'}/tx/${hash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">
                                                View Transaction
                                                <ExternalLink className="w-4 h-4 ml-2" />
                                            </Button>
                                        </a>
                                    </div>
                                </div>
                            )}

                            {!isSuccess && (
                                <>
                                    {!isConnected ? (
                                        <Button className="w-full h-14 text-lg bg-white text-black hover:bg-white/90" disabled>
                                            Connect Wallet to Claim
                                        </Button>
                                    ) : isWrongNetwork ? (
                                        <Button
                                            className="w-full h-14 text-lg bg-yellow-500 text-black hover:bg-yellow-400"
                                            onClick={() => switchChain({ chainId: Number(metadata.chainId) })}
                                        >
                                            Switch to {networkName}
                                        </Button>
                                    ) : hasUserClaimed ? (
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 text-center">
                                            <CheckCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                                            <p className="text-lg font-bold text-blue-400">Already Claimed</p>
                                            <p className="text-white/70 mt-2">You've already claimed this SURGE token.</p>
                                            <Link href="/gallery">
                                                <Button variant="outline" className="mt-4 border-white/10 text-white hover:bg-white/10">
                                                    View in Gallery
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : isExpired ? (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                                            <Clock className="w-12 h-12 text-red-400 mx-auto mb-3" />
                                            <p className="text-lg font-bold text-red-400">Event Expired</p>
                                            <p className="text-white/70 mt-2">This claim period has ended.</p>
                                        </div>
                                    ) : isSoldOut ? (
                                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 text-center">
                                            <Users className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                                            <p className="text-lg font-bold text-yellow-400">Sold Out</p>
                                            <p className="text-white/70 mt-2">All tokens have been claimed.</p>
                                        </div>
                                    ) : (
                                        <Button
                                            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-base via-optimism to-celo hover:opacity-90 text-white"
                                            onClick={handleClaim}
                                            disabled={isPending || isConfirming}
                                        >
                                            {isPending || isConfirming ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    {isPending ? "Claiming..." : "Confirming..."}
                                                </>
                                            ) : (
                                                "Claim SURGE Token"
                                            )}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Back Button */}
                <div className="text-center">
                    <Link href="/events">
                        <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                            ← Back to Events
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
