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
import MatchingBlock from "./MatchingBlock";

const DiagramScale = dynamic(() => import("../DiagramScale"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-muted rounded-xl h-40 w-full" />,
});

const ShikiCode = dynamic(() => import("./ShikiCode"), {
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
        question_type: ["code", "mcq", "short_input", "diagram", "matching"].includes(
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
      onOptionSelect(option);
    };

    const renderOption = (option: string, idx: number) => {
      const letters = ["A", "B", "C", "D", "E", "F"];
      const isSelected = selectedOption === option;
      const isOptionCorrect = hasAnswered && isSelected && isCorrect;
      const isOptionIncorrect = hasAnswered && isSelected && !isCorrect;
      const isDisabled = disabledOptions.includes(option) || (hasAnswered && isCorrect);

      const buttonClass = cn(
        "group w-full p-3.5 md:p-4.5 text-xs md:text-sm rounded-2xl border-2 transition-all duration-300 relative text-left outline-none flex items-center gap-4",
        // Default state
        !isSelected && !hasAnswered && "border-slate-200/60 dark:border-white/10 bg-white dark:bg-zinc-800/50 hover:border-primary/40 text-slate-700 dark:text-slate-300 shadow-sm hover:shadow-md hover:-translate-y-0.5",
        // Selected state (not answered yet) - Premium Lavender/Purple
        isSelected && !hasAnswered && "border-primary/60 bg-primary/5 dark:bg-primary/10 shadow-[0_8px_20px_-10px_rgba(168,85,247,0.3)] ring-1 ring-primary/20 text-primary font-bold scale-[1.01] hover:-translate-y-0.5",
        // Correct state - Vibrant Emerald
        isOptionCorrect && "border-emerald-500/60 bg-emerald-50/80 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold shadow-[0_8px_20px_-10px_rgba(16,185,129,0.3)]",
        // Incorrect state - Vibrant Rose (Enhanced Visibility)
        isOptionIncorrect && "border-rose-500 bg-rose-100/90 dark:bg-rose-500/20 text-rose-950 dark:text-rose-100 font-bold shadow-[0_4px_12px_rgba(244,63,94,0.4)]",
        // Disabled/Not selected state
        isDisabled && !isSelected && "border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-transparent text-slate-400/40 cursor-not-allowed grayscale opacity-40 shadow-none"
      );

      const indicatorClass = cn(
        "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all duration-300 shrink-0",
        !isSelected && !hasAnswered && "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5 text-slate-400 group-hover:bg-primary/10 group-hover:border-primary/40 group-hover:text-primary",
        isSelected && !hasAnswered && "bg-primary border-primary text-white shadow-lg shadow-primary/20",
        isOptionCorrect && "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20",
        isOptionIncorrect && "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20",
        isDisabled && !isSelected && "border-slate-100 dark:border-white/5 bg-transparent text-slate-300 dark:text-white/10"
      );

      return (
        <button
          key={idx}
          onClick={() => handleOptionSelect(option)}
          disabled={isDisabled}
          className={buttonClass}
        >
          <div className={indicatorClass}>
            {isOptionCorrect ? <Check className="h-6 w-6 stroke-[3]" /> :
              isOptionIncorrect ? <X className="h-6 w-6 stroke-[3]" /> :
                letters[idx] || (idx + 1)}
          </div>
          <div className="flex-1">
            <span className="leading-snug text-sm md:text-base tracking-tight">
              {content?.question_type === "code" || option.startsWith("```") ? (
                <ShikiCode code={option.replace(/```[a-z]*\n?|```/g, "")} language={option.match(/```([a-z]+)/)?.[1] || "javascript"} />
              ) : content?.content?.type === "latex" ? (
                <Latex>{option}</Latex>
              ) : (
                option
              )}
            </span>
          </div>
          {isSelected && !hasAnswered && (
            <div className="absolute right-6 scale-110">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            </div>
          )}
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

    if (content.question_type === "matching") {
      return (
        <div className="w-full max-w-3xl mx-auto px-4 pb-12">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                Isku xir kuwa saxda ah
              </h2>
              <p className="text-slate-500 font-medium">Jiid oo isku xir qeybaha is leh</p>
            </div>
            <MatchingBlock
              options={content.options}
              onComplete={(success) => {
                if (success) {
                  onCheckAnswer(); // Call parent check
                } else {
                  playSound("incorrect");
                }
              }}
              isCorrect={answerState.isCorrect}
            />
            {answerState.isCorrect !== null && (
              <div className="flex justify-center mt-8">
                <Button onClick={onContinue} size="lg" className="rounded-2xl px-12 h-14 font-black">
                  Sii soco markale
                </Button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full max-w-3xl mx-auto px-4 pb-12">
        <div className="space-y-8">
          {/* Question Card */}
          <div className="overflow-hidden rounded-[2rem] bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-black/[0.05] dark:border-white/[0.05] relative">
            <div className="p-8 md:p-12 space-y-10">
              <div className="space-y-6 text-center max-w-2xl mx-auto">
                {content.which && (
                  <div className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
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
                  {content.question_type === "code" || content.question.includes("```") ? (
                    <ShikiCode
                      code={content.question.replace(/```[a-z]*\n?|```/g, "")}
                      language={content.question.match(/```([a-z]+)/)?.[1] || "javascript"}
                    />
                  ) : content.content?.type === "latex" ? (
                    <Latex>{content.question}</Latex>
                  ) : (
                    content.question.includes('<') ? (
                      <div dangerouslySetInnerHTML={{ __html: content.question }} />
                    ) : content.question
                  )}
                </h2>
              </div>

              {content.img && (
                <div className="flex justify-center group px-4">
                  <div className="relative w-full max-w-[550px] aspect-[16/10] rounded-2xl overflow-hidden border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.01] dark:bg-black/20">
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
                        className="object-contain p-2 transition-transform duration-700 group-hover:scale-[1.01]"
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
                          <div key={cfg.diagram_id || i} className="w-full bg-black/[0.01] dark:bg-white/[0.01] rounded-2xl p-6 border border-black/[0.04] dark:border-white/[0.04]">
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
            <div className="px-8 md:px-12 pb-12 flex flex-col items-center">
              {!hasAnswered && (
                <Button
                  onClick={onCheckAnswer}
                  disabled={!selectedOption}
                  size="xl"
                  className={cn(
                    "w-full h-14 rounded-2xl font-bold transition-all duration-300 shadow-lg active:scale-[0.98]",
                    selectedOption ? "shadow-primary/20" : "shadow-none opacity-50"
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
