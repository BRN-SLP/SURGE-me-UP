// Example: Create SURGE Event Component
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateSurgeEvent } from "@/hooks/useSurgeContracts";
import { DistributionMode } from "@/types/surge";
import { useAccount } from "wagmi";
import { LoadingState } from "@/components/ui/LoadingState";
import { SuccessModal } from "@/components/ui/SuccessModal";
import type { Address } from "viem";

export function CreateEventExample() {
    const { address, isConnected } = useAccount();
    const { createEvent, isPending, isConfirming, isSuccess, hash } = useCreateSurgeEvent();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageURI: "",
        maxSupply: "1000",
        expiryDays: "30",
    });

    const handleSubmit = async () => {
        if (!isConnected || !address) {
            alert("Please connect your wallet");
            return;
        }

        const metadata = {
            name: formData.name,
            description: formData.description,
            imageURI: formData.imageURI || "ipfs://default",
            chainId: BigInt(8453), // Current chain - should come from useAccount
            tier: 0, // Community tier
            maxSupply: BigInt(formData.maxSupply),
            expiryTimestamp: BigInt(Math.floor(Date.now() / 1000) + (parseInt(formData.expiryDays) * 86400)),
            mode: DistributionMode.Public,
            creator: address,
        };

        const config = {
            merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
            startTimestamp: BigInt(Math.floor(Date.now() / 1000)),
        };

        try {
            await createEvent(metadata, config);
        } catch (error) {
            console.error("Failed to create event:", error);
        }
    };

    if (isSuccess) {
        return (
            <Card>
                <CardContent className="py-8 text-center space-y-4">
                    <div className="text-green-500 text-6xl">✓</div>
                    <h3 className="text-2xl font-bold">Event Created!</h3>
                    <p className="text-muted-foreground">Your SURGE event has been created successfully</p>
                    {hash && (
                        <a
                            href={`https://basescan.org/tx/${hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                        >
                            View on Basescan
                        </a>
                    )}
                    <Button onClick={() => window.location.reload()}>
                        Create Another
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create SURGE Event</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <label className="block text-sm mb-2">Event Name</label>
                    <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="My Awesome Event"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-2">Description</label>
                    <Input
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Event description"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-2">Image URI (IPFS)</label>
                    <Input
                        value={formData.imageURI}
                        onChange={(e) => setFormData(prev => ({ ...prev, imageURI: e.target.value }))}
                        placeholder="ipfs://..."
                    />
                </div>

                <div>
                    <label className="block text-sm mb-2">Max Supply</label>
                    <Input
                        type="number"
                        value={formData.maxSupply}
                        onChange={(e) => setFormData(prev => ({ ...prev, maxSupply: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-sm mb-2">Expires In (Days)</label>
                    <Input
                        type="number"
                        value={formData.expiryDays}
                        onChange={(e) => setFormData(prev => ({ ...prev, expiryDays: e.target.value }))}
                    />
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={!isConnected || isPending || isConfirming}
                    className="w-full"
                >
                    {isPending || isConfirming ? (
                        <LoadingState message={isPending ? "Creating..." : "Confirming..."} variant="minimal" />
                    ) : (
                        "Create Event"
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
