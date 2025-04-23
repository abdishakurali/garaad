import React from "react";
import { useRouter } from "next/navigation";

interface LessonHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
}

const LessonHeader: React.FC<LessonHeaderProps> = ({
  currentQuestion,
  totalQuestions,
}) => {
  const router = useRouter();
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <div className="fixed top-0 inset-x-0 z-100">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#E5E5E5]">
        <div
          className="h-full bg-primary/80 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header content */}
      <div className="flex items-center justify-between px-4 py-2 mt-2">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              d="M18 6L6 18M6 6l12 12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Progress dots */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {Array.from({ length: totalQuestions }).map((_, index) => (
            <div
              key={index}
              className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${index < currentQuestion ? "bg-primary" : "bg-[#E5E5E5]"}
                ${index === currentQuestion ? "scale-150" : "scale-100"}
            `}
            />
          ))}
        </div>

        {/* Empty div for spacing */}
        <div className="w-10" />
      </div>
    </div>
  );
};

export default LessonHeader;
