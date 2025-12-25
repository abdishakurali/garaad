import useSWR from "swr";
import { Category, Course, Lesson } from "@/types/lms";
import axios from "axios";
import { Module } from "@/types/learning";
import { API_BASE_URL } from "@/lib/constants";

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
    `${API_BASE_URL}/api/lms/categories/`,
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

// export function useCourse(categoryId: string, courseSlug: string) {
//   const { data, error, isLoading, mutate } = useSWR<Course>(
//     categoryId && courseSlug
//       ? `${process.env.NEXT_PUBLIC_API_URL}/api/lms/categories/${categoryId}/courses/${courseSlug}/`
//       : null,
//     fetcher,
//     swrConfig
//   );

//   return {
//     course: data,
//     isLoading,
//     isError: error,
//     mutate,
//   };
// }

// Modules
export function useModule(courseId: string, moduleId: string) {
  const { data, error, isLoading, mutate } = useSWR<Module>(
    courseId && moduleId
      ? `${API_BASE_URL}/api/lms/courses/${courseId}/modules/${moduleId}/`
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
      ? `${API_BASE_URL}/api/lms/modules/${moduleId}/lessons/${lessonId}/`
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
    `${API_BASE_URL}/api/lms/user/progress/`,
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
    `${API_BASE_URL}/api/lms/leaderboard/?time_period=${timePeriod}`,
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
    `${API_BASE_URL}/api/lms/leaderboard/my_rank/`,
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
      ? `${API_BASE_URL}/api/lms/rewards?lesson_id=${lessonId}`
      : `${API_BASE_URL}/api/lms/rewards`,
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
    `${API_BASE_URL}/api/streaks/`,
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

export function useCourse(categoryId: string, courseSlug: string) {
  const shouldFetch = !!categoryId && !!courseSlug;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ["/course", categoryId, courseSlug] : null,
    async () => {
      const coursesRes = await axios.get(
        `${API_BASE_URL}/api/lms/courses/?category=${categoryId}`
      );
      const course: Course | undefined = coursesRes.data.find(
        (c: Course) => c.slug === courseSlug
      );
      if (!course) throw new Error("Course not found");

      const modulesRes = await axios.get(
        `${API_BASE_URL}/api/lms/lessons/?course=${course.id}`
      );
      return { ...course, modules: modulesRes.data as Module[] };
    }
  );

  return {
    course: data as Course & { modules: Module[] },
    isLoading,
    error,
    mutate,
  };
}
