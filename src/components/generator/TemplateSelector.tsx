import { templates, SURGETemplate } from "@/data/templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, LayoutTemplate } from "lucide-react";

interface TemplateSelectorProps {
    onSelect: (template: SURGETemplate) => void;
}

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
    return (
        <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
                <LayoutTemplate className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">
                    Start with a Template
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template)}
                        className="group glass-panel p-4 rounded-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 text-left bg-white/5 hover:bg-white/10"
                        aria-label={`Select ${template.name} template`}
                    >
                        <div className="aspect-square rounded-lg bg-gradient-to-br from-white/5 to-white/10 mb-3 overflow-hidden border border-white/10 flex items-center justify-center group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-colors">
                            {/* Placeholder for template preview */}
                            <Sparkles className="w-8 h-8 text-white/20 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <h4 className="font-medium text-white text-sm mb-1 group-hover:text-blue-400 transition-colors truncate">
                            {template.name}
                        </h4>
                        <p className="text-xs text-white/50 line-clamp-2 h-8">
                            {template.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
