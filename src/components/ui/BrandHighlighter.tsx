import React from 'react';

export function BrandHighlighter({ text }: { text: string }) {
    const regex = /(Superchain|Base|Optimism|Celo)/gi;
    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) => {
                const lower = part.toLowerCase();
                if (lower === 'superchain') return <span key={i} className="text-optimism font-bold">Superchain</span>;
                if (lower === 'base') return <span key={i} className="text-base font-bold">Base</span>;
                if (lower === 'optimism') return <span key={i} className="text-optimism font-bold">Optimism</span>;
                if (lower === 'celo') return <span key={i} className="text-celo font-bold">Celo</span>;
                return part;
            })}
        </>
    );
}
