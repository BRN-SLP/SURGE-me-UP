"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { motion, AnimatePresence } from "framer-motion";

export function WalletStatus() {
    const { isConnected, address, isConnecting, isReconnecting } = useAccount();
    const [showConnected, setShowConnected] = useState(false);

    // Auto-hide "Wallet Connected" notification after 3 seconds
    useEffect(() => {
        if (isConnected && address) {
            setShowConnected(true);
            const timer = setTimeout(() => {
                setShowConnected(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [isConnected, address]);

    if (isConnecting || isReconnecting) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="fixed top-20 right-4 glass-panel px-4 py-3 rounded-lg border border-blue-500/20 bg-blue-500/5 z-50"
            >
                <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="text-sm text-white">Connecting wallet...</span>
                </div>
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            {showConnected && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-20 right-4 glass-panel px-4 py-3 rounded-lg border border-green-500/20 bg-green-500/5 z-50"
                >
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white">Wallet Connected</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
