import useSWR from "swr";
import AuthService from "@/services/auth";
import { API_BASE_URL } from "@/lib/constants";

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
      ? `${API_BASE_URL}/api/lms/courses/${courseId}/`
      : null,
    (url) => fetcher(url, "get")
  );
};

export const useRewards = (lessonId?: string) => {
  return useSWR(
    lessonId
      ? `${API_BASE_URL}/api/lms/rewards?lesson_id=${lessonId}`
      : null,
    (url) => fetcher(url, "get")
  );
};

export const useLeaderboard = () => {
  return useSWR(
    `${API_BASE_URL}/api/lms/leaderboard/?time_period=all_time&limit=10`,
    (url) => fetcher(url, "get")
  );
};

export const useUserRank = () => {
  return useSWR(
    `${API_BASE_URL}/api/lms/leaderboard/my_rank/`,
    (url) => fetcher(url, "get")
  );
};
