import { baseURL } from "@/config";
import AuthService from "@/services/auth";

interface ApiError extends Error {
  status?: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  level: string;
  category: string;
  author_id: string;
  is_published: boolean;
  module_count: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  course: number;
  title: string;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  module: number;
  title: string;
  content: string;
  type: string;
  order: number;
  created_at: string;
  updated_at: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: number;
  lesson: number;
  question: string;
  type: "input" | "multiple_choice";
  choices: string[] | null;
  correct_answer: string;
  explanation: string;
  created_at: string;
  updated_at: string;
}

interface GetCoursesParams {
  search?: string;
  ordering?: string;
}

export const coursesService = {
  // Courses
  async getCourses({ search, ordering }: GetCoursesParams = {}) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (ordering) params.append("ordering", ordering);

    const queryString = params.toString();
    const url = `${baseURL}/api/lms/courses/${
      queryString ? `?${queryString}` : ""
    }`;

    // Get the token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.status === 401) {
        // Token might be expired, try to refresh it
        try {
          const newToken = await AuthService.refreshAccessToken();
          // Retry the request with the new token
          const retryResponse = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
          });

          if (!retryResponse.ok) {
            throw new Error("Failed to fetch courses after token refresh");
          }

          const data = await retryResponse.json();
          return data as Course[];
        } catch (error) {
          console.log(error);
        }
      }

      if (!response.ok) {
        let errorMessage = "Failed to fetch courses";

        // Try to get error details from response
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.detail || errorMessage;
        } catch {
          // If we can't parse the error JSON, create specific messages based on status
          switch (response.status) {
            case 500:
              errorMessage =
                "The server encountered an internal error. Please try again later or contact support if the problem persists.";
              break;
            case 404:
              errorMessage =
                "The courses endpoint could not be found. Please check the API configuration.";
              break;
            case 403:
              errorMessage =
                "Adiga don't have permission to access the courses.";
              break;
            case 401:
              errorMessage = "Authentication required. Please log in again.";
              break;
            default:
              errorMessage = `Server error (${response.status}): ${errorMessage}`;
          }
        }

        const error = new Error(errorMessage) as ApiError;
        error.status = response.status;
        throw error;
      }

      const data = await response.json();
      return data as Course[];
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Unable to connect to the server. Please check your internet connection and try again."
        );
      }

      // Re-throw the error with our custom properties
      throw error;
    }
  },

  // Course Details
  async getCourseDetails(courseId: number) {
    // Get the token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    try {
      const response = await fetch(`${baseURL}/api/lms/courses/${courseId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch course details");
      }

      const data = await response.json();
      return data as Course & { modules: Module[] };
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  },

  // Lessons
  async getModuleLessons(moduleId: number) {
    // Get the token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    try {
      const response = await fetch(
        `${baseURL}/api/lms/lessons/module/${moduleId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch module lessons");
      }

      const data = await response.json();
      return data as Lesson[];
    } catch (error) {
      console.error("Error fetching module lessons:", error);
      throw error;
    }
  },

  // Exercises
  async getLessonExercises(lessonId: number) {
    // Get the token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    try {
      const response = await fetch(
        `${baseURL}/api/lms/exercises/lesson/${lessonId}/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch lesson exercises");
      }

      const data = await response.json();
      return data as Exercise[];
    } catch (error) {
      console.error("Error fetching lesson exercises:", error);
      throw error;
    }
  },

  // Submit Exercise
  async submitExercise(exerciseId: number, answer: string) {
    // Get the token from localStorage
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    try {
      const response = await fetch(
        `${baseURL}/api/lms/exercises/${exerciseId}/submit/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ answer }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to submit exercise");
      }

      const data = await response.json();
      return data as {
        is_correct: boolean;
        correct_answer: string | null;
        explanation: string;
      };
    } catch (error) {
      console.error("Error submitting exercise:", error);
      throw error;
    }
  },
};
