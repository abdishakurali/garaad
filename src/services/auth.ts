import axios from "axios";
import { jwtDecode } from "jwt-decode";

export interface SignUpData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  onboarding_data?: {
    goal: string;
    learning_approach: string;
    topic: string;
    math_level: string;
    minutes_per_day: number;
  };
  profile?: {
    qabiil: string;
    laan: string;
  };
}

export interface SignUpResponse {
  message?: string;
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
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_premium: boolean;
    has_completed_onboarding: boolean;
    subscription_status: "premium" | "basic";
    profile: {
      qabiil: string;
      laan: string;
    };
  };
  token: string;
  tokens?: {
    refresh: string;
    access: string;
  };
}

interface JWTPayload {
  exp: number;
  iat: number;
  user_id: number;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private baseURL: string =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  private refreshTimeout: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  private constructor() {
    // Initialize tokens from localStorage if they exist
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("accessToken");
      this.refreshToken = localStorage.getItem("refreshToken");
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
    const token = localStorage.getItem("accessToken");

    if (!token) {
      return null;
    }

    if (this.isTokenExpired(token)) {
      try {
        return await this.refreshAccessToken();
      } catch (error) {
        console.error("Failed to refresh token:", error);
        this.logout();
        return null;
      }
    }

    return token;
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
        {
          ...data,
          username: `${data.first_name.toLowerCase()}_${data.last_name.toLowerCase()}`,
          name: `${data.first_name} ${data.last_name}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Signup response:", response.data);

      // Store token and user data
      if (response.data.tokens?.access) {
        console.log("Attempting to store token from signup response");
        const { access, refresh } = response.data.tokens;

        this.setTokens(access, refresh);
        this.setCurrentUser(response.data.user);

        return response.data;
      } else {
        console.error("No token received in signup response");
        throw new Error("No token received from server");
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      // Handle Axios error
      if (error.response) {
        const errorData = error.response.data;
        let errorMessage = "Khalad ayaa dhacay markii la sameeyay akoonka";

        // Handle specific error cases
        if (errorData.email) {
          if (Array.isArray(errorData.email)) {
            const emailError = errorData.email[0];
            if (emailError === "Enter a valid email address.") {
              errorMessage = "Fadlan geli email sax ah";
            } else if (emailError === "User with this email already exists.") {
              errorMessage = "Email-kan horey ayaa loo isticmaalaa";
            }
          }
        } else if (errorData.password) {
          if (Array.isArray(errorData.password)) {
            const passwordError = errorData.password[0];
            if (
              passwordError === "Password must be at least 8 characters long"
            ) {
              errorMessage = "Password-ka waa inuu ahaadaa ugu yaraan 8 xaraf";
            }
          }
        } else if (errorData.username) {
          if (Array.isArray(errorData.username)) {
            const usernameError = errorData.username[0];
            if (usernameError === "Username already exists") {
              errorMessage = "Magaca isticmaalaha horey ayaa loo isticmaalaa";
            }
          }
        } else if (errorData.name) {
          if (Array.isArray(errorData.name)) {
            const nameError = errorData.name[0];
            if (nameError === "This field is required.") {
              errorMessage = "Fadlan geli magacaaga";
            } else if (nameError === "Name is too long") {
              errorMessage = "Magacaaga aad u dheer yahay";
            }
          }
        } else if (errorData.onboarding_data) {
          errorMessage = "Xogta diiwaangelinta aysan saxneyn";
        }

        throw new Error(errorMessage);
      }

      throw error;
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
      if (response.data.tokens) {
        console.log("Storing tokens from signin response");
        const { access, refresh } = response.data.tokens;

        this.setTokens(access, refresh);
        // Store user data
        this.setCurrentUser(response.data.user);

        // Verify storage
        const storedAccessToken = localStorage.getItem("accessToken");
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
    const token = localStorage.getItem("accessToken");
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
    console.log("Setting tokens:", { accessToken, refreshToken });

    try {
      // Set in localStorage
      if (typeof window !== "undefined") {
        // Store in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Store in cookies with proper attributes
        const cookieOptions = {
          path: "/",
          maxAge: 86400, // 1 day for access token
          sameSite: "Strict" as const,
          secure: true,
        };

        // Set access token cookie
        document.cookie = `accessToken=${accessToken}; path=${cookieOptions.path}; max-age=${cookieOptions.maxAge}; SameSite=${cookieOptions.sameSite}; Secure`;

        // Set refresh token cookie with longer expiry
        document.cookie = `refreshToken=${refreshToken}; path=${cookieOptions.path}; max-age=604800; SameSite=${cookieOptions.sameSite}; Secure`;

        // Verify storage
        const storedAccessToken = localStorage.getItem("accessToken");
        const storedRefreshToken = localStorage.getItem("refreshToken");
        const cookies = document.cookie
          .split(";")
          .map((cookie) => cookie.trim());

        console.log("Token storage verification:", {
          localStorage: {
            accessToken: storedAccessToken === accessToken,
            refreshToken: storedRefreshToken === refreshToken,
          },
          cookies: {
            accessToken: cookies.some((cookie) =>
              cookie.startsWith("accessToken=")
            ),
            refreshToken: cookies.some((cookie) =>
              cookie.startsWith("refreshToken=")
            ),
          },
        });

        if (!storedAccessToken || !storedRefreshToken) {
          throw new Error("Failed to store tokens in localStorage");
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

  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", token);
    }
  }

  public clearAuthData() {
    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Clear cookies with proper attributes
    document.cookie =
      "accessToken=; path=/; max-age=0; SameSite=Strict; Secure";
    document.cookie =
      "refreshToken=; path=/; max-age=0; SameSite=Strict; Secure";

    // Clear instance variables
    this.token = null;
    this.refreshToken = null;
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
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post(`${this.baseURL}/api/auth/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      localStorage.setItem("accessToken", access);

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
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
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

  initializeAuth() {
    const token = localStorage.getItem("accessToken");
    if (token) {
      this.setupRefreshTimer(token);
    }
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    if (this.refreshTimeout) {
      clearTimeout(this.refreshTimeout);
    }
    this.token = null;
    this.refreshToken = null;
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
}

export default AuthService;
