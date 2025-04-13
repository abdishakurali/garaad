import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState, LoginCredentials, AuthError } from "@/types/auth";
import AuthService from "@/services/auth";
import { SignUpData, SignUpResponse, SignInResponse } from "@/services/auth";
import { AxiosError } from "axios";

// Define the error response type
interface ErrorResponseData {
  email?: string[];
  password?: string[];
  name?: string[];
  detail?: string;
  error?: string;
  message?: string;
  non_field_errors?: string[];
  [key: string]: string | string[] | undefined;
}

// Define a custom error type
interface CustomError extends Error {
  status?: number;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const login = createAsyncThunk<
  { user: SignInResponse["user"]; tokens: SignInResponse["tokens"] },
  LoginCredentials,
  { rejectValue: AuthError }
>("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const authService = AuthService.getInstance();
    const response = await authService.signIn(credentials);
    return response;
  } catch (error) {
    // Log the full error for debugging
    console.log("Login error details:", error);

    // If the error is an Error object with a message, use that message
    if (error instanceof Error) {
      const customError = error as CustomError;
      return rejectWithValue({
        message: customError.message,
        status: customError.status || 500,
      });
    }

    // Handle Axios errors
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as AxiosError<ErrorResponseData>;
      const status = axiosError.response?.status;
      console.log("Status:", status);
      const responseData = axiosError.response?.data;

      console.log("Login API Error Response:", responseData);

      // Handle 401 Unauthorized error (invalid credentials)
      if (status === 401) {
        return rejectWithValue({
          message:
            "Email-ka ama password-ka aad gelisay waa khalad. Fadlan hubi xogtaada oo mar kale isku day.",
          status: 401,
        });
      }

      // Handle field-specific errors (400 status)
      if (status === 400 && responseData) {
        // Check for non_field_errors
        if (
          responseData.non_field_errors &&
          Array.isArray(responseData.non_field_errors)
        ) {
          const errorMessage = responseData.non_field_errors.join(", ");

          // Check for specific error messages
          if (errorMessage.includes("Invalid credentials")) {
            return rejectWithValue({
              message:
                "Email-ka ama password-ka aad gelisay waa khalad. Fadlan hubi xogtaada oo mar kale isku day.",
              status: 400,
            });
          }

          return rejectWithValue({
            message: `Cilad ayaa dhacday: ${errorMessage}`,
            status: 400,
          });
        }

        // Check for email errors
        if (responseData.email && Array.isArray(responseData.email)) {
          return rejectWithValue({
            message: `Email: ${responseData.email.join(", ")}`,
            status: 400,
          });
        }

        // Check for password errors
        if (responseData.password && Array.isArray(responseData.password)) {
          return rejectWithValue({
            message: `Password: ${responseData.password.join(", ")}`,
            status: 400,
          });
        }

        // If there are other field errors, combine them
        const fieldErrors = Object.entries(responseData)
          .filter((entry) => Array.isArray(entry[1]) && entry[1].length > 0)
          .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
          .join("; ");

        if (fieldErrors) {
          return rejectWithValue({
            message: `Cilad ayaa dhacday: ${fieldErrors}`,
            status: 400,
          });
        }
      }

      // Handle server errors (500 status)
      if (status === 500) {
        return rejectWithValue({
          message:
            "Server-ka ayaa la xiriira dhibaato. Fadlan mar kale isku day.",
          status: 500,
        });
      }

      // If we have a response but couldn't parse a specific error
      if (responseData) {
        // Check for detail field
        if (responseData.detail) {
          return rejectWithValue({
            message: `Cilad ayaa dhacday: ${responseData.detail}`,
            status: status,
          });
        }

        // Check for error field
        if (responseData.error) {
          return rejectWithValue({
            message: `Cilad ayaa dhacday: ${responseData.error}`,
            status: status,
          });
        }

        // Check for message field
        if (responseData.message) {
          return rejectWithValue({
            message: `Cilad ayaa dhacday: ${responseData.message}`,
            status: status,
          });
        }
      }

      // If we couldn't parse a specific error, return a generic message
      return rejectWithValue({
        message: "Cilad ayaa dhacday. Fadlan mar kale isku day.",
        status: status,
      });
    }

    // For non-Axios errors
    return rejectWithValue({
      message: "Cilad ayaa dhacday. Fadlan mar kale isku day.",
      status: 500,
    });
  }
});

export const signup = createAsyncThunk<
  { user: SignUpResponse["user"]; tokens: SignUpResponse["tokens"] },
  SignUpData,
  { rejectValue: AuthError }
