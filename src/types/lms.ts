export interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  inProgress: boolean;
  courses: Course[];
  sequence?: number;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  level?: "beginner" | "intermediate" | "advanced";
  progress?: number;
  is_new: boolean;
  category_id?: string;
  category?: number | string;
  modules?: Module[];
  author_id: string;
  is_published: boolean;
  module_count?: number;
  lesson_count?: number;
  estimatedHours?: number;
  sequence?: number;
  created_at: string;
  updated_at: string;
  /** Set by API when user has onboarding; matches topic or goal */
  recommended?: boolean;
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
  module_id?: number;
  course_id?: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  type: "video" | "text" | "quiz";
  order: number;
  lesson_number?: number;
  progress: number;
  problem?: Problem;
  content_blocks?: any[];
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
interface CategoryState {
  items: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

interface CourseState {
  items: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

interface ModuleState {
  items: Module[];
  currentModule: Module | null;
  loading: boolean;
  error: string | null;
}

interface LessonState {
  items: Lesson[];
  currentLesson: Lesson | null;
  loading: boolean;
  error: string | null;
}

type Position = "left" | "center" | "right";
type Orientation = "vertical" | "horizontal" | "none";

interface DiagramObject {
  type: "cube" | "triangle" | "weight" | "circle" | "trapezoid_weight";
  color: string;
  number: number;
  position: "left" | "right" | "center";
  orientation: "vertical" | "horizontal" | "none";
  weight_value?: number;
}

interface DiagramConfig {
  diagram_id: number;
  diagram_type: string;
  scale_weight: number;
  objects: DiagramObject[];
}

// The shape returned by your `/api/lms/lessons/:id/` endpoint
interface LessonResponse {
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
interface ProblemResponse {
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
