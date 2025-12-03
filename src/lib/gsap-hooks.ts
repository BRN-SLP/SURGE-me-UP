"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook for fade-in animation on mount (no scroll trigger)
 */
export function useFadeIn(delay = 0) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const animation = gsap.fromTo(
            element,
            {
                opacity: 0,
                y: 50,
            },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                delay,
                ease: "power3.out",
            }
        );

        return () => {
            animation.kill();
        };
    }, [delay]);

    return ref;
}

/**
 * Hook for magnetic button effect
 */
export function useMagnetic(strength = 0.3) {
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const button = ref.current;

        const handleMouseMove = (e: MouseEvent) => {
            const { left, top, width, height } = button.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;

            const deltaX = (e.clientX - centerX) * strength;
            const deltaY = (e.clientY - centerY) * strength;

            gsap.to(button, {
                x: deltaX,
                y: deltaY,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)",
            });
        };

        button.addEventListener("mousemove", handleMouseMove);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            button.removeEventListener("mousemove", handleMouseMove);
            button.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [strength]);

    return ref;
}

/**
 * Hook for smooth reveal animation
 */
export function useReveal(duration = 0.8) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        gsap.fromTo(
            element,
            {
                opacity: 0,
                scale: 0.8,
            },
            {
                opacity: 1,
                scale: 1,
                duration,
                ease: "back.out(1.7)",
            }
        );
    }, [duration]);

    return ref;
}

/**
 * Hook for gradient animation
 */
export function useGradientAnimation() {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        gsap.to(element, {
            backgroundPosition: "200% center",
            duration: 3,
            ease: "none",
            repeat: -1,
            yoyo: true,
        });
    }, []);

    return ref;
}

/**
 * Hook for floating animation (up and down)
 */
export function useFloating(duration = 2, distance = 10) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        gsap.to(element, {
            y: distance,
            duration: duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });
    }, [duration, distance]);

    return ref;
}

/**
 * Hook for Hero section scroll effects (Portal effect)
 */
export function useHeroScroll(
    heroRef: React.RefObject<HTMLElement | null>,
    titleRef: React.RefObject<HTMLElement | null>,
    blobsRef: React.RefObject<HTMLElement | null>[]
) {
    useEffect(() => {
        if (!heroRef.current || !titleRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
            }
        });

        // Title moves up and fades out
        tl.to(titleRef.current, {
            scale: 0.8,
            opacity: 0,
            y: -100,
            ease: "none",
        }, 0);

        // Blobs expand and rotate
        blobsRef.forEach((blob, i) => {
            if (blob.current) {
                tl.to(blob.current, {
                    scale: 2,
                    rotation: i % 2 === 0 ? 90 : -90,
                    opacity: 0,
                    ease: "none",
                }, 0);
            }
        });

        return () => {
            tl.kill();
        };
    }, [heroRef, titleRef, blobsRef]);
}

/**
 * Hook for animated count-up effect
 */
export function useCountUp(target: number, duration = 2, suffix = "") {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;
        const obj = { value: 0 };

        const animation = gsap.to(obj, {
            value: target,
            duration,
            delay: 0.5,
            ease: "power2.out",
            onUpdate: () => {
                if (element) {
                    element.textContent = Math.floor(obj.value) + suffix;
                }
            },
        });

        return () => {
            animation.kill();
        };
    }, [target, duration, suffix]);

    return ref;
}

/**
 * Hook for staggered animations
 */
export function useStagger(delay = 0.1, stagger = 0.1) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const children = ref.current.children;
        const ctx = gsap.context(() => {
            gsap.fromTo(
                children,
                {
                    opacity: 0,
                    y: 30,
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay,
                    stagger,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: ref.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }, ref);

        return () => ctx.revert();
    }, [delay, stagger]);

    return ref;
}

/**
 * Hook for parallax scroll effect
 */
export function useParallax(speed = 0.5) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const animation = gsap.to(element, {
            y: () => window.innerHeight * speed,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
            },
        });

        return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
        };
    }, [speed]);

    return ref;
}

/**
 * Hook for SVG path drawing animation
 */
export function useDrawSVG(duration = 2, delay = 0) {
    const ref = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const path = ref.current;
        const length = path.getTotalLength();

        // Set up the starting positions
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;

        const animation = gsap.to(path, {
            strokeDashoffset: 0,
            duration,
            delay,
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: path,
                start: "top 80%",
                toggleActions: "play none none reset",
            },
        });

        return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
        };
    }, [duration, delay]);

    return ref;
}

/**
 * Hook for scroll progress indicator
 */
export function useScrollProgress() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const animation = gsap.to(element, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 0.3,
            },
        });

        return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
        };
    }, []);

    return ref;
}
/**
 * Hook for button shine effect (cursor-following gradient like GSAP)
 */
export function useButtonShine() {
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const button = ref.current;

        // Create the shine overlay if it doesn't exist
        let shine = button.querySelector(".btn-shine") as HTMLDivElement;
        if (!shine) {
            shine = document.createElement("div");
            shine.classList.add("btn-shine");
            shine.style.position = "absolute";
            shine.style.inset = "0";
            shine.style.borderRadius = "inherit";
            shine.style.pointerEvents = "none";
            shine.style.zIndex = "1";
            shine.style.opacity = "0";
            shine.style.background = "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)";
            shine.style.backgroundSize = "200% 100%";
            shine.style.backgroundPosition = "100% 50%";
            shine.style.mixBlendMode = "overlay";

            button.style.position = "relative";
            button.style.overflow = "hidden";
            button.appendChild(shine);

            // Ensure content is above shine
            Array.from(button.children).forEach((child) => {
                if (child !== shine && child instanceof HTMLElement) {
                    child.style.position = "relative";
                    child.style.zIndex = "2";
                }
            });
        }

        const handleMouseMove = (e: MouseEvent) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const xPercent = (x / rect.width) * 100;

            // Move gradient based on cursor position
            gsap.to(shine, {
                opacity: 1,
                backgroundPosition: `${xPercent}% 50%`,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseLeave = () => {
            gsap.to(shine, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        button.addEventListener("mousemove", handleMouseMove);
        button.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            button.removeEventListener("mousemove", handleMouseMove);
            button.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return ref;
}
/**
 * Hook for text gradient animation on scroll
 */
export function useScrollGradientText() {
    const ref = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        // Set initial gradient styles
        element.style.backgroundImage = "linear-gradient(to right, #0052FF, #FF0420, #FCCC16, #0052FF)";
        element.style.backgroundSize = "200% auto";
        element.style.webkitBackgroundClip = "text";
        element.style.webkitTextFillColor = "transparent";
        element.style.backgroundClip = "text";
        element.style.color = "transparent";

        const animation = gsap.to(element, {
            backgroundPosition: "200% center",
            ease: "none",
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
            },
        });

        return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
        };
    }, []);

    return ref;
}
