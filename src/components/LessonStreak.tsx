"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Zap,
  BatteryFull,
  BatteryMedium,
  BatteryLow,
  LucideBattery,
} from "lucide-react";
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
  daily_activity: DailyActivity[];
}

interface StreakDisplayProps {
  loading: boolean;
  streakData: StreakData | null;
  error: string | null;
}

export default function LessonStreak({
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

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const getMotivationalMessage = (status: "none" | "partial" | "complete") => {
    switch (status) {
      case "complete":
        return "Aad baad u wanaagsan tahay! Waa inaad sii waddaa dadaalkaaga.";
      case "partial":
        return "Waa horumar! Hal talaabo kaliya ayaa kuu harsan si aad u dhameystirto maalinta.";
      case "none":
        return "Maalin cusub ayaa kuu bilaabatay — ku bilow waxbarashadaada maanta!";
      default:
        return "";
    }
  };

  const getBatteryIcon = (current: number, max: number) => {
    const percent = (current / max) * 100;
    if (percent > 75) return <BatteryFull className="text-green-500 w-5 h-5" />;
    if (percent > 40)
      return <BatteryMedium className="text-yellow-500 w-5 h-5" />;
    if (percent > 10) return <BatteryLow className="text-orange-500 w-5 h-5" />;
    return <LucideBattery className="text-red-500 w-5 h-5" />;
  };

  const todayStatus =
    streakData?.daily_activity?.find((d) => d.isToday)?.status ?? "none";

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        {/* <Button className="font-medium rounded-xl" variant={"outline"}> */}
        <div className="flex items-center p-2 cursor-pointer bg-background/20 gap-1">
          {streakData?.current_streak}

          <Zap
            className={`w-6 h-6 ${
              todayStatus === "complete" ? "text-green-500" : "text-gray-400"
            }`}
          />
        </div>
        {/* </Button> */}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 mr-10" align="center">
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
            <p className="text-red-500 text-sm mb-3">{error}</p>
          </div>
        ) : streakData ? (
          <div className="space-y-4">
            {/* Motivational Message */}
            <div className="p-3 rounded-md bg-gray-50 border border-gray-200 text-center text-sm">
              {getMotivationalMessage(todayStatus)}
            </div>

            {/* Battery (Energy) Indicator */}
            <div className="flex justify-center items-center gap-2">
              <span className="text-xs text-gray-600">Tamarta:</span>
              {getBatteryIcon(streakData.energy.current, streakData.energy.max)}
              <span className="text-xs text-gray-600">
                {streakData.energy.current}/{streakData.energy.max}
              </span>
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
