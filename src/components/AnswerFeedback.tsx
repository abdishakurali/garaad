"use client";
import React, { memo, useState, useMemo, useCallback, Suspense } from "react";
import { useDispatch } from "react-redux";
import { resetAnswerState, revealAnswer } from "@/store/features/learningSlice";
import { ExplanationText, Lesson } from "@/types/learning";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Award, Check, ChevronRight, X } from "lucide-react";

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
      const blocks = [...currentLesson.content_blocks].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      const idx = blocks.findIndex((b) => b.block_type === "problem");
      return idx === blocks.length - 1;
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
    // Memoized feedback text & action
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
        {/* Feedback Banner - Only render if not reporting a bug */}
        {/* Explanation Modal */}
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
              "fixed inset-x-0 bottom-0 z-40 flex justify-center p-4"
            )}
          >
            <div
              className={cn(
                "w-full max-w-2xl p-6 rounded-3xl backdrop-blur-xl border shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-5",
                isCorrect
                  ? "bg-green-500/10 border-green-500/30 shadow-green-500/5"
                  : "bg-red-500/10 border-red-500/30 shadow-red-500/5"
              )}
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Icon + Text */}
                <div className="flex items-center text-left gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-2xl border transition-colors",
                      isCorrect
                        ? "bg-green-500/20 border-green-500/40 text-green-400"
                        : "bg-red-500/20 border-red-500/40 text-red-400"
                    )}
                  >
                    {isCorrect ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <X className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className={cn(
                      "font-bold text-lg",
                      isCorrect ? "text-green-400" : "text-red-400"
                    )}>
                      {title}
                    </p>
                    <p className="text-slate-300 text-sm font-medium">
                      {message}
                    </p>
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex gap-3 w-full md:w-auto">
                  {isCorrect && (
                    <Button
                      size="lg"
                      variant="ghost"
                      onClick={handleWhyClick}
                      className="flex-1 md:flex-none rounded-xl border border-white/10 hover:bg-white/5 text-white bg-transparent font-bold"
                    >
                      Sharaxaad
                    </Button>
                  )}
                  <Button
                    size="lg"
                    onClick={buttonAction}
                    className={cn(
                      "flex-1 md:flex-none rounded-xl gap-2 text-white font-bold transition-all active:scale-[0.98]",
                      isCorrect
                        ? "bg-green-600 hover:bg-green-500 shadow-lg shadow-green-500/20"
                        : "bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20"
                    )}
                  >
                    {buttonText}
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  {/* Bug Report */}
                  <Suspense fallback={null}>
                    <BugReportButton setIsReportingBug={setIsReportingBug} />
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
