"use client";

import React, { ReactNode } from "react";
import { wagmiAdapter, projectId, networks } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { mainnet } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { ThemeProvider } from "next-themes";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
    throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
    name: "SURGE me UP",
    description: "The Future of On-Chain Identity",
    url: "https://surge-me-up.vercel.app",
    icons: ["https://surge-me-up.vercel.app/favicon.svg"],
};

// Create the modal
const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    defaultNetwork: mainnet,
    metadata: metadata,
    features: {
        analytics: true,
    },
});

function ContextProvider({
    children,
    cookies,
}: {
    children: ReactNode;
    cookies: string | null;
}) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

    return (
        <WagmiProvider
            config={wagmiAdapter.wagmiConfig as Config}
            initialState={initialState}
        >
            <QueryClientProvider client={queryClient}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange
                >
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export default ContextProvider;
