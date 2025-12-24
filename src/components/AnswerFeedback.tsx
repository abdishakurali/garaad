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
              "fixed inset-x-0 bottom-0 z-40 flex justify-center p-2 sm:p-4"
            )}
          >
            <div
              className={cn(
                "w-full max-w-2xl p-4 sm:p-6 rounded-2xl shadow-xl border-2",
                isCorrect
                  ? "bg-[#D7FFB8] border-[#58CC02]"
                  : "bg-red-50 border-red-200"
              )}
            >
              <div className="flex flex-col md:flex-row items-left justify-between gap-4">
                {/* Icon + Text */}
                <div className="flex items-left text-left gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full border-2",
                      isCorrect
                        ? "bg-[#58CC02] border-[#58CC02]"
                        : "bg-red-500 border-red-500"
                    )}
                  >
                    {isCorrect ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <X className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1 text-left">
                    <p className="font-semibold text-sm sm:text-base">
                      {title}
                    </p>
                    <p className="text-xs sm:text-sm">{message}</p>
                  </div>
                  {isCorrect && (
                    <div className=" py-2 px-1.5 font-bold text-sm rounded-md bg-[#8ef53f42] flex items-center gap-2">
                      <Award className="text-green-400" size={17} />+{xp} dhibco
                    </div>
                  )}
                </div>
                {/* Buttons */}
                <div className="flex gap-2">
                  {isCorrect && (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={handleWhyClick}
                      className="rounded-full border-gray-300 hover:border-gray-400 text-base sm:text-sm"
                    >
                      Sharaxaad
                    </Button>
                  )}
                  <Button
                    size="lg"
                    variant={isCorrect ? "default" : "secondary"}
                    onClick={buttonAction}
                    className={cn(
                      "rounded-full gap-1 text-base sm:text-sm",
                      isCorrect
                        ? "border-[#58CC02] hover:border-[#58CC02]/80"
                        : "border-red-200 hover:border-red-300"
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
