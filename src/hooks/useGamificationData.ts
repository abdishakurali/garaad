"use client";

import { useMemo } from "react";
import {
  useStreak,
  useProgress,
  useLeague,
  useLeagueLeaderboard,
} from "@/services/gamification";

interface UseGamificationDataProps {
  leagueId?: string;
  timePeriod?: string;
  limit?: number;
}

export function useGamificationData({
  leagueId,
  timePeriod = "weekly",
  limit = 10,
}: UseGamificationDataProps = {}) {
  const {
    streak,
    isLoading: isLoadingStreak,
    isError: isStreakError,
    mutate: mutateStreak,
  } = useStreak();

  const {
    progress,
    isLoading: isLoadingProgress,
    isError: isProgressError,
    mutate: mutateProgress,
  } = useProgress();

  const {
    league,
    isLoading: isLoadingLeague,
    isError: isLeagueError,
    mutate: mutateLeague,
  } = useLeague();

  const {
    leaderboard,
    isLoading: isLoadingLeaderboard,
    isError: isLeaderboardError,
    mutate: mutateLeaderboard,
  } = useLeagueLeaderboard(leagueId, timePeriod, limit);

  const isLoading = useMemo(() => {
    return (
      isLoadingStreak ||
      isLoadingProgress ||
      isLoadingLeague ||
      isLoadingLeaderboard
    );
  }, [
    isLoadingStreak,
    isLoadingProgress,
    isLoadingLeague,
    isLoadingLeaderboard,
  ]);

  const hasError = useMemo(() => {
    return (
      isStreakError || isProgressError || isLeagueError || isLeaderboardError
    );
  }, [isStreakError, isProgressError, isLeagueError, isLeaderboardError]);

  const mutateAll = useMemo(() => {
    return () =>
      Promise.all([
        mutateStreak(),
        mutateProgress(),
        mutateLeague(),
        mutateLeaderboard(),
      ]);
  }, [mutateStreak, mutateProgress, mutateLeague, mutateLeaderboard]);

  return {
    streak,
    progress,
    league,
    leaderboard,
    isLoading,
    hasError,
    mutateAll,
  };
}
