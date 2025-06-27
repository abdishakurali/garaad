import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User, SignUpData, AuthState } from "@/types/auth";
import AuthService from "@/services/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Signup failed";
      });
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;

// Export the logout action as logoutAction for consistency
export const logoutAction = logout;

// Export selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectIsLoading = selectAuthLoading; // Alias for selectAuthLoading
export const selectAuthError = (state: RootState) => state.auth.error;

// Export the signup thunk
export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData: SignUpData, { dispatch }) => {
    try {
      const response = await AuthService.getInstance().signUp(userData);
      dispatch(
        setUser({
          ...response.user,
          is_premium: response.user.is_premium || false, // Use existing value or default to false
          profile: userData.profile || {
            bio: "",
            avatar: "",
            location: "",
            website: "",
            socialLinks: {
              twitter: "",
              linkedin: "",
              github: "",
            },
          },
        })
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
);

// Export the login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { dispatch }) => {
    try {
      const response = await AuthService.getInstance().signIn(credentials);

      if (response?.user) {
        const userData = {
          ...response.user,
          is_premium: response.user.is_premium || false,
        };

        dispatch(setUser(userData));
        return response;
      }

      throw new Error("Invalid response from server");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }
);

export default authSlice.reducer;
