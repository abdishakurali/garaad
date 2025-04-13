// src/components/learning/ProblemDisplay.tsx
"use client";

import { Problem } from "@/types/course";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";

interface ProblemDisplayProps {
    problem: Problem;
    onSubmit: (answer: string) => void;
    isSubmitting?: boolean;
}

export function ProblemDisplay({
    problem,
    onSubmit,
    isSubmitting = false
}: ProblemDisplayProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{problem.question}</h2>

            {problem.example.visual && (
                <div className="mb-6 relative aspect-video">
                    <Image
                        src={problem.example.visual}
                        alt={problem.example.visualAlt || "Problem visualization"}
                        fill
                        className="object-cover rounded-lg"
                    />
                    {problem.example.context && (
                        <p className="text-sm text-gray-600 mt-2">{problem.example.context}</p>
                    )}
                </div>
            )}

            <div className="space-y-3 mb-6">
                {problem.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedAnswer(option)}
                        className={`w-full p-4 text-left border rounded-lg transition-colors ${selectedAnswer === option
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>

            <Button
                onClick={() => selectedAnswer && onSubmit(selectedAnswer)}
                disabled={!selectedAnswer || isSubmitting}
                className="w-full"
            >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
            </Button>
        </Card>
    );
}