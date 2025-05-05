"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import DiagramScale from "../DiagramScale";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Latex from "react-latex-next";
import { motion } from "framer-motion";
import { ProblemContent } from "@/app/courses/[categoryId]/[courseSlug]/lessons/[lessonId]/page";

// Dynamically import the code editor to avoid SSR issues

const ProblemBlock: React.FC<{
  onContinue: () => void;
  selectedOption: string | null;
  answerState: {
    isCorrect: boolean | null;
    showAnswer: boolean;
    lastAttempt: string | null;
  };
  onOptionSelect: (option: string) => void;
  onCheckAnswer: () => void;
  isLoading: boolean;
  error: string | null;
  content: ProblemContent | null;
  isCorrect: boolean;
  isLastInLesson: boolean;
}> = ({
  onContinue,
  selectedOption,
  answerState,
  onOptionSelect,
  onCheckAnswer,
  isLoading,
  error,
  content,
  isCorrect,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-6 text-center">
          <p className="text-red-500">
            {error || "Problem content could not be loaded"}
          </p>
          <Button onClick={onContinue} className="mt-2">
            SiiWado Qaybta Kale
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Determine if user has checked an answer
  const hasAnswered = answerState.isCorrect !== null;

  console.log("CONTENT", content);

  return (
    <div className="max-w-2xl mx-auto  ">
      <motion.div className="space-y-8">
        {/* Question Card */}
        <Card className="border-none shadow-xl z-0">
          <CardHeader className="relative text-left items-center justify-center flex   bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
            <div className="pt-1">
              <CardTitle className="text-md font-normal text-gray-600 items-center justify-center flex mt-1">
                {content.which}
              </CardTitle>
              <CardTitle className="text-md text-max font-medium items-center justify-center flex mt-1">
                {content.question}
              </CardTitle>
            </div>
          </CardHeader>

          {content.img && (
            <CardContent className="flex justify-center py-2">
              <div className="relative w-full max-w-[500px] h-[250px] my-2">
                <Image
                  src={content.img || "/placeholder.svg"}
                  alt={content.alt || "lesson image"}
                  fill
                  loading="lazy"
                  className="rounded-xl shadow-lg object-contain bg-white"
                  sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 500px"
                  quality={90}
                />
              </div>
            </CardContent>
          )}
          {content.question_type === "diagram" && (
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-center h-auto">
              {content?.diagram_config &&
                (Array.isArray(content.diagram_config) ? (
                  content.diagram_config.length === 1 ? (
                    <DiagramScale config={content.diagram_config[0]} />
                  ) : (
                    content.diagram_config.map((config, index) => (
                      <DiagramScale key={index} config={config} />
                    ))
                  )
                ) : (
                  <DiagramScale config={content.diagram_config} />
                ))}
            </CardContent>
          )}
          <CardContent className="p-4 -mt-4">
            {/* Options Layout */}
            {content.question_type === "diagram" ? (
              <div className="grid gap-4  grid-cols-2">
                {content?.options?.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isOptionCorrect =
                    hasAnswered && isSelected && isCorrect;
                  const isOptionIncorrect =
                    hasAnswered && isSelected && !isCorrect;
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => onOptionSelect(option)}
                      disabled={hasAnswered && isSelected}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all duration-300 relative overflow-hidden text-left",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        !isSelected &&
                          !hasAnswered &&
                          "border-gray-200 hover:border-primary/50 hover:bg-primary/5",
                        isSelected &&
                          !hasAnswered &&
                          "border-primary bg-primary/10 shadow-md",
                        isOptionCorrect &&
                          "border-green-500 bg-green-50 shadow-md",
                        isOptionIncorrect &&
                          "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {/* X icon for incorrect */}
                      {isOptionIncorrect && (
                        <span className="absolute top-2 right-2 text-gray-400">
                          <X className="h-5 w-5" />
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "text-sm   font-normal",
                            isOptionIncorrect
                              ? "text-gray-400"
                              : "text-gray-800"
                          )}
                        >
                          {content.content.type === "latex" ? (
                            // <InlineMath
                            //   math={
                            //     option
                            //       .replace(/^\\\(/, "") // remove leading \( if present
                            //       .replace(/\\\)$/, "") // remove trailing \) if present
                            //       .replace(/\\\\/g, "\\") // removes wrapping \( \)
                            //   }
                            // />
                            <Latex>{option}</Latex>
                          ) : (
                            <span>{option} </span>
                          )}
                        </span>
                        {isOptionCorrect && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                      {isSelected && !hasAnswered && (
                        <motion.div
                          className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                          layoutId="selectedOption"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div
                className={`${
                  content.content && content.content.format == "grid"
                    ? "grid grid-cols-2 items-center gap-5"
                    : "grid grid-cols-1 items-center gap-5 py-5 "
                }`}
              >
                {content?.options?.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isOptionCorrect =
                    hasAnswered && isSelected && isCorrect;
                  const isOptionIncorrect =
                    hasAnswered && isSelected && !isCorrect;
                  return (
                    <motion.button
                      key={idx}
                      onClick={() => onOptionSelect(option)}
                      disabled={hasAnswered && isSelected}
                      className={cn(
                        "w-full p-3 text-sm rounded-xl border-2 transition-all duration-300 relative overflow-hidden text-left",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        // Default state
                        !isSelected &&
                          !hasAnswered &&
                          "border-gray-200 hover:border-primary/50 hover:bg-primary/5",
                        // Selected but not yet checked
                        isSelected &&
                          !hasAnswered &&
                          "border-primary bg-primary/10 shadow-md",
                        // Correct
                        isOptionCorrect &&
                          "border-green-500 bg-green-50 shadow-md",
                        // Incorrect (custom style)
                        isOptionIncorrect &&
                          "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
                      )}
                    >
                      {/* X icon for incorrect */}
                      {isOptionIncorrect && (
                        <span className="absolute top-2 right-2 text-gray-400">
                          <X className="h-5 w-5" />
                        </span>
                      )}
                      <div className="flex items-center justify-between">
                        <span
                          className={cn(
                            "text-sm   font-normal",
                            isOptionIncorrect
                              ? "text-gray-400"
                              : "text-gray-800"
                          )}
                        >
                          {content.content.type === "latex" ? (
                            // <InlineMath
                            //   math={
                            //     option
                            //       .replace(/^\\\(/, "") // remove leading \( if present
                            //       .replace(/\\\)$/, "") // remove trailing \) if present
                            //       .replace(/\\\\/g, "\\") // removes wrapping \( \)
                            //   }
                            // />
                            <Latex>{option}</Latex>
                          ) : (
                            <span>{option} </span>
                          )}
                        </span>
                        {isOptionCorrect && (
                          <motion.div
                            initial="hidden"
                            animate="visible"
                            className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center"
                          >
                            <Check className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                      </div>
                      {isSelected && !hasAnswered && (
                        <motion.div
                          className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                          layoutId="selectedOption"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}
          </CardContent>
          <CardFooter className="pt-2 pb-4 px-6">
            <div className="w-full space-y-2">
              {answerState.isCorrect === null && !hasAnswered && (
                <Button
                  onClick={onCheckAnswer}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  disabled={!selectedOption || isLoading}
                >
                  Hubi Jawaabta
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProblemBlock;
