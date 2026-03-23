import useSWR from "swr";
import AuthService from "./auth";
import { API_BASE_URL } from "@/lib/constants";
import { useAuthStore } from "@/store/useAuthStore";

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
    if (!token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        shouldFetch ? `${API_BASE_URL}/api/problems/${problemId}/` : null,
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

export function useGamificationStatus() {
    const user = useAuthStore((s) => s.user);
    const key = user ? `${API_BASE_URL}/api/gamification/status/` : null;

    const { data, error, isLoading, mutate } = useSWR(key, fetcher, swrConfig);

    return {
        gamificationStatus: data,
        isLoading: !!user && isLoading,
        isError: error,
        mutate,
    };
}

export function useNotification() {
    const { data, error, isLoading, mutate } = useSWR(
        `${API_BASE_URL}/api/notifications/`,
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
    const user = useAuthStore((s) => s.user);
    const key = user ? `${API_BASE_URL}/api/gamification/streak/` : null;

    const { data, error, isLoading, mutate } = useSWR(key, fetcher, swrConfig);

    return {
        streak: data,
        isLoading: !!user && isLoading,
        isError: error,
        mutate,
    };
}

export function useProgress() {
    const user = useAuthStore((s) => s.user);
    const key = user ? `${API_BASE_URL}/api/gamification/progress/` : null;

    const { data, error, isLoading, mutate } = useSWR(key, fetcher, swrConfig);

    return {
        progress: data,
        isLoading: !!user && isLoading,
        isError: error,
        mutate,
    };
}

export function useLeague() {
    const user = useAuthStore((s) => s.user);
    const key = user ? `${API_BASE_URL}/api/gamification/league/` : null;

    const { data, error, isLoading, mutate } = useSWR(key, fetcher, swrConfig);

    return {
        league: data,
        isLoading: !!user && isLoading,
        isError: error,
        mutate,
    };
}

export function useLeagues() {
    const user = useAuthStore((s) => s.user);
    const key = user ? `${API_BASE_URL}/api/gamification/leagues/` : null;

    const { data, error, isLoading, mutate } = useSWR(key, fetcher, swrConfig);

    return {
        leagues: data,
        isLoading: !!user && isLoading,
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

    const user = useAuthStore((s) => s.user);
    const url = `${API_BASE_URL}/api/gamification/leaderboard/?${query.toString()}`;
    const key = user ? url : null;

    const { data, error, isLoading, mutate } = useSWR(key, fetcher, swrConfig);

    return {
        leaderboard: data,
        isLoading: !!user && isLoading,
        isError: error,
        mutate,
    };
}
