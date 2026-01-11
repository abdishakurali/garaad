import { useMemo } from "react";
import useSWR from "swr";
import { Category, Course, Lesson } from "@/types/lms";
import axios from "axios";
import { Module } from "@/types/learning";
import { API_BASE_URL } from "@/lib/constants";

// Add cache configuration
function localStorageProvider() {
  if (typeof window === "undefined") return new Map();

  // Handle SSR/Hydration by initializing with empty map if needed
  const cacheData = localStorage.getItem("swr-cache");
  const map = new Map(JSON.parse(cacheData || "[]"));

  // This is a simple implementation. In a real app, you might want to 
  // throttle the storage update or use a more robust solution.
  window.addEventListener("beforeunload", () => {
    try {
      const appCache = JSON.stringify(Array.from(map.entries()));
      localStorage.setItem("swr-cache", appCache);
    } catch (e) {
      console.error("Failed to save SWR cache to localStorage:", e);
    }
  });

  return map;
}

export const swrConfig = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 300000, // 5 minutes by default for read-heavy data
  provider: localStorageProvider,
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
    fetcher
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
    fetcher
  );

  return {
    module: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Lessons
export function useLesson(lessonId: string | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Lesson>(
    lessonId ? `${API_BASE_URL}/api/lms/lessons/${lessonId}/` : null,
    fetcher
  );

  return {
    lesson: data,
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
    fetcher
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
    fetcher
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
    fetcher
  );

  return {
    rewards: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Problems
export function useProblem(problemId: number | string | undefined | null) {
  const { data, error, isLoading, mutate } = useSWR(
    problemId ? `${API_BASE_URL}/api/lms/problems/${problemId}/` : null,
    fetcher
  );

  return {
    problem: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Streak
export function useUserStreak() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/api/streaks/`,
    fetcher
  );

  return {
    streak: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Enrollments
export function useEnrollments() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/api/lms/enrollments/`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
    }
  );

  return {
    enrollments: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// User Progress
export function useUserProgress() {
  const { data, error, isLoading, mutate } = useSWR(
    `${API_BASE_URL}/api/lms/user-progress/`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
    }
  );

  return {
    progress: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCourse(categoryId: string, courseSlug: string) {
  const shouldFetch = !!categoryId && !!courseSlug;

  // Fetch the specific course list for this category
  // Using [URL, courseSlug] as key ensures SWR properly isolates caches for different courses in the same category
  const {
    data: courseData,
    error: courseError,
    isLoading: isCourseLoading,
    mutate: mutateCourse,
  } = useSWR<Course>(
    shouldFetch
      ? [`${API_BASE_URL}/api/lms/courses/?category=${categoryId}`, courseSlug]
      : null,
    async ([url]: [string, string]) => {
      const data = await fetcher(url);
      const found = data.find((c: Course) => c.slug === courseSlug);
      if (!found) throw new Error("Koorso lama helin");
      return found;
    }
  );

  // Fetch lessons using the specific course ID
  const {
    data: lessonsData,
    error: lessonsError,
    isLoading: isLessonsLoading,
    mutate: mutateLessons,
  } = useSWR<Lesson[]>(
    courseData?.id
      ? `${API_BASE_URL}/api/lms/lessons/?course=${courseData.id}`
      : null,
    fetcher
  );

  // Combine data: Map EACH flat lesson to its own module for the zigzag view "simpel"
  const courseWithModules = useMemo(() => {
    if (!courseData) return null;

    // Each lesson becomes a module bubble in the zigzag path
    const syntheticModules = lessonsData
      ? [...lessonsData]
        .sort((a, b) => (a.lesson_number || 0) - (b.lesson_number || 0))
        .map((lesson) => ({
          id: lesson.id,
          course_id: courseData.id,
          title: lesson.title,
          description: lesson.description || "",
          order: lesson.lesson_number || 1,
          lessons: [lesson], // One lesson per bubble
        }))
      : [];

    return {
      ...courseData,
      modules: syntheticModules as unknown as Module[],
    };
  }, [courseData, lessonsData]);

  return {
    course: courseWithModules as unknown as Course,
    isLoading: isCourseLoading || isLessonsLoading,
    error: courseError || lessonsError,
    mutate: () => {
      mutateCourse();
      mutateLessons();
    },
  };
}
