// src/store/features/learningSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Course, Category } from "@/types/learning";
import axios from "axios";

interface LessonType {
  id: number;
  title: string;
  slug: string;
  description: string;
  progress: number;
  type: string;
  problem: {
    options: string[];
    question: string;
    solution: string;
    explanation: string;
  };
  module: string;
  progress_id?: string;
}

interface LearningState {
  categories: {
    items: Category[];
    status: string;
    error: string | null;
  };
  currentCategory: Category | null;
  currentCourse: Course | null;
  currentLesson: LessonType | null;
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
  currentLesson: null,
  error: null,
  isLoading: false,
};

// Async thunks
export const fetchCategories = createAsyncThunk(
  "learning/fetchCategories",
  async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lms/categories/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/?category=${categoryId}`
      );

      // Find the specific course by slug
      const course = response.data.find(
        (course: Course) => course.slug === courseSlug
      );

      if (!course) {
        throw new Error("Course not found");
      }

      // Fetch the modules for this course
      const modulesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/${courseSlug}/modules/`
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
  async ({
    courseSlug,
    moduleSlug,
  }: {
    courseSlug: string;
    moduleSlug: string;
  }) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/${courseSlug}/modules/${moduleSlug}/lessons/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching module lessons:", error);
      throw error;
    }
  }
);

export const submitLessonAnswer = createAsyncThunk(
  "learning/submitLessonAnswer",
  async ({ progressId, answer }: { progressId: string; answer: string }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lms/progress/${progressId}/submit_answer/`,
        { answer }
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting answer:", error);
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
        state.categories.error =
          action.error.message || "Failed to fetch categories";
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
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchModuleLessons.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchModuleLessons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch module lessons";
      })
      // Submit answer reducers
      .addCase(submitLessonAnswer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitLessonAnswer.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(submitLessonAnswer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to submit answer";
      });
  },
});

export const { setCurrentLesson, setError, setLoading } = learningSlice.actions;
export default learningSlice.reducer;
