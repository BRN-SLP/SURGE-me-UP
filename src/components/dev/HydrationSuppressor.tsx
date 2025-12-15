"use client";

// Execute immediately when module loads on client
if (typeof window !== "undefined") {
    const originalError = console.error;

    console.error = (...args) => {
        const msg = args[0];

        // Filter out hydration mismatch errors caused by browser extensions
        if (typeof msg === 'string' && (
            msg.includes('bis_skin_checked') ||
            msg.includes('Hydration failed because the initial UI does not match the server-rendered HTML') ||
            msg.includes('A tree hydrated but some attributes of the server rendered HTML')
        )) {
            return;
        }

        originalError.apply(console, args);
    };
}

export function HydrationSuppressor() {
    return null;
}
