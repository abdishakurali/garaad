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
  type: string;
  color: string;
  number: number;
  position?: "left" | "right" | "center"; // Platform position (which side of the scale)
  layout: {
    rows: number;
    columns: number;
    position: "top" | "bottom" | "left" | "right" | "center"; // Position within the platform
    alignment: "center" | "left" | "right";
  };
  weight_value?: number;
  text_color?: string;
  background_color?: string;
}

export interface DiagramConfig {
  diagram_id: number;
  diagram_type: string;
  scale_weight: number;
  objects: DiagramObject[];
}

// Example JSON format expected from the backend for a diagram problem:
/*
Single diagram format (existing):
{
  "id": 1,
  "question": "What is the total weight on the scale?",
  "which": "diagram",
  "options": ["10", "15", "20", "25"],
  "correct_answer": [{ "id": "1", "text": "15" }],
  "explanation": "The total weight is the sum of all objects.",
  "diagram_config": {
    "diagram_id": 101,
    "diagram_type": "scale",
    "scale_weight": 15,
    "objects": [
      {
        "type": "cube",
        "color": "#FF5733",
        "number": 2,
        "position": "left",
        "orientation": "vertical",
        "weight_value": 5
      },
      {
        "type": "circle",
        "color": "#33FF57",
        "number": 1,
        "position": "center",
        "orientation": "none",
        "weight_value": 5
      }
    ]
  },
  "question_type": "diagram",
  "img": null,
  "alt": null,
  "content": {
    "format": "default",
    "type": "diagram"
  }
}

Multiple diagrams format (new):
{
  "id": 2,
  "question": "Now can you find the weight of 1 circle?",
  "which": "diagram",
  "options": ["3", "5", "7", "9"],
  "correct_answer": [{ "id": "1", "text": "7" }],
  "explanation": "Analyze both scales to find the circle's weight.",
  "diagrams": [
    {
      "diagram_id": 101,
      "diagram_type": "scale",
      "scale_weight": 16,
      "objects": [
        {
          "type": "cube",
          "color": "#4F8EF7",
          "layout": {
            "rows": 2,
            "columns": 1,
            "position": "left",
            "alignment": "center"
          },
          "number": 2,
          "text_color": "#FFFFFF",
          "weight_value": null
        },
        {
          "type": "triangle",
          "color": "#9B59B6",
          "layout": {
            "rows": 1,
            "columns": 1,
            "position": "right",
            "alignment": "center"
          },
          "number": 10,
          "text_color": "#FFFFFF",
          "weight_value": null
        }
      ]
    },
    {
      "diagram_id": 102,
      "diagram_type": "scale",
      "scale_weight": 14,
      "objects": [
        {
          "type": "circle",
          "color": "#2ECC71",
          "layout": {
            "rows": 1,
            "columns": 1,
            "position": "left",
            "alignment": "center"
          },
          "number": 1,
          "text_color": "#FFFFFF",
          "weight_value": null
        },
        {
          "type": "trapezoid_weight",
          "color": "#9B59B6",
          "layout": {
            "rows": 2,
            "columns": 2,
            "position": "right",
            "alignment": "center"
          },
          "number": 4,
          "text_color": "#FFFFFF",
          "weight_value": 5
        }
      ]
    }
  ],
  "question_type": "diagram",
  "img": null,
  "alt": null,
  "content": {
    "format": "default",
    "type": "diagram"
  },
  "xp": 10,
  "created_at": "2025-06-30T09:33:40.194312Z",
  "updated_at": "2025-06-30T10:38:06.272995Z",
  "xp_value": 10
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
