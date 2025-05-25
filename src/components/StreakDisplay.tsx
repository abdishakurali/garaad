"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Zap } from "lucide-react";
import AuthService from "@/services/auth";

interface Energy {
  current: number;
  max: number;
  next_update: string;
}

interface DailyActivity {
  date: string;
  day: string;
  status: "none" | "partial" | "complete";
  problems_solved: number;
  lesson_ids: string[];
  isToday: boolean;
}

interface StreakData {
  userId: string;
  username: string;
  current_streak: number;
  max_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  energy: Energy;
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

  console.log("STREAKDISPLAY", streakData)

  useEffect(() => {
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) router.push("/");
  }, [router]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button className="font-medium rounded-xl" variant={"outline"}>
          {streakData?.current_streak ?? 0}
          <Zap />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-4 mr-[30px] md:mr-[60px] lg:mr-[80px]"
        align="center"
      >
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-10 w-10 bg-gray-200 rounded-full mb-3"></div>
              <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <p className="text-red-500 text-sm mb-3">
              {error instanceof Error ? error.message : String(error)}
            </p>
          </div>
        ) : streakData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">
                  {streakData.current_streak}
                </span>
                <Zap className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: streakData.energy.current }).map(
                  (_, i) => (
                    <Zap
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  )
                )}
                {Array.from({
                  length: streakData.energy.max - streakData.energy.current,
                }).map((_, i) => (
                  <Zap
                    key={i + streakData.energy.current}
                    className="w-5 h-5 text-gray-200"
                  />
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600">
              Xalli ugu yaraan {streakData.problems_to_next_streak} waydiimood
              saad u sameysatid streak.
            </p>

            <div className="flex justify-between">
              {streakData.dailyActivity.slice(-7).map((activity, index) => {
                const isComplete = activity.status === "complete";
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isComplete ? "bg-yellow-400" : "bg-gray-200"
                      }`}
                    >
                      <Zap
                        className={`w-4 h-4 ${
                          isComplete ? "text-black" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <span className="text-xs mt-1">{activity.day}</span>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-2 bg-gray-50 rounded-md overflow-hidden">
              <div className="p-3 text-center border-r border-gray-200">
                <div className="text-lg font-bold">{streakData.max_streak}</div>
                <div className="text-xs text-gray-500">
                  istriigii ugu badnaa
                </div>
              </div>
              <div className="p-3 text-center">
                <div className="text-lg font-bold">
                  {streakData.lessons_completed}
                </div>
                <div className="text-xs text-gray-500">cashar la dhameyay</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">
            Click to load streak data
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