>("auth/signup", async (signUpData, { rejectWithValue }) => {
  try {
    const authService = AuthService.getInstance();
    const response = await authService.signUp(signUpData);
    return response;
  } catch (error) {
    if (error instanceof Error) {
      // Log the error details for debugging
      console.log("Signup error:", error);

      // If the error message already contains the Somali translation for "email already exists"
      if (
        error.message.includes(
          "Emailkan aad isticmaashay ayaa horey loo isticmaalay"
        )
      ) {
        return rejectWithValue({
          message: error.message,
          status: 400,
        });
      }

      // Try to extract error from Axios error
      const axiosError = error as AxiosError<ErrorResponseData>;
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data;
        console.log("API Error Response:", errorData);

        // Handle field-specific errors (400 status)
        if (axiosError.response?.status === 400) {
          // Check for email already exists error
          if (
            errorData.email &&
            Array.isArray(errorData.email) &&
            errorData.email.some((msg: string) =>
              msg.includes("already exists")
            )
          ) {
            return rejectWithValue({
              message:
                "Emailkan aad isticmaashay ayaa horey loo isticmaalay. Fadlan isticmaal email kale ama ku soo bilow.",
              status: 400,
            });
          }

          // Check for password errors
          if (errorData.password && Array.isArray(errorData.password)) {
            const passwordErrors = errorData.password.join(", ");
            if (passwordErrors.includes("short")) {
              return rejectWithValue({
                message: "Passwordka waa inuu ahaadaa ugu yaraan 8 xaraf.",
                status: 400,
              });
            }
            return rejectWithValue({
              message: `Password: ${passwordErrors}`,
              status: 400,
            });
          }

          // Check for name errors
          if (errorData.name && Array.isArray(errorData.name)) {
            return rejectWithValue({
              message: `Magaca: ${errorData.name.join(", ")}`,
              status: 400,
            });
          }

          // If there are other field errors, combine them
          const fieldErrors = Object.entries(errorData)
            .filter((entry) => Array.isArray(entry[1]) && entry[1].length > 0)
            .map(([key, value]) => `${key}: ${(value as string[]).join(", ")}`)
            .join("; ");

          if (fieldErrors) {
            return rejectWithValue({
              message: `Cilad ayaa dhacday: ${fieldErrors}`,
              status: 400,
            });
          }
        }

        // Handle the specific error format from your API (500 status)
        if (
          errorData.error === "An error occurred during signup" &&
          errorData.detail
        ) {
          const detailStr = String(errorData.detail);

          // Check for duplicate email in the detail string
          if (
            detailStr.includes("duplicate key value") ||
            detailStr.includes("already exists") ||
            detailStr.includes("accounts_user_email_key")
          ) {
            return rejectWithValue({
              message:
                "Emailkan aad isticmaashay ayaa horey loo isticmaalay. Fadlan isticmaal email kale ama ku soo bilow.",
              status: axiosError.response?.status,
            });
          }
        }

        // Handle other specific error cases
        if (errorData.detail) {
          const detailStr = String(errorData.detail);

          if (detailStr.includes("password")) {
            return rejectWithValue({
              message: "Passwordka waa inuu ahaadaa ugu yaraan 8 xaraf.",
              status: axiosError.response?.status,
            });
          }

          if (detailStr.includes("email") && detailStr.includes("valid")) {
            return rejectWithValue({
              message: "Fadlan geli email sax ah.",
              status: axiosError.response?.status,
            });
          }
        }

        // If we have an error message but it doesn't match our specific cases
        if (errorData.error) {
          return rejectWithValue({
            message:
              "Cilad ayaa dhacday xogta la geliyay. Fadlan hubi xogtaada oo markale isku day.",
            status: axiosError.response?.status,
          });
        }
      }

      // Handle network or server errors (status 500)
      if (axiosError.response?.status === 500) {
        return rejectWithValue({
          message:
            "Server-ka ayaa la xiriira dhibaato. Fadlan mar kale isku day.",
          status: 500,
        });
      }

      // If we couldn't parse a specific error, return a generic message
      return rejectWithValue({
        message: "Cilad ayaa dhacday. Fadlan mar kale isku day.",
        status: axiosError.response?.status,
      });
    }

    // For non-Error types
    return rejectWithValue({
      message: "Cilad ayaa dhacday. Fadlan mar kale isku day.",
      status: 500,
    });
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  AuthService.signOut();
});

// Create the slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    setCredentials: (state, { payload }) => {
      state.user = payload.user;
      state.accessToken = payload.tokens.access;
      state.refreshToken = payload.tokens.refresh;
      state.isAuthenticated = true;

      // Store user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(payload.user));
      }
    },
    logoutAction: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Clear cookies
        document.cookie =
          "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = payload.user;
        state.accessToken = payload.tokens.access;
        state.refreshToken = payload.tokens.refresh;

        // Store user in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Cilad ayaa dhacday";
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = payload.user;
        state.accessToken = payload.tokens.access;
        state.refreshToken = payload.tokens.refresh;

        // Store user in localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
      })
      .addCase(signup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Cilad ayaa dhacday";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;

        // Clear localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          // Clear cookies
          document.cookie =
            "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie =
            "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
      });
  },
});

export const { resetError, setCredentials, logoutAction } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.isLoading;

export default authSlice.reducer;
