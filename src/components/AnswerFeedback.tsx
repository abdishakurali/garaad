"use client";
import React, { memo, useState, useMemo, useCallback, Suspense } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import { ExplanationText, Lesson } from "@/types/learning";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, X, Zap } from "lucide-react";

// Lazy‑load heavy components
const ExplanationModal = React.lazy(() => import("./ExplanationModal"));
const BugReportButton = React.lazy(() => import("./BugRepportButton"));

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
        const { resetAnswerState, revealAnswer } = useLearningStore();
        const [showExplanation, setShowExplanation] = useState(false);
        const [isReportingBug, setIsReportingBug] = useState(false);

        const isLastQuestion = useMemo(() => {
            if (!currentLesson?.content_blocks) return false;
            const blocks = [...currentLesson.content_blocks]
                .filter(b => b.block_type === "problem")
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            return true;
        }, [currentLesson?.content_blocks]);

        const hasExplanation = !!(explanationData?.explanation);

        const handleWhyClick = useCallback(() => {
            revealAnswer();
            setShowExplanation(true);
        }, [revealAnswer]);

        const handleContinueClick = useCallback(() => {
            resetAnswerState();
            onContinue?.();
        }, [resetAnswerState, onContinue]);

        const handleCloseExplanation = useCallback(() => {
            setShowExplanation(false);
        }, []);

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

        return (
            <>
                {showExplanation && (
                    <Suspense fallback={null}>
                        <ExplanationModal
                            isOpen
                            onClose={handleCloseExplanation}
                            content={{
                                explanation: explanationData?.explanation || "",
                                image: explanationData?.image || "",
                                type: explanationData?.type === "latex" ? "latex" : "markdown",
                            }}
                        />
                    </Suspense>
                )}

                {!isReportingBug && (
                    <div
                        key="answer-feedback-banner"
                        className="fixed inset-x-0 bottom-0 z-50 flex justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]"
                    >
                        <div
                            className={cn(
                                "pointer-events-auto w-full min-h-[72px] rounded-t-2xl border-t transition-[transform] duration-300 ease-out translate-y-0",
                                "px-4 sm:px-6 py-4 pb-[env(safe-area-inset-bottom)]",
                                isCorrect
                                    ? "bg-emerald-950 border-emerald-800/60"
                                    : "bg-zinc-950 border-zinc-800"
                            )}
                            style={{ animation: "slideUp 300ms ease-out" }}
                        >
                            <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className={cn(
                                            "w-9 h-9 rounded-full shrink-0 flex items-center justify-center min-w-[44px] min-h-[44px]",
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
                                        <h3 className={cn(
                                            "text-sm font-bold truncate",
                                            isCorrect ? "text-emerald-300" : "text-white"
                                        )}>
                                            {title}
                                        </h3>
                                        <p className={cn(
                                            "text-xs mt-0.5 flex items-center gap-1",
                                            isCorrect ? "text-emerald-500/80" : "text-zinc-500"
                                        )}>
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

                                <div className="flex flex-row items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                                    <Suspense fallback={null}>
                                        <div className="hidden lg:block">
                                            <BugReportButton setIsReportingBug={setIsReportingBug} />
                                        </div>
                                    </Suspense>
                                    {isCorrect ? (
                                        <>
                                            {hasExplanation && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={handleWhyClick}
                                                    className="h-8 sm:h-9 min-h-[44px] rounded-full px-3 text-xs sm:text-sm bg-transparent border border-emerald-700/60 text-emerald-400 hover:bg-emerald-900/50"
                                                >
                                                    Maxay?
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                onClick={buttonAction}
                                                className="h-9 min-h-[44px] rounded-full px-5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm transition-colors duration-150"
                                            >
                                                {buttonText}
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            {hasExplanation && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={handleWhyClick}
                                                    className="h-8 sm:h-9 min-h-[44px] rounded-full px-3 text-xs sm:text-sm bg-transparent border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                                                >
                                                    Sharaxaad
                                                </Button>
                                            )}
                                            <Button
                                                type="button"
                                                onClick={buttonAction}
                                                className="h-9 min-h-[44px] rounded-full px-5 bg-white text-zinc-900 font-semibold text-sm transition-colors duration-150 hover:bg-zinc-100"
                                            >
                                                {buttonText}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
);

AnswerFeedback.displayName = "AnswerFeedback";
