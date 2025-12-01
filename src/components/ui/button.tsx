"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-light tracking-wide ring-offset-background transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-40",
    {
        variants: {
            variant: {
                default: "border border-accent bg-accent text-white hover:bg-accent/80 hover:scale-[1.02] transition-all duration-200",
                outline: "border border-white/15 bg-transparent hover:bg-white/5 hover:border-white/25 text-white",
                ghost: "hover:bg-white/5 text-neutral-300 hover:text-white",
                minimal: "border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 text-white backdrop-blur-sm",
                link: "text-accent hover:text-accent-light underline-offset-4 hover:underline",
                sketch: "border border-white/20 bg-transparent text-white hover:bg-white/[0.03] sketch-border",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
