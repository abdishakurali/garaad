import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info, X } from "lucide-react";

interface QuestionExplanationProps {
    explanation: string;
    className?: string;
}

export function QuestionExplanation({
    explanation,
    className = "",
}: QuestionExplanationProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`relative ${className}`}>
            <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Info className="w-4 h-4" />
                <span>Sharaxaad</span>
            </Button>

            {isOpen && (
                <div
                    className="absolute top-0 right-0 w-64 bg-white rounded-lg shadow-lg p-4 z-10"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">Sharaxaad</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-gray-600">{explanation}</p>
                </div>
            )}
        </div>
    );
} 