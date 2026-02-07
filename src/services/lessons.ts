import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";

export interface ContentBlock {
  id: number;
  lesson: number;
  block_type: "text" | "example" | "interactive";
  content: {
    text?: string;
    title?: string;
    examples?: string[];
    description?: string;
    type?: "quiz";
    question?: string;
    options?: string[];
    correct?: string;
    explanation?: string;
  };
  order: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: ContentBlock[];
  order: number;
  courseId: string;
}

export interface Problem {
  id: number;
  question_text: string;
  question_type: "single_choice" | "multiple_choice";
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  hints: string[];
  solution_steps: string[];
  created_at: string;
  updated_at: string;
}

export interface PracticeSetProblem {
  id: number;
  practice_set: number;
  problem: number;
  problem_details: Problem;
  order: number;
}

export interface PracticeSet {
  id: number;
  title: string;
  lesson: number;
  module: string | null;
  practice_type: "lesson" | "module";
  difficulty_level: "beginner" | "intermediate" | "advanced";
  is_randomized: boolean;
  is_published: boolean;
  practice_set_problems: PracticeSetProblem[];
  created_at: string;
  updated_at: string;
}

class LessonService {
  private static instance: LessonService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = "/api/lms/lessons";
  }

  public static getInstance(): LessonService {
    if (!LessonService.instance) {
      LessonService.instance = new LessonService();
    }
    return LessonService.instance;
  }

  async getLesson(lessonId: string): Promise<Lesson> {
    try {
      return await api.get<Lesson>(`${this.baseUrl}/${lessonId}/`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch lesson: ${error.message}`);
      }
      throw new Error("Failed to fetch lesson");
    }
  }

  async getLessonsByCourse(courseId: string): Promise<Lesson[]> {
    try {
      return await api.get<Lesson[]>(`${this.baseUrl}/course/${courseId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch lessons: ${error.message}`);
      }
      throw new Error("Failed to fetch lessons");
    }
  }

  async completeLesson(lessonId: string): Promise<void> {
    try {
      await api.post(`${this.baseUrl}/${lessonId}/complete/`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to complete lesson: ${error.message}`);
      }
      throw new Error("Failed to complete lesson");
    }
  }
}

export default LessonService;
