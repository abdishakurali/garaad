import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import LessonStreak from "./LessonStreak";
import AuthService from "@/services/auth";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { useGamificationData } from "@/hooks/useGamificationData";

interface LessonHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  coursePath: string;
  onDotClick?: (lessonIndex: number) => void;
  completedLessons?: number[];
  lessonTitle?: string | null;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  currentQuestion,
  totalQuestions,
  coursePath,
  onDotClick,
  completedLessons = [],
  lessonTitle,
}) => {
  const { streak: streakData, isLoading: loading, hasError: error } = useGamificationData();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeDotRef = useRef<HTMLDivElement>(null);

  // Whenever currentQuestion changes, scroll the active dot into view
  useEffect(() => {
    if (activeDotRef.current && containerRef.current) {
      activeDotRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [currentQuestion]);

  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="fixed z-50 bg-white dark:bg-black/80 backdrop-blur-md top-0 inset-x-0 border-b border-black/5 dark:border-white/[0.09]">
      {/* Progress Bar — full width, flush, no horizontal padding */}
      <div className="absolute top-0 left-0 right-0 h-[3px] sm:h-1 bg-white/5">
        <div
          className="h-full bg-primary/80 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header Content: mobile = back + dots + XP (no title); tablet+ = back + title + XP */}
      <div className="flex items-center justify-between gap-2 px-3 py-3 mt-[3px] sm:px-4 sm:mt-1">
        {/* Back Button — min 44x44px touch target */}
        <div className="shrink-0">
          <Button
            onClick={() => router.push(coursePath)}
            className="min-h-[44px] min-w-[44px] p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all border-none bg-transparent text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white flex items-center justify-center"
            aria-label="Go back"
            variant="ghost"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>

        {/* Mobile: dots only. Tablet+: optional lesson title centered */}
        <div className="flex-1 min-w-0 mx-2 overflow-x-auto scrollbar-hide">
          <div
            ref={containerRef}
            className="flex flex-nowrap items-center gap-1.5 snap-x snap-mandatory scroll-px-4 justify-center sm:justify-center"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const isActive = idx === currentQuestion - 1;
              const isCompleted = completedLessons.includes(idx);
              return (
                <div
                  key={idx}
                  ref={isActive ? activeDotRef : null}
                  onClick={() => onDotClick?.(idx)}
                  className={cn(
                    "shrink-0 rounded-full transition-all duration-300 snap-center cursor-pointer",
                    isActive ? "w-6 h-1.5 bg-primary" : "w-1.5 h-1.5",
                    !isActive && (isCompleted ? "bg-green-500/50" : idx < currentQuestion - 1 ? "bg-primary/50" : "bg-white/10"),
                    "hover:bg-primary/80"
                  )}
                />
              );
            })}
          </div>
          {lessonTitle && (
            <p className="hidden sm:block text-center text-sm font-semibold text-foreground truncate max-w-[200px] mx-auto mt-0.5 leading-snug" title={lessonTitle}>
              {lessonTitle}
            </p>
          )}
        </div>

        {/* XP / Streak Widget */}
        {streakData && (
          <div className="shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <LessonStreak
              streakData={streakData}
              loading={loading}
              error={error}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonHeader;