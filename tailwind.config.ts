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
                background: "var(--background)",
                foreground: "var(--foreground)",
                // LayerZero-inspired accent palette
                accent: {
                    DEFAULT: "#0ae448", // Bright green (LayerZero style)
                    muted: "#0ac23c",
                    light: "#3dff6f",
                    dark: "#089e38",
                },
                // Secondary accents
                secondary: {
                    DEFAULT: "#00d9ff", // Teal/cyan
                    muted: "#00b8d9",
                },
                tertiary: {
                    DEFAULT: "#ff0080", // Pink/magenta
                    muted: "#d9006c",
                },
                // Neutral grays (darker for LayerZero style)
                neutral: {
                    50: "#f5f5f5",
                    100: "#e0e0e0",
                    200: "#c0c0c0",
                    300: "#a0a0a0",
                    400: "#707070",
                    500: "#505050",
                    600: "#2a2a2a",
                    700: "#1a1a1a",
                    800: "#141414",
                    900: "#0d0d0d",
                },
                border: "var(--border)",
                muted: {
                    DEFAULT: "var(--text-muted)",
                    foreground: "var(--text-secondary)",
                },
                card: {
                    DEFAULT: "rgba(255, 255, 255, 0.03)",
                    foreground: "var(--text-primary)",
                    hover: "rgba(255, 255, 255, 0.06)",
                },
                // Superchain Network Colors
                base: "#0052FF",           // Base blue
                optimism: "#FF0420",       // Optimism red
                celo: "#35D07F",           // Celo green
                zora: "#5E3FBE",           // Zora purple
                ink: "#7C3AED",            // Ink purple
                lisk: "#0ABBED",           // Lisk blue
                unichain: "#FF007A",       // Unichain pink
                soneium: "#8B5CF6",        // Soneium purple
            },
            boxShadow: {
                'glow-sm': '0 0 10px rgba(10, 228, 72, 0.3)',
                'glow': '0 0 20px rgba(10, 228, 72, 0.4)',
                'glow-lg': '0 0 30px rgba(10, 228, 72, 0.5)',
                'glow-teal': '0 0 20px rgba(0, 217, 255, 0.4)',
                'glow-pink': '0 0 20px rgba(255, 0, 128, 0.4)',
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                heading: ["var(--font-outfit)", "sans-serif"],
            },
            fontWeight: {
                'extralight': '200',
                'light': '300',
                'normal': '400',
                'medium': '500',
            },
            letterSpacing: {
                tighter: '-0.02em',
                tight: '-0.01em',
                normal: '0',
                wide: '0.01em',
                wider: '0.02em',
                widest: '0.03em',
            },
            borderWidth: {
                'fine': '0.5px',
            },
            animation: {
                "fade-in": "fadeIn 0.6s ease-out forwards",
                "fade-in-slow": "fadeIn 1s ease-out forwards",
                "slide-up": "slideUp 0.6s ease-out forwards",
                "gradient-text": "gradient 8s linear infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0", transform: "translateY(8px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideUp: {
                    "0%": { opacity: "0", transform: "translateY(16px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                gradient: {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
            },
            backgroundImage: {
                'dot-pattern': 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
            },
            backgroundSize: {
                'dot': '24px 24px',
            },
        },
    },
    plugins: [],
};
export default config;
