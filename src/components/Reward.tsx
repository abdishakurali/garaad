// components/RewardSequence.tsx
"use client";

import { useState } from "react";
import StreakCelebration from "./StreakCelebaration";
import LeaderboardLeague from "./LeaderboardLeague";
import Certificate from "./ShareLesson";

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
interface User {
  id: number;
  name: string;
}

interface Standing {
  rank: number;
  user: User;
  points: number;
  streak: number;
}

interface LeaderboardData {
  time_period: string;
  league: string;
  standings: Standing[];
  my_standing: {
    rank: number;
    points: number;
    streak: number;
  };
}

type RewardProps = {
  streak: StreakData;
  leaderboard: LeaderboardData;
  completedLesson: string;
  onContinue: () => void;
};

const sections = ["streak", "leaderboard", "certificate"] as const;
type Section = (typeof sections)[number];

const RewardSequence = ({
  streak,
  leaderboard,
  completedLesson,
  onContinue,
}: RewardProps) => {
  const [step, setStep] = useState(0);
  const current = sections[step];

  const handleContinue = () => setStep((prev) => prev + 1);

  return (
    <div className="flex justify-center items-center h-screen px-4 gap-5">
      {current === "streak" && (
        <StreakCelebration userData={streak} onContinue={handleContinue} />
      )}

      {current === "leaderboard" && (
        <LeaderboardLeague
          data={leaderboard}
          xp={streak.xp}
          onContinue={handleContinue}
        />
      )}

      {current === "certificate" && (
        <Certificate lessonTitle={completedLesson} onContinue={onContinue} />
      )}
    </div>
  );
};

export default RewardSequence;
