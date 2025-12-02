
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LivePreview } from "./LivePreview";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorAlert } from "@/components/ui/ErrorAlert";
import { SuccessModal } from "@/components/ui/SuccessModal";
import { HelpButton } from "@/components/ui/HelpButton";
import { SURGETemplate } from "@/data/templates";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCreateSurgeEvent } from "@/hooks/useSurgeContracts";
import { DistributionMode, type EventMetadata, type DistributionConfig } from "@/types/surge";
import { Sparkles, RefreshCw, Download, Wallet, CheckCircle2, Loader2, Upload, Image as ImageIcon, X } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from "wagmi";
import { base, optimism, celo, zora } from "wagmi/chains";
import { useFadeIn, useMagnetic } from "@/lib/gsap-hooks";

export function GeneratorForm() {
    const { address, isConnected, chain } = useAccount();
    const { switchChain } = useSwitchChain();
    const { writeContract, writeContractAsync, data: hash, isPending: isMinting, error: mintError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed, data: receipt } = useWaitForTransactionReceipt({
        hash,
    });

    const [mintedTokenId, setMintedTokenId] = useState<string | null>(null);
    const [isBridging, setIsBridging] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

    const formRef = useFadeIn(0.2);

    // Form data state - SURGE event creation fields
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        date: string;
        network: "base" | "celo" | "optimism" | "zora";
        distributionMode: DistributionMode;
        maxSupply: number;
        expiryDate: string; // ISO string, empty if no expiry
        theme: "sketch" | "modern" | "flat" | "pixel" | "monochrome" | "abstract";
        keywords: string;
        imageUrl?: string;
    }>({
        title: "",
        description: "",
        date: "",
        network: "base",
        distributionMode: DistributionMode.Public,
        maxSupply: 100,
        expiryDate: "",
        theme: "modern",
        keywords: "",
    });

    // Form validation rules
    const validationRules = {
        title: [
            { required: true, message: "Event title is required" },
            { minLength: 3, message: "Minimum 3 characters" },
            { maxLength: 100, message: "Maximum 100 characters" }
        ],
        description: [
            { required: true, message: "Event description is required" },
            { minLength: 10, message: "Minimum 10 characters" },
            { maxLength: 500, message: "Maximum 500 characters" }
        ],
        date: [
            {
                custom: (value: string) => !value || new Date(value) >= new Date(new Date().setHours(0, 0, 0, 0)),
                message: "Date cannot be in the past"
            }
        ],
        maxSupply: [
            { required: true, message: "Max supply is required" },
            {
                custom: (value: string) => {
                    const num = typeof value === 'number' ? value : parseInt(value);
                    return !isNaN(num) && num >= 1 && num <= 10000;
                },
                message: "Supply must be between 1 and 10,000"
            }
        ],
        expiryDate: [
            {
                custom: (value: string) => !value || new Date(value) > new Date(),
                message: "Expiry date must be in the future"
            }
        ]
    };

    const { errors, validate, validateAll, clearError } = useFormValidation(validationRules);
    const { trackEvent } = useAnalytics();

    // SURGE event creation hook
    const { createEvent, isPending: isCreatingEvent, isConfirming: isConfirmingEvent, isSuccess: isEventCreated, hash: eventCreationHash, eventAddress } = useCreateSurgeEvent();

    useEffect(() => {
        if (isConfirmed && receipt) {
            const transferLog = receipt.logs.find(log =>
                log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
            );
            if (transferLog && transferLog.topics[3]) {
                const id = parseInt(transferLog.topics[3], 16).toString();
                setMintedTokenId(id);

                trackEvent({
                    name: "MINT_SURGE_SUCCESS",
                    properties: {
                        id,
                        network: formData.network,
                        title: formData.title
                    }
                });

                // Show success modal when minting is confirmed
                if (formData.imageUrl) {
                    // Save to local collection
                    const mySurges = JSON.parse(localStorage.getItem('my-surges') || '[]');
                    mySurges.unshift({
                        id: id,
                        title: formData.title,
                        image: formData.imageUrl,
                        date: formData.date,
                        network: formData.network,
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('my-surges', JSON.stringify(mySurges));

                    setShowSuccessModal(true);
                }
            }
        }
    }, [isConfirmed, receipt, formData, trackEvent]);

    // Handle successful SURGE event creation
    useEffect(() => {
        if (isEventCreated && eventCreationHash && eventAddress) {
            trackEvent({
                name: "CREATE_EVENT_SUCCESS",
                properties: {
                    network: formData.network,
                    title: formData.title,
                    txHash: eventCreationHash,
                    eventAddress // NEW
                }
            });

            // Save event to localStorage for user's created events  
            const myEvents = JSON.parse(localStorage.getItem('my-surge-events') || '[]');
            myEvents.push({
                title: formData.title,
                description: formData.description,
                network: formData.network,
                imageUrl: formData.imageUrl,
                createdAt: new Date().toISOString(),
                txHash: eventCreationHash,
                eventAddress, // NEW: save deployed contract address
            });
            localStorage.setItem('my-surge-events', JSON.stringify(myEvents));

            // Show success modal
            setShowSuccessModal(true);
        }
    }, [isEventCreated, eventCreationHash, eventAddress, formData, trackEvent]);

    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState("");
    const [generationMode, setGenerationMode] = useState<'ai' | 'manual'>('ai');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setError({
                    title: "File too large",
                    message: "Please upload an image smaller than 5MB",
                    canRetry: false
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setFormData(prev => ({ ...prev, imageUrl: result }));
                trackEvent({
                    name: "GENERATE_SURGE_SUCCESS",
                    properties: { type: 'manual_upload' }
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const [error, setError] = useState<{
        title: string;
        message: string;
        canRetry: boolean;
    } | null>(null);

    // Auto-save draft to localStorage
    useEffect(() => {
        const saveTimer = setTimeout(() => {
            if (formData.title || formData.keywords) {
                localStorage.setItem('surge-draft', JSON.stringify(formData));
            }
        }, 1000);
        return () => clearTimeout(saveTimer);
    }, [formData]);

    // Restore draft on mount
    useEffect(() => {
        const saved = localStorage.getItem('surge-draft');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setFormData(parsed);
            } catch (e) {
                console.error('Failed to restore draft:', e);
            }
        }
    }, []);

    const getTargetChainId = () => {
        switch (formData.network) {
            case "base": return base.id;
            case "optimism": return optimism.id;
            case "celo": return celo.id;
            default: return base.id;
        }
    };

    // Style-specific prompt templates
    const stylePrompts = {
        sketch: "Hand-drawn sketch style badge, pencil or ink drawing aesthetic, artistic linework, hatching and cross-hatching shading, organic imperfect lines, artistic doodle elements, creative hand-lettered typography, sketch book illustration style, artistic and expressive design",
        modern: "Contemporary sleek badge design, vibrant gradient backgrounds, clean sans-serif typography, geometric shapes, bold colors, minimalist composition, tech-forward aesthetic",
        flat: "Flat design combined with minimalistic aesthetic, simple geometric shapes, limited color palette, clean vector art, no shadows or gradients, modern sans-serif fonts, Scandinavian design influence",
        pixel: "8-bit pixel art badge, retro gaming aesthetic, pixelated typography, limited color palette like NES or Game Boy, sprite-based design, nostalgic 80s-90s video game style, pixel perfect details, blocky graphics",
        monochrome: "Black and white badge design combining flat design with monochrome aesthetic, high contrast, bold typography, minimalist composition, ink drawing or woodcut style, grayscale only, strong graphic design, timeless elegance",
        abstract: "Abstract art badge design, fluid organic shapes, vibrant color splashes, geometric patterns, surreal composition, artistic interpretation, creative expression, modern art style, dynamic movement, experimental design, psychedelic elements"
    };

    const handleTemplateSelect = (template: SURGETemplate) => {
        setFormData(prev => ({
            ...prev,
            title: template.defaultData.title,
            theme: template.defaultData.theme,
            keywords: template.defaultData.keywords,
            imageUrl: '' // Reset image when template changes
        }));
        clearError('title');

        trackEvent({
            name: "TEMPLATE_SELECTED",
            properties: {
                templateId: template.id,
                templateName: template.name
            }
        });
        // Clear errors when selecting a template
        setError(null);
        // Validate the new data (optional, but good practice)
        validate('title', template.defaultData.title);
    };

    // Handle export PNG
    const handleExport = () => {
        if (!formData.imageUrl) return;

        const link = document.createElement('a');
        link.href = formData.imageUrl;
        link.download = `surge-${formData.title.replace(/\s+/g, '-').toLowerCase() || 'untitled'}-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        trackEvent({
            name: 'EXPORT_SURGE',
            properties: {
                network: formData.network,
                title: formData.title
            }
        });
    };

    const handleGenerateAI = async () => {
        console.log('[FRONTEND] Starting generation...');
        setError(null);

        // Validate only required fields for generation (title and date)
        const titleValid = validate('title', formData.title);
        const dateValid = formData.date ? validate('date', formData.date) : true;

        if (!titleValid || !dateValid) {
            setError({
                title: "Please check the form",
                message: "Please fix errors before generating",
                canRetry: false
            });
            return;
        }

        if (!formData.title) {
            setError({
                title: "Title is required",
                message: "Please enter an event title",
                canRetry: false
            });
            return;
        }

        setIsGenerating(true);
        setGenerationProgress("AI is creating your unique SURGE...");
        console.log('[FRONTEND] isGenerating set to true');

        trackEvent({
            name: "GENERATE_SURGE_START",
            properties: {
                theme: formData.theme,
                hasKeywords: !!formData.keywords
            }
        });

        try {
            const styleKeywords = stylePrompts[formData.theme] || stylePrompts.modern;
            const keywordsText = formData.keywords ? `. Visual elements: ${formData.keywords}` : "";
            const dateText = formData.date ? `. Date: "${formData.date}"` : "";

            const fullPrompt = `${styleKeywords}. A premium SURGE commemorative badge design. Title text must read: "${formData.title}"${dateText}${keywordsText}`;

            console.log('[FRONTEND] Calling API with prompt:', fullPrompt.substring(0, 100));

            // Call our backend API which uses Hugging Face
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: fullPrompt,
                    style: formData.theme
                }),
            });

            console.log('[FRONTEND] API response status:', response.status);

            if (!response.ok) {
                throw new Error(`API returned status ${response.status}`);
            }

            const data = await response.json();
            console.log('[FRONTEND] API response data:', data);

            if (!data.imageUrl) {
                throw new Error('Image was not generated');
            }

            console.log('[FRONTEND] Setting imageUrl:', data.imageUrl);

            // Set the generated image
            setFormData(prev => {
                const newData = {
                    ...prev,
                    imageUrl: data.imageUrl
                };
                console.log('[FRONTEND] New formData:', newData);
                return newData;
            });

            setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));

            trackEvent({
                name: "GENERATE_SURGE_SUCCESS",
                properties: {
                    imageUrl: data.imageUrl
                }
            });

            console.log('[FRONTEND] Generation SUCCESS!');

        } catch (err: any) {
            console.error('[FRONTEND] Generation error:', err);
            setError({
                title: "Failed to create SURGE",
                message: err.message || "Check your internet connection and try again",
                canRetry: true
            });
            trackEvent({
                name: "GENERATE_SURGE_ERROR",
                properties: {
                    error: err instanceof Error ? err.message : "Unknown error"
                }
            });
        } finally {
            console.log('[FRONTEND] Setting isGenerating to false');
            setIsGenerating(false);
            setGenerationProgress("");
        }
    };

    const handleClearImage = () => {
        setFormData(prev => ({ ...prev, imageUrl: undefined }));
        setError(null);
    };

    const handleDownload = () => {
        if (!formData.imageUrl) return;

        const link = document.createElement('a');
        link.href = formData.imageUrl;
        link.download = `surge-${formData.title.replace(/\s+/g, '-').toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCreateAnother = () => {
        setShowSuccessModal(false);
        setFormData({
            title: "",
            description: "",
            date: "",
            network: "base",
            distributionMode: DistributionMode.Public,
            maxSupply: 100,
            expiryDate: "",
            theme: "modern",
            keywords: "",
        });
        localStorage.removeItem('surge-draft');
    };

    const handleCreateEvent = async () => {
        if (!isConnected) {
            setError({
                title: "Wallet Not Connected",
                message: "Please connect your wallet to create a SURGE event.",
                canRetry: false
            });
            return;
        }

        if (!address) return;

        // Check if wallet is on the correct network
        if (chain) {
            const targetChainId = getTargetChainId();
            if (chain.id !== targetChainId) {
                // Try to switch network automatically
                try {
                    setIsSwitchingNetwork(true);
                    await switchChain({ chainId: targetChainId });
                    setIsSwitchingNetwork(false);
                    // Wait a bit for the switch to complete
                    await new Promise(resolve => setTimeout(resolve, 500));
                } catch (err: any) {
                    setIsSwitchingNetwork(false);
                    setError({
                        title: "Wrong Network",
                        message: `Please switch to ${formData.network.charAt(0).toUpperCase() + formData.network.slice(1)} network to create this event.`,
                        canRetry: false
                    });
                    return;
                }
            }
        }

        // Validate all required fields
        // Convert formData to string record for validation
        const formDataForValidation: Record<string, string> = {
            title: formData.title,
            description: formData.description,
            date: formData.date,
            maxSupply: formData.maxSupply.toString(),
            expiryDate: formData.expiryDate,
        };

        const validationResult = validateAll(formDataForValidation);
        if (!validationResult) {
            setError({
                title: "Validation Error",
                message: "Please fill in all required fields correctly.",
                canRetry: false
            });
            return;
        }

        // Check if image is generated
        if (!formData.imageUrl) {
            setError({
                title: "Image Required",
                message: "Please generate an event image before creating the event.",
                canRetry: false
            });
            return;
        }

        try {
            trackEvent({
                name: "CREATE_EVENT_START",
                properties: {
                    network: formData.network,
                    distributionMode: formData.distributionMode,
                    maxSupply: formData.maxSupply
                }
            });

            // Get chain ID for current network
            const getChainId = (network: string): bigint => {
                switch (network) {
                    case 'base': return BigInt(8453);
                    case 'optimism': return BigInt(10);
                    case 'celo': return BigInt(42220);
                    case 'zora': return BigInt(7777777);
                    default: return BigInt(8453);
                }
            };

            // Construct EventMetadata
            const metadata: EventMetadata = {
                name: formData.title,
                description: formData.description,
                imageURI: formData.imageUrl, // Could upload to IPFS in future
                chainId: getChainId(formData.network),
                tier: 0, // Community tier by default - could be determined by wallet verification
                maxSupply: BigInt(formData.maxSupply),
                expiryTimestamp: formData.expiryDate ? BigInt(Math.floor(new Date(formData.expiryDate).getTime() / 1000)) : BigInt(0),
                mode: formData.distributionMode,
                creator: address
            };

            // Construct DistributionConfig
            const config: DistributionConfig = {
                merkleRoot: '0x0000000000000000000000000000000000000000000000000000000000000000', // Empty merkle root for Public mode
                startTimestamp: formData.date ? BigInt(Math.floor(new Date(formData.date).getTime() / 1000)) : BigInt(Math.floor(Date.now() / 1000))
            };

            // Call createEvent
            await createEvent(metadata, config);

            // Hash will be available in eventCreationHash from hook
            // Success modal will be triggered by useEffect when isEventCreated becomes true
        } catch (err: any) {
            console.error('[CREATE_EVENT_ERROR]', err);
            trackEvent({
                name: "CREATE_EVENT_ERROR",
                properties: {
                    error: err.message,
                    network: formData.network
                }
            });

            setError({
                title: "Event Creation Failed",
                message: err.message || "Failed to create SURGE event. Please try again.",
                canRetry: true
            });
        }
    };

    const handleBridge = async () => {
        if (!mintedTokenId || !address) return;
        setIsBridging(true);
        alert("Bridging requires a fee quote. In this demo, we'll simulate the bridge request.");
        setIsBridging(false);
    };

    return (
        <div ref={formRef} className="grid gap-12 xl:grid-cols-2 items-start">
            <div className="space-y-6">

                <Card className="glass-panel border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Network</label>
                                <HelpButton content="Choose the blockchain network for your SURGE. Base and Optimism are L2 solutions with low fees." />
                            </div>
                            <div className="relative">
                                <select
                                    value={formData.network}
                                    onChange={async (e) => {
                                        const selectedNetwork = e.target.value as "base" | "celo" | "optimism" | "zora";
                                        setFormData({ ...formData, network: selectedNetwork });

                                        // Auto-switch wallet to selected network if different from current
                                        if (isConnected && chain) {
                                            const newTargetChainId = selectedNetwork === "base" ? base.id :
                                                selectedNetwork === "optimism" ? optimism.id :
                                                    selectedNetwork === "celo" ? celo.id : zora.id;

                                            if (chain.id !== newTargetChainId) {
                                                try {
                                                    setIsSwitchingNetwork(true);
                                                    await switchChain({ chainId: newTargetChainId });
                                                } catch (err) {
                                                    console.error('Failed to switch network:', err);
                                                    // User rejected network switch - that's ok
                                                } finally {
                                                    setIsSwitchingNetwork(false);
                                                }
                                            }
                                        }
                                    }}
                                    disabled={isSwitchingNetwork}
                                    className="flex h-12 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-white appearance-none cursor-pointer hover:bg-white/10 transition-colors"
                                >
                                    <option value="base" className="bg-neutral-900 text-white">Base</option>
                                    <option value="optimism" className="bg-neutral-900 text-white">Optimism</option>
                                    <option value="celo" className="bg-neutral-900 text-white">Celo</option>
                                    <option value="zora" className="bg-neutral-900 text-white">Zora</option>
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                                    {isSwitchingNetwork ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            {/* Network status indicator */}
                            {isConnected && chain && (() => {
                                const targetChainId = getTargetChainId();
                                const isNetworkMatched = chain.id === targetChainId;

                                if (!isNetworkMatched) {
                                    return (
                                        <div className="flex items-center gap-2 text-xs text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                            <span>Connected to {chain.name}, but {formData.network.charAt(0).toUpperCase() + formData.network.slice(1)} is selected. Switch your wallet network.</span>
                                        </div>
                                    );
                                }

                                return (
                                    <div className="flex items-center gap-2 text-xs text-green-400">
                                        <div className="w-2 h-2 rounded-full bg-green-400" />
                                        <span>Connected to {chain.name}</span>
                                    </div>
                                );
                            })()}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Event Title *</label>
                            <Input
                                placeholder="e.g. Superchain Summit 2024"
                                value={formData.title}
                                onChange={(e) => {
                                    setFormData({ ...formData, title: e.target.value });
                                    validate('title', e.target.value);
                                }}
                                onBlur={(e) => validate('title', e.target.value)}
                                className={`bg-black/40 border-white/20 focus:border-white/40 h-12 text-lg placeholder:text-white/30 text-white ${errors.title ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                aria-label="Event Title"
                                aria-invalid={!!errors.title}
                                aria-describedby={errors.title ? "title-error" : undefined}
                            />
                            {errors.title && (
                                <p id="title-error" role="alert" className="text-sm text-red-400">{errors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Description *</label>
                            <textarea
                                placeholder="Describe your event and what makes it special..."
                                value={formData.description}
                                onChange={(e) => {
                                    setFormData({ ...formData, description: e.target.value });
                                    validate('description', e.target.value);
                                }}
                                onBlur={(e) => validate('description', e.target.value)}
                                className={`bg-black/40 border-white/20 focus:border-white/40 p-3 text-white placeholder:text-white/30 rounded-lg w-full min-h-[100px] resize-y ${errors.description ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                aria-label="Event Description"
                                aria-invalid={!!errors.description}
                                aria-describedby={errors.description ? "description-error" : undefined}
                            />
                            {errors.description && (
                                <p id="description-error" role="alert" className="text-sm text-red-400">{errors.description}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Distribution Mode *</label>
                                <HelpButton content="Public: Anyone can claim. Whitelist: Requires merkle proof. Signature: Requires server signature." />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Button
                                    variant={formData.distributionMode === DistributionMode.Public ? "default" : "outline"}
                                    onClick={() => setFormData({ ...formData, distributionMode: DistributionMode.Public })}
                                    className={`h-12 font-medium hover:scale-100 ${formData.distributionMode === DistributionMode.Public
                                        ? "bg-white/90 text-black hover:bg-white"
                                        : "border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                                        }`}
                                    type="button"
                                >
                                    Public
                                </Button>
                                <Button
                                    variant={formData.distributionMode === DistributionMode.Whitelist ? "default" : "outline"}
                                    onClick={() => setFormData({ ...formData, distributionMode: DistributionMode.Whitelist })}
                                    className={`h-12 font-medium hover:scale-100 ${formData.distributionMode === DistributionMode.Whitelist
                                        ? "bg-white/90 text-black hover:bg-white"
                                        : "border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                                        }`}
                                    type="button"
                                >
                                    Whitelist
                                </Button>
                                <Button
                                    variant={formData.distributionMode === DistributionMode.Signature ? "default" : "outline"}
                                    onClick={() => setFormData({ ...formData, distributionMode: DistributionMode.Signature })}
                                    className={`h-12 font-medium hover:scale-100 ${formData.distributionMode === DistributionMode.Signature
                                        ? "bg-white/90 text-black hover:bg-white"
                                        : "border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                                        }`}
                                    type="button"
                                >
                                    Signature
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Max Supply *</label>
                                    <HelpButton content="Maximum number of tokens that can be claimed (1-10,000)" />
                                </div>
                                <Input
                                    type="number"
                                    min="1"
                                    max="10000"
                                    placeholder="100"
                                    value={formData.maxSupply}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 0;
                                        setFormData({ ...formData, maxSupply: value });
                                        validate('maxSupply', value.toString());
                                    }}
                                    onBlur={(e) => validate('maxSupply', (parseInt(e.target.value) || 0).toString())}
                                    className={`bg-black/40 border-white/20 focus:border-white/40 h-12 text-white ${errors.maxSupply ? 'border-red-500 focus:border-red-500' : ''
                                        }`}
                                    aria-label="Max Supply"
                                    aria-invalid={!!errors.maxSupply}
                                    aria-describedby={errors.maxSupply ? "maxSupply-error" : undefined}
                                />
                                {errors.maxSupply && (
                                    <p id="maxSupply-error" role="alert" className="text-sm text-red-400">{errors.maxSupply}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Expiry (Optional)</label>
                                    <HelpButton content="When should claims stop? Leave empty for no expiration." />
                                </div>
                                <Input
                                    type="datetime-local"
                                    value={formData.expiryDate}
                                    onChange={(e) => {
                                        setFormData({ ...formData, expiryDate: e.target.value });
                                        validate('expiryDate', e.target.value);
                                    }}
                                    onBlur={(e) => validate('expiryDate', e.target.value)}
                                    className={`bg-black/40 border-white/20 focus:border-white/40 h-12 text-white ${errors.expiryDate ? 'border-red-500 focus:border-red-500' : ''
                                        }`}
                                    aria-label="Expiry Date"
                                    aria-invalid={!!errors.expiryDate}
                                    aria-describedby={errors.expiryDate ? "expiryDate-error" : undefined}
                                />
                                {errors.expiryDate && (
                                    <p id="expiryDate-error" role="alert" className="text-sm text-red-400">{errors.expiryDate}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Date</label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => {
                                    setFormData({ ...formData, date: e.target.value });
                                    validate('date', e.target.value);
                                }}
                                onBlur={(e) => validate('date', e.target.value)}
                                className={`bg-black/40 border-white/20 focus:border-white/40 h-12 text-white ${errors.date ? 'border-red-500 focus:border-red-500' : ''
                                    }`}
                                aria-label="Event Date"
                                aria-invalid={!!errors.date}
                                aria-describedby={errors.date ? "date-error" : undefined}
                            />
                            {errors.date && (
                                <p id="date-error" role="alert" className="text-sm text-red-400">{errors.date}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-white/70 uppercase tracking-wider">SURGE Style</label>
                                <HelpButton content="Select an artistic style for your badge. AI will generate a unique design based on this style." />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {(["sketch", "modern", "flat", "pixel", "monochrome", "abstract"] as const).map((theme) => (
                                    <Button
                                        key={theme}
                                        variant={formData.theme === theme ? "default" : "ghost"}
                                        size="sm"
                                        onClick={() => setFormData({ ...formData, theme })}
                                        className={`capitalize h-10 font-medium ${formData.theme === theme
                                            ? "bg-white/90 text-black hover:bg-white"
                                            : "text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
                                            }`}
                                    >
                                        {theme}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-white/70 uppercase tracking-wider">Keywords (Optional)</label>
                                <HelpButton content="Add specific visual elements you want to see (e.g., 'futuristic city', 'golden trophy')." />
                            </div>
                            <Input
                                placeholder="e.g., clouds, boat, fish, summer"
                                value={formData.keywords}
                                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                className="bg-black/40 border-white/20 focus:border-white/40 h-12 text-white placeholder:text-white/30"
                            />
                            <p className="text-xs text-white/50">Add visual themes and elements for your SURGE</p>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <ErrorAlert
                        title={error.title}
                        message={error.message}
                        onRetry={error.canRetry ? handleGenerateAI : undefined}
                        onDismiss={() => setError(null)}
                    />
                )}

                <div className="flex gap-4">
                    <Button
                        className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-base via-optimism to-celo hover:opacity-90 hover:scale-[1.02] text-white hover:text-black shadow-lg shadow-base/30 hover:shadow-xl hover:shadow-base/50 transition-all duration-200 rounded-xl relative overflow-hidden group"
                        onClick={handleGenerateAI}
                        disabled={isGenerating}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <span className="relative z-10 flex items-center justify-center">
                            {isGenerating ? (
                                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-5 w-5" />
                            )}
                            {isGenerating ? "Generating..." : "Generate with AI"}
                        </span>
                    </Button>

                    {formData.imageUrl && (
                        <Button
                            variant="outline"
                            className="h-14 px-6 border-white/10 hover:bg-white/10 text-white"
                            onClick={handleClearImage}
                        >
                            Clear
                        </Button>
                    )}
                </div>
            </div>

            <div className="sticky top-24 flex flex-col items-center gap-8">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-base via-optimism to-celo rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative">
                        <LivePreview {...formData} isGenerating={isGenerating} />
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-md">
                    <div className="flex gap-4 w-full">
                        <Button
                            variant="outline"
                            className="flex-1 border-white/10 hover:bg-white/5 hover:text-white h-12"
                            onClick={handleExport}
                            disabled={!formData.imageUrl}
                        >
                            <Download className="mr-2 h-4 w-4" /> Export PNG
                        </Button>
                        <Button
                            className="flex-1 bg-white text-black hover:bg-white/90 h-12 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleCreateEvent}
                            disabled={!isConnected || isCreatingEvent || isConfirmingEvent || !formData.imageUrl}
                            title={!formData.imageUrl ? "Generate an event image first" : ""}
                        >
                            {isCreatingEvent || isConfirmingEvent ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Wallet className="mr-2 h-4 w-4" />
                            )}
                            {isCreatingEvent ? "Creating..." : isConfirmingEvent ? "Confirming..." : "Create Event"}
                        </Button>
                    </div>

                    {hash && (
                        <div className="w-full p-4 bg-white/5 rounded-xl border border-white/10 text-sm break-all backdrop-blur-sm">
                            <p className="font-medium mb-2 flex items-center gap-2 text-green-400">
                                <CheckCircle2 className="h-4 w-4" />
                                Transaction Sent
                            </p>
                            <a
                                href={formData.network === 'base'
                                    ? `https://basescan.org/tx/${hash}`
                                    : `https://sepolia-optimism.etherscan.io/tx/${hash}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-white transition-colors underline decoration-white/20 underline-offset-4"
                            >
                                {hash}
                            </a>
                            {mintedTokenId && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="font-medium text-white mb-3">Token ID: {mintedTokenId}</p>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full bg-white/10 hover:bg-white/20 text-white border-0"
                                        onClick={handleBridge}
                                        disabled={isBridging}
                                    >
                                        Bridge to {formData.network === 'base' ? 'Optimism' : 'Base'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {mintError && (
                        <div className="w-full p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 text-sm">
                            <p className="font-medium mb-1">Error Minting</p>
                            <p className="opacity-90">{mintError.message.slice(0, 100)}...</p>
                        </div>
                    )}
                </div>
            </div>

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                surgeImage={formData.imageUrl || ''}
                surgeTitle={formData.title}
                onDownload={handleDownload}
                onCreateAnother={handleCreateAnother}
                eventAddress={eventAddress || undefined} // NEW: pass deployed event address
            />
        </div >
    );
}
