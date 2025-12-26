"use client";

import React, { useState, useEffect } from "react";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { Leaderboard } from "@/components/leaderboard/Leaderboard";
import { PracticeSet } from "@/components/practice/PracticeSet";
import ActivityTracker from "@/components/ActivityTracker";
import { progressService } from "@/services/progress";
import { practiceService } from "@/services/practice";
import type {
  UserProgress,
  UserReward,
  LeaderboardEntry,
  UserRank,
} from "@/services/progress";
import type { PracticeSet as PracticeSetType } from "@/services/practice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [rewards, setRewards] = useState<UserReward[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<UserRank>({
    rank: 0,
    points: 0,
    entries_above: [],
    entries_below: [],
    user_info: {
      email: "",
      first_name: "",
      last_name: "",
      stats: {
        total_points: 0,
        completed_lessons: 0,
        enrolled_courses: 0,
        current_streak: 0,
        badges_count: 0,
      },
      badges: [],
    },
  });
  const [practiceSets, setPracticeSets] = useState<PracticeSetType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [
        progressData,
        rewardsData,
        leaderboardData,
        userRankData,
        practiceSetsData,
      ] = await Promise.all([
        progressService.getUserProgress(),
        progressService.getUserRewards(),
        progressService.getLeaderboard(),
        progressService.getUserRank(),
        practiceService.getPracticeSets(),
      ]);

      setProgress(progressData);
      setRewards(rewardsData);
      setLeaderboard(leaderboardData);
      setUserRank(userRankData);
      setPracticeSets(practiceSetsData);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid gap-8">
        {/* Activity Tracker */}
        <div className="grid gap-4 md:grid-cols-2">
          <ActivityTracker showDetails={true} />
        </div>

        <ProgressCard progress={progress} rewards={rewards} />
        <Leaderboard leaderboard={leaderboard} userRank={userRank} />



        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {practiceSets.map((practiceSet) => (
            <PracticeSet
              key={practiceSet.id}
              practiceSet={practiceSet}
              onSubmit={(problemId, answer) => {
                // Handle answer submission
                console.log("Answer submitted:", { problemId, answer });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
