import useSWR from "swr";
import { Category, Course, Module, Lesson } from "@/types/lms";

// Add cache configuration
const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000,
  // Add persistent cache
  provider: () => new Map(),
  // Add cache persistence
  persistSize: 1000, // Maximum number of items to persist
  // Add stale-while-revalidate strategy
  revalidateIfStale: true,
  revalidateOnMount: true,
};

const fetcher = async (url: string) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

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

// Categories and Courses
export function useCategories() {
  const { data, error, isLoading, mutate } = useSWR<Category[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/categories/`,
    fetcher,
    swrConfig
  );

  return {
    categories: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCourse(categoryId: string, courseSlug: string) {
  const { data, error, isLoading, mutate } = useSWR<Course>(
    categoryId && courseSlug
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/lms/categories/${categoryId}/courses/${courseSlug}/`
      : null,
    fetcher,
    swrConfig
  );

  return {
    course: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Modules
export function useModule(courseId: string, moduleId: string) {
  const { data, error, isLoading, mutate } = useSWR<Module>(
    courseId && moduleId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/${courseId}/modules/${moduleId}/`
      : null,
    fetcher,
    swrConfig
  );

  return {
    module: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Lessons
export function useLesson(moduleId: string, lessonId: string) {
  const { data, error, isLoading, mutate } = useSWR<Lesson>(
    moduleId && lessonId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/lms/modules/${moduleId}/lessons/${lessonId}/`
      : null,
    fetcher,
    swrConfig
  );

  return {
    lesson: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Progress
export function useUserProgress() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/user/progress/`,
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

// Leaderboard
export function useLeaderboard(
  timePeriod: "daily" | "weekly" | "all_time" = "all_time"
) {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/leaderboard/?time_period=${timePeriod}`,
    fetcher,
    swrConfig
  );

  return {
    leaderboard: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Rank
export function useUserRank() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/leaderboard/my_rank/`,
    fetcher,
    swrConfig
  );

  return {
    rank: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Rewards
export function useUserRewards(lessonId?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    lessonId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/lms/rewards?lesson_id=${lessonId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/lms/rewards`,
    fetcher,
    swrConfig
  );

  return {
    rewards: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Streak
export function useUserStreak() {
  const { data, error, isLoading, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/streaks/`,
    fetcher,
    swrConfig
  );

  console.log("streak:", data);

  return {
    streak: data,
    isLoading,
    isError: error,
    mutate,
  };
}
