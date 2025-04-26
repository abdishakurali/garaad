import axios from "axios";
import { jwtDecode } from "jwt-decode";

export interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  age: number;
  onboarding_data: {
    goal: string;
    learning_approach: string;
    topic: string;
    math_level: string;
    minutes_per_day: number;
  };
  profile?: {
    bio?: string;
    avatar?: string;
    location?: string;
    website?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      github?: string;
    };
  };
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string;
  avatar_url?: string;
  bio?: string;
  preferences?: {
    language: string;
    theme: string;
    notifications: boolean;
  };
  stats?: {
    rank: number;
    points: number;
    completed: number;
  };
}

export interface SignUpResponse {
  message?: string;
  user: User;
  token: string;
  tokens?: {
    refresh: string;
    access: string;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResponse {
  message?: string;
  user: User;
  refresh: string;
  access: string;
}

interface JWTPayload {
  exp: number;
  iat: number;
  user_id: number;
}

interface AuthError {
  message?: string;
  status?: number;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

interface LoginCredentials {
  username: string;
  password: string;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;
  private baseURL: string =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  private refreshTimeout: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private loadFromStorage(): void {
    if (typeof window !== "undefined") {
      // Get token from cookie instead of localStorage
      this.token = this.getCookie("accessToken");
      this.refreshToken = this.getCookie("refreshToken");
      const userStr = this.getCookie("user");
      if (userStr) {
        try {
          this.user = JSON.parse(userStr) as User;
        } catch (error: unknown) {
          const authError = error as AuthError;
          console.error("Failed to parse user from storage:", authError);
          this.user = null;
        }
      }
    }
  }

  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  private setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict; Secure`;
  }

  private deleteCookie(name: string): void {
    if (typeof document === "undefined") return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
  }

  private getAuthHeaders() {
    const token = this.getCookie("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JWTPayload>(token);
      // Check if token expires in less than 1 minute
      return decoded.exp * 1000 <= Date.now() + 60000;
    } catch {
      return true;
    }
  }

  public async ensureValidToken(): Promise<string | null> {
    const token = this.getCookie("accessToken");

    if (!token) {
      return null;
    }

    if (this.isTokenExpired(token)) {
      try {
        return await this.refreshAccessToken();
      } catch (error: unknown) {
        const authError = error as AuthError;
        console.error("Failed to refresh token:", authError);
        this.logout();
        return null;
      }
    }

    return token;
  }

  public async signUp(data: SignUpData): Promise<SignUpResponse> {
    try {
      console.log("Signing up with data:", data);
      const response = await axios.post<SignUpResponse>(
        `${this.baseURL}/api/auth/register/`,
        data
      );

      // Store token and user data
      if (response.data.token) {
        this.setTokens(response.data.token, response.data.token);
        this.setCurrentUser(response.data.user);
      }

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  public async signIn(data: SignInData): Promise<SignInResponse> {
    try {
      console.log("SignIn attempt with data:", {
        email: data.email,
        password: data.password ? "***" : "undefined",
      });
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

      console.log("Sign in response:", response.data);

      // Store tokens and user data
      if (response.data.refresh && response.data.access) {
        console.log("Storing tokens from signin response");
        const { access, refresh } = response.data;

        this.setTokens(access, refresh);
        // Store user data
        this.setCurrentUser(response.data.user);

        // Verify storage
        const storedAccessToken = this.getCookie("accessToken");
        console.log("Token storage verification:", {
          expectedToken: access,
          storedToken: storedAccessToken,
          matches: storedAccessToken === access,
        });

        return response.data;
      } else {
        console.error("No tokens received in signin response");
        throw new Error("No tokens received from server");
      }
    } catch (error) {
      console.error("Signin error details:", {
        error,
        response: axios.isAxiosError(error) ? error.response?.data : undefined,
        status: axios.isAxiosError(error) ? error.response?.status : undefined,
        headers: axios.isAxiosError(error)
          ? error.response?.headers
          : undefined,
        config: axios.isAxiosError(error) ? error.config : undefined,
      });

      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        console.log("Error response data:", responseData);

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          throw new Error(
            "Email-ka ama password-ka aad gelisay waa khalad. Fadlan hubi xogtaada oo mar kale isku day."
          );
        }

        // Handle other status codes
        if (responseData) {
          // Check for specific error formats
          if (typeof responseData === "object") {
            const errorMessage =
              responseData.detail ||
              responseData.message ||
              responseData.error ||
              (Array.isArray(responseData.non_field_errors)
                ? responseData.non_field_errors[0]
                : null);

            if (errorMessage) {
              throw new Error(errorMessage);
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
    const token = this.getCookie("accessToken");
    const user = this.getCurrentUser();
    return !!token && !!user;
  }

  public getToken(): string | null {
    return this.getCookie("accessToken");
  }

  public getCurrentUser() {
    const userStr = this.getCookie("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user;
      } catch (e) {
        console.error("Error parsing user from cookie:", e);
        this.clearAuthData(); // Clear invalid data
        return null;
      }
    }
    return null;
  }

  public setCurrentUser(user: SignUpResponse["user"]) {
    this.setCookie("user", JSON.stringify(user), 7);
  }

  private setTokens(accessToken: string, refreshToken: string) {
    console.log("Setting tokens in cookies:", { accessToken, refreshToken });

    try {
      if (typeof window !== "undefined") {
        // Store tokens in cookies
        this.setCookie("accessToken", accessToken, 1); // 1 day for access token
        this.setCookie("refreshToken", refreshToken, 7); // 7 days for refresh token

        // Verify storage
        const storedAccessToken = this.getCookie("accessToken");
        const storedRefreshToken = this.getCookie("refreshToken");

        console.log("Token storage verification:", {
          cookies: {
            accessToken: storedAccessToken === accessToken,
            refreshToken: storedRefreshToken === refreshToken,
          },
        });

        if (!storedAccessToken || !storedRefreshToken) {
          throw new Error("Failed to store tokens in cookies");
        }
      } else {
        console.warn("window is undefined - cannot store tokens");
      }

      // Set in instance
      this.token = accessToken;
      this.refreshToken = refreshToken;
    } catch (error) {
      console.error("Error setting tokens:", error);
      throw error;
    }
  }

  public clearAuthData() {
    // Clear cookies
    this.deleteCookie("accessToken");
    this.deleteCookie("refreshToken");
    this.deleteCookie("user");

    // Clear instance variables
    this.token = null;
    this.refreshToken = null;
    this.user = null;
  }

  // Add a method to make authenticated requests
  public async makeAuthenticatedRequest<T>(
    method: "get" | "post" | "put" | "delete",
    url: string,
    data?: Record<string, unknown>
  ): Promise<T> {
    try {
      const token = await this.ensureValidToken();

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await axios({
        method,
        url: `${this.baseURL}${url}`,
        data,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // If we get a 401 even after refreshing, we need to log out
        this.logout();
      }
      throw error;
    }
  }

  private async refreshAccessToken() {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshSubscribers.push(resolve);
      });
    }

    this.isRefreshing = true;

    try {
      const refreshToken = this.getCookie("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${this.baseURL}/api/auth/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      this.setCookie("accessToken", access, 1);

      // Set up the next refresh
      this.setupRefreshTimer(access);

      // Notify subscribers
      this.refreshSubscribers.forEach((callback) => callback(access));
      this.refreshSubscribers = [];

      return access;
    } catch (error) {
      // If refresh fails, log out the user
      this.logout();
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  private setupRefreshTimer(token: string) {
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      const expiresIn = decoded.exp * 1000 - Date.now();
      // Refresh 5 minutes before expiration
      const refreshTime = Math.max(0, expiresIn - 5 * 60 * 1000);

      this.refreshTimeout = setTimeout(() => {
        this.refreshAccessToken();
      }, refreshTime);
    } catch (error) {
      console.error("Error setting up refresh timer:", error);
    }
  }

  private _signOut(): void {
    this.token = null;
    this.refreshToken = null;
    this.user = null;
    if (typeof window !== "undefined") {
      this.deleteCookie("accessToken");
      this.deleteCookie("refreshToken");
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
      this.setCookie("accessToken", newAccessToken, 1);
      return newAccessToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refresh fails, clear tokens and force re-authentication
      this._signOut();
      throw new Error("Session expired. Please sign in again.");
    }
  }

  initializeAuth() {
    const token = this.getCookie("accessToken");
    if (token) {
      this.setupRefreshTimer(token);
    }
  }

  logout() {
    this.deleteCookie("accessToken");
    this.deleteCookie("refreshToken");
    this.deleteCookie("user");
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    this.token = null;
    this.refreshToken = null;
    this.user = null;
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      type ErrorResponse = {
        detail?: string;
        errors?: Record<string, string[]>;
      };

      const response = error.response?.data as ErrorResponse;

      if (response?.detail) {
        throw new Error(response.detail);
      }

      if (response?.errors) {
        const errorMessages = Object.entries(response.errors)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        throw new Error(errorMessages);
      }
    }

    throw error instanceof Error
      ? error
      : new Error("An unknown error occurred");
  }

  public async login(
    username: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const credentials: LoginCredentials = { username, password };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        const error: AuthError = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data: AuthResponse = await response.json();
      this.setAuth(data);
      return data;
    } catch (error: unknown) {
      const authError = error as AuthError;
      throw new Error(authError.message || "Login failed");
    }
  }

  private setAuth(data: AuthResponse): void {
    this.token = data.access;
    this.refreshToken = data.refresh;
    this.user = data.user;
    if (typeof window !== "undefined") {
      this.setCookie("accessToken", data.access, 1);
      this.setCookie("refreshToken", data.refresh, 7);
      this.setCookie("user", JSON.stringify(data.user), 7);
    }
  }
}

export default AuthService;
