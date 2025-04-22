import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { User, SignUpData, LoginCredentials } from "@/types/auth";
import { AppDispatch } from "@/store/store";
import AuthService from "@/services/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setError, clearError, logout } =
  authSlice.actions;

// Export the logout action as logoutAction for consistency
export const logoutAction = logout;

// Export selectors
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectIsLoading = selectAuthLoading; // Alias for selectAuthLoading
export const selectAuthError = (state: RootState) => state.auth.error;

// Export the signup thunk
export const signup =
  (userData: SignUpData) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      // TODO: Implement actual signup logic here
      dispatch(
        setUser({
          ...userData,
          id: 1,
          username: userData.email,
          is_premium: false,
          has_completed_onboarding: false,
          subscription_status: "basic",
        })
      );
      dispatch(setError(null));
      return true; // Return success
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : "An error occurred")
      );
      return false; // Return failure
    } finally {
      dispatch(setLoading(false));
    }
  };

// Export the login thunk
export const login =
  (credentials: LoginCredentials) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));
      const authService = AuthService.getInstance();
      const response = await authService.signIn(credentials);

      if (response.user) {
        dispatch(setUser(response.user));
        dispatch(setError(null));
        return true;
      } else {
        throw new Error("No user data received from server");
      }
    } catch (error) {
      dispatch(
        setError(error instanceof Error ? error.message : "An error occurred")
      );
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };

export default authSlice.reducer;
