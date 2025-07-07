import useSWR from "swr";
import AuthService from "@/services/auth";

const fetcher = async (
  url: string,
  method: "get" | "post" = "get",
  body?: any
) => {
  const service = AuthService.getInstance();
  return service.makeAuthenticatedRequest(method, url, body);
};

export const useCourseProgress = (courseId?: string) => {
  return useSWR(
    courseId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/${courseId}/`
      : null,
    (url) => fetcher(url, "get")
  );
};

export const useRewards = (lessonId?: string) => {
  return useSWR(
    lessonId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/lms/rewards?lesson_id=${lessonId}`
      : null,
    (url) => fetcher(url, "get")
  );
};

export const useLeaderboard = () => {
  return useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/leaderboard/?time_period=all_time&limit=10`,
    (url) => fetcher(url, "get")
  );
};

export const useUserRank = () => {
  return useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/leaderboard/my_rank/`,
    (url) => fetcher(url, "get")
  );
};
