"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface LessonCompleteModalProps {
  lessonTitle: string;
  /** Score from the lesson (frontend value: e.g. isCorrect ? 100 : 0) */
  score: number;
  /** XP earned this lesson — hardcoded for now, ready for real value */
  xpEarned?: number;
  /** Current streak from useGamificationData (stub: 0) */
  currentStreak?: number;
  /** Course progress 0–100 from CourseEnrollment */
  courseProgressPercent: number;
  /** Completed lessons count (e.g. 3) */
  completedLessonsCount: number;
  /** Total lessons in course (e.g. 10) */
  totalLessonsCount: number;
  /** Whether there is a next lesson */
  hasNextLesson: boolean;
  onNextLesson: () => void;
  onReview: () => void;
  onDashboard: () => void;
}

export function LessonCompleteModal({
  lessonTitle,
  score,
  xpEarned = 20,
  currentStreak = 0,
  courseProgressPercent,
  completedLessonsCount,
  totalLessonsCount,
  hasNextLesson,
  onNextLesson,
  onReview,
  onDashboard,
}: LessonCompleteModalProps) {
  const router = useRouter();

  const handleDashboard = useCallback(() => {
    onDashboard();
    router.push("/dashboard");
  }, [onDashboard, router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      style={{ animation: "none" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-complete-heading"
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl",
          "transition-all duration-300 ease-out",
          "scale-100 opacity-100"
        )}
        style={{
          animation: "lessonCompleteEntry 300ms ease-out forwards",
        }}
      >
        <style>{`
          @keyframes lessonCompleteEntry {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes lessonCompleteEntry {
              from, to { opacity: 1; transform: scale(1); }
            }
          }
        `}</style>

        <div className="p-8 space-y-6">
          {/* 1. CELEBRATION HEADER */}
          <div className="text-center space-y-2">
            <div
              className="mx-auto w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center motion-safe:animate-bounce"
              style={{ backgroundColor: "#7c3aed" }}
            >
              <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <h2
              id="lesson-complete-heading"
              className="text-2xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-display), Inter, sans-serif" }}
            >
              Casharku wuu dhameystirmay!
            </h2>
            <p className="text-sm text-gray-400">{lessonTitle}</p>
          </div>

          {/* 2. STATS ROW — 3 cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide">XP</p>
              <p className="text-lg font-bold text-purple-400">+{xpEarned} XP</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Streak</p>
              <p className="text-lg font-bold text-white">
                🔥 {currentStreak} maalmood
              </p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-wide">Score</p>
              <p className="text-lg font-bold text-white">{score}</p>
            </div>
          </div>

          {/* 3. PROGRESS BAR */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">
              Koorsada horumarinta
            </p>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-600 transition-[width] duration-600 ease-out"
                style={{
                  width: `${courseProgressPercent}%`,
                  backgroundColor: "#7c3aed",
                  boxShadow: "0 0 8px #7c3aed",
                }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {completedLessonsCount} / {totalLessonsCount} casharro
            </p>
          </div>

          {/* 4. NEXT LESSON CTA */}
          <Button
            onClick={onNextLesson}
            className="w-full h-12 text-base font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white border-0"
            style={{ backgroundColor: "#7c3aed" }}
          >
            {hasNextLesson ? "Casharka xiga →" : "Koorsada dhamee ✓"}
          </Button>

          {/* 5. SECONDARY ACTIONS */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onReview}
              className="flex-1 rounded-xl border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Dib u eeg
            </Button>
            <Button
              variant="outline"
              onClick={handleDashboard}
              className="flex-1 rounded-xl border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Guriga
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
