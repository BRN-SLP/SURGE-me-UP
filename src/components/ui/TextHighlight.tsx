"use client";

import { cn } from "@/lib/utils";

interface TextHighlightProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * GradientText component
 * Adds a shimmering gradient effect to the text using CSS
 */
export function GradientText({ children, className }: TextHighlightProps) {
    return (
        <span className={cn("animate-gradient-text font-bold", className)}>
            {children}
        </span>
    );
}

/**
 * HighlightText component
 * Adds an animated marker-style highlight behind the text using CSS
 */
export function HighlightText({ children, className }: TextHighlightProps) {
    return (
        <span className={cn("highlight-text-container", className)}>
            <span className="highlight-text-bg" />
            <span className="relative z-10">{children}</span>
        </span>
    );
}
