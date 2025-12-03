import React from "react";

export const BaseLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12" fill="none" />
        <circle cx="50" cy="50" r="20" fill="currentColor" />
    </svg>
);

export const OptimismLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="#FF0420" />
        <path d="M30 50 L70 50 M50 30 L50 70" stroke="white" strokeWidth="8" strokeLinecap="round" />
        <path d="M35 35 L65 65 M65 35 L35 65" stroke="white" strokeWidth="8" strokeLinecap="round" />
    </svg>
);

// Simplified Optimism "O" logo
export const OptimismLogoSimple = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M50 5C25.147 5 5 25.147 5 50S25.147 95 50 95 95 74.853 95 50 74.853 5 50 5ZM50 85C30.67 85 15 69.33 15 50S30.67 15 50 15 85 30.67 85 50 69.33 85 50 85Z" />
    </svg>
);


export const CeloLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <circle cx="50" cy="30" r="20" fill="#FCFF52" />
        <circle cx="30" cy="70" r="20" fill="#47E5BC" />
        <circle cx="70" cy="70" r="20" fill="#47E5BC" />
    </svg>
);

// Simplified Celo Rings
export const CeloLogoSimple = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M50 20 A 20 20 0 1 0 50 60 A 20 20 0 1 0 50 20 Z M30 50 A 20 20 0 1 0 30 90 A 20 20 0 1 0 30 50 Z M70 50 A 20 20 0 1 0 70 90 A 20 20 0 1 0 70 50 Z" fill="none" stroke="currentColor" strokeWidth="8" />
    </svg>
);


export const ZoraLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" />
        <circle cx="50" cy="50" r="20" fill="currentColor" />
    </svg>
);

export const ModeLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <rect x="20" y="20" width="20" height="60" rx="4" />
        <rect x="50" y="20" width="20" height="60" rx="4" />
        <rect x="80" y="20" width="20" height="60" rx="4" />
    </svg>
);

export const FraxtalLogo = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
        <path d="M50 10 L90 90 L10 90 Z" fill="none" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
        <path d="M50 35 L70 75 L30 75 Z" fill="currentColor" />
    </svg>
);
