import React, { useState } from "react";
import {
  Lesson,
  LessonContentBlock,
  TextContent,
  ProblemContent,
} from "@/types/learning";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, AlertCircle } from "lucide-react";

interface LessonContentProps {
  lesson: Lesson;
  onQuizSubmit?: (blockId: number, answer: string) => void;
}

interface QuizState {
  selectedAnswer: string | null;
  isSubmitted: boolean;
  isCorrect: boolean;
  showExplanation: boolean;
}

const ContentBlockRenderer: React.FC<{
  block: LessonContentBlock;
  onQuizSubmit?: (blockId: number, answer: string) => void;
  onContinue: () => void;
}> = ({ block, onQuizSubmit, onContinue }) => {
  const [quizState, setQuizState] = useState<QuizState>({
    selectedAnswer: null,
    isSubmitted: false,
    isCorrect: false,
    showExplanation: false,
  });

  const handleAnswerSelect = (answer: string) => {
    if (quizState.isSubmitted) return;
    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: answer,
    }));
  };

  const handleQuizSubmit = () => {
    if (
      !quizState.selectedAnswer ||
      !block.content ||
      typeof block.content !== "object" ||
      !("correct_answer" in block.content)
    )
      return;

    const isCorrect = Array.isArray(block.content.correct_answer)
      ? block.content.correct_answer.some(
          (answer) => answer.text === quizState.selectedAnswer
        )
      : quizState.selectedAnswer === block.content.correct_answer;
    setQuizState((prev) => ({
      ...prev,
      isSubmitted: true,
      isCorrect,
    }));

    if (block.problem) {
      onQuizSubmit?.(block.problem, quizState.selectedAnswer);
    }
  };

  const toggleExplanation = () => {
    setQuizState((prev) => ({
      ...prev,
      showExplanation: !prev.showExplanation,
    }));
  };

  switch (block.block_type) {
    case "text":
      const textContent = block.content as TextContent;
      return (
        <div className="space-y-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg">{textContent.text}</p>
          </div>
          <Button onClick={onContinue} className="w-full sm:w-auto">
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    case "example":
      const exampleContent = block.content as TextContent;
      return (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{exampleContent.desc}</h3>
            <p className="text-lg text-muted-foreground">
              {exampleContent.text}
            </p>
          </div>
          <Button onClick={onContinue} className="w-full sm:w-auto">
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    case "interactive":
      const problemContent = block.content as ProblemContent;
      if (problemContent.question_type === "mcq") {
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Practice Question</h3>
              <p className="text-lg">{problemContent.question}</p>
              <div className="grid gap-3">
                {problemContent.options?.map(
                  (option: string, index: number) => (
                    <button
                      key={index}
                      className={cn(
                        "p-4 text-left rounded-lg border-2 transition-all",
                        "hover:border-primary/50",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        quizState.selectedAnswer === option &&
                          !quizState.isSubmitted &&
                          "border-primary",
                        quizState.isSubmitted && {
                          "border-green-500 bg-green-50 text-green-700":
                            Array.isArray(problemContent.correct_answer) &&
                            problemContent.correct_answer.some(
                              (answer) => answer.text === option
                            ),
                          "border-red-500 bg-red-50 text-red-700":
                            quizState.selectedAnswer === option &&
                            !Array.isArray(problemContent.correct_answer) &&
                            option !== problemContent.correct_answer,
                        }
                      )}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={quizState.isSubmitted}
                    >
                      <span className="text-lg">{option}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!quizState.isSubmitted && quizState.selectedAnswer && (
                <Button onClick={handleQuizSubmit} className="flex-1">
                  Check Answer
                </Button>
              )}

              {quizState.isSubmitted && (
                <>
                  <Button
                    variant="outline"
                    onClick={toggleExplanation}
                    className="flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4" />
                    Why?
                  </Button>
                  <Button onClick={onContinue} className="flex-1">
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {quizState.isSubmitted &&
              quizState.showExplanation &&
              problemContent.explanation && (
                <div
                  className={cn(
                    "p-4 rounded-lg",
                    quizState.isCorrect ? "bg-green-50" : "bg-red-50"
                  )}
                >
                  <p className="text-lg font-medium mb-2">
                    {quizState.isCorrect ? "Correct!" : "Incorrect"}
                  </p>
                  <p className="text-lg">{problemContent.explanation}</p>
                </div>
              )}
          </div>
        );
      }
      return null;
    default:
      return null;
  }
};

export const LessonContent: React.FC<LessonContentProps> = ({
  lesson,
  onQuizSubmit,
}) => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const sortedBlocks =
    lesson.content_blocks?.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)) ??
    [];
  const currentBlock = sortedBlocks[currentBlockIndex];

  const handleContinue = () => {
    if (currentBlockIndex < sortedBlocks.length - 1) {
      setCurrentBlockIndex(currentBlockIndex + 1);
    }
  };

  if (!lesson.content_blocks?.length) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
            <span>Lesson {lesson.lesson_number}</span>
            <span>•</span>
            <span>{lesson.estimated_time}</span>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              No content blocks available for this lesson.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{lesson.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <span>Lesson {lesson.lesson_number}</span>
          <span>•</span>
          <span>{lesson.estimated_time}</span>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          {currentBlock && (
            <ContentBlockRenderer
              block={currentBlock}
              onQuizSubmit={onQuizSubmit}
              onContinue={handleContinue}
            />
          )}
        </CardContent>
      </Card>

      <div className="mt-4 flex justify-between items-center">
        <div className="flex gap-1">
          {sortedBlocks.map((_: LessonContentBlock, index: number) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full",
                index === currentBlockIndex
                  ? "bg-primary"
                  : index < currentBlockIndex
                  ? "bg-primary/30"
                  : "bg-gray-200"
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {currentBlockIndex + 1} of {sortedBlocks.length}
        </span>
      </div>
    </div>
  );
};
