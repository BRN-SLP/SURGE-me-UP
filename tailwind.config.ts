import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0B0C10",
                foreground: "#F0F0F0",

                // --- Superchain Identity Palette (Merged Superset) ---

                // Main Brand (from Home/Generator)
                primary: {
                    DEFAULT: "#3B82F6", // Soft Blue default
                    glow: "#60A5FA",
                    dark: "#1337ec", // Generator primary
                },
                secondary: "#1F2833",

                // Accents
                accent: {
                    DEFAULT: "#45A29E",
                    hover: "#66FCF1",
                    purple: "#A78BFA", // Mystic Purple / Lavender
                    blue: "#60A5FA",   // Soft Blue
                    mint: "#34D399",   // Growth Mint
                    yellow: "#fde047",
                    red: "#fca5a5",
                },

                // Specific Page Theme Aliases (to support pasted HTML)

                // Design System / Dark
                "background-dark": "#0B0C15",
                "surface-dark": "#151725",
                "surface-highlight": "#1E2136",
                "border-dark": "#2A2F45",
                "text-main": "#FFFFFF",
                "text-secondary": "#94A3B8",
                "text-tertiary": "#64748B",

                // Manage Wallets
                "surge-bg": "#0B0B0F",
                "surge-surface": "#14151F",
                "surge-surface-hover": "#1D1E2C",
                "surge-border": "#252736",
                "surge-black": "#0B0C15",
                "surge-charcoal": "#121421",

                // Home Page / Marketing
                lavender: { DEFAULT: "#e9d5ff", dark: "#c084fc" },
                aqua: { DEFAULT: "#a5f3fc", dark: "#22d3ee" },
                mint: { DEFAULT: "#34d399", light: "#6ee7b7", dark: "#10b981" },
                surface: { DEFAULT: "#020617", card: "#0f172a" },
                "text-header": "#f8fafc",
                "text-muted": "#94a3b8",

                // Claim Page (LayerZero style)
                "lz-bg": "#06070a",
                "lz-card": "#0e1016",
                "lz-border": "#1e212b",
                "lz-primary": "#4C82FB",
                "lz-purple": "#a855f7",
                "lz-mint": "#2dd4bf",
                "lz-text-main": "#FFFFFF",
                "lz-text-muted": "#94A3B8",

                // Legacy/System
                muted: {
                    DEFAULT: "#1F2833",
                    foreground: "#8892b0",
                },
                border: "#1F2833",

                // Network Colors
                base: { DEFAULT: "#0052FF", neon: "#3374FF" },
                optimism: { DEFAULT: "#FF0000", neon: "#FF334B" },
                celo: { DEFAULT: "#FCCC16", neon: "#FEFF85" },
                zora: { DEFAULT: "#8A63D2", neon: "#A888E0" },
                ink: { DEFAULT: "#9945FF", neon: "#BC6BFF" },
                lisk: { DEFAULT: "#4070F4", neon: "#6690FF" },
                unichain: { DEFAULT: "#FF007A", neon: "#FF339A" },
                soneium: { DEFAULT: "#5B21B6", neon: "#7C3AED" },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                heading: ["var(--font-outfit)", "sans-serif"],
                display: ["var(--font-space-grotesk)", "sans-serif"],
                body: ["var(--font-noto-sans)", "sans-serif"],
                mono: ["monospace"],
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1f2833 1px, transparent 1px), linear-gradient(to bottom, #1f2833 1px, transparent 1px)",
                'gradient-surge': 'linear-gradient(135deg, rgba(192, 132, 252, 0.1) 0%, rgba(96, 165, 250, 0.1) 50%, rgba(52, 211, 153, 0.1) 100%)',
                'soft-gradient': 'linear-gradient(135deg, #e9d5ff 0%, #a5f3fc 100%)',
                'dark-gradient': 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out 3s infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'blob': 'blob 10s infinite',
                'shimmer': 'shimmer 2.5s linear infinite',
                'spin-slow': 'spin 20s linear infinite',
                'spin-reverse-slow': 'spin 25s linear infinite reverse',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
