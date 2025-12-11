"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium tracking-wide ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40",
    {
        variants: {
            variant: {
                default: "border border-accent bg-accent text-neutral-900 hover:bg-accent/90 hover:shadow-glow",
                outline: "border border-accent/60 bg-transparent text-accent hover:bg-accent/10 hover:border-accent hover:shadow-glow-sm",
                ghost: "hover:bg-white/5 text-neutral-300 hover:text-white",
                minimal: "border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 text-white backdrop-blur-sm",
                link: "text-accent hover:text-accent-light underline-offset-4 hover:underline",
                secondary: "border border-secondary/60 bg-transparent text-secondary hover:bg-secondary/10 hover:border-secondary hover:shadow-glow-teal",
                "gsap-cta": "rounded-full border-2 border-accent bg-transparent text-white hover:shadow-glow hover:scale-105 transition-all duration-300",
                "gsap-demo": "rounded-full border-2 border-white/20 bg-transparent text-white hover:border-white hover:bg-white/5 transition-all duration-300",
            },
            size: {
                default: "h-11 px-6 py-2.5",
                sm: "h-9 rounded-md px-4 text-xs",
                lg: "h-14 rounded-lg px-10 text-base",
                icon: "h-11 w-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

import { useButtonShine } from "@/lib/gsap-hooks"
import { useMergeRefs } from "@/hooks/useMergeRefs"

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        // Apply shine effect to default and outline variants
        const hasShine = variant === "default" || variant === "outline";
        const shineRef = useButtonShine();
        const mergedRef = useMergeRefs(ref, hasShine ? shineRef : null);

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={mergedRef}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
