import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

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
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeDotRef.current && containerRef.current) {
      activeDotRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [currentQuestion]);

  const progress = totalQuestions > 0 ? (currentQuestion / totalQuestions) * 100 : 0;

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-14 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/60">
      {/* Progress bar — full width */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-2 mt-1 sm:px-4">
        {/* Back — min 44x44 touch target */}
        <div className="shrink-0 flex items-center">
          <Button
            onClick={() => router.push(coursePath)}
            variant="ghost"
            className="min-h-[44px] min-w-[44px] p-0 -m-1 rounded-lg bg-transparent hover:bg-white/[0.06] text-zinc-400 hover:text-white border-0 transition-all duration-150"
            aria-label="Dib u noqo"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Center — progress dots + title on sm+ */}
        <div className="flex-1 min-w-0 mx-2 overflow-x-auto scrollbar-hide">
          <div
            ref={containerRef}
            className="flex flex-nowrap items-center gap-1.5 justify-center"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {Array.from({ length: Math.max(1, totalQuestions) }).map((_, idx) => {
              const isActive = idx === currentQuestion - 1;
              const isCompleted = completedLessons.includes(idx);
              return (
                <button
                  key={idx}
                  type="button"
                  ref={isActive ? activeDotRef : null}
                  onClick={() => onDotClick?.(idx)}
                  className={cn(
                    "shrink-0 rounded-full transition-all duration-150 snap-center cursor-pointer",
                    isActive ? "w-6 h-1.5 bg-violet-500" : "w-1.5 h-1.5",
                    !isActive && (isCompleted ? "bg-emerald-500/50" : idx < currentQuestion - 1 ? "bg-violet-500/50" : "bg-zinc-700"),
                    !isActive && "hover:bg-zinc-600"
                  )}
                  aria-label={isActive ? `Su'aal ${currentQuestion}` : `Su'aal ${idx + 1}`}
                />
              );
            })}
          </div>
          {lessonTitle && (
            <p className="hidden sm:block text-center text-xs text-zinc-500 mt-1 truncate max-w-[200px] mx-auto" title={lessonTitle}>
              {lessonTitle}
            </p>
          )}
        </div>

      </div>
    </header>
  );
};

export default LessonHeader;
