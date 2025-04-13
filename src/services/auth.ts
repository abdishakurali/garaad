import axios from "axios";

// Define a custom error type
interface CustomError extends Error {
  status?: number;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  goal: string;
  learning_approach: string;
  topic: string;
  math_level: string;
  minutes_per_day: number;
}

export interface SignUpResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_premium: boolean;
    has_completed_onboarding: boolean;
    subscription_status: "premium" | "basic";
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_premium: boolean;
    has_completed_onboarding: boolean;
    subscription_status: "premium" | "basic";
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private baseURL: string =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  private constructor() {
    // Initialize tokens from localStorage if they exist
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("access_token");
      this.refreshToken = localStorage.getItem("refresh_token");
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  public async signUp(data: SignUpData): Promise<SignUpResponse> {
    try {
      console.log(
        "Sending signup request to:",
        `${this.baseURL}/api/auth/signup/`
      );
      console.log("Request body:", JSON.stringify(data, null, 2));

      const response = await axios.post<SignUpResponse>(
        `${this.baseURL}/api/auth/signup/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Signup response:", response.data);

      // Store tokens
      if (response.data.tokens) {
        this.setTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );
      }

      return response.data;
    } catch (error) {
      console.error("Signup error:", error);

      // Extract error details from Axios error
      if (axios.isAxiosError(error)) {
        console.error("Axios error details:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });

        const responseData = error.response?.data;

        // Check for email already exists error
        if (
          responseData?.email &&
          Array.isArray(responseData.email) &&
          responseData.email.some((msg: string) =>
            msg.includes("already exists")
          )
        ) {
          const customError = new Error(
            "Emailkan aad isticmaashay ayaa horey loo isticmaalay. Fadlan isticmaal email kale ama ku soo bilow."
          ) as CustomError;
          customError.status = error.response?.status;
          throw customError;
        }

        // Handle other validation errors
        if (responseData?.detail) {
          const customError = new Error(responseData.detail) as CustomError;
          customError.status = error.response?.status;
          throw customError;
        }

        // Handle other error formats
        if (responseData?.message) {
          const customError = new Error(responseData.message) as CustomError;
          customError.status = error.response?.status;
          throw customError;
        }

        if (responseData?.error) {
          const customError = new Error(responseData.error) as CustomError;
          customError.status = error.response?.status;
          throw customError;
        }
      }

      // If it's not an Axios error or doesn't have the expected format
      const genericError = new Error(
        "Cilad ayaa dhacday. Fadlan mar kale isku day."
      ) as CustomError;
      genericError.status = 500;
      throw genericError;
    }
  }

  public async signIn(data: SignInData): Promise<SignInResponse> {
    try {
      const response = await axios.post<SignInResponse>(
        `${this.baseURL}/api/auth/signin/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store tokens
      if (response.data.tokens) {
        this.setTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );
      }

      return response.data;
    } catch (error) {
      console.error("Signin error:", error);

      if (axios.isAxiosError(error)) {
        console.log("cillad ayaa dhacday", error.status);
        const status = error.response?.status;
        const responseData = error.response?.data;

        let errorMessage = "Cilad ayaa dhacday, markale isku day";

        // Handle specific status codes
        switch (status) {
          case 401:
            errorMessage =
              "Email-ka ama password-ka aad gelisay waa khalad. Fadlan hubi xogtaada oo mar kale isku day.";
            break;
          case 400:
            if (responseData && typeof responseData === "object") {
              if ("non_field_errors" in responseData) {
                const nonFieldErrors = responseData.non_field_errors;
                if (
                  Array.isArray(nonFieldErrors) &&
                  nonFieldErrors.includes("Invalid credentials")
                ) {
                  errorMessage =
                    "Email-ka ama password-ka aad gelisay waa khalad. Fadlan hubi xogtaada oo mar kale isku day.";
                } else {
                  errorMessage = String(nonFieldErrors);
                }
              } else if ("detail" in responseData) {
                errorMessage = String(responseData.detail);
              } else {
                // Handle field-specific errors
                const fieldErrors = Object.entries(responseData)
                  .map(([field, messages]) => {
                    const fieldTranslations: { [key: string]: string } = {
                      email: "Email",
                      password: "Password",
                      username: "Username",
                    };
                    const fieldName = fieldTranslations[field] || field;
                    return `${fieldName}: ${messages}`;
                  })
                  .join(", ");
                if (fieldErrors) {
                  errorMessage = fieldErrors;
                }
              }
            }
            break;
          case 404:
            errorMessage = "Account-kan lama helin";
            break;
          case 500:
            errorMessage = "Server error ayaa dhacday, fadlan markale isku day";
            break;
          default:
            if (responseData) {
              if (typeof responseData === "string") {
                errorMessage = responseData;
              } else if (typeof responseData === "object") {
                if ("detail" in responseData) {
                  errorMessage = String(responseData.detail);
                } else if ("message" in responseData) {
                  errorMessage = String(responseData.message);
                } else if ("error" in responseData) {
                  errorMessage = String(responseData.error);
                }
              }
            }
        }

        // Create a custom error with the message
        const customError = new Error(errorMessage) as CustomError;
        // Add the status to the error object
        customError.status = status;
        throw customError;
      }

      // For non-Axios errors, throw a generic error
      throw new Error("Cilad ayaa dhacday, fadlan markale isku day");
    }
  }

  public static async refreshAccessToken(): Promise<string> {
    const instance = AuthService.getInstance();
    return instance._refreshAccessToken();
  }

  public static signOut(): void {
    const instance = AuthService.getInstance();
    instance._signOut();
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem("accessToken");
  }

  public getToken(): string | null {
    return this.token;
  }

  public getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        return null;
      }
    }
    return null;
  }

  public setCurrentUser(user: SignUpResponse["user"]) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  private setTokens(accessToken: string, refreshToken: string) {
    // Store tokens in localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    // Store tokens in cookies
    document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
    document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;
  }

  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  // Add a method to clear all auth data
  public clearAuthData() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Clear cookies
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie =
      "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  // Add a method to make authenticated requests
  public async makeAuthenticatedRequest<T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${this.baseURL}${url}`,
        data,
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Token expired, try to refresh
        try {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const response = await axios.post(
              `${this.baseURL}/api/token/refresh/`,
              { refresh: refreshToken }
            );
            if (response.data.access) {
              this.setTokens(response.data.access, refreshToken);
              // Retry the original request
              return this.makeAuthenticatedRequest(method, url, data);
            }
          }
        } catch {
          // If refresh fails, clear tokens and redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/";
        }
      }
      throw error;
    }
  }

  private async _refreshAccessToken(): Promise<string> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/api/token/refresh/`,
        { refresh: this.refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newAccessToken = response.data.access;
      this.setToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refresh fails, clear tokens and force re-authentication
      this._signOut();
      throw new Error("Session expired. Please sign in again.");
    }
  }

  private _signOut(): void {
    this.token = null;
    this.refreshToken = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  }
}

export default AuthService;
