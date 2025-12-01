// Example: Claim Token Component
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    useClaimToken,
    useEventMetadata,
    useRemainingSupply,
    useHasUserClaimed
} from "@/hooks/useSurgeContracts";
import { useAccount } from "wagmi";
import type { Address } from "viem";
import { LoadingState } from "@/components/ui/LoadingState";
import { CheckCircle2 } from "lucide-react";

interface ClaimTokenProps {
    eventAddress: Address;
}

export function ClaimToken({ eventAddress }: ClaimTokenProps) {
    const { isConnected } = useAccount();
    const metadata = useEventMetadata(eventAddress);
    const remaining = useRemainingSupply(eventAddress);
    const hasClaimed = useHasUserClaimed(eventAddress);
    const { claim, isPending, isConfirming, isSuccess } = useClaimToken(eventAddress);

    const handleClaim = async () => {
        try {
            await claim();
        } catch (error) {
            console.error("Claim failed:", error);
        }
    };

    if (!metadata) {
        return <LoadingState message="Loading event..." />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{metadata.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{metadata.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span>Remaining Supply:</span>
                    <span className="font-mono">{remaining?.toString() || "..."}</span>
                </div>

                {hasClaimed ? (
                    <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>You've already claimed this token!</span>
                    </div>
                ) : isSuccess ? (
                    <div className="flex items-center gap-2 text-green-500">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Claim successful!</span>
                    </div>
                ) : (
                    <Button
                        onClick={handleClaim}
                        disabled={!isConnected || isPending || isConfirming}
                        className="w-full"
                    >
                        {isPending || isConfirming ? (
                            <LoadingState message={isPending ? "Claiming..." : "Confirming..."} variant="minimal" />
                        ) : (
                            "Claim Token"
                        )}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
