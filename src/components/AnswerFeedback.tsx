import React, { useState, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { resetAnswerState, revealAnswer } from "@/store/features/learningSlice";
import { Lesson } from "@/types/learning";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, X } from "lucide-react";
import ExplanationModal from "./ExplanationModal";

interface AnswerFeedbackProps {
  currentLesson: Lesson | null;
  isCorrect: boolean;
  onResetAnswer: () => void;
  onContinue?: () => void;
  explanationData?: {
    explanation: string;
    image: string;
  };
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = React.memo(({
  currentLesson,
  isCorrect,
  onResetAnswer,
  onContinue,
  explanationData,
}) => {
  const dispatch = useDispatch();
  const [showExplanation, setShowExplanation] = useState(false);

  // Memoize the sorted blocks and last question check
  const { isLastQuestion } = useMemo(() => {
    const sortedBlocks = currentLesson?.content_blocks
      ? [...currentLesson.content_blocks].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      )
      : [];

    const problemBlockIndex = sortedBlocks.findIndex(
      (block) => block.block_type === "problem"
    );

    return {
      isLastQuestion: problemBlockIndex === sortedBlocks.length - 1
    };
  }, [currentLesson?.content_blocks]);

  const handleWhyClick = useCallback(() => {
    dispatch(revealAnswer());
    setShowExplanation(true);
  }, [dispatch]);

  const handleContinueClick = useCallback(() => {
    dispatch(resetAnswerState());
    if (onContinue) {
      onContinue();
    }
  }, [dispatch, onContinue]);

  const handleCloseExplanation = useCallback(() => {
    setShowExplanation(false);
  }, []);

  // Memoize the feedback content
  const feedbackContent = useMemo(() => ({
    title: isCorrect ? "Jawaab Sax ah!" : "Jawaab Khalad ah",
    message: isCorrect ? "waxaad ku guulaysatay 15 XP" : "akhri sharaxaada oo ku celi markale",
    continueText: isCorrect ? (isLastQuestion ? "Casharka xiga" : "Sii wado") : "Isku day markale",
    buttonAction: isCorrect ? handleContinueClick : onResetAnswer
  }), [isCorrect, isLastQuestion, handleContinueClick, onResetAnswer]);

  return (
    <>
      <AnimatePresence>
        {showExplanation && (
          <ExplanationModal
            isOpen={showExplanation}
            onClose={handleCloseExplanation}
            content={{
              explanation: explanationData?.explanation || "",
              image: explanationData?.image || "",
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.5
        }}
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center p-2 sm:p-4"
      >
        <div
          className={cn(
            "w-full max-w-2xl p-4 sm:p-6 rounded-2xl shadow-xl border-2",
            isCorrect
              ? "bg-[#D7FFB8] border-[#58CC02]"
              : "bg-red-50 border-red-200"
          )}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2",
                  isCorrect
                    ? "bg-[#58CC02] border-[#58CC02] shadow-sm"
                    : "bg-red-500 border-red-500 shadow-sm"
                )}
              >
                {isCorrect ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <X className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-sm sm:text-base">
                  {feedbackContent.title}
                </p>
                <p className="text-xs sm:text-sm">
                  {feedbackContent.message}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Button
                size="lg"
                variant={isCorrect ? "default" : "secondary"}
                onClick={feedbackContent.buttonAction}
                className={cn(
                  "w-full sm:w-auto rounded-full gap-1 py-4 text-base sm:text-sm",
                  "border-2 transition-all duration-200",
                  isCorrect
                    ? "border-[#58CC02] hover:border-[#58CC02]/80"
                    : "border-red-200 hover:border-red-300"
                )}
              >
                {feedbackContent.continueText}
                <ChevronRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWhyClick}
                className="w-full sm:w-auto rounded-full border-2 border-gray-300 py-4 text-base sm:text-sm hover:border-gray-400 transition-all duration-200"
              >
                Sharaxaad
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
});

AnswerFeedback.displayName = "AnswerFeedback";
