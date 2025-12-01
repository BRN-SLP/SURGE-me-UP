"use client";

import { useCallback } from "react";

type AnalyticsEventName =
    | "WALLET_CONNECTED"
    | "WALLET_DISCONNECTED"
    | "GENERATE_SURGE_START"
    | "GENERATE_SURGE_SUCCESS"
    | "GENERATE_SURGE_ERROR"
    | "MINT_SURGE_START"
    | "MINT_SURGE_SUCCESS"
    | "MINT_SURGE_ERROR"
    | "EXPORT_SURGE"
    | "TEMPLATE_SELECTED"
    | "SHARE_CLICK"
    | "EXPLORER_VIEW"
    | "NAVIGATION_CLICK";

interface AnalyticsEvent {
    name: AnalyticsEventName;
    properties?: Record<string, any>;
}

export function useAnalytics() {
    const trackEvent = useCallback(({ name, properties = {} }: AnalyticsEvent) => {
        // In development, log to console
        if (process.env.NODE_ENV === "development") {
            console.groupCollapsed(`[Analytics] ${name}`);
            console.log("Properties:", properties);
            console.log("Timestamp:", new Date().toISOString());
            console.groupEnd();
        }

        // TODO: Integrate with real analytics provider (e.g., PostHog, Google Analytics)
        // Example: posthog.capture(name, properties);
    }, []);

    return { trackEvent };
}
