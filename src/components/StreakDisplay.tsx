"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ConciergeBell, Zap } from "lucide-react";
import AuthService from "@/services/auth";

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

interface StreakDisplayProps {
  loading: boolean;
  streakData: StreakData | null;
  error: string | Error | null;
}

export default function StreakDisplay({
  loading,
  streakData,
  error,
}: StreakDisplayProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) router.push("/");
  }, [router]);

  const handleOpenChange = (newOpen: boolean) => setOpen(newOpen);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          className={`font-medium ml-4 rounded-full px-3 py-2 flex items-center gap-1.5 shadow-sm border-gray-300 hover:shadow-md `}
          variant="outline"
        >
          <span className="font-semibold">
            {streakData?.current_streak ?? 0}
          </span>
          <Zap
            className={`w-5 h-5 transition-colors duration-200 ${streakData?.dailyActivity?.[0]?.status === "complete"
              ? "text-yellow-500 fill-amber-300"
              : streakData?.current_streak && streakData.current_streak > 0
                ? "text-yellow-500"
                : "text-gray-400"
              }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-96 p-5 rounded-2xl shadow-xl border border-gray-200 bg-white -mr-16 sm:mr-0"
        side="bottom"
        align="end"
        sideOffset={8}
      >
        {loading ? (
          <div className="flex flex-col items-center space-y-2 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-200 rounded" />
          </div>
        ) : error ? (
          <div className="text-center text-sm text-red-500">
            {error instanceof Error ? error.message : String(error)}
          </div>
        ) : streakData ? (
          <div className="space-y-6">
            {/* Header with current streak and energy */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">
                  {streakData.current_streak}
                </span>

                <Zap
                  className={`w-6 h-6 text-yellow-500 ${streakData?.dailyActivity?.[0]?.status === "complete"
                    ? "fill-amber-300"
                    : ""
                    }`}
                />
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-md p-1.5 relative">
                {Array.from({ length: streakData?.energy?.max ?? 0 }).map((_, i) => (
                  <Zap
                    key={i}
                    className={`w-4 h-4 ${i < (streakData?.energy?.current ?? 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                      }`}
                  />
                ))}
                <div className="absolute -right-2 top-[5px] rounded-sm text-amber-200  w-3 h-4 bg-gray-100 flex items-center justify-center text-xs font-bold"></div>
              </div>
            </div>

            {/* Streak Progress Text */}
            <p className="text-sm text-gray-600 text-center">
              {streakData?.dailyActivity?.[0]?.status === "complete"
                ? "Shaqo wacan! Waad ilaashatay istriiga maanta "
                : `Xalli ugu yaraan ${streakData.problems_to_next_streak} waydiimood si aad u hesho streak cusub.`}
            </p>

            {/* Daily Activity Chart */}
            <div className="flex justify-between px-4">
              {streakData.dailyActivity
                .slice(0, 5)
                .reverse()
                .map((activity, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${activity.status === "complete"
                        ? "bg-yellow-400"
                        : "bg-gray-100"
                        }`}
                    >
                      <Zap
                        className={`w-4 h-4 ${activity.status === "complete"
                          ? "text-black"
                          : "text-gray-400"
                          }`}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {activity.day}
                    </span>
                  </div>
                ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 divide-x divide-gray-200 border rounded-xl overflow-hidden bg-gray-50">
              <div className="p-4 text-center">
                <div className="text-xl font-semibold">
                  {streakData.max_streak}
                </div>
                <div className="text-xs text-gray-500">Streak-ga ugu dheer</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-xl font-semibold">
                  {streakData.lessons_completed}
                </div>
                <div className="text-xs text-gray-500">
                  Casharro la dhameeyay
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">
            Riix si aad u aragto streak-kaaga.
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
