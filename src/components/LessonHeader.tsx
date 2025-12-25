import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import LessonStreak from "./LessonStreak";
import AuthService from "@/services/auth";
import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

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

  const fetchStreakData = async () => {
    setLoading(true);
    setError(null);

    try {
      const authService = AuthService.getInstance();
      const token = authService.getToken();

      const response = await axios.get(
        `${API_BASE_URL}/api/streaks//`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStreakData(response.data);
      setLoading(false);
      console.log(response.data);
      console.log(response.data.username);
    } catch (err: unknown) {
      console.error("Error fetching streak data:", err);

      // Handle 401 Unauthorized error
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'status' in err.response && err.response.status === 401) {
        console.log("401 Unauthorized - clearing session and redirecting to home");

        const authService = AuthService.getInstance();

        // Clear all cookies and localStorage
        authService.logout();

        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }

        // Redirect to home page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }

        return;
      }

      setError("Lagu guuldaraaystay in la soo raro xogta streak-ga. Fadlan mar kale isku day.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, []);

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
    <div className="fixed z-50 bg-white top-0 inset-x-0">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gray-200">
        <div
          className="h-full bg-primary/80 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Header Content */}
      <div className="flex items-center justify-between px-4 py-2 mt-2">
        {/* Back Button */}
        <div className="flex-shrink-0">
          <Button
            onClick={() => router.push(coursePath)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
            variant="outline"
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
        </div>

        {/* Scrollable Dots */}
        <div className="flex-1 mx-4 overflow-x-auto scrollbar-hide">
          <div
            ref={containerRef}
            className="flex flex-nowrap items-center gap-2 snap-x snap-mandatory scroll-px-4 justify-center"
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
                  className={`
                  flex-shrink-0 w-3 h-3 rounded-full transition-all duration-300 snap-center cursor-pointer
                  ${isCompleted ? "bg-green-500" : idx < currentQuestion - 1 ? "bg-primary" : "bg-gray-200"}
                  ${isActive ? "scale-150 ring-2 ring-primary" : "scale-100"}
                  hover:scale-110 hover:ring-1 hover:ring-primary/50
                `}
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