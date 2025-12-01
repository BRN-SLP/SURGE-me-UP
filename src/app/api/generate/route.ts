import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { prompt, style } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        console.log("[API] Generation request received:", { prompt: prompt.substring(0, 50), style });

        const randomSeed = Math.floor(Math.random() * 1000000);
        const fullPrompt = `${prompt}. Circular badge format, professional composition, highly detailed, 1024x1024, perfect for NFT, masterpiece quality`;
        const encodedPrompt = encodeURIComponent(fullPrompt);
        const baseParams = `width=1024&height=1024&nologo=true&seed=${randomSeed}`;

        // Multi-tier strategy for best text quality
        const models = [
            { name: 'flux-pro', timeout: 20000 },  // Best quality, slower
            { name: 'flux', timeout: 15000 },      // Good quality, faster
            { name: 'default', timeout: 10000 }    // Fallback, fastest
        ];

        // Try each model in sequence
        for (const model of models) {
            const modelParam = model.name !== 'default' ? `&model=${model.name}` : '';
            const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?${baseParams}${modelParam}`;

            console.log(`[API] Trying ${model.name}...`);

            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), model.timeout);

                const response = await fetch(url, {
                    method: 'GET',
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (response.ok) {
                    console.log(`[API] ${model.name} SUCCESS`);
                    return NextResponse.json({
                        imageUrl: url,
                        model: model.name
                    });
                }

                console.warn(`[API] ${model.name} returned status:`, response.status);
            } catch (error: any) {
                console.warn(`[API] ${model.name} failed:`, error.message);
                // Continue to next model
            }
        }

        // All models failed - return placeholder
        console.log("[API] All models failed, returning placeholder");
        return NextResponse.json({
            imageUrl: `https://placehold.co/1024x1024/0a0a0a/0052FF/png?text=SURGE+Preview&font=outfit`,
            model: 'placeholder'
        });

    } catch (error: any) {
        console.error("[API] Error:", error);

        // Final fallback
        return NextResponse.json({
            imageUrl: `https://placehold.co/1024x1024/0a0a0a/0052FF/png?text=Error&font=outfit`,
            model: 'error'
        });
    }
}
