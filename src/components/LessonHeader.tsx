import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

interface LessonHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  currentQuestion,
  totalQuestions,
}) => {
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
    <div className="fixed top-0 inset-x-0 z-50 bg-white">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
        <div
          className="h-full bg-primary/80 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header content */}
      <div className="flex items-center justify-between px-4 py-2 mt-2">
        {/* Back button */}
        <Button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
          variant={"outline"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 18l-6-6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Button>

        {/* Scrollable progress dots */}
        <div
          ref={containerRef}
          className="
            flex flex-nowrap items-center gap-2 
            overflow-x-auto px-2 
            scrollbar-hide 
            snap-x snap-mandatory
            -mx-2
          "
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const isActive = idx === currentQuestion;
            return (
              <div
                key={idx}
                ref={isActive ? activeDotRef : null}
                className={`
                  flex-shrink-0 w-3 h-3 rounded-full transition-all duration-300 snap-center
                  ${idx < currentQuestion ? "bg-primary" : "bg-gray-200"}
                  ${isActive ? "scale-200" : "scale-100"}
                `}
              />
            );
          })}
        </div>

        {/* Right spacer */}
        <div className="w-10" />
      </div>
    </div>
  );
};

export default LessonHeader;
