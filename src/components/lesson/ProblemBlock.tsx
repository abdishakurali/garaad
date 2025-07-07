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
  disabledOptions: string[];
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
  disabledOptions = [],
}) => {
    const hasAnswered = answerState.isCorrect !== null;
    const [imgLoading, setImgLoading] = useState(false);
    const [imgSrc, setImgSrc] = useState(content?.img);
    const { playSound } = useSoundManager();

    useEffect(() => {
      if (content?.img) {
        setImgLoading(true);
        setImgSrc(content.img);
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
        "w-full p-3 text-sm rounded-xl border-2 relative text-left",
        !isSelected &&
        !hasAnswered &&
        "border-gray-200 hover:border-primary/50 hover:bg-primary/5",
        isSelected && !hasAnswered && "border-primary bg-primary/10 shadow-md",
        isOptionCorrect && "border-green-500 bg-green-50 shadow-md",
        isOptionIncorrect && "border-gray-300 bg-gray-50 text-gray-400",
        isDisabled &&
        "border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed"
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
                isOptionIncorrect ? "text-gray-400" : "text-gray-800"
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

    return (
      <div className="max-w-2xl mx-auto">
        <div className="space-y-8">
          <Card className="border-none shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-2">
              {content.content.type === "latex" ? (
                <>
                  <CardTitle className="text-md font-normal text-gray-600">
                    <Latex>{content.which}</Latex>
                  </CardTitle>
                  <CardTitle className="text-md font-medium">
                    <Latex>{content.question}</Latex>
                  </CardTitle>
                </>
              ) : (
                <>
                  <CardTitle className="text-md font-normal text-gray-600">
                    {content.which}
                  </CardTitle>
                  <CardTitle className="text-md font-medium">
                    {content.question}
                  </CardTitle>
                </>
              )}
            </CardHeader>

            {content.img && (
              <CardContent className="flex justify-center py-2">
                <div className="relative w-full max-w-[500px] h-[250px]">
                  {imgLoading && (
                    <div className="absolute inset-0 w-full h-full bg-gray-200 animate-pulse rounded-xl z-10" />
                  )}
                  {isVideoFile(content.img) ? (
                    <video
                      key={imgSrc}
                      src={imgSrc || ""}
                      controls
                      className="rounded-xl shadow-lg object-contain bg-black w-full h-full"
                      onLoadStart={() => setImgLoading(true)}
                      onCanPlay={() => setImgLoading(false)}
                      onError={() => setImgLoading(false)}
                      style={{ opacity: imgLoading ? 0 : 1, transition: "opacity 0.2s" }}
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
                      className="rounded-xl shadow-lg object-contain bg-white"
                      sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 500px"
                      quality={75}
                      priority={false}
                      onLoad={() => setImgLoading(false)}
                      onError={() => setImgLoading(false)}
                      style={{ opacity: imgLoading ? 0 : 1, transition: "opacity 0.2s" }}
                    />
                  )}
                </div>
              </CardContent>
            )}

            {content.question_type === "diagram" && (content.diagram_config || content.diagrams) && (
              <CardContent className="p-6 max-w-full overflow-hidden">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center w-full max-w-full overflow-hidden">
                  {(() => {
                    // Determine if there are multiple diagrams
                    const diagramCount = content.diagrams?.length ||
                      (Array.isArray(content.diagram_config) ? content.diagram_config.length : 1);
                    const isMultiple = diagramCount > 1;

                    if (content.diagrams) {
                      // Handle new diagrams array format
                      return content.diagrams.map((cfg, i) => (
                        <div key={cfg.diagram_id || i} className="flex-shrink min-w-0 w-full max-w-full">
                          <DiagramScale config={cfg} isMultiple={isMultiple} />
                        </div>
                      ));
                    } else if (Array.isArray(content.diagram_config)) {
                      // Handle existing diagram_config array format
                      return content.diagram_config.map((cfg, i) => (
                        <div key={cfg.diagram_id || i} className="flex-shrink min-w-0 w-full max-w-full">
                          <DiagramScale config={cfg} isMultiple={isMultiple} />
                        </div>
                      ));
                    } else if (content.diagram_config) {
                      // Handle existing single diagram_config format
                      return (
                        <div className="flex-shrink min-w-0 w-full max-w-full">
                          <DiagramScale config={content.diagram_config} isMultiple={isMultiple} />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </CardContent>
            )}

            <CardContent className="p-4">
              <div
                className={cn(
                  content.question_type === "diagram"
                    ? "grid grid-cols-2 gap-4 w-full max-w-xl mx-auto"
                    : "flex flex-col gap-4 w-full max-w-xl mx-auto"
                )}
              >
                {content.options.map(renderOption)}
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-4 px-6">
              <div className="w-full space-y-2">
                {answerState.isCorrect === null && !hasAnswered && (
                  <Button onClick={onCheckAnswer} className="w-full">
                    Hubi Jawaabta
                  </Button>
                )}
                {hasAnswered && (
                  <Button onClick={onContinue} className="w-full">
                    SiiWado Qaybta Kale
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  };

export default memo(ProblemBlock);
