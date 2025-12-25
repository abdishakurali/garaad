// src/store/features/learningSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Course, Category, Lesson, Module } from "@/types/learning";
import axios from "axios";
import AuthService from "@/services/auth";
import useSWR from "swr";
import { API_BASE_URL } from "@/lib/constants";

type LessonType = Lesson;

interface ModuleType {
  id: number;
  title: string;
  description: string;
  order: number;
  course: number;
  lessons: LessonType[];
}

interface LearningState {
  categories: {
    items: Category[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
  };
  currentCategory: Category | null;
  currentCourse: Course | null;
  currentModule: {
    data: ModuleType | null;
    status: string;
    error: string | null;
  };
  currentLesson: LessonType | null;
  answerState: {
    isCorrect: boolean | null;
    showAnswer: boolean;
    lastAttempt: string | null;
  };
  error: string | null;
  isLoading: boolean;
}

const initialState: LearningState = {
  categories: {
    items: [],
    status: "idle",
    error: null,
  },
  currentCategory: null,
  currentCourse: null,
  currentModule: {
    data: null,
    status: "idle",
    error: null,
  },
  currentLesson: null,
  answerState: {
    isCorrect: null,
    showAnswer: false,
    lastAttempt: null,
  },
  error: null,
  isLoading: false,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  "learning/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const authService = AuthService.getInstance();
      const response = await authService.makeAuthenticatedRequest<Category[]>(
        "get",
        `${API_BASE_URL}/api/lms/categories/`
      );
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

export const fetchCourse = createAsyncThunk(
  "learning/fetchCourse",
  async ({
    categoryId,
    courseSlug,
  }: {
    categoryId: string;
    courseSlug: string;
  }) => {
    try {
      // First, fetch all courses for the category
      const response = await axios.get(
        `${API_BASE_URL}/api/lms/courses/?category=${categoryId}`
      );

      // Find the specific course by slug
      const course = response.data.find(
        (course: Course) => course.slug === courseSlug
      );

      if (!course) {
        throw new Error("Course not found");
      }

      // Fetch the modules for this course using the course ID
      const modulesResponse = await axios.get(
        `${API_BASE_URL}/api/lms/lessons/?course=${course.id}`
      );

      // Combine course data with modules
      return {
        ...course,
        modules: modulesResponse.data,
      };
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  }
);

export const fetchModuleLessons = createAsyncThunk(
  "learning/fetchModuleLessons",
  async ({ moduleId }: { moduleId: string }) => {
    try {
      // First fetch the module details
      const moduleResponse = await axios.get(
        `${API_BASE_URL}/api/lms/lessons/${moduleId}/`
      );

      // Then fetch all lessons
      const lessonsResponse = await axios.get(
        `${API_BASE_URL}/api/lms/lessons/?module=${moduleId}`
      );

      return {
        module: moduleResponse.data,
        lessons: lessonsResponse.data,
      };
    } catch (error) {
      console.error("Error fetching module lessons:", error);
      throw error;
    }
  }
);

export const submitAnswer = createAsyncThunk(
  "learning/submitAnswer",
  async ({ lessonId, answer }: { lessonId: string; answer: string }) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      // First, get the lesson details
      const lessonResponse = await fetch(
        `${API_BASE_URL}/api/lms/lessons/${lessonId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!lessonResponse.ok) {
        throw new Error("Failed to fetch lesson details");
      }

      const lessonData = await lessonResponse.json();

      // Get the problem block from the lesson's content blocks
      const problemBlock = lessonData.content_blocks?.find(
        (block: { block_type: string; content: unknown }) =>
          block.block_type === "problem"
      );

      if (!problemBlock) {
        throw new Error("No problem found in this lesson");
      }

      // Handle the problem content based on its type
      let problemContent;
      if (typeof problemBlock.content === "string") {
        try {
          problemContent = JSON.parse(problemBlock.content);
        } catch {
          problemContent = problemBlock.content;
        }
      } else {
        problemContent = problemBlock.content;
      }

      // Validate the answer against the correct_answer in the problem content
      const isCorrect = answer === problemContent.correct_answer;
      console.log(problemContent.correct_answer);
      console.log(answer);
      return {
        correct: isCorrect,
        feedback: isCorrect ? "Correct!" : "That's incorrect. Try again.",
        explanation: problemContent.explanation,
        correctAnswer: problemContent.correct_answer,
        lastAttempt: answer,
      };
    } catch (error) {
      console.error("Error submitting answer:", error);
      throw error;
    }
  }
);

export const fetchModule = createAsyncThunk(
  "learning/fetchModule",
  async (moduleId: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lms/lessons/${moduleId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching module:", error);
      throw error;
    }
  }
);

// Add a new thunk to fetch a single lesson
export const fetchLesson = createAsyncThunk(
  "learning/fetchLesson",
  async (lessonId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/lms/lessons/${lessonId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching lesson:", error);
      throw error;
    }
  }
);

const learningSlice = createSlice({
  name: "learning",
  initialState,
  reducers: {
    setCurrentLesson: (state, action: PayloadAction<LessonType>) => {
      state.currentLesson = action.payload;
      state.error = null;
      state.isLoading = false;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    clearCurrentModule: (state) => {
      state.currentModule = {
        data: null,
        status: "idle",
        error: null,
      };
    },
    revealAnswer: (state) => {
      state.answerState.showAnswer = true;
    },
    resetAnswerState: (state) => {
      state.answerState = {
        isCorrect: null,
        showAnswer: false,
        lastAttempt: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories reducers
      .addCase(fetchCategories.pending, (state) => {
        state.categories.status = "loading";
        state.categories.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories.status = "succeeded";
        state.categories.items = action.payload;
        state.categories.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categories.status = "failed";
        state.categories.error = action.payload as string;
      })
      // Course reducers
      .addCase(fetchCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(fetchCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch course";
      })
      // Module lessons reducers
      .addCase(fetchModuleLessons.pending, (state) => {
        state.currentModule.status = "loading";
        state.currentModule.error = null;
      })
      .addCase(fetchModuleLessons.fulfilled, (state, action) => {
        state.currentModule.status = "succeeded";
        state.currentModule.data = {
          ...action.payload.module,
          lessons: action.payload.lessons,
        };
        state.currentModule.error = null;
      })
      .addCase(fetchModuleLessons.rejected, (state, action) => {
        state.currentModule.status = "failed";
        state.currentModule.error =
          action.error.message || "Failed to fetch module lessons";
      })
      // Module reducers
      .addCase(fetchModule.pending, (state) => {
        state.currentModule.status = "loading";
        state.currentModule.error = null;
      })
      .addCase(fetchModule.fulfilled, (state, action) => {
        state.currentModule.status = "succeeded";
        state.currentModule.data = action.payload;
        state.currentModule.error = null;
      })
      .addCase(fetchModule.rejected, (state, action) => {
        state.currentModule.status = "failed";
        state.currentModule.error =
          action.error.message || "Failed to fetch module";
      })
      // Lesson reducers
      .addCase(fetchLesson.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLesson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentLesson = action.payload;
        state.error = null;
      })
      .addCase(fetchLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch lesson";
      })
      // Submit answer reducers
      .addCase(submitAnswer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.answerState = {
          isCorrect: action.payload.correct,
          showAnswer: false,
          lastAttempt: action.payload.lastAttempt,
        };
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to submit answer";
      });
  },
});

export const {
  setCurrentLesson,
  setError,
  setLoading,
  clearCurrentModule,
  revealAnswer,
  resetAnswerState,
} = learningSlice.actions;
export default learningSlice.reducer;
