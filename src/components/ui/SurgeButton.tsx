"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";

const buttonVariants = cva(
    "relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
    {
        variants: {
            variant: {
                stroke:
                    "border border-white text-white hover:text-black hover:border-transparent bg-transparent rounded-none uppercase tracking-wider",
                neon:
                    "bg-gradient-to-r from-lavender-dark to-aqua-dark text-white rounded-full font-bold shadow-lg hover:shadow-lavender/25 hover:brightness-110 border border-transparent hover:-translate-y-0.5",
                glass:
                    "bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-white/20 shadow-sm",
                ghost:
                    "hover:bg-white/5 text-white/70 hover:text-white rounded-lg",
            },
            size: {
                default: "h-12 px-8 py-2",
                sm: "h-9 px-4 text-xs",
                lg: "h-14 px-10 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "stroke",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    href?: string;
    flairColor?: string;
}

const SurgeButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, children, href, flairColor = "bg-white", ...props }, ref) => {
        const [isFlaring, setIsFlaring] = React.useState(false);
        const [clickCoords, setClickCoords] = React.useState({ x: 0, y: 0 });

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (variant === "stroke") {
                const rect = e.currentTarget.getBoundingClientRect();
                setClickCoords({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
                setIsFlaring(true);
                setTimeout(() => setIsFlaring(false), 600);
            }
            props.onClick?.(e);
        };

        const content = (
            <>
                {/* Flair Effect for separate stroke variant */}
                {variant === "stroke" && (
                    <span
                        className={cn(
                            "absolute pointer-events-none rounded-full mix-blend-difference z-0",
                            flairColor,
                            isFlaring ? "animate-flair" : "opacity-0"
                        )}
                        style={{
                            left: clickCoords.x,
                            top: clickCoords.y,
                            width: "20px",
                            height: "20px",
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                )}

                {/* Fill animation for stroke variant on hover */}
                {variant === "stroke" && (
                    <span className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0" />
                )}

                <span className={cn("relative z-10 flex items-center gap-2", variant === "stroke" && "mix-blend-exclusion")}>
                    {children}
                </span>
            </>
        );

        if (href) {
            return (
                <Link
                    href={href}
                    className={cn(buttonVariants({ variant, size, className }))}
                >
                    {content}
                </Link>
            );
        }

        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                onClick={handleClick}
                {...props}
            >
                {content}
            </button>
        );
    }
);
SurgeButton.displayName = "SurgeButton";

export { SurgeButton, buttonVariants };
