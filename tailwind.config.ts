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
                background: "#0B0C10", // Deepest Navy/Black
                foreground: "#F0F0F0", // Off-white for text

                // LayerZero-inspired Accent Palette
                primary: {
                    DEFAULT: "#FFFFFF", // Sharp White for high contrast actions
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "#1F2833", // Dark Slate
                    foreground: "#66FCF1", // Cyan/Electric Blue highlight
                },
                accent: {
                    DEFAULT: "#45A29E", // Muted Cyan
                    hover: "#66FCF1",   // Bright Cyan
                },
                muted: {
                    DEFAULT: "#1F2833",
                    foreground: "#8892b0", // Muted text
                },
                border: "#1F2833", // Subtle border

                // Superchain Network Colors (Preserved)
                base: "#0052FF",
                optimism: "#FF0000",
                celo: "#FCCC16",
                zora: "#8A63D2",
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                heading: ["var(--font-outfit)", "sans-serif"],
                mono: ["monospace"], // Technical feel
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1f2833 1px, transparent 1px), linear-gradient(to bottom, #1f2833 1px, transparent 1px)",
            },
            backgroundSize: {
                'grid': '40px 40px',
            },
        },
    },
    plugins: [],
};
export default config;
