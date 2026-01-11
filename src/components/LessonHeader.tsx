import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import LessonStreak from "./LessonStreak";
import AuthService from "@/services/auth";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LessonHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  coursePath: string;
  onDotClick?: (lessonIndex: number) => void;
  completedLessons?: number[];
}

interface DailyActivity {
  date: string;
  day: string;
  status: "complete" | "none";
  problems_solved: number;
  lesson_ids: number[];
  isToday: boolean;
}

interface StreakData {
  userId: string;
  username: string;
  current_streak: number;
  max_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  energy: {
    current: number;
    max: number;
    next_update: string;
  };
  dailyActivity: DailyActivity[];
  xp: number;
  daily_xp: number;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  currentQuestion,
  totalQuestions,
  coursePath,
  onDotClick,
  completedLessons = [],
}) => {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeDotRef = useRef<HTMLDivElement>(null);
  // const { streak, isLoading, isError } = useUserStreak();

  /* 
  const fetchStreakData = async () => {
    // ...
  };

  useEffect(() => {
    fetchStreakData();
  }, []);
  */

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
    <div className="fixed z-50 bg-white dark:bg-black/80 backdrop-blur-md top-0 inset-x-0 border-b border-black/5 dark:border-white/5">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
        <div
          className="h-full bg-primary/80 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(16,185,129,0.3)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header Content */}
      <div className="flex items-center justify-between px-6 py-3 mt-1">
        {/* Back Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={() => router.push(coursePath)}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all border-none bg-transparent text-slate-600 dark:text-slate-400 hover:text-black dark:hover:text-white"
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

        {/* Scrollable Dots */}
        <div className="flex-1 mx-4 overflow-x-auto scrollbar-hide">
          <div
            ref={containerRef}
            className="flex flex-nowrap items-center gap-1.5 snap-x snap-mandatory scroll-px-4 justify-center"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const isActive = idx === currentQuestion - 1; // Adjust for 0-based index
              const isCompleted = completedLessons.includes(idx);
              return (
                <div
                  key={idx}
                  ref={isActive ? activeDotRef : null}
                  onClick={() => onDotClick?.(idx)}
                  className={cn(
                    "flex-shrink-0 rounded-full transition-all duration-300 snap-center cursor-pointer",
                    isActive ? "w-6 h-1.5 bg-primary" : "w-1.5 h-1.5",
                    !isActive && (isCompleted ? "bg-green-500/50" : idx < currentQuestion - 1 ? "bg-primary/50" : "bg-white/10"),
                    "hover:bg-primary/80"
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* Streak Widget */}
        {streakData && (
          <div className="flex-shrink-0">
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