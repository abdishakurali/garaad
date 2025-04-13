"use client";
import { CheckCircle } from "lucide-react";

interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
    return (
        <div className="relative">
            {/* Progress bar background */}
            <div className="h-2 bg-gray-200 rounded-full">
                <div
                    className="h-full bg-green-500 rounded-full"
                />
            </div>

            {/* Step indicators */}
            <div className="absolute -top-4 left-0 right-0 flex justify-between">
                {Array.from({ length: totalSteps }).map((_, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div
                            key={index}
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted
                                ? "bg-green-500 text-white"
                                : isCurrent
                                    ? "bg-blue-500 text-white"
                                    : "bg-white border-2 border-gray-300"
                                }`}
                        >
                            {isCompleted ? (
                                <CheckCircle className="w-5 h-5" />
                            ) : (
                                <span className="text-sm font-medium">
                                    {index + 1}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 