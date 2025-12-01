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
                // Minimal accent palette
                accent: {
                    DEFAULT: "#4a9eff",
                    muted: "#2a5a8f",
                    light: "#7ab8ff",
                },
                // Neutral grays
                neutral: {
                    50: "#f5f5f5",
                    100: "#e0e0e0",
                    200: "#c0c0c0",
                    300: "#a0a0a0",
                    400: "#808080",
                    500: "#6a6a6a",
                    600: "#4a4a4a",
                    700: "#2a2a2a",
                    800: "#1a1a1a",
                    900: "#0a0a0a",
                },
                border: "var(--border)",
                muted: {
                    DEFAULT: "var(--text-muted)",
                    foreground: "var(--text-secondary)",
                },
                card: {
                    DEFAULT: "rgba(255, 255, 255, 0.02)",
                    foreground: "var(--text-primary)",
                    hover: "rgba(255, 255, 255, 0.04)",
                },
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
            },
            backgroundImage: {
                'dot-pattern': 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
            },
            backgroundSize: {
                'dot': '24px 24px',
            },
        },
    },
    plugins: [],
};
export default config;
