'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { base, baseSepolia, optimismSepolia, celoAlfajores } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Get projectId
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'cc1492a490250c8a83769eb7cc50d383'

if (!projectId) {
    throw new Error('Project ID is not defined')
}

export const networks = [base, baseSepolia, optimismSepolia, celoAlfajores]

// Create wagmiAdapter locally to avoid import issues
export const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
})

// Set up queryClient
const queryClient = new QueryClient()

// Set up metadata
const metadata = {
    name: "SURGE me UP",
    description: "Amplify your achievements with SURGE - the Superchain recognition engine",
    url: "http://185.229.251.126:3000",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
}

// Create the modal
const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [base, baseSepolia, optimismSepolia, celoAlfajores] as any,
    defaultNetwork: base,
    metadata: metadata,
    features: {
        analytics: true
    }
})

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

export default ContextProvider
