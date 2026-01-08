import { baseURL } from "@/config";
import AuthService from "@/services/auth";

export interface UserProgress {
  module_id: number;
  id: number;
  user: number;
  lesson: number;
  lesson_title: string;
  module_title: string;
  category_title: string;
  course_title: string;
  status: "not_started" | "in_progress" | "completed";
  score: number | null;
  last_visited_at: string;
  completed_at: string | null;
}

export const progressService = {
  // User Progress
  async getUserProgress() {
    const token = await AuthService.getInstance().ensureValidToken();
    if (!token) throw new Error("Authentication required");

    try {
      const response = await fetch(`${baseURL}/api/lms/user-progress/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch user progress");
      }

      return (await response.json()) as UserProgress[];
    } catch (error) {
      console.error("Error fetching user progress:", error);
      throw error;
    }
  },

  async createProgressRecord(lessonId: number, status: UserProgress["status"]) {
    const token = await AuthService.getInstance().ensureValidToken();
    if (!token) throw new Error("Authentication required");

    try {
      const response = await fetch(`${baseURL}/api/lms/user-progress/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lesson: lessonId,
          status,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to create progress record");
      }

      return (await response.json()) as UserProgress;
    } catch (error) {
      console.error("Error creating progress record:", error);
      throw error;
    }
  },

  async updateProgress(progressId: number, data: Partial<UserProgress>) {
    const token = await AuthService.getInstance().ensureValidToken();
    if (!token) throw new Error("Authentication required");

    try {
      const response = await fetch(
        `${baseURL}/api/lms/user-progress/${progressId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to update progress");
      }

      return (await response.json()) as UserProgress;
    } catch (error) {
      console.error("Error updating progress:", error);
      throw error;
    }
  },

  async getProgressByCourse(courseId: number) {
    const token = await AuthService.getInstance().ensureValidToken();
    if (!token) throw new Error("Authentication required");

    try {
      const response = await fetch(
        `${baseURL}/api/lms/user-progress/by_course?course_id=${courseId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch course progress");
      }

      return (await response.json()) as UserProgress[];
    } catch (error) {
      console.error("Error fetching course progress:", error);
      throw error;
    }
  },

  async getProgressByCategory(categoryId: number) {
    const token = await AuthService.getInstance().ensureValidToken();
    if (!token) throw new Error("Authentication required");

    try {
      const response = await fetch(
        `${baseURL}/api/lms/user-progress/by_category/?category_id=${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch category progress");
      }

      return (await response.json()) as UserProgress[];
    } catch (error) {
      console.error("Error fetching category progress:", error);
      throw error;
    }
  },

  async getProgressByModule(moduleId: number) {
    const token = await AuthService.getInstance().ensureValidToken();
    if (!token) throw new Error("Authentication required");

    try {
      const response = await fetch(
        `${baseURL}/api/lms/user-progress/by_module/?module_id=${moduleId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch module progress");
      }

      return (await response.json()) as UserProgress[];
    } catch (error) {
      console.error("Error fetching module progress:", error);
      throw error;
    }
  },
};
