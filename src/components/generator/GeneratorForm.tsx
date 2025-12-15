
"use client";

import { useState, useEffect, useRef } from "react";
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
import { defineChain } from "viem";
import { useFadeIn, useMagnetic } from "@/lib/gsap-hooks";
import { NetworkSelector } from "./NetworkSelector";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { NetworkStep } from "./steps/NetworkStep";
import { DetailsStep } from "./steps/DetailsStep";
import { VisualsStep } from "./steps/VisualsStep";
import { ReviewStep } from "./steps/ReviewStep";

// Define additional Superchain networks
const ink = defineChain({
    id: 57073,
    name: 'Ink',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc-gel.inkonchain.com'] } },
    blockExplorers: { default: { name: 'Inkscout', url: 'https://explorer.inkonchain.com' } },
});

const lisk = defineChain({
    id: 1135,
    name: 'Lisk',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.api.lisk.com'] } },
    blockExplorers: { default: { name: 'Blockscout', url: 'https://blockscout.lisk.com' } },
});

const unichain = defineChain({
    id: 130,
    name: 'Unichain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://mainnet.unichain.org'] } },
    blockExplorers: { default: { name: 'Blockscout', url: 'https://unichain.blockscout.com' } },
});

const soneium = defineChain({
    id: 1868,
    name: 'Soneium',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.soneium.org'] } },
    blockExplorers: { default: { name: 'Blockscout', url: 'https://soneium.blockscout.com' } },
});

