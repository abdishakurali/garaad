import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetAnswerState, revealAnswer } from "@/store/features/learningSlice";
import { Lesson, LessonContentBlock, ProblemContent } from "@/types/learning";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, ChevronRight, X } from "lucide-react";

interface AnswerFeedbackProps {
  currentLesson: Lesson | null;
  isCorrect: boolean;
  onResetAnswer: () => void;
}
const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  currentLesson,
  isCorrect,
  onResetAnswer,
}) => {
  const dispatch = useDispatch();
  // const [showExplanation, setShowExplanation] = useState(false);

  // No need to play sounds here as we're handling it in the handleCheckAnswer function

  // Get explanation content from the current lesson
  const problemBlock = currentLesson?.content_blocks?.find(
    (block: LessonContentBlock) => block.block_type === "problem"
  );

  const content = problemBlock?.content
    ? typeof problemBlock.content === "string"
      ? (JSON.parse(problemBlock.content) as ProblemContent)
      : (problemBlock.content as ProblemContent)
    : null;

  const explanation = content?.explanation || "";
  const explanationImage = content?.image || "";

  const handleWhyClick = () => {
    dispatch(revealAnswer());
  };

  function handleContinue() {
    dispatch(resetAnswerState());
    // Logic to proceed to the next question or lesson
    console.log("Continuing to the next step...");
  }

  return (
    <>
      {/* <ExplanationModal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        explanation={explanation}
        image={explanationImage}
      /> */}

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed inset-x-0 bottom-0 z-40 flex justify-center p-4"
      >
        <div
          className={cn(
            "w-full max-w-2xl p-6 rounded-2xl shadow-xl border",
            isCorrect
              ? "bg-[#D7FFB8] border-[#58CC02]"
              : "bg-red-50 border-red-200"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isCorrect ? "bg-[#58CC02]" : "bg-red-500"
                )}
              >
                {isCorrect ? (
                  <Check className="h-5 w-5 text-white" />
                ) : (
                  <X className="h-5 w-5 text-white" />
                )}
              </div>
              <div className="space-y-1">
                <p className="font-semibold">
                  {isCorrect ? "Jawaab Sax ah!" : "Jawaab Khalad ah"}
                </p>
                <p className="text-sm">
                  {isCorrect
                    ? "waxaad ku guulaysatay 15 XP"
                    : "akhri sharaxaada oo ku celi markale"}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isCorrect ? "default" : "secondary"}
                onClick={isCorrect ? handleContinue : onResetAnswer}
                className="rounded-full gap-1"
              >
                {isCorrect ? "Sii wado" : "Isku day markale"}
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleWhyClick}
                className="rounded-full border-gray-300"
              >
                Sharaxaad
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AnswerFeedback;
