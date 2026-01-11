"use client";
import React, { memo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Latex from "react-latex-next";
// import { ProblemContent } from "@/types/lms";
import { ProblemContent } from "@/types/learning";
import { useSoundManager } from "@/hooks/use-sound-effects";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { useProblem } from "@/hooks/useApi";

// Dynamically import the diagram component
const DiagramScale = dynamic(() => import("../DiagramScale"), {
  ssr: false,
  loading: () => <div>Loading diagram...</div>,
});

// Helper function to check if URL is a video file
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
    // Internal fetching if problemId is provided
    const { problem: fetchedData, isLoading: internalLoading, isError: internalError } = useProblem(problemId);

    // Transform internal data to ProblemContent if needed
    const content = useMemo(() => {
      if (externalContent) return externalContent;
      if (!fetchedData) return null;

      // Transform ProblemData to ProblemContent (logic from LessonPage.tsx)
      const pd = fetchedData as any;
      return {
        id: pd.id,
        question: pd.question_text,
        which: pd.which,
        options: Array.isArray(pd.options)
          ? pd.options.map((opt: any) => typeof opt === 'string' ? opt : opt.text)
          : pd?.options,
        correct_answer: pd.correct_answer.map((ans: any, index: number) => ({
          id: `answer-${index}`,
          text: ans.text,
        })),
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
      // Play toggle-on sound when an option is selected
      playSound("toggle-on");
      onOptionSelect(option);
    };

    const renderOption = (option: string, idx: number) => {
      const isSelected = selectedOption === option;
      const isOptionCorrect = hasAnswered && isSelected && isCorrect;
      const isOptionIncorrect = hasAnswered && isSelected && !isCorrect;
      const isDisabled =
        disabledOptions.includes(option) || (hasAnswered && isCorrect);

      const buttonClass = cn(
        "w-full p-4 text-sm rounded-xl border transition-all duration-300 relative text-left outline-none",
        !isSelected && !hasAnswered && "border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:border-primary/50 hover:bg-primary/5 text-slate-700 dark:text-slate-200",
        isSelected && !hasAnswered && "border-primary bg-primary/20 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-primary dark:text-white scale-[1.02]",
        isOptionCorrect && "border-green-500 bg-green-500/10 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
        isOptionIncorrect && "border-black/5 dark:border-white/5 bg-transparent text-slate-400 dark:text-slate-600",
        isDisabled && !isOptionCorrect && "border-black/5 dark:border-white/5 bg-transparent text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50"
      );

      return (
        <button
          key={idx}
          onClick={() => handleOptionSelect(option)}
          disabled={isDisabled}
          className={buttonClass}
        >
          {(isOptionIncorrect || isDisabled) && (
            <span className="absolute top-2 right-2 text-gray-400">
              <X className="h-5 w-5" />
            </span>
          )}
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "font-normal",
                isOptionIncorrect ? "text-slate-400 dark:text-slate-600" : "text-slate-800 dark:text-slate-200"
              )}
            >
              {content?.content.type === "latex" ? (
                <Latex>{option}</Latex>
              ) : (
                option
              )}
            </span>
            {isOptionCorrect && (
              <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </button>
      );
    };

    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="rounded-full h-12 w-12 border-b-2 border-primary animate-spin"></div>
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

    // Handle Calculator type
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
      <div className="w-full max-w-2xl mx-auto px-4">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl bg-white/5 dark:bg-black/40 backdrop-blur-sm border border-black/5 dark:border-white/5 transition-all duration-500 hover:bg-black/5 dark:hover:bg-black/50">
            <div className="p-8 md:p-10 space-y-6">
              <div className="space-y-3">
                {content.content.type === "latex" ? (
                  <>
                    <div className="text-sm font-bold text-primary/80 uppercase tracking-widest">
                      <Latex>{content.which}</Latex>
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                      <Latex>{content.question}</Latex>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-bold text-primary/80 uppercase tracking-widest prose-sm max-w-none">
                      {content.which && content.which.includes('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: content.which }} />
                      ) : (
                        content.which
                      )}
                    </div>
                    <div className="text-xl md:text-2xl font-bold text-foreground leading-tight prose dark:prose-invert max-w-none">
                      {content.question && content.question.includes('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: content.question }} />
                      ) : (
                        content.question
                      )}
                    </div>
                  </>
                )}
              </div>

              {content.img && (
                <div className="flex justify-center py-4">
                  <div className="relative w-full max-w-[500px] aspect-[16/9] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 bg-black/5 dark:bg-black/20">
                    {imgLoading && (
                      <div className="absolute inset-0 w-full h-full bg-white/5 animate-pulse z-10" />
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
                        style={{ opacity: imgLoading ? 0 : 1, transition: "opacity 0.5s" }}
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
                        className="object-contain"
                        sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 500px"
                        quality={75}
                        priority={false}
                        onLoad={() => setImgLoading(false)}
                        onError={() => setImgLoading(false)}
                        style={{ opacity: imgLoading ? 0 : 1, transition: "opacity 0.5s" }}
                      />
                    )}
                  </div>
                </div>
              )}

              {content.question_type === "diagram" && (content.diagram_config || content.diagrams) && (
                <div className="py-6 max-w-full overflow-hidden">
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center w-full max-w-full overflow-hidden">
                    {(() => {
                      const diagramCount = content.diagrams?.length ||
                        (Array.isArray(content.diagram_config) ? content.diagram_config.length : 1);
                      const isMultiple = diagramCount > 1;

                      if (content.diagrams) {
                        return content.diagrams.map((cfg, i) => (
                          <div key={cfg.diagram_id || i} className="flex-shrink min-w-0 w-full max-w-full">
                            <DiagramScale config={cfg} isMultiple={isMultiple} />
                          </div>
                        ));
                      } else if (Array.isArray(content.diagram_config)) {
                        return content.diagram_config.map((cfg, i) => (
                          <div key={cfg.diagram_id || i} className="flex-shrink min-w-0 w-full max-w-full">
                            <DiagramScale config={cfg} isMultiple={isMultiple} />
                          </div>
                        ));
                      } else if (content.diagram_config) {
                        return (
                          <div className="flex-shrink min-w-0 w-full max-w-full">
                            <DiagramScale config={content.diagram_config} isMultiple={isMultiple} />
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "gap-4 w-full max-w-xl mx-auto",
                  content.question_type === "diagram" ? "grid grid-cols-2" : "flex flex-col"
                )}
              >
                {content.options.map(renderOption)}
              </div>
            </div>

            <div className="px-8 pb-8 pt-2">
              <div className="w-full">
                {answerState.isCorrect === null && !hasAnswered && (
                  <Button
                    onClick={onCheckAnswer}
                    className="w-full h-12 rounded-xl text-md font-bold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                    disabled={!selectedOption}
                  >
                    Hubi Jawaabta
                  </Button>
                )}
                {hasAnswered && (
                  <Button
                    onClick={onContinue}
                    className="w-full h-12 rounded-xl text-md font-bold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                  >
                    Sii wado
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default memo(ProblemBlock);
