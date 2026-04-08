"use client";

import { useState, useMemo, useCallback } from "react";
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
  daily_xp: number;
}

interface StreakDisplayProps {
  loading: boolean;
  streakData: StreakData | null;
  error: string | null;
}

// Memoized loading skeleton component
const LoadingSkeleton = () => (
  <div className="flex justify-center py-6">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-10 w-10 bg-gray-200 rounded-full mb-3"></div>
      <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Memoized error component
const ErrorDisplay = ({ error }: { error: string }) => (
  <div className="text-center py-6">
    <p className="text-red-500 text-sm mb-3">{error}</p>
  </div>
);

// Memoized empty state component
const EmptyState = () => (
  <div className="text-center py-6 text-gray-500 text-sm">
    Click to load streak data
  </div>
);

export default function LessonStreak({
  loading,
  streakData,
  error,
}: StreakDisplayProps) {
  const [open, setOpen] = useState(false);

  // Memoized motivational messages to prevent recreation on every render
  const motivationalMessages = useMemo(
    () => ({
      complete: "Aad baad u wanaagsan tahay! Waa inaad sii waddaa dadaalkaaga.",
      partial:
        "Waa horumar! Hal talaabo kaliya ayaa kuu harsan si aad u gaarto yool maalmeedkaaga.",
      none: "Maalin cusub ayaa kuu bilaabatay — bilow waxbarashadaada maanta!",
    }),
    []
  );

  // Memoized function to get motivational message
  const getMotivationalMessage = useCallback(
    (status: "none" | "partial" | "complete") => {
      return motivationalMessages[status] || "";
    },
    [motivationalMessages]
  );

  // Memoized battery icon component to prevent recreation
  const getBatteryIcon = useCallback((current: number, max: number) => {
    const percent = (current / max) * 100;
    const iconProps = { className: "w-5 h-5" };

    if (percent > 75)
      return <BatteryFull {...iconProps} className="text-green-500 w-5 h-5" />;
    if (percent > 40)
      return (
        <BatteryMedium {...iconProps} className="text-yellow-500 w-5 h-5" />
      );
    if (percent > 10)
      return <BatteryLow {...iconProps} className="text-orange-500 w-5 h-5" />;
    return <LucideBattery {...iconProps} className="text-red-500 w-5 h-5" />;
  }, []);

  // Memoized popover change handler
  const handleOpenChange = useCallback((newOpen: boolean) => {
    setOpen(newOpen);
  }, []);

  // Memoized today's status calculation
  const todayStatus = useMemo(() => {
    return streakData?.dailyActivity?.[0]?.status;
  }, [streakData?.dailyActivity]);

  // Memoized streak display value
  const streakValue = useMemo(() => {
    return streakData?.current_streak ?? 0;
  }, [streakData?.current_streak]);

  // Memoized energy data
  const energyData = useMemo(() => {
    if (!streakData?.energy) return null;
    return {
      current: streakData.energy.current,
      max: streakData.energy.max,
      icon: getBatteryIcon(streakData.energy.current, streakData.energy.max),
    };
  }, [streakData?.energy, getBatteryIcon]);

  // Memoized motivational message for today
  const todayMessage = useMemo(() => {
    return getMotivationalMessage(todayStatus ?? "none");
  }, [todayStatus, getMotivationalMessage]);

  // Memoized Zap icon styling
  const zapIconClass = useMemo(() => {
    return `w-6 h-6 ${
      todayStatus === "complete"
        ? "text-yellow-500 fill-yellow-500"
        : "text-gray-400"
    }`;
  }, [todayStatus]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="flex items-center p-2 cursor-pointer bg-background/20 gap-1 hover:bg-background/30 transition-colors rounded-md">
          {streakValue}
          <Zap className={zapIconClass} />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 mr-10" align="center">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <ErrorDisplay error={error} />
        ) : streakData ? (
          <div className="space-y-4">
            {/* Motivational Message */}
            <div className="p-3 rounded-md bg-gray-50 border border-gray-200 text-center text-sm">
              {todayMessage}
            </div>

            {/* Battery (Energy) Indicator */}
            {energyData && (
              <div className="flex justify-center items-center gap-2">
                <span className="text-xs text-gray-600">Tamarta:</span>
                {energyData.icon}
                <span className="text-xs text-gray-600">
                  {energyData.current}/{energyData.max}
                </span>
              </div>
            )}
          </div>
        ) : (
          <EmptyState />
        )}
      </PopoverContent>
    </Popover>
  );
}
