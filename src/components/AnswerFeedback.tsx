"use client";
import React, { memo, useMemo, useCallback, useEffect, useRef } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import { ExplanationText, Lesson } from "@/types/learning";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Zap } from "lucide-react";

interface AnswerFeedbackProps {
    currentLesson: Lesson | null;
    isCorrect: boolean;
    onResetAnswer: () => void;
    onContinue?: () => void;
    explanationData?: {
        explanation: string | ExplanationText;
        image: string;
        type: "markdown" | "latex" | string;
    };
    xp: number;
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = memo(
    ({
        currentLesson,
        isCorrect,
        onResetAnswer,
        onContinue,
        explanationData,
        xp,
    }) => {
        const { resetAnswerState } = useLearningStore();

        const isLastQuestion = useMemo(() => {
            if (!currentLesson?.content_blocks) return false;
            const blocks = [...currentLesson.content_blocks]
                .filter((b) => b.block_type === "problem")
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            return true;
        }, [currentLesson?.content_blocks]);

        const hasExplanation = useMemo(() => {
            const ex = explanationData?.explanation;
            if (!ex) return false;
            if (typeof ex === "string") return ex.trim().length > 0;
            return Object.values(ex).some((t) => typeof t === "string" && t.trim());
        }, [explanationData?.explanation]);

        const autoAdvancedRef = useRef(false);

        const handleContinueClick = useCallback(() => {
            autoAdvancedRef.current = true;
            resetAnswerState();
            onContinue?.();
        }, [resetAnswerState, onContinue]);

        useEffect(() => {
            autoAdvancedRef.current = false;
        }, [isCorrect]);

        useEffect(() => {
            if (!isCorrect) return;
            const t = window.setTimeout(() => {
                if (autoAdvancedRef.current) return;
                autoAdvancedRef.current = true;
                resetAnswerState();
                onContinue?.();
            }, 1500);
            return () => window.clearTimeout(t);
        }, [isCorrect, onContinue, resetAnswerState]);

        const { title, subtitle, buttonText, buttonAction } = useMemo(() => {
            if (isCorrect) {
                return {
                    title: "Jawaab Sax ah!",
                    subtitle: `+${xp} XP`,
                    buttonText: isLastQuestion ? "Casharka xiga" : "Sii wado",
                    buttonAction: handleContinueClick,
                };
            }
            return {
                title: "Jawaab Khalad ah",
                subtitle: "Isku day markale",
                buttonText: "Isku day markale",
                buttonAction: onResetAnswer,
            };
        }, [isCorrect, isLastQuestion, xp, handleContinueClick, onResetAnswer]);

        const inlineExplanationHtml = useMemo(() => {
            const ex = explanationData?.explanation;
            if (!ex || typeof ex !== "string" || !ex.trim()) return null;
            if (ex.includes("<")) return ex;
            return ex.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>");
        }, [explanationData?.explanation]);

        return (
            <div
                key="answer-feedback-banner"
                className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none pb-[max(12px,env(safe-area-inset-bottom))]"
            >
                <div
                    className={cn(
                        "pointer-events-auto w-full max-w-2xl mx-auto min-h-[64px] lg:min-h-[72px] rounded-t-2xl lg:rounded-2xl lg:mb-6 lg:border lg:border-zinc-700 lg:shadow-2xl lg:shadow-black/50 border-t transition-[transform] duration-300 ease-out translate-y-0",
                        "px-4 sm:px-5 py-3 sm:py-4 pb-[max(12px,env(safe-area-inset-bottom))] max-h-[min(70vh,520px)] flex flex-col",
                        isCorrect
                            ? "bg-emerald-950 border-emerald-800/60"
                            : "bg-zinc-950 border-zinc-800"
                    )}
                    style={{ animation: "slideUp 300ms ease-out" }}
                >
                    <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-3 shrink-0">
                        <div className="flex items-center gap-3 min-w-0">
                            <div
                                className={cn(
                                    "w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0",
                                    isCorrect
                                        ? "bg-emerald-500/20 border border-emerald-500/30"
                                        : "bg-red-500/10 border border-red-500/20"
                                )}
                            >
                                {isCorrect ? (
                                    <Check className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                                ) : (
                                    <X className="w-4 h-4 text-red-400 stroke-[2.5]" />
                                )}
                            </div>
                            <div>
                                <h3
                                    className={cn(
                                        "text-sm font-bold truncate",
                                        isCorrect ? "text-emerald-300" : "text-white"
                                    )}
                                >
                                    {title}
                                </h3>
                                <p
                                    className={cn(
                                        "text-xs mt-0.5 flex items-center gap-1",
                                        isCorrect ? "text-emerald-500/80" : "text-zinc-500"
                                    )}
                                >
                                    {isCorrect ? (
                                        <>
                                            <Zap className="w-3 h-3 shrink-0" />
                                            {subtitle}
                                        </>
                                    ) : (
                                        subtitle
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-row items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap sm:pt-0.5">
                            <Button
                                type="button"
                                onClick={buttonAction}
                                className={cn(
                                    "h-9 min-h-[44px] rounded-full px-4 sm:px-5 text-xs sm:text-sm font-semibold transition-colors duration-150",
                                    isCorrect
                                        ? "bg-emerald-500 hover:bg-emerald-400 text-white"
                                        : "bg-white text-zinc-900 hover:bg-zinc-100"
                                )}
                            >
                                {buttonText}
                            </Button>
                        </div>
                    </div>

                    {hasExplanation && inlineExplanationHtml && (
                        <div
                            className="mt-3 pt-3 border-t border-zinc-800/80 overflow-y-auto min-h-0 text-left"
                            dangerouslySetInnerHTML={{ __html: inlineExplanationHtml }}
                        />
                    )}
                </div>
            </div>
        );
    }
);

AnswerFeedback.displayName = "AnswerFeedback";
