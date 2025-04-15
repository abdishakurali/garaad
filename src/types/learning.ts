export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  is_new?: boolean;
  progress?: number;
  modules?: Module[];
  totalLessons?: number;
  estimatedHours?: number;
  skillLevel?: string;
}

export interface Category {
  id: number;
  title: string;
  description: string;
  image?: string;
  courses?: Course[];
}

export interface Module {
  id: number;
  title: string;
  description: string;
  course_id: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  module_id: number;
  content: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  lesson_id: number;
  type: string;
  content: string;
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
