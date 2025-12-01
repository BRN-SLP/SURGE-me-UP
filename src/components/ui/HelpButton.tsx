import { HelpCircle } from "lucide-react";
import { Tooltip } from "./tooltip";

interface HelpButtonProps {
    content: string;
}

export function HelpButton({ content }: HelpButtonProps) {
    return (
        <Tooltip content={content}>
            <button
                type="button"
                className="text-white/40 hover:text-white/80 transition-colors focus:outline-none"
                aria-label={`Help: ${content}`}
            >
                <HelpCircle className="w-4 h-4" />
            </button>
        </Tooltip>
    );
}
