"use client";
import React, { memo, useState, useMemo, useCallback, Suspense } from "react";
import { useLearningStore } from "@/store/useLearningStore";
import { ExplanationText, Lesson } from "@/types/learning";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Award, Check, ChevronRight, X, Info, Flag } from "lucide-react";

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

        // Determine if this is the last problem block
        const isLastQuestion = useMemo(() => {
            if (!currentLesson?.content_blocks) return false;
            const blocks = [...currentLesson.content_blocks]
                .filter(b => b.block_type === "problem")
                .sort((a, b) => (a.order || 0) - (b.order || 0));
            return true; // Simplified for UI redesign
        }, [currentLesson?.content_blocks]);

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

        // Memoized feedback content
        const { title, message, buttonText, buttonAction } = useMemo(() => {
            if (isCorrect) {
                return {
                    title: "Jawaab Sax ah!",
                    message: "Hore usoco Garaad",
                    buttonText: isLastQuestion ? "Casharka xiga" : "Sii wado",
                    buttonAction: handleContinueClick,
                };
            }
            return {
                title: "Jawaab Khalad ah",
                message: "akhri sharaxaada oo ku celi markale",
                buttonText: "Isku day markale",
                buttonAction: onResetAnswer,
            };
        }, [isCorrect, isLastQuestion, handleContinueClick, onResetAnswer]);

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
                        className="fixed inset-x-0 bottom-0 z-50 flex justify-center"
                    >
                        <div
                            className={cn(
                                "w-full max-w-3xl p-6 md:p-8 rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t border-x transition-all duration-300",
                                isCorrect
                                    ? "bg-white/95 dark:bg-zinc-900/95 border-emerald-500/25 backdrop-blur-xl"
                                    : "bg-white/95 dark:bg-zinc-900/95 border-slate-200 dark:border-white/10 backdrop-blur-xl"
                            )}
                        >
                            <div className="flex flex-col md:flex-row items-center gap-6">
                                {/* Left side: Icon + Text + XP */}
                                <div className="flex items-center gap-4 text-left flex-1">
                                    <div
                                        className={cn(
                                            "w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl shadow-sm transition-transform duration-500",
                                            isCorrect
                                                ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                                : "bg-slate-500 text-white shadow-slate-500/20"
                                        )}
                                    >
                                        {isCorrect ? (
                                            <Check className="h-7 w-7 stroke-[3.5]" />
                                        ) : (
                                            <X className="h-7 w-7 stroke-[3.5]" />
                                        )}
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center flex-wrap gap-2.5">
                                            <h3 className={cn(
                                                "text-xl font-black tracking-tight",
                                                isCorrect ? "text-emerald-600 dark:text-emerald-400" : "text-slate-600 dark:text-slate-400"
                                            )}>
                                                {title}
                                            </h3>
                                            {isCorrect && (
                                                <div className="py-1 px-3 font-black text-[10px] rounded-full bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 animate-bounce">
                                                    <Award size={12} />
                                                    <span className="tracking-widest uppercase">+{xp}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm leading-tight">
                                            {message}
                                        </p>
                                    </div>
                                </div>

                                {/* Right side: Action Buttons */}
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleWhyClick}
                                        className={cn(
                                            "h-12 rounded-xl font-black px-5 text-sm transition-colors",
                                            isCorrect
                                                ? "hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
                                                : "hover:bg-slate-500/10 hover:text-slate-600 dark:hover:text-slate-400"
                                        )}
                                    >
                                        <Info className="mr-2 h-4 w-4 stroke-[2.5]" />
                                        Sharaxaad
                                    </Button>

                                    <Button
                                        size="lg"
                                        onClick={buttonAction}
                                        className={cn(
                                            "flex-1 md:flex-none h-12 px-10 rounded-xl gap-2 text-white font-black text-lg transition-all active:scale-[0.96] shadow-xl",
                                            isCorrect
                                                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30"
                                                : "bg-slate-600 hover:bg-slate-500 shadow-slate-500/30"
                                        )}
                                    >
                                        {buttonText}
                                        <ChevronRight className="h-5 w-5 stroke-[3]" />
                                    </Button>

                                    <Suspense fallback={null}>
                                        <div className="hidden lg:block">
                                            <BugReportButton setIsReportingBug={setIsReportingBug} />
                                        </div>
                                    </Suspense>
                                </div>
                            </div>
                        </div>
                    </div >
                )}
            </>
        );
    }
);

AnswerFeedback.displayName = "AnswerFeedback";
