export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  is_new?: boolean;
  progress: number;
  modules?: Module[];
  totalLessons?: number;
  estimatedHours?: number;
  skillLevel?: string;
  lesson_count?: number;
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
  id: string;
  title: string;
  slug: string;
  module_id: number;
  lesson_number: number;
  estimated_time: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  progress?: number;
  content_blocks?: LessonContentBlock[];
  exercises?: Exercise[];
}

export type BlockType =
  | "text"
  | "image"
  | "video"
  | "example"
  | "problem"
  | "diagram"
  | "note"
  | "code"
  | "quiz"
  | "exercise"
  | "interactive";

export interface TextContent {
  desc: string;
  text: string;
  text1?: string;
  format: "markdown";
  orientation?: "horizontal" | "vertical";
  title?: string;
  url?: string;
  alt?: string;
}

export interface ImageContent {
  url: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface LessonContentBlock {
  block_type: BlockType;
  content: string | TextContent | ImageContent | ProblemContent;
  order?: number;
  problem?: number;
}

type Position = "left" | "center" | "right";
type Orientation = "vertical" | "horizontal" | "none";

interface DiagramObject {
  type: string;
  color: string;
  number: number;
  position: Position;
  orientation: Orientation;
  weight_value?: number;
}

interface DiagramConfig {
  diagram_id: number;
  diagram_type: string;
  scale_weight: number;
  objects: DiagramObject[];
}

export interface ProblemContent {
  id?: number;
  question: string;
  question_text?: string;
  question_type?: "mcq" | "short_input" | "code" | "diagram";
  options: string[];
  correct_answer: Array<{
    id: string;
    text: string;
  }>;
  explanation?: string;
  image?: string;
  language?: string;
  hints?: Array<{
    content: string;
  }>;
  solution_steps?: Array<{
    explanation: string;
  }>;
  diagram_config?: DiagramConfig | DiagramConfig[];
}

export interface Exercise {
  id: number;
  title: string;
  description: string;
  lesson_id: number;
  type: string;
  content: string;
}

export interface Problem {
  id: number;
  question_text: string;
  question_type: "mcq" | "code" | "short_input";
  options?: string[];
  correct_answer: string;
  explanation: string;
  points: number;
  difficulty: "easy" | "medium" | "hard";
  created_at: string;
  hints?: Hint[];
  solution_steps?: SolutionStep[];
}

export interface Hint {
  id: number;
  problem_id: number;
  content: string;
  order: number;
}

export interface SolutionStep {
  id: number;
  problem_id: number;
  explanation: string;
  order: number;
}

export interface PracticeSet {
  id: number;
  title: string;
  lesson_id?: number;
  module_id?: number;
  practice_type: string;
  difficulty_level: string;
  is_randomized: boolean;
  is_published: boolean;
  created_at: string;
  problems?: Problem[];
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
