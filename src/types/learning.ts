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
  is_published: boolean;
}

export interface Category {
  id: number;
  title: string;
  description: string;
  image?: string;
  courses?: Course[];
}

export interface Module {
  length: number;
  id: number;
  title: string;
  description: string;
  estimatedHours: string;
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
  | "interactive"
  | "calculator"
  | "calculator_interface";

export interface Feature {
  title: string;
  text: string;
}

export interface TextContent {
  title?: string;
  type: string;
  desc?: string;
  text: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  text5?: string;
  text6?: string;
  "hover-1"?: string;
  "hover-2"?: string;
  format: "markdown";
  orientation?: "horizontal" | "vertical";
  url?: string;
  alt?: string;
  features?: Feature[];
  table?: {
    header: string[];
    rows: string[][];
  };
}

export interface ExplanationText {
  text?: string;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  text5?: string;
  text6?: string;
}

export interface ImageContent {
  url: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface LessonContentBlock {
  id: number;
  block_type: BlockType;
  content: string | TextContent | ImageContent | ProblemContent;
  order?: number;
  problem?: number;
  options?: Record<string, unknown>;
}

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

// Example JSON format expected from the backend for a diagram problem (matching diagram.md structure):
/*
Single diagram format:
{
  "id": 7,
  "question_text": "Waxa miisaanka ku yaal ayaa muujinaya culayska alaabta. Immisa ayuu le'eg yahay hal laba jibbaaran?",
  "question_type": "diagram",
  "options": [
    {
      "id": "a",
      "text": "4"
    },
    {
      "id": "b", 
      "text": "8"
    },
    {
      "id": "c",
      "text": "10"
    },
    {
      "id": "d",
      "text": "16"
    }
  ],
  "correct_answer": [
    {
      "id": "c",
      "text": "10"
    }
  ],
  "explanation": "Since there are 4 squares weighing 40, each square weighs 40 / 4 = 10.",
  "content": [
    {}
  ],
  "diagram_config": [
    {
      "objects": [
        {
          "type": "cube",
          "color": "blue",
          "number": 3,
          "position": "center",
          "orientation": "vertical",
          "weight_value": 10
        },
        {
          "type": "triangle",
          "color": "gray",
          "number": 1,
          "position": "center",
          "orientation": "none",
          "weight_value": 10
        }
      ],
      "diagram_id": 1,
      "diagram_type": "scale",
      "scale_weight": 25
    }
  ],
  "created_at": "2025-04-21T09:13:55.103330Z",
  "updated_at": "2025-04-29T13:50:41.216425Z"
}
*/

export interface ProblemContent {
  id: number;
  question: string;
  which: string;
  options: string[];
  correct_answer: { id: string; text: string }[];
  explanation?: string | ExplanationText;
  diagram_config?: DiagramConfig | DiagramConfig[];
  diagrams?: DiagramConfig[];
  question_type?:
    | "code"
    | "mcq"
    | "short_input"
    | "diagram"
    | "multiple_choice";
  img?: string;
  alt?: string;
  content: {
    format?: string;
    type?: string;
  };
  type?: string;
  points?: number;
  xp?: number;
  xp_value?: number;
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
