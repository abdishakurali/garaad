// src/types/learning.ts
export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  in_progress: boolean;
  course_ids: number[];
  courses: Course[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  is_new: boolean;
  progress: number;
  module_ids: string[];
  modules?: Module[];
  author_id: string;
  is_published: boolean;
  module_count: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lesson_ids: number[];
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  slug: string;
  description: string;
  progress: number;
  type: string;
  problem: Problem;
  language_options: string[];
  narration: string;
}

export interface Problem {
  question: string;
  example: {
    equation?: string;
    visual?: string;
    visualAlt?: string;
    context?: string;
  };
  options: string[];
  solution: string;
  explanation: string;
}
