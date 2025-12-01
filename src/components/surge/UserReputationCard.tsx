// User Reputation Display Component
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserReputation, useUserBadges } from "@/hooks/useSurgeContracts";
import { useAccount } from "wagmi";
import { Trophy, Flame, Star } from "lucide-react";

export function UserReputationCard() {
    const { address } = useAccount();
    const reputation = useUserReputation();
    const badges = useUserBadges();

    if (!address) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    Connect your wallet to view reputation
                </CardContent>
            </Card>
        );
    }

    if (!reputation) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                    Loading reputation...
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Reputation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                            <div className="text-2xl font-bold">{reputation.totalPoints.toString()}</div>
                            <div className="text-sm text-muted-foreground">Total Points</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-blue-500" />
                        <div>
                            <div className="text-2xl font-bold">{reputation.totalClaims.toString()}</div>
                            <div className="text-sm text-muted-foreground">Total Claims</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <div>
                            <div className="text-2xl font-bold">{reputation.currentStreak.toString()}</div>
                            <div className="text-sm text-muted-foreground">Current Streak</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Flame className="w-5 h-5 text-red-500" />
                        <div>
                            <div className="text-2xl font-bold">{reputation.longestStreak.toString()}</div>
                            <div className="text-sm text-muted-foreground">Longest Streak</div>
                        </div>
                    </div>
                </div>

                {badges && badges.length > 0 && (
                    <div>
                        <div className="text-sm font-medium mb-2">Badges</div>
                        <div className="flex flex-wrap gap-2">
                            {badges.map((badge, idx) => (
                                <div key={idx} className="px-3 py-1 bg-accent/20 rounded-full text-sm">
                                    Badge #{badge.toString()}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
