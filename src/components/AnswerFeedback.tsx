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
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = memo(
    ({
        currentLesson,
        isCorrect,
        onResetAnswer,
        onContinue,
        explanationData,
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
        const content = useMemo(() => {
            if (isCorrect) {
                return {
                    title: "Jawaab Sax ah!",
                    message: "Aad iyo aad ayaad u mahadsantahay, horey u soco!",
                    buttonText: "Sii wado",
                    buttonClass: "bg-green-600 hover:bg-green-500 shadow-green-500/20",
                    icon: <Check className="h-7 w-7" />,
                    statusClass: "bg-green-500/20 border-green-500/40 text-green-500 dark:text-green-400",
                    bannerClass: "bg-white/90 dark:bg-zinc-900/90 border-green-500/30 shadow-green-500/10",
                    action: handleContinueClick
                };
            }
            return {
                title: "Jawaabtu waa khalad",
                message: "Sharaxaadda akhri oo markale isku day.",
                buttonText: "Isku day markale",
                buttonClass: "bg-red-600 hover:bg-red-500 shadow-red-500/20",
                icon: <X className="h-7 w-7" />,
                statusClass: "bg-red-500/20 border-red-500/40 text-red-500 dark:text-red-400",
                bannerClass: "bg-white/90 dark:bg-zinc-900/90 border-red-500/30 shadow-red-500/10",
                action: onResetAnswer
            };
        }, [isCorrect, handleContinueClick, onResetAnswer]);

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
                    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-6 md:p-10 pointer-events-none">
                        <div
                            className={cn(
                                "w-full max-w-4xl p-8 rounded-[2.5rem] backdrop-blur-2xl border-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] pointer-events-auto",
                                "animate-in fade-in slide-in-from-bottom-10 duration-500 ease-out",
                                content.bannerClass
                            )}
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                {/* Left side: Status Indicator + Text */}
                                <div className="flex items-center gap-6 text-center md:text-left">
                                    <div className={cn(
                                        "w-16 h-16 shrink-0 flex items-center justify-center rounded-[1.25rem] border-2 transition-transform duration-500 hover:scale-110",
                                        content.statusClass
                                    )}>
                                        {content.icon}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className={cn(
                                            "text-2xl font-black tracking-tight",
                                            isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                                        )}>
                                            {content.title}
                                        </h3>
                                        <p className="text-muted-foreground font-medium text-lg">
                                            {content.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Right side: Action Buttons */}
                                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                                    {!isCorrect && (
                                        <Button
                                            variant="outline"
                                            size="xl"
                                            onClick={handleWhyClick}
                                            className="w-full sm:w-auto rounded-2xl border-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 text-primary font-bold px-8 h-14"
                                        >
                                            <Info className="mr-2 h-5 w-5" />
                                            Sharaxaad
                                        </Button>
                                    )}

                                    <Button
                                        size="xl"
                                        onClick={content.action}
                                        className={cn(
                                            "w-full sm:w-auto h-14 px-10 rounded-2xl gap-3 text-white font-black text-lg transition-all active:scale-[0.96] shadow-2xl",
                                            content.buttonClass
                                        )}
                                    >
                                        {content.buttonText}
                                        <ChevronRight className="h-6 w-6" />
                                    </Button>

                                    <Suspense fallback={null}>
                                        <div className="md:ml-2">
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
