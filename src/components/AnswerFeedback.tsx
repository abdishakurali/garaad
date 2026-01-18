"use client";
import React, { memo, useState, useMemo, useCallback, Suspense } from "react";
import { useDispatch } from "react-redux";
import { resetAnswerState, revealAnswer } from "@/store/features/learningSlice";
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
        const dispatch = useDispatch();
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
            dispatch(revealAnswer());
            setShowExplanation(true);
        }, [dispatch]);

        const handleContinueClick = useCallback(() => {
            dispatch(resetAnswerState());
            onContinue?.();
        }, [dispatch, onContinue]);

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
                        className={cn(
                            "fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 sm:p-6",
                            "animate-in fade-in slide-in-from-bottom-10 duration-500 ease-out"
                        )}
                    >
                        <div
                            className={cn(
                                "w-full max-w-2xl p-6 rounded-[2rem] shadow-2xl border-2 transition-all duration-300",
                                isCorrect
                                    ? "bg-[#D7FFB8] border-[#58CC02] dark:bg-[#1a2e0a] dark:border-[#58CC02]"
                                    : "bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-500/30"
                            )}
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                {/* Left side: Icon + Text + XP */}
                                <div className="flex items-center gap-4 text-left w-full">
                                    <div
                                        className={cn(
                                            "w-12 h-12 shrink-0 flex items-center justify-center rounded-2xl border-2 shadow-sm transition-transform duration-500 hover:scale-110",
                                            isCorrect
                                                ? "bg-[#58CC02] border-[#58CC02] text-white"
                                                : "bg-red-500 border-red-500 text-white"
                                        )}
                                    >
                                        {isCorrect ? (
                                            <Check className="h-7 w-7 stroke-[3]" />
                                        ) : (
                                            <X className="h-7 w-7 stroke-[3]" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className={cn(
                                                "text-xl font-black tracking-tight",
                                                isCorrect ? "text-[#58CC02]" : "text-red-600 dark:text-red-400"
                                            )}>
                                                {title}
                                            </h3>
                                            {isCorrect && (
                                                <div className="py-1 px-3 font-bold text-sm rounded-xl bg-[#8ef53f42] border border-[#58CC02]/20 flex items-center gap-2 animate-bounce">
                                                    <Award className="text-[#58CC02]" size={16} />
                                                    <span className="text-[#3b8a01] dark:text-[#a3e635]">+{xp} dhibco</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground font-medium text-sm sm:text-base">
                                            {message}
                                        </p>
                                    </div>
                                </div>

                                {/* Right side: Action Buttons */}
                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    {isCorrect && (
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={handleWhyClick}
                                            className="h-12 rounded-2xl border-2 border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 font-bold px-6"
                                        >
                                            <Info className="mr-2 h-5 w-5" />
                                            Sharaxaad
                                        </Button>
                                    )}

                                    {!isCorrect && (
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            onClick={handleWhyClick}
                                            className="h-12 rounded-2xl border-2 border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 font-bold px-6"
                                        >
                                            <Info className="mr-2 h-5 w-5" />
                                            Sharaxaad
                                        </Button>
                                    )}

                                    <Button
                                        size="lg"
                                        onClick={buttonAction}
                                        className={cn(
                                            "flex-1 md:flex-none h-12 px-8 rounded-2xl gap-2 text-white font-black text-base transition-all active:scale-[0.96] shadow-lg",
                                            isCorrect
                                                ? "bg-[#58CC02] hover:bg-[#46a302] border-b-4 border-[#46a302]"
                                                : "bg-red-500 hover:bg-red-400 border-b-4 border-red-700"
                                        )}
                                    >
                                        {buttonText}
                                        <ChevronRight className="h-5 w-5 stroke-[3]" />
                                    </Button>

                                    <Suspense fallback={null}>
                                        <div className="hidden sm:block">
                                            <BugReportButton setIsReportingBug={setIsReportingBug} />
                                        </div>
                                    </Suspense>
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
