"use client";
import React, { memo, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { ProblemContent } from "@/types/learning";
import { useSoundManager } from "@/hooks/use-sound-effects";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";
import { useProblem } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";

import CalculatorProblemBlock from "./CalculatorProblemBlock";
import MatchingBlock from "./MatchingBlock";
import { CodeChallengeBlock } from "./CodeChallengeBlock";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  onOptionSelect: (option: string | string[]) => void;
  onCheckAnswer: () => void;
  isLoading?: boolean;
  error?: string | null;
  content?: ProblemContent | null;
  isCorrect: boolean;
  isLastInLesson: boolean;
  disabledOptions: string[];
  showReviewBanner?: boolean;
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
  showReviewBanner = false,
}) => {


    // Support for multiple selection (multiple_choice)
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const { problem: fetchedData, isLoading: internalLoading, isError: internalError } = useProblem(problemId);

    const content = useMemo(() => {
      // Prioritize fetchedData if available, otherwise use externalContent
      const pd = (fetchedData?.id ? fetchedData : externalContent) as any;
      if (!pd) return null;

      // Special case: if pd only contains metadata (like points) but is missing question_text,
      // and we have fetchedData, we should definitely use fetchedData.
      const actualData = (fetchedData?.question_text || fetchedData?.question) ? fetchedData : pd;

      // Unify field names across API and embedded content
      return {
        id: actualData.id,
        question: actualData.question_text || actualData.question,
        which: actualData.which,
        options: Array.isArray(actualData.options)
          ? actualData.options.map((opt: any) => typeof opt === 'string' ? opt : (opt.text || opt.content || ""))
          : [],
        correct_answer: (() => {
          const ca = actualData.correct_answer;
          if (actualData.question_type === "code" && ca === "passed") {
            return [{ id: "answer-0", text: "passed" }];
          }
          return Array.isArray(ca)
            ? ca.map((ans: any, index: number) => ({
                id: `answer-${ans.id || index}`,
                text: ans.text || (typeof ans === "string" ? ans : ""),
              }))
            : [];
        })(),
        img: actualData.img,
        alt: actualData.alt,
        explanation: actualData.explanation || "No explanation available",
        diagram_config: actualData.diagram_config,
        diagrams: actualData.diagrams,
        question_type: ["code", "mcq", "short_input", "diagram", "matching", "multiple_choice", "calculator", "single_choice"].includes(
          actualData.question_type
        )
          ? (actualData.question_type as any)
          : actualData.question_type || "mcq", // Default to mcq for safety
        content: actualData.content || {},
      } as ProblemContent;
    }, [externalContent, fetchedData]);

    const isMultipleChoice = content?.question_type === 'multiple_choice';

    // Sync with parent's selectedOption for backward compatibility
    useEffect(() => {
      if (!selectedOption) return;

      if (isMultipleChoice) {
        try {
          // Attempt to parse if it looks like an array
          let parsed = selectedOption;
          if (typeof selectedOption === 'string' && selectedOption.startsWith('[')) {
            try {
              const p = JSON.parse(selectedOption);
              if (Array.isArray(p)) parsed = p;
            } catch (e) {
              // ignore
            }
          }

          const newOpts = Array.isArray(parsed) ? parsed : [parsed];

          // Only update if different to avoid loops
          const isDifferent = newOpts.length !== selectedOptions.length || !newOpts.every(o => selectedOptions.includes(o));

          if (isDifferent) {
            setSelectedOptions(newOpts);
          }
        } catch (e) {
          console.error("Error parsing selectedOption", e);
        }
      } else {
        if (!selectedOptions.includes(selectedOption)) {
          setSelectedOptions([selectedOption]);
        }
      }
    }, [selectedOption, isMultipleChoice]);



    const isLoading = externalLoading || internalLoading;
    const error = externalError || (internalError ? "Su'aasha lama soo gelin karo" : null);

    const hasAnswered = answerState.isCorrect !== null;
    const [imgLoading, setImgLoading] = useState(false);
    const [imgSrc, setImgSrc] = useState(content?.img);
    const [textAnswer, setTextAnswer] = useState("");
    const { playSound } = useSoundManager();

    useEffect(() => {
      if (content?.img) {
        setImgLoading(true);
        setImgSrc(optimizeCloudinaryUrl(content.img));
      }
    }, [content?.img]);

    const handleOptionSelect = (option: string) => {
      if (hasAnswered && isCorrect) return;
      setTextAnswer(option); // Keep for short_input

      // Only one option at a time for both single_choice and multiple_choice (radio behavior)
      setSelectedOptions([option]);
      onOptionSelect(isMultipleChoice ? [option] : option);
    };

    // Which options are correct (by text match, normalized and trimmed)
    const correctAnswerTexts = useMemo(() => {
      if (!content?.correct_answer || !Array.isArray(content.correct_answer)) return new Set<string>();
      return new Set(
        content.correct_answer
          .map((a: { id?: string; text?: string }) => (a?.text ?? "").trim())
          .filter(Boolean)
      );
    }, [content?.correct_answer]);

    const renderOption = (option: string, idx: number) => {
      const letters = ["A", "B", "C", "D", "E", "F"];
      const optionTrimmed = (option || "").trim();
      const isSelected = selectedOptions.includes(option) || selectedOptions.includes(optionTrimmed) || selectedOption === option || selectedOption === optionTrimmed;
      const isOptionCorrect = hasAnswered && isSelected && isCorrect;
      const isOptionIncorrect = hasAnswered && isSelected && !isCorrect;
      const isCorrectUnselected = hasAnswered && (content?.question_type === "multiple_choice" || content?.question_type === "mcq" || content?.question_type === "single_choice") && correctAnswerTexts.has(optionTrimmed) && !isSelected;
      // Wrong-selected option is always disabled and unselectable; also any option in disabledOptions or after correct answer
      const isDisabled = isOptionIncorrect || disabledOptions.includes(option) || (hasAnswered && isCorrect);

      // STATE 1: idle, 2: selected (pre-submit), 3: correct selected, 4: wrong selected, 5: correct unselected, 6: disabled unselected
      const buttonClass = cn(
        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-150 min-h-[52px]",
        // STATE 1: IDLE
        !isSelected && !hasAnswered && !isCorrectUnselected && !isDisabled && "bg-zinc-900/50 border-zinc-700/80 text-zinc-200 hover:border-zinc-500 hover:bg-white/[0.04] cursor-pointer",
        // STATE 2: SELECTED (pre-submit)
        isSelected && !hasAnswered && "bg-violet-500/10 border-2 border-violet-500 text-white cursor-pointer",
        // STATE 3: CORRECT SELECTED
        isOptionCorrect && "bg-emerald-500/10 border-2 border-emerald-500 text-emerald-100 cursor-default",
        // STATE 4: WRONG SELECTED — distinct border, unselectable
        isOptionIncorrect && "bg-red-500/5 border-2 border-red-500/80 text-zinc-500 opacity-80 cursor-not-allowed pointer-events-none",
        // STATE 5: CORRECT UNSELECTED
        isCorrectUnselected && "bg-emerald-500/[0.08] border-2 border-emerald-500/60 text-emerald-300 cursor-default",
        // STATE 6: DISABLED UNSELECTED
        isDisabled && !isSelected && !isCorrectUnselected && "bg-transparent border border-zinc-800 text-zinc-600 opacity-50 cursor-not-allowed pointer-events-none"
      );

      // Single letter indicator (A, B, C, D) — no checkboxes; clean design
      const letterCircleClass = cn(
        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-semibold transition-all duration-150",
        !isSelected && !hasAnswered && !isCorrectUnselected && !isDisabled && "bg-zinc-800/80 text-zinc-400",
        isSelected && !hasAnswered && "bg-violet-500 text-white font-bold",
        isOptionCorrect && "bg-emerald-500 text-white",
        isOptionIncorrect && "bg-red-500/20 border border-red-500/50 text-red-400",
        isCorrectUnselected && "bg-transparent border-2 border-emerald-500 text-emerald-400",
        isDisabled && !isSelected && !isCorrectUnselected && "bg-zinc-800/50 border border-zinc-700 text-zinc-600"
      );

      return (
        <button
          key={idx}
          onClick={() => !isDisabled && handleOptionSelect(option)}
          disabled={isDisabled}
          className={buttonClass}
          type="button"
          aria-disabled={isDisabled}
        >
          <div className={letterCircleClass}>
            {isOptionCorrect ? (
              <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            ) : isCorrectUnselected ? (
              <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
            ) : isOptionIncorrect ? (
              <X className="w-3 h-3 text-red-400 stroke-[2.5]" />
            ) : (
              letters[idx] ?? String(idx + 1)
            )}
          </div>
          <div className="flex-1 min-w-0 text-sm sm:text-base leading-snug">
            {content.question_type === "code" ? (
              <div className="bg-zinc-950 rounded-xl overflow-hidden">
                <ShikiCode code={option} language="javascript" />
              </div>
            ) : content?.content?.type === "latex" ? (
              <Latex>{option}</Latex>
            ) : (
              <span className="prose dark:prose-invert max-w-none inline-block">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: "span" }}>
                  {option}
                </ReactMarkdown>
              </span>
            )}
          </div>
        </button>
      );
    };

    if (isLoading) {
      return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0 flex flex-col justify-center items-center py-24 gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-zinc-700 border-t-violet-500 animate-spin" />
          <p className="text-zinc-500 text-sm font-medium">Soo dejinaya...</p>
        </div>
      );
    }

    if (error || !content) {
      return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-8 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-white font-medium text-sm">
              {error || "Khalad ayaa dhacay markii la soo dejinayay su'aasha"}
            </p>
            <Button onClick={onContinue} className="h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm px-6">
              Sii soco
            </Button>
          </div>
        </div>
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
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {content.question || "Isku xir kuwa saxda ah"}
              </h2>
              <p className="text-slate-500 font-medium">Jiid oo isku xir qeybaha is leh</p>
            </div>
            <MatchingBlock
              options={content.options}
              onComplete={(success) => {
                if (success) {
                  onOptionSelect("matching_success"); // Mark as selected
                  onCheckAnswer();
                } else {
                  // If it's a "live" matching that checks on every drop, 
                  // we might not want to show full red feedback yet.
                  // For now, let's just play the sound.
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

    if (content.question_type === "code") {
      const problemContent = (content.content || {}) as Record<string, unknown>;
      const starterCode =
        (problemContent.starter_code as string) ||
        "function solution() {\n  // Halkan code-kaaga ku qor\n  \n}";
      const functionName = (problemContent.function_name as string) || "solution";
      const language = (problemContent.language as string) || "javascript";
      const rawTestCases = Array.isArray(problemContent.test_cases) ? problemContent.test_cases : [];
      const testCases = rawTestCases.map((tc: unknown) => {
        const t = tc as Record<string, unknown>;
        return {
          args: Array.isArray(t.args) ? t.args : [],
          expected: t.expected,
          label: t.label as string | undefined,
          hint: t.hint as string | undefined,
        };
      });
      return (
        <CodeChallengeBlock
          questionText={content.question ?? ""}
          explanation={content.explanation ?? ""}
          starterCode={starterCode}
          functionName={functionName}
          language={language}
          testCases={testCases}
          onCorrect={() => {
            onOptionSelect("passed");
            onCheckAnswer();
          }}
          onIncorrect={() => {
            onOptionSelect("__incorrect__");
            onCheckAnswer();
          }}
        />
      );
    }

    return (
      <div className="w-full px-4 sm:px-6 lg:px-0 max-w-2xl mx-auto pb-12">
        <div className="space-y-6 sm:space-y-8">
          {/* Question Card — Brilliant-style: near-black card, clean borders, no shadow */}
          <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-5 sm:p-6 w-full shadow-none">
            <div className="text-white text-base sm:text-lg font-medium leading-relaxed mb-5 sm:mb-6">
              {content.question_type === "code" || content.question?.includes("```") ? (
                <ShikiCode
                  code={content.question?.replace(/```[a-z]*\n?|```/g, "") || ""}
                  language={content.question?.match(/```([a-z]+)/)?.[1] || "javascript"}
                />
              ) : content.content?.type === "latex" ? (
                <Latex>{content.question}</Latex>
              ) : (
                content.question?.includes('<') && !content.question?.includes('**') ? (
                  <div dangerouslySetInnerHTML={{ __html: content.question }} />
                ) : (
                  <div className="prose dark:prose-invert max-w-none inline-block">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{ p: "span" }}
                    >
                      {content.question}
                    </ReactMarkdown>
                  </div>
                )
              )}
            </div>

              {content.img && (
                <div className="flex justify-center group px-4 min-[0px]:px-4">
                  <div className={cn(
                    "relative w-full max-w-[550px] aspect-[16/10] rounded-2xl overflow-hidden border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.01] dark:bg-black/20",
                    isVideoFile(content.img) && "mx-4 sm:mx-0"
                  )}>
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

              {/* Card-style diagram (diagram_cards: card_1, card_2 with label, visual_type, content, note) */}
              {content.content?.diagram_cards && typeof content.content.diagram_cards === "object" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                  {["card_1", "card_2"].map((key) => {
                    const card = (content.content?.diagram_cards as Record<string, { label?: string; visual_type?: string; content?: string[]; note?: string }>)?.[key];
                    if (!card) return null;
                    const isFlowchart = card.visual_type === "flowchart";
                    const steps = Array.isArray(card.content) ? card.content : [];
                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-5 space-y-3"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-foreground">{card.label}</span>
                          <span className={cn(
                            "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded",
                            isFlowchart ? "bg-amber-500/15 text-amber-700 dark:text-amber-400" : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          )}>
                            {isFlowchart ? "Flowchart" : "Learning loop"}
                          </span>
                        </div>
                        <ul className="space-y-1.5 text-sm text-foreground/90">
                          {steps.map((line: string, i: number) => (
                            <li key={i} className="flex gap-2">
                              <span className="text-muted-foreground shrink-0">•</span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ul>
                        {card.note && (
                          <p className="text-xs italic text-muted-foreground pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
                            {card.note}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {content.question_type === "diagram" && (content.diagram_config || content.diagrams) && !content.content?.diagram_cards && (
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

              {/* Options Grid / Input */}
              {(content.question_type === "short_input" || content.question_type === "code") ? (
                <div className="w-full max-w-2xl mx-auto py-4">
                  {content.question_type === "code" && (
                    <div className="mb-4 text-xs font-bold text-primary/70 uppercase tracking-widest px-2">
                      Qor code-ka halkan:
                    </div>
                  )}
                  <Input
                    type="text"
                    placeholder={content.question_type === "code" ? "Qor code-ka..." : "Qor jawaabta halkan..."}
                    value={textAnswer}
                    onChange={(e) => handleOptionSelect(e.target.value)}
                    disabled={hasAnswered && isCorrect}
                    className={cn(
                      "h-16 rounded-2xl text-lg px-6 border-2 transition-all",
                      content.question_type === "code" && "font-mono bg-zinc-950 border-zinc-800 text-emerald-400 placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-emerald-500/20",
                      hasAnswered && isCorrect && "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-700",
                      hasAnswered && !isCorrect && "border-rose-500 bg-rose-50/50 dark:bg-rose-500/10 text-rose-700",
                      !hasAnswered && content.question_type !== "code" && "border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && textAnswer.trim()) {
                        onCheckAnswer();
                      }
                    }}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "w-full",
                    content.question_type === "diagram" ? "grid grid-cols-1 sm:grid-cols-2 gap-2.5" : "flex flex-col gap-2.5"
                  )}
                >
                  {content.options.map(renderOption)}
                </div>
              )}

            {/* Check Answer — Brilliant-style */}
            {!hasAnswered && (
              <div className="border-t border-zinc-800 pt-5 mt-5">
                <Button
                  onClick={onCheckAnswer}
                  disabled={isMultipleChoice ? selectedOptions.length === 0 : !selectedOption}
                  className={cn(
                    "w-full h-12 rounded-xl font-medium text-sm transition-colors duration-150",
                    isMultipleChoice ? selectedOptions.length > 0 : selectedOption
                      ? "bg-violet-600 hover:bg-violet-500 text-white font-semibold"
                      : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                  )}
                >
                  {(isMultipleChoice ? selectedOptions.length > 0 : selectedOption) ? "Hubi Jawaabta" : "Xulo jawaab..."}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default memo(ProblemBlock);
