import useSWR from "swr";
import AuthService from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  provider: () => new Map(),
  revalidateIfStale: true,
  revalidateOnMount: true,
};

const fetcher = async (url: string) => {
  const token = await AuthService.getInstance().ensureValidToken();

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};

// --- SWR Hooks ---

export function useProblem(problemId?: string) {
  const shouldFetch = !!problemId;
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? `${API_URL}/api/problems/${problemId}/` : null,
    fetcher,
    swrConfig
  );

  return {
    problem: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useNotifcation() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/api/lms/notifications/`,
    fetcher,
    swrConfig
  );

  return {
    notification: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useStreak() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/api/streaks/`,
    fetcher,
    swrConfig
  );

  return {
    streak: data?.streak,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useProgress() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/api/progress/`,
    fetcher,
    swrConfig
  );

  return {
    progress: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useLeague() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/api/league/leagues/status/`,
    fetcher,
    swrConfig
  );

  return {
    league: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useLeagueLeaderboard(
  timePeriod = "weekly",
  leagueId?: string,
  limit = 10
) {
  const query = new URLSearchParams({
    time_period: timePeriod,
    ...(leagueId ? { league: leagueId } : {}),
    ...(limit ? { limit: limit.toString() } : {}),
  });

  const url = `${API_URL}/api/league/leagues/leaderboard/?${query.toString()}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, swrConfig);

  return {
    leaderboard: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// --- POST Mutation Functions ---

export async function solveProblem(
  problemId: string,
  answer: string,
  attemptNumber: number
) {
  const token = await AuthService.getInstance().ensureValidToken();

  const response = await fetch(`${API_URL}/api/problems/${problemId}/solve/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      answer,
      attempt_number: attemptNumber,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit solution");
  }

  return response.json();
}

export async function useEnergy() {
  const token = await AuthService.getInstance().ensureValidToken();

  const response = await fetch(`${API_URL}/api/gamification/use_energy/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to use energy");
  }

  return response.json();
}
