"use client";

import React from "react";

class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("NetworkBackground Error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 text-red-500 font-mono text-sm p-4">
                    <div className="bg-surface p-6 border border-red-500 rounded-lg max-w-2xl overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Background Component Crash</h2>
                        <p className="mb-2">The interactive background failed to load.</p>
                        <pre className="bg-black/50 p-4 rounded text-xs">
                            {this.state.error?.message}
                            <br />
                            {this.state.error?.stack}
                        </pre>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
