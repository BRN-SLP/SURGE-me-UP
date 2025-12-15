"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HelpButton } from "@/components/ui/HelpButton";
import { DistributionMode } from "@/types/surge";

interface DetailsStepProps {
    formData: any;
    setFormData: (data: any) => void;
    validate: (field: string, value: any) => boolean;
    errors: any;
}

export function DetailsStep({ formData, setFormData, validate, errors }: DetailsStepProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Identity Details</h2>
                <p className="text-white/60">Define the core metadata for your SURGE identity token.</p>
            </div>

            <div className="space-y-6">
                {/* Title Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Identity Title *</label>
                    <Input
                        placeholder="e.g. Superchain Builder 2025"
                        value={formData.title}
                        onChange={(e) => {
                            setFormData({ ...formData, title: e.target.value });
                            validate('title', e.target.value);
                        }}
                        onBlur={(e) => validate('title', e.target.value)}
                        className={`bg-black/40 border-white/20 focus:border-white/40 h-14 text-lg placeholder:text-white/30 text-white transition-all ${errors.title ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.title && <p className="text-sm text-red-400">{errors.title}</p>}
                </div>

                {/* Description Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Description *</label>
                    <textarea
                        placeholder="What does this identity represent?"
                        value={formData.description}
                        onChange={(e) => {
                            setFormData({ ...formData, description: e.target.value });
                            validate('description', e.target.value);
                        }}
                        onBlur={(e) => validate('description', e.target.value)}
                        className={`bg-black/40 border-white/20 focus:border-white/40 p-4 text-white placeholder:text-white/30 rounded-lg w-full min-h-[120px] resize-y transition-all ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
                    />
                    {errors.description && <p className="text-sm text-red-400">{errors.description}</p>}
                </div>

                {/* Distribution Mode */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Distribution Mode</label>
                        <HelpButton content="Public: Anyone can mint. Whitelist: Pre-approved addresses only." />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[DistributionMode.Public, DistributionMode.Whitelist].map((mode) => (
                            <Button
                                key={mode}
                                variant={formData.distributionMode === mode ? "default" : "outline"}
                                onClick={() => setFormData({ ...formData, distributionMode: mode })}
                                className={`h-12 font-medium transition-all ${formData.distributionMode === mode
                                    ? "bg-white text-black hover:bg-white/90 scale-[1.02]"
                                    : "border-white/10 text-white/60 hover:text-white hover:bg-white/5"
                                    }`}
                                type="button"
                            >
                                {mode === DistributionMode.Public ? "Public (Open)" : "Whitelist (Private)"}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Max Supply */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Max Supply</label>
                    <Input
                        type="number"
                        min="1"
                        max="10000"
                        value={formData.maxSupply}
                        onChange={(e) => setFormData({ ...formData, maxSupply: parseInt(e.target.value) || 100 })}
                        className="bg-black/40 border-white/20 focus:border-white/40 h-12 text-white"
                    />
                </div>
            </div>
        </motion.div>
    );
}
