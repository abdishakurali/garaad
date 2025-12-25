import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { CategoryState } from "@/types/lms";
import axios, { AxiosError } from "axios";
import { API_BASE_URL } from "@/lib/constants";

const initialState: CategoryState = {
  items: [],
  currentCategory: null,
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/lms/categories/`
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

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/lms/categories/${id}/`
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

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentCategory } = categorySlice.actions;
export const selectCategories = (state: { categories: CategoryState }) =>
  state.categories.items;
export const selectCurrentCategory = (state: { categories: CategoryState }) =>
  state.categories.currentCategory;
export const selectCategoriesLoading = (state: { categories: CategoryState }) =>
  state.categories.loading;
export const selectCategoriesError = (state: { categories: CategoryState }) =>
  state.categories.error;

export default categorySlice.reducer;
