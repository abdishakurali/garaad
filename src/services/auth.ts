import axios from "axios";

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
    const token = localStorage.getItem("access_token");
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

      // Store tokens and user data
      if (response.data.tokens) {
        this.setTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );
        // Store user data
        this.setCurrentUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error("Signup error:", error);

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
          throw new Error(
            "Emailkan aad isticmaashay ayaa horey loo isticmaalay. Fadlan isticmaal email kale ama ku soo bilow."
          );
        }

        // Handle other validation errors
        if (responseData?.detail) {
          throw new Error(responseData.detail);
        }

        // Handle other error formats
        if (responseData?.message) {
          throw new Error(responseData.message);
        }

        if (responseData?.error) {
          throw new Error(responseData.error);
        }
      }

      // Generic error
      throw new Error("Cilad ayaa dhacday. Fadlan mar kale isku day.");
    }
  }

  public async signIn(data: SignInData): Promise<SignInResponse> {
    try {
      console.log("Attempting to sign in with:", { email: data.email });
      console.log("API URL:", `${this.baseURL}/api/auth/signin/`);

      const response = await axios.post<SignInResponse>(
        `${this.baseURL}/api/auth/signin/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Sign in successful:", { userId: response.data.user.id });

      // Store tokens and user data
      if (response.data.tokens) {
        this.setTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );
        // Store user data
        this.setCurrentUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      console.error("Signin error details:", {
        error,
        response: axios.isAxiosError(error) ? error.response?.data : undefined,
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
      });

      if (axios.isAxiosError(error)) {
        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          throw new Error(
            "Email-ka ama password-ka aad gelisay waa khalad. Fadlan hubi xogtaada oo mar kale isku day."
          );
        }

        // Handle other status codes
        if (error.response?.data) {
          const data = error.response.data;
          if (typeof data === "object" && data !== null) {
            // Check for various error message formats
            const message =
              data.detail ||
              data.message ||
              data.error ||
              (Array.isArray(data.non_field_errors)
                ? data.non_field_errors[0]
                : null);

            if (message) {
              throw new Error(message);
            }
          }
        }
      }

      // Generic error
      throw new Error("Cilad ayaa dhacday. Fadlan mar kale isku day.");
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
    const token = localStorage.getItem("access_token");
    const user = this.getCurrentUser();
    return !!token && !!user;
  }

  public getToken(): string | null {
    return this.token;
  }

  public getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user;
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        this.clearAuthData(); // Clear invalid data
        return null;
      }
    }
    return null;
  }

  public setCurrentUser(user: SignUpResponse["user"]) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  private setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
    this.token = accessToken;
    this.refreshToken = refreshToken;
  }

  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
    }
  }

  public clearAuthData() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    this.token = null;
    this.refreshToken = null;

    // Clear cookies if they exist
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
        try {
          const newToken = await this.refreshTokenIfNeeded();
          // Retry the request with the new token
          const response = await axios({
            method,
            url: `${this.baseURL}${url}`,
            data,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
            },
          });
          return response.data;
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          this.clearTokens();
          throw new Error("Session expired. Please sign in again.");
        }
      }
      throw error;
    }
  }

  private async refreshTokenIfNeeded() {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/api/auth/refresh/`,
        { refresh: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.access) {
        this.setTokens(response.data.access, refreshToken);
        return response.data.access;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      this.clearTokens();
      throw error;
    }
  }

  private clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    this.token = null;
    this.refreshToken = null;
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
