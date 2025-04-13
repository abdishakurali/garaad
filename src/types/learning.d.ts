export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail?: string;
  progress: number;
  is_new?: boolean;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  courses: Course[];
  in_progress?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  course_id: string;
  lessons: Lesson[];
  progress: number;
  total_lessons: number;
  completed_lessons: number;
}

export interface Lesson {
  id: number;
  title: string;
  module_id: string;
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
  progress: number;
  position: number;
  total_lessons: number;
  is_completed: boolean;
  next_lesson_id?: number;
  previous_lesson_id?: number;
}
