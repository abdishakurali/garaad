export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  totalLessons: number;
  estimatedHours: number;
  skillLevel: string;
  modules: Module[];
  progress: number;
  thumbnail?: string;
  is_new?: boolean;
  author_id: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  hasExercises: boolean;
  isAvailable: boolean;
  progress: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  position: number;
  total_lessons: number;
  progress: number;
  next_lesson_id?: number;
  problem: {
    question: string;
    options: string[];
    solution: string;
    explanation: string;
    example: {
      visual?: string;
      visualAlt?: string;
      equation?: string;
    };
  };
}

export interface LearningState {
  categories: {
    items: Category[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
  currentCategory: Category | null;
  currentCourse: Course | null;
  currentLesson: Lesson | null;
  error: string | null;
  isLoading: boolean;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  image?: string;
  in_progress?: boolean;
  course_ids: string[];
  courses: Course[];
}
