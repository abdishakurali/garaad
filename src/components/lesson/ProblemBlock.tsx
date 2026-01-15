"use client";
import React, { memo, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Latex from "react-latex-next";
import { ProblemContent } from "@/types/learning";
import { useSoundManager } from "@/hooks/use-sound-effects";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { useProblem } from "@/hooks/useApi";

import CalculatorProblemBlock from "./CalculatorProblemBlock";

const DiagramScale = dynamic(() => import("../DiagramScale"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted rounded-xl h-40 w-full" />,
});

const isVideoFile = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.endsWith(ext));
};

const ProblemBlock: React.FC<{
  problemId?: number | null;
  onContinue: () => void;
  selectedOption: string | null;
  answerState: {
    isCorrect: boolean | null;
    showAnswer: boolean;
    lastAttempt: string | null;
  };
  onOptionSelect: (option: string) => void;
  onCheckAnswer: () => void;
  isLoading?: boolean;
  error?: string | null;
  content?: ProblemContent | null;
  isCorrect: boolean;
  isLastInLesson: boolean;
  disabledOptions: string[];
}> = ({
  problemId,
  onContinue,
  selectedOption,
  answerState,
  onOptionSelect,
  onCheckAnswer,
  isLoading: externalLoading,
  error: externalError,
  content: externalContent,
  isCorrect,
  disabledOptions = [],
}) => {
    const { problem: fetchedData, isLoading: internalLoading, isError: internalError } = useProblem(problemId);

    const content = useMemo(() => {
      if (externalContent) return externalContent;
      if (!fetchedData) return null;

      const pd = fetchedData as any;
      return {
        id: pd.id,
        question: pd.question_text,
        which: pd.which,
        options: Array.isArray(pd.options)
          ? pd.options.map((opt: any) => typeof opt === 'string' ? opt : opt.text)
          : [],
        correct_answer: Array.isArray(pd.correct_answer)
          ? pd.correct_answer.map((ans: any, index: number) => ({
            id: `answer-${ans.id || index}`,
            text: ans.text || "",
          }))
          : [],
        img: pd.img,
        alt: pd.alt,
        explanation: pd.explanation || "No explanation available",
        diagram_config: pd.diagram_config,
        diagrams: pd.diagrams,
        question_type: ["code", "mcq", "short_input", "diagram"].includes(
          pd.question_type
        )
          ? (pd.question_type as any)
          : undefined,
        content: pd.content || {},
      } as ProblemContent;
    }, [externalContent, fetchedData]);

    const isLoading = externalLoading || internalLoading;
    const error = externalError || (internalError ? "Failed to load problem" : null);

    const hasAnswered = answerState.isCorrect !== null;
    const [imgLoading, setImgLoading] = useState(false);
    const [imgSrc, setImgSrc] = useState(content?.img);
    const { playSound } = useSoundManager();

    useEffect(() => {
      if (content?.img) {
        setImgLoading(true);
        setImgSrc(optimizeCloudinaryUrl(content.img));
      }
    }, [content?.img]);

    const handleOptionSelect = (option: string) => {
      if (hasAnswered && isCorrect) return;
      playSound("toggle-on");
      onOptionSelect(option);
    };

    const renderOption = (option: string, idx: number) => {
      const letters = ["A", "B", "C", "D", "E", "F"];
      const isSelected = selectedOption === option;
      const isOptionCorrect = hasAnswered && isSelected && isCorrect;
      const isOptionIncorrect = hasAnswered && isSelected && !isCorrect;
      const isDisabled = disabledOptions.includes(option) || (hasAnswered && isCorrect);

      const buttonClass = cn(
        "group w-full p-5 text-sm md:text-md rounded-2xl border-2 transition-all duration-300 relative text-left outline-none flex items-center gap-4",
        // Default state
        !isSelected && !hasAnswered && "border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] hover:border-primary/40 hover:bg-primary/[0.04] text-foreground/80",
        // Selected state (not answered yet)
        isSelected && !hasAnswered && "border-primary bg-primary/10 shadow-[0_0_20px_rgba(209,143,253,0.15)] dark:shadow-[0_0_20px_rgba(16,185,129,0.1)] text-primary font-semibold scale-[1.01]",
        // Correct state
        isOptionCorrect && "border-green-500 bg-green-500/10 text-green-600 dark:text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.15)] font-semibold",
        // Incorrect/Disabled state
        isOptionIncorrect && "border-red-500/50 bg-red-500/5 text-red-500/70",
        isDisabled && !isSelected && "border-black/[0.03] dark:border-white/[0.03] bg-transparent text-foreground/30 cursor-not-allowed opacity-40"
      );

      const indicatorClass = cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors shrink-0",
        !isSelected && !hasAnswered && "border-black/[0.1] dark:border-white/[0.1] text-foreground/40 group-hover:border-primary/50 group-hover:text-primary",
        isSelected && !hasAnswered && "bg-primary border-primary text-white",
        isOptionCorrect && "bg-green-500 border-green-500 text-white",
        isOptionIncorrect && "bg-red-500 border-red-500 text-white",
        isDisabled && !isSelected && "border-black/[0.05] dark:border-white/[0.05] text-foreground/20"
      );

      return (
        <button
          key={idx}
          onClick={() => handleOptionSelect(option)}
          disabled={isDisabled}
          className={buttonClass}
        >
          <div className={indicatorClass}>
            {isOptionCorrect ? <Check className="h-4 w-4" /> :
              isOptionIncorrect ? <X className="h-4 w-4" /> :
                letters[idx] || (idx + 1)}
          </div>
          <div className="flex-1">
            <span className="leading-snug">
              {content?.content?.type === "latex" ? (
                <Latex>{option}</Latex>
              ) : (
                option
              )}
            </span>
          </div>
        </button>
      );
    };

    if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center py-24 gap-4">
          <div className="rounded-full h-14 w-14 border-4 border-primary/20 border-t-primary animate-spin"></div>
          <p className="text-muted-foreground animate-pulse font-medium">Soo dejinaya...</p>
        </div>
      );
    }

    if (error || !content) {
      return (
        <Card className="max-w-xl mx-auto border-destructive/20 bg-destructive/5 backdrop-blur-sm">
          <CardContent className="p-10 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <p className="text-destructive font-semibold text-lg">
              {error || "Khalad ayaa dhacay markii la soo dejinayay su'aasha"}
            </p>
            <Button onClick={onContinue} variant="outline" className="mt-4 rounded-xl px-8">
              Sii soco
            </Button>
          </CardContent>
        </Card>
      );
    }

    if (content.content?.type === "calculator") {
      const options = content.options as any;
      return (
        <CalculatorProblemBlock
          question={content.question}
          which={content.which}
          view={options?.view}
          onContinue={onContinue}
        />
      );
    }

    return (
      <div className="w-full max-w-3xl mx-auto px-4 pb-12">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Question Card */}
          <div className="overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-900 shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-black/[0.05] dark:border-white/[0.05] relative">
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-40" />

            <div className="p-8 md:p-12 space-y-8">
              <div className="space-y-4">
                {content.which && (
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                    {content.content?.type === "latex" ? (
                      <Latex>{content.which}</Latex>
                    ) : (
                      content.which.includes('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: content.which }} />
                      ) : content.which
                    )}
                  </div>
                )}

                <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight">
                  {content.content?.type === "latex" ? (
                    <Latex>{content.question}</Latex>
                  ) : (
                    content.question.includes('<') ? (
                      <div dangerouslySetInnerHTML={{ __html: content.question }} />
                    ) : content.question
                  )}
                </h2>
              </div>

              {content.img && (
                <div className="flex justify-center group">
                  <div className="relative w-full max-w-[600px] aspect-[16/10] rounded-[2rem] overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-black/[0.02] dark:bg-black/40 shadow-inner">
                    {imgLoading && (
                      <div className="absolute inset-0 w-full h-full bg-muted animate-pulse z-10" />
                    )}
                    {isVideoFile(content.img) ? (
                      <video
                        key={imgSrc}
                        src={imgSrc || ""}
                        controls
                        className="w-full h-full object-contain"
                        onLoadStart={() => setImgLoading(true)}
                        onCanPlay={() => setImgLoading(false)}
                        onError={() => setImgLoading(false)}
                        style={{ opacity: imgLoading ? 0 : 1, transition: "opacity 0.6s ease" }}
                      >
                        Browser-kaagu ma taageerayo video-ga.
                      </video>
                    ) : (
                      <Image
                        key={imgSrc}
                        src={imgSrc || ""}
                        alt={content.alt || "lesson image"}
                        fill
                        loading="lazy"
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-[1.02]"
                        sizes="(max-width: 900px) 100vw, 600px"
                        quality={90}
                        onLoad={() => setImgLoading(false)}
                        onError={() => setImgLoading(false)}
                        style={{ opacity: imgLoading ? 0 : 1, transition: "opacity 0.6s ease" }}
                      />
                    )}
                  </div>
                </div>
              )}

              {content.question_type === "diagram" && (content.diagram_config || content.diagrams) && (
                <div className="py-2 overflow-hidden">
                  {(() => {
                    const diagrams = content.diagrams || (Array.isArray(content.diagram_config) ? content.diagram_config : [content.diagram_config]);
                    const diagramCount = diagrams.length;
                    const isMultiple = diagramCount > 1;

                    return (
                      <div className={cn("grid gap-6 justify-center items-center w-full",
                        diagramCount === 2 ? "grid-cols-1 md:grid-cols-2" :
                          diagramCount >= 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
                      )}>
                        {diagrams.map((cfg: any, i: number) => (
                          <div key={cfg.diagram_id || i} className="w-full bg-black/[0.02] dark:bg-white/[0.02] rounded-3xl p-6 border border-black/[0.04] dark:border-white/[0.04] shadow-sm">
                            <DiagramScale config={cfg} isMultiple={isMultiple} />
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Options Grid */}
              <div
                className={cn(
                  "grid gap-4 w-full",
                  content.question_type === "diagram" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
                )}
              >
                {content.options.map(renderOption)}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-8 md:px-12 pb-10 flex flex-col items-center">
              {!hasAnswered && (
                <Button
                  onClick={onCheckAnswer}
                  disabled={!selectedOption}
                  size="xl"
                  className={cn(
                    "w-full max-w-sm font-black transition-all duration-300 shadow-xl active:scale-[0.97]",
                    selectedOption ? "shadow-primary/30 transform -translate-y-1" : "shadow-none"
                  )}
                >
                  Hubi Jawaabta
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

export default memo(ProblemBlock);
