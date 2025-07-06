export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  inProgress: boolean;
  courses: Course[];
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  level: "beginner" | "intermediate" | "advanced";
  progress?: number;
  is_new: boolean;
  category_id: string;
  modules?: Module[];
  author_id: string;
  is_published: boolean;
  module_count: number;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: number;
  course_id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  description: string;
  content: string;
  type: "video" | "text" | "quiz";
  order: number;
  progress: number;
  problem?: Problem;
  language_options: string[];
}

export interface Problem {
  question: string;
  example: {
    equation: string;
    visual: string;
    visualAlt: string;
    context: string;
  };
  options: string[];
}

// State interfaces
export interface CategoryState {
  items: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

export interface CourseState {
  items: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

export interface ModuleState {
  items: Module[];
  currentModule: Module | null;
  loading: boolean;
  error: string | null;
}

export interface LessonState {
  items: Lesson[];
  currentLesson: Lesson | null;
  loading: boolean;
  error: string | null;
}

export type Position = "left" | "center" | "right";
export type Orientation = "vertical" | "horizontal" | "none";

export interface DiagramObject {
  type: "cube" | "triangle" | "weight" | "circle" | "trapezoid_weight";
  color: string;
  number: number;
  position: "left" | "right" | "center";
  orientation: "vertical" | "horizontal" | "none";
  weight_value?: number;
}

export interface DiagramConfig {
  diagram_id: number;
  diagram_type: string;
  scale_weight: number;
  objects: DiagramObject[];
}

// The shape returned by your `/api/lms/lessons/:id/` endpoint
export interface LessonResponse {
  id: number;
  title: string;
  // Each block in the lesson can be one of several types:
  content_blocks: Array<{
    id: number;
    block_type: "problem" | "text" | "image" | "video" | "calculator_interface";
    order?: number;
    // If it's a problem block, it carries the problem ID to fetch separately:
    problem?: number;
    // For non‑problem blocks, content is usually JSON‑serialized:
    content?: string;
    // For calculator interfaces there may be additional options:
    options?: {
      view?: string | Record<string, unknown>;
      [key: string]: unknown;
    };
  }>;
}

// The shape returned by your `/api/lms/problems/:id/` endpoint
export interface ProblemResponse {
  id: number;
  question_text: string;
  which: string;
  options: { text: string }[];
  correct_answer: { text: string }[];
  explanation?: string;
  diagram_config?: DiagramConfig;
  diagrams?: DiagramConfig[];
  question_type: string;
  img?: string;
  alt?: string;
  content: {
    format?: string;
    type?: string;
  };
}
