import { baseURL } from "@/config";
import AuthService from "@/services/auth";

export interface PracticeProblem {
  id: number;
  question_text: string;
  question_type: "math_expression" | "multiple_choice";
  options: string[] | null;
  correct_answer: string;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  hints: Array<{
    id: number;
    content: string;
    order: number;
  }>;
  solution_steps: Array<{
    id: number;
    explanation: string;
    order: number;
  }>;
  created_at: string;
  updated_at: string;
}

export interface PracticeSetProblem {
  id: number;
  practice_set: number;
  problem: number;
  problem_details: PracticeProblem;
  order: number;
}

export interface PracticeSet {
  id: number;
  title: string;
  lesson: number | null;
  module: number | null;
  practice_type: "lesson" | "module" | "course";
  difficulty_level: "beginner" | "intermediate" | "advanced";
  is_randomized: boolean;
  is_published: boolean;
  practice_set_problems: PracticeSetProblem[];
  created_at: string;
  updated_at: string;
}

interface PracticeCompletionResponse {
  practice_set: number;
  score: number;
  completed: boolean;
  reward: {
    points: number;
    name: string;
  };
}

export const practiceService = {
  async getPracticeSets(lessonId?: number, moduleId?: number) {
    const token = await AuthService.getInstance().ensureValidToken();
    if (!token) throw new Error("Authentication required");

    try {
      const params = new URLSearchParams();
      if (lessonId) params.append("lesson", lessonId.toString());
      if (moduleId) params.append("module", moduleId.toString());

      const response = await fetch(
        `${baseURL}/api/lms/practice-sets/?${params.toString()}`,
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
        throw new Error(error.message || "Failed to fetch practice sets");
      }

      return (await response.json()) as PracticeSet[];
    } catch (error) {
      console.error("Error fetching practice sets:", error);
      throw error;
    }
  },

  async getPracticeSet(practiceSetId: number) {
    const token = await AuthService.getInstance().ensureValidToken();
    if (!token) throw new Error("Authentication required");

    try {
      const response = await fetch(
        `${baseURL}/api/lms/practice-sets/${practiceSetId}/`,
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
        throw new Error(error.message || "Failed to fetch practice set");
      }

      return (await response.json()) as PracticeSet;
    } catch (error) {
      console.error("Error fetching practice set:", error);
      throw error;
    }
  },

  async completePracticeSet(practiceSetId: number, score: number) {
    const token = await AuthService.getInstance().ensureValidToken();
    if (!token) throw new Error("Authentication required");

    try {
      const response = await fetch(
        `${baseURL}/api/lms/practice-sets/${practiceSetId}/complete/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ score }),
        }
      );

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || "Failed to complete practice set");
      }

      return (await response.json()) as PracticeCompletionResponse;
    } catch (error) {
      console.error("Error completing practice set:", error);
      throw error;
    }
  },
};
