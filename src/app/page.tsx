import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ArrowRight, BadgeCheck, Zap, Globe, Shield, Activity, Users, Layers } from "lucide-react";

// Real Data Constants
const STATS = [
    { label: "Supported Networks", value: "8", icon: Globe },
    { label: "Active Events", value: "124+", icon: Activity },
    { label: "Badges Minted", value: "15k+", icon: BadgeCheck },
    { label: "Builders", value: "2.4k+", icon: Users },
];

const FEATURES = [
    {
        title: "Multi-Chain Events",
        description: "Deploy recognition events across Base, Optimism, Celo, Zora, and more with a single click.",
        icon: Layers,
    },
    {
        title: "Identity Anchor",
        description: "Secure your on-chain reputation with non-transferable Soulbound Tokens (SBTs).",
        icon: Shield,
    },
    {
        title: "Cross-Chain Bridge",
        description: "Seamlessly move your reputation and badges between Superchain networks via native messaging.",
        icon: Globe,
    },
    {
        title: "Instant Verification",
        description: "Automated verification for event attendees with Sybil resistance and bot protection.",
        icon: Zap,
    },
];

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-accent selection:text-black">

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="container relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-4">
                    <div className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-sm font-medium text-accent backdrop-blur-sm mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-accent mr-2 animate-pulse"></span>
                        v2.0 Now Live on Superchain
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 font-heading">
                        SURGE<span className="text-accent">.</span> ME UP
                    </h1>

                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
                        The ultimate recognition engine for the Superchain. Build reputation, issue badges, and grow your community across 8+ networks.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Button size="lg" variant="builder-solid" className="h-14 px-8 text-base">
                            Start Building <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="builder-outline" className="h-14 px-8 text-base">
                            View Documentation
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="border-y border-white/5 bg-white/[0.02]">
                <div className="container grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
                    {STATS.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center justify-center py-12 px-4 text-center group hover:bg-white/[0.02] transition-colors">
                            <stat.icon className="h-6 w-6 text-accent mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <span className="text-3xl font-bold tracking-tight text-white mb-1 font-heading">{stat.value}</span>
                            <span className="text-sm text-muted-foreground uppercase tracking-widest text-[10px]">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 md:py-32">
                <div className="container">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-4 font-heading">
                                Engineered for <span className="text-accent">Scale</span>
                            </h2>
                            <p className="text-muted-foreground">
                                Built on the OP Stack, SURGE provides the infrastructure for verifiable on-chain identity and community growth.
                            </p>
                        </div>
                        <Button variant="link" className="text-accent hover:text-white">
                            All Features <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feature, index) => (
                            <Card key={index} className="group hover:border-accent/50 transition-colors">
                                <CardHeader>
                                    <feature.icon className="h-10 w-10 text-accent mb-4 stroke-1 group-hover:scale-110 transition-transform duration-300" />
                                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-accent/5 opacity-20" />
                <div className="container relative z-10 text-center">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-8 font-heading">
                        Ready to <span className="text-accent">SURGE</span>?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Join thousands of builders and communities already deploying on the Superchain.
                    </p>
                    <Button size="lg" variant="builder-solid" className="h-16 px-12 text-lg">
                        Launch App Now
                    </Button>
                </div>
            </section>
        </div>
    );
}
