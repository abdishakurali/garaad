import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { coursesService, Course, Module, Lesson } from "@/services/courses";
import { RootState } from "@/store";

interface ApiError {
  message?: string;
  status?: number;
}

interface CoursesState {
  courses: Course[];
  currentCourse: (Course & { modules: Module[] }) | null;
  currentModule: Module | null;
  currentLesson: Lesson | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: {
    message: string;
    status?: number;
  } | null;
  search: string;
  ordering: string;
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  currentModule: null,
  currentLesson: null,
  status: "idle",
  error: null,
  search: "",
  ordering: "",
};

// Thunks
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async ({ search, ordering }: { search?: string; ordering?: string } = {}) => {
    return await coursesService.getCourses({ search, ordering });
  }
);

export const fetchCourseDetails = createAsyncThunk(
  "courses/fetchCourseDetails",
  async (courseId: number) => {
    return await coursesService.getCourseDetails(courseId);
  }
);

export const fetchCourseModules = createAsyncThunk(
  "courses/fetchCourseModules",
  async (courseId: number) => {
    return await coursesService.getCourseModules(courseId);
  }
);

export const fetchModuleLessons = createAsyncThunk(
  "courses/fetchModuleLessons",
  async (moduleId: number) => {
    return await coursesService.getModuleLessons(moduleId);
  }
);

export const fetchLessonExercises = createAsyncThunk(
  "courses/fetchLessonExercises",
  async (lessonId: number) => {
    return await coursesService.getLessonExercises(lessonId);
  }
);

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setOrdering: (state, action) => {
      state.ordering = action.payload;
    },
    setCurrentModule: (state, action) => {
      state.currentModule = action.payload;
    },
    setCurrentLesson: (state, action) => {
      state.currentLesson = action.payload;
    },
    clearCourseDetails: (state) => {
      state.currentCourse = null;
      state.currentModule = null;
      state.currentLesson = null;
    },
    clearError: (state) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = {
          message: action.error.message || "Something went wrong",
          status: (action.error as ApiError).status,
        };
      })
      // Fetch Course Details
      .addCase(fetchCourseDetails.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCourseDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentCourse = action.payload;
        state.error = null;
      })
      .addCase(fetchCourseDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = {
          message: action.error.message || "Something went wrong",
          status: (action.error as ApiError).status,
        };
      })
      // Fetch Course Modules
      .addCase(fetchCourseModules.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCourseModules.fulfilled, (state, action) => {
        if (state.currentCourse) {
          state.currentCourse.modules = action.payload;
        }
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchCourseModules.rejected, (state, action) => {
        state.status = "failed";
        state.error = {
          message: action.error.message || "Something went wrong",
          status: (action.error as ApiError).status,
        };
      })
      // Fetch Module Lessons
      .addCase(fetchModuleLessons.fulfilled, (state, action) => {
        if (state.currentModule) {
          state.currentModule.lessons = action.payload;
        }
      })
      // Fetch Lesson Exercises
      .addCase(fetchLessonExercises.fulfilled, (state, action) => {
        if (state.currentLesson) {
          state.currentLesson.exercises = action.payload;
        }
      });
  },
});

export const {
  setSearch,
  setOrdering,
  setCurrentModule,
  setCurrentLesson,
  clearCourseDetails,
  clearError,
} = coursesSlice.actions;

// Selectors
export const selectCourses = (state: RootState) => state.courses.courses;
export const selectCurrentCourse = (state: RootState) =>
  state.courses.currentCourse;
export const selectCurrentModule = (state: RootState) =>
  state.courses.currentModule;
export const selectCurrentLesson = (state: RootState) =>
  state.courses.currentLesson;
export const selectCoursesStatus = (state: RootState) => state.courses.status;
export const selectCoursesError = (state: RootState) => state.courses.error;
export const selectSearch = (state: RootState) => state.courses.search;
export const selectOrdering = (state: RootState) => state.courses.ordering;

export default coursesSlice.reducer;
