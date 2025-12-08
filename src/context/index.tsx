'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { base, optimism, celo, zora, defineChain } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

// Get projectId
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'cc1492a490250c8a83769eb7cc50d383'

if (!projectId) {
    throw new Error('Project ID is not defined')
}

// Define custom chains for new L2s
const ink = defineChain({
    id: 57073,
    caipNetworkId: 'eip155:57073',
    chainNamespace: 'eip155',
    name: 'Ink',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc-gel.inkonchain.com'] } },
    blockExplorers: { default: { name: 'Inkscout', url: 'https://explorer.inkonchain.com' } },
})

const lisk = defineChain({
    id: 1135,
    caipNetworkId: 'eip155:1135',
    chainNamespace: 'eip155',
    name: 'Lisk',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.api.lisk.com'] } },
    blockExplorers: { default: { name: 'Blockscout', url: 'https://blockscout.lisk.com' } },
})

const unichain = defineChain({
    id: 130,
    caipNetworkId: 'eip155:130',
    chainNamespace: 'eip155',
    name: 'Unichain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.unichain.org'] } },
    blockExplorers: { default: { name: 'Blockscout', url: 'https://unichain.blockscout.com' } },
})

const soneium = defineChain({
    id: 1868,
    caipNetworkId: 'eip155:1868',
    chainNamespace: 'eip155',
    name: 'Soneium',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.soneium.org'] } },
    blockExplorers: { default: { name: 'Blockscout', url: 'https://soneium.blockscout.com' } },
})

// All supported networks (8 mainnets)
export const networks = [base, optimism, celo, zora, ink, lisk, unichain, soneium]

// Create wagmiAdapter
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
    url: "http://157.180.7.165:3000",
    icons: ["https://avatars.githubusercontent.com/u/179229932"],
}

// Create the modal
const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: networks as any,
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