// All supported network IDs
type NetworkId = "base" | "optimism" | "celo" | "zora" | "ink" | "lisk" | "unichain" | "soneium";

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
    const bgRef = useRef<HTMLDivElement>(null);

    const handleNetworkSelect = async (selectedNetwork: string) => {
        const network = selectedNetwork as NetworkId;
        setFormData(prev => ({ ...prev, network }));

        // Auto-switch wallet to selected network if different from current
        if (isConnected && chain) {
            const chainMap: Record<NetworkId, number> = {
                base: base.id,
                optimism: optimism.id,
                celo: celo.id,
                zora: zora.id,
                ink: ink.id,
                lisk: lisk.id,
                unichain: unichain.id,
                soneium: soneium.id,
            };
            const newTargetChainId = chainMap[network] || base.id;

            if (chain.id !== newTargetChainId) {
                try {
                    setIsSwitchingNetwork(true);
                    await switchChain({ chainId: newTargetChainId });
                } catch (err) {
                    console.error('Failed to switch network:', err);
                } finally {
                    setIsSwitchingNetwork(false);
                }
            }
        }
    };

    // Form data state - SURGE event creation fields
    const [formData, setFormData] = useState<{
        title: string;
        description: string;
        date: string;
        network: NetworkId;
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

    // Dynamic background color based on network
    useGSAP(() => {
        const colors: Record<NetworkId, string> = {
            base: "#0052FF",
            optimism: "#FF0420",
            celo: "#FCFF52",
            zora: "#5E3FBE",
            ink: "#7C3AED",
            lisk: "#0ABBED",
            unichain: "#FF007A",
            soneium: "#8B5CF6",
        };
        const color = colors[formData.network] || colors.base;

        gsap.to(bgRef.current, {
            background: `radial-gradient(circle at 50% 0%, ${color}40 0%, transparent 70%)`,
            duration: 1.5,
            ease: "power2.out"
        });
    }, { dependencies: [formData.network] });

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
        const chainMap: Record<NetworkId, number> = {
            base: base.id,
            optimism: optimism.id,
            celo: celo.id,
            zora: zora.id,
            ink: ink.id,
            lisk: lisk.id,
            unichain: unichain.id,
            soneium: soneium.id,
        };
        return chainMap[formData.network] || base.id;
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

    // --- Multi-step Wizard State ---
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    const nextStep = () => {
        // Validate before moving
        if (currentStep === 2) {
            if (!validate('title', formData.title) || !validate('description', formData.description)) {
                return;
            }
        }
        if (currentStep === 3) {
            if (!formData.imageUrl) {
                setError({ title: "Visual Required", message: "Please generate an image first.", canRetry: false });
                return;
            }
        }

        if (currentStep < totalSteps) {
            setCurrentStep(curr => curr + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(curr => curr - 1);
        }
    };

    // --- Render ---

    return (
        <div ref={formRef} className="max-w-4xl mx-auto relative min-h-[500px]">
            {/* Background Blob - Adjusted for compactness */}
            <div
                ref={bgRef}
                className="absolute inset-0 -z-10 blur-[100px] opacity-30 transition-all duration-1000"
                style={{ background: 'radial-gradient(circle at 50% 20%, #0052FF40 0%, transparent 70%)' }}
            />

            {/* Success Modal */}
            {showSuccessModal && (
                <SuccessModal
                    isOpen={showSuccessModal}
                    onClose={() => setShowSuccessModal(false)}
                    onCreateAnother={handleCreateAnother}
                    surgeTitle={formData.title}
                    surgeImage={formData.imageUrl || ''}
                    onDownload={handleDownload}
                    eventAddress={eventAddress || undefined}
                />
            )}

            {/* Error Alert */}
            {error && (
                <div className="mb-4 animate-in slide-in-from-top-2 p-4">
                    <ErrorAlert
                        title={error.title}
                        message={error.message}
                        onRetry={error.canRetry ? () => setError(null) : undefined}
                        onDismiss={() => setError(null)}
                    />
                </div>
            )}

            {/* Stepper Header - Compacted */}
            <div className="flex justify-between items-center mb-6 px-4 pt-6 relative z-10">
                {[1, 2, 3, 4].map((step) => {
                    const isActive = step === currentStep;
                    const isCompleted = step < currentStep;
                    const labels = ["Network", "Details", "Visuals", "Review"];

                    return (
                        <div key={step} className="flex flex-col items-center gap-1.5 relative z-10">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all duration-500 
                                ${isActive ? "bg-white text-black border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.4)]" :
                                        isCompleted ? "bg-green-500 text-white border-green-500" : "bg-white/5 text-white/30 border-white/10"}
                                `}
                            >
                                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : step}
                            </div>
                            <span className={`text-[10px] uppercase tracking-wider font-medium transition-colors duration-300 ${isActive ? "text-white" : "text-white/30"}`}>
                                {labels[step - 1]}
                            </span>
                        </div>
                    )
                })}
                {/* Progress Bar Line */}
                <div className="absolute top-4 left-8 right-8 h-[2px] bg-white/10 -z-0">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all duration-500 ease-out"
                        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Step Content - Compacted */}
            <div className="rounded-b-3xl p-6 md:p-8 relative overflow-hidden">
                {currentStep === 1 && (
                    <NetworkStep
                        selectedNetwork={formData.network}
                        onSelect={handleNetworkSelect}
                        isConnected={isConnected}
                        chain={chain}
                        getTargetChainId={getTargetChainId}
                    />
                )}

                {currentStep === 2 && (
                    <DetailsStep
                        formData={formData}
                        setFormData={setFormData}
                        validate={validate}
                        errors={errors}
                    />
                )}

                {currentStep === 3 && (
                    <VisualsStep
                        formData={formData}
                        setFormData={setFormData}
                        handleGenerateAI={handleGenerateAI}
                        isGenerating={isGenerating}
                        generationProgress={generationProgress}
                        themes={Object.keys(stylePrompts)}
                    />
                )}

                {currentStep === 4 && (
                    <ReviewStep
                        formData={formData}
                        handleCreateEvent={handleCreateEvent}
                        isCreatingEvent={isCreatingEvent || isMinting}
                        isConfirmingEvent={isConfirmingEvent || isConfirming}
                    />
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-8 border-t border-white/10">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`text-white/50 hover:text-white ${currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        Back
                    </Button>

                    {currentStep < 4 && (
                        <Button
                            onClick={nextStep}
                            className="bg-white text-black hover:bg-gray-200 px-8 font-bold"
                        >
                            Continue
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
