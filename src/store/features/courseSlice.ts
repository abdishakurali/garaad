import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CourseState } from "@/types/lms";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants";

const initialState: CourseState = {
  items: [],
  currentCourse: null,
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (categoryId: string | undefined, { rejectWithValue }) => {
    try {
      const url = categoryId
        ? `${API_BASE_URL}/api/lms/categories/${categoryId}/courses/`
        : `${API_BASE_URL}/api/lms/courses/`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (
    { categoryId, courseId }: { categoryId: string; courseId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/lms/categories/${categoryId}/courses/${courseId}/`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const updateCourseProgress = createAsyncThunk(
  "courses/updateProgress",
  async (
    {
      categoryId,
      courseId,
      progress,
    }: { categoryId: string; courseId: string; progress: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/lms/categories/${categoryId}/courses/${courseId}/progress/`,
        {
          progress,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data || error.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCourseProgress.fulfilled, (state, action) => {
        if (state.currentCourse) {
          state.currentCourse.progress = action.payload.progress;
        }
      });
  },
});

export const { setCurrentCourse } = courseSlice.actions;
export const selectCourses = (state: { courses: CourseState }) =>
  state.courses.items;
export const selectCurrentCourse = (state: { courses: CourseState }) =>
  state.courses.currentCourse;
export const selectCoursesLoading = (state: { courses: CourseState }) =>
  state.courses.loading;
export const selectCoursesError = (state: { courses: CourseState }) =>
  state.courses.error;

export default courseSlice.reducer;
