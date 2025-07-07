"use client";
import React, { useState } from "react";
import {
  PracticeSet as IPracticeSet,
  PracticeSetProblem,
} from "@/services/practice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSoundManager } from "@/hooks/use-sound-effects";

interface PracticeSetProps {
  practiceSet: IPracticeSet;
  onSubmit?: (problemId: number, answer: string) => void;
}

interface ProblemState {
  selectedAnswer: string | null;
  isSubmitted: boolean;
  isCorrect: boolean;
}

export const PracticeSet: React.FC<PracticeSetProps> = ({
  practiceSet,
  onSubmit,
}) => {
  const [problemStates, setProblemStates] = useState<
    Record<number, ProblemState>
  >({});
  const { playSound } = useSoundManager();

  const handleAnswerSelect = (problem: PracticeSetProblem, answer: string) => {
    if (problemStates[problem.id]?.isSubmitted) return;

    // Play toggle-on sound when an option is selected
    playSound("toggle-on");

    setProblemStates((prev) => ({
      ...prev,
      [problem.id]: {
        selectedAnswer: answer,
        isSubmitted: false,
        isCorrect: false,
      },
    }));
  };

  const handleSubmit = (problem: PracticeSetProblem) => {
    const selectedAnswer = problemStates[problem.id]?.selectedAnswer;
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === problem.problem_details.correct_answer;
    setProblemStates((prev) => ({
      ...prev,
      [problem.id]: {
        ...prev[problem.id],
        isSubmitted: true,
        isCorrect,
      },
    }));

    onSubmit?.(problem.id, selectedAnswer);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{practiceSet.title}</h2>
        <p className="text-muted-foreground">
          Adkaan: {practiceSet.difficulty_level}
        </p>
      </div>

      <div className="space-y-6">
        {practiceSet.practice_set_problems
          .sort((a, b) => a.order - b.order)
          .map((problem) => {
            const state = problemStates[problem.id];
            const showExplanation = state?.isSubmitted;

            return (
              <Card key={problem.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {problem.problem_details.question_text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {problem.problem_details.options?.map((option, index) => (
                      <button
                        key={index}
                        className={cn(
                          "w-full text-left px-4 py-2 rounded-lg border",
                          "transition-colors",
                          state?.selectedAnswer === option && "border-primary",
                          state?.isSubmitted && {
                            "border-green-500 bg-green-50":
                              option === problem.problem_details.correct_answer,
                            "border-red-500 bg-red-50":
                              state.selectedAnswer === option &&
                              option !== problem.problem_details.correct_answer,
                          }
                        )}
                        onClick={() => handleAnswerSelect(problem, option)}
                        disabled={state?.isSubmitted}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {!state?.isSubmitted && state?.selectedAnswer && (
                    <Button
                      onClick={() => handleSubmit(problem)}
                      className="w-full"
                    >
                      Gudbi Jawaabta
                    </Button>
                  )}

                  {showExplanation && (
                    <div
                      className={cn(
                        "p-4 rounded-lg",
                        state.isCorrect
                          ? "bg-green-50 text-green-900"
                          : "bg-red-50 text-red-900"
                      )}
                    >
                      <p className="font-medium">
                        {state.isCorrect ? "Sax!" : "Qaldan"}
                      </p>
                      <p className="mt-2">
                        {problem.problem_details.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};
