import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DailyActivity {
  date: string;
  day: string;
  status: "complete" | "none";
  problems_solved: number;
  lesson_ids: number[];
  isToday: boolean;
}

interface UserData {
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

interface StreakCelebrationProps {
  userData: UserData;
  onContinue: () => void;
}

export default function StreakCelebration({
  userData,
  onContinue,
}: StreakCelebrationProps) {
  // Get the last 5 days for the weekly view
  const lastFiveDays = userData.dailyActivity.slice(0, 5);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 mx-w-md">
      {/* Mascot Character */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-3xl bg-yellow-200 opacity-30 scale-110"></div>
          <div className="absolute inset-0 rounded-3xl bg-yellow-100 opacity-20 scale-125"></div>

          {/* Character face */}
          <div className="relative z-10">
            <div className="w-2 h-1 bg-green-800 rounded-full mb-2 mx-auto"></div>
            <div className="w-8 h-2 bg-green-800 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Streak Number */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-6xl font-bold text-gray-800">
          {userData.current_streak}
        </span>
        <Zap className="w-8 h-8 text-yellow-500 fill-yellow-500" />
      </div>

      {/* Streak Text */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-12">
        Xariga waa la siyaadiyay
      </h1>

      {/* Weekly Progress */}
      <div className="flex gap-3 mb-16">
        {lastFiveDays.map((day, index) => (
          <div key={day.date} className="flex flex-col items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                day.status === "complete" ? "bg-yellow-400" : "bg-gray-200"
              }`}
            >
              {day.status === "complete" ? (
                <Zap className="w-4 h-4 text-yellow-800 fill-yellow-800" />
              ) : (
                <span className="text-lg font-bold text-gray-600">
                  {day.problems_solved}
                </span>
              )}
            </div>
            <span
              className={`text-sm font-medium ${
                day.isToday ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {day.day.charAt(0)}
            </span>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <Button className="w-full rounded-lg" onClick={() => onContinue()}>
        Sii wado
      </Button>
    </div>
  );
}
