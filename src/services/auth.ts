import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/auth";
import { validateEmail } from "@/lib/email-validation";
import { API_BASE_URL } from "@/lib/constants";

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  username?: string;
  // last_name: string;
  age: number;
  referral_code?: string;
  promo_code?: string;
  onboarding_data: {
    goal: string;
    preferred_study_time: string;
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

export interface OnboardingData {
  goal: string;
  learning_approach: string;
  topic: string;
  math_level: string;
  minutes_per_day: number;
  preferred_study_time: string;
}

export interface DashboardProfile {
  id: number;
  username: string;
  community_profile: {
    total_posts: number;
  };
  profile_picture: string;
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
  tokens: {
    refresh: string;
    access: string;
  };
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

export class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private user: User | null = null;
  private baseURL: string =
    typeof window !== 'undefined' && window.location.hostname === 'localhost'
      ? "https://api.garaad.org"
      : process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org";
  private refreshTimeout: NodeJS.Timeout | null = null;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private constructor() {
    console.log("AuthService initialized with baseURL:", this.baseURL);
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
      this.token = this.getCookie("accessToken");
      this.refreshToken = this.getCookie("refreshToken");
      const userStr = this.getCookie("user");
      if (userStr) {
        try {
          this.user = JSON.parse(userStr) as User;
        } catch (error) {
          console.error("Failed to parse user from storage:", error);
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

    // Check if we're in development (localhost) or production
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalhost) {
      // For localhost: no Secure flag, use Lax for SameSite
      document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
    } else {
      // For production: use Secure and Strict
      document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict; Secure`;
    }
  }

  private deleteCookie(name: string): void {
    if (typeof document === "undefined") return;
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalhost) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    } else {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
    }
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
        console.log("Token expired, refreshing...");
        return await this.refreshAccessToken();
      } catch (error: unknown) {
        console.error("Failed to refresh token during ensureValidToken:", error);
        this.logout();
        return null;
      }
    }

    return token;
  }

  public async signUp(data: SignUpData): Promise<SignUpResponse> {
    try {
      console.log("Signing up with data:", data);

      // Validate email before sending to server
      const emailValidation = validateEmail(data.email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error || "Fadlan geli email sax ah");
      }

      const response = await axios.post<SignUpResponse>(
        `${this.baseURL}/api/auth/signup/`,
        data
      );

      console.log("SINGUP DATA", response.data);

      // Store token and user data
      if (response.data.tokens) {
        this.setTokens(
          response.data.tokens.access,
          response.data.tokens.refresh
        );
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
      if (
        response.data?.tokens?.refresh &&
        response.data?.tokens?.access &&
        response.data?.user
      ) {
        console.log("Storing tokens from signin response");
        const { access, refresh } = response.data.tokens;

        // Store tokens and user data
        this.setTokens(access, refresh);
        this.setCurrentUser(response.data.user);

        // Verify storage
        const storedAccessToken = this.getCookie("accessToken");
        const storedUser = this.getCurrentUser();

        console.log("Storage verification:", {
          tokenMatches: storedAccessToken === access,
          userStored: !!storedUser,
          isPremium: storedUser?.is_premium,
        });

        return response.data;
      }

      console.error("Invalid response data:", response.data);
      throw new Error("Invalid response data from server");
    } catch (error) {
      console.error("SignIn error:", error);
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;

        // Check for specific error message from server first
        if (responseData && typeof responseData === "object") {
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

        // Fallback for 401 if no specific message found
        if (error.response?.status === 401) {
          throw new Error(
            "Email-ka ama password-ka aad gelisay waa khalad. Fadlan hubi xogtaada oo mar kale isku day."
          );
        }
      }
    }
    throw new Error("Cilad ayaa dhacday. Fadlan mar kale isku day.");
  }


  public static async refreshAccessToken(): Promise<string> {
    const instance = AuthService.getInstance();
    return instance.refreshAccessToken();
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

  public getCurrentUser(): User | null {
    return this.user;
  }

  public isPremium(): boolean {
    return !!this.user?.is_premium;
  }

  public setCurrentUser(user: User): void {
    this.user = user;
    if (typeof window !== "undefined") {
      this.setCookie("user", JSON.stringify(user), 7);
    }
    // Also update Redux store if available
    this.updateReduxStore(user);
  }

  private async updateReduxStore(user: User): Promise<void> {
    try {
      const { store } = await import("@/store");
      const { setUser } = await import("@/store/features/authSlice");
      store.dispatch(setUser(user));
    } catch (error) {
      console.warn("Failed to update Redux store:", error);
    }
  }

  // Add method to update email verification status
  public updateEmailVerificationStatus(isVerified: boolean): void {
    if (this.user) {
      const updatedUser = {
        ...this.user,
        is_email_verified: isVerified,
      };
      this.setCurrentUser(updatedUser);
      console.log("Email verification status updated:", isVerified);
    }
  }

  // Add method to fetch and update user data from backend
  public async fetchAndUpdateUserData(token?: string): Promise<User | null> {
    try {
      const authToken = token || (await this.ensureValidToken());
      if (!authToken) {
        console.error("No valid token available for user data fetch");
        return null;
      }

      const response = await fetch(`${this.baseURL}/api/auth/user-profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch user data:", response.status);
        return null;
      }

      const userData = await response.json();
      this.setCurrentUser(userData);
      console.log("User data updated from backend:", userData);
      return userData;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
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

  public clearAuthData(): void {
    this.deleteCookie("accessToken");
    this.deleteCookie("refreshToken");
    this.deleteCookie("user");
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

      console.log(response.data);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // If we get a 401 even after refreshing, we need to log out
        this.logout();
      }
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing) {
      console.log("Refresh already in progress, subscribing to existing promise...");
      return new Promise((resolve, reject) => {
        this.refreshSubscribers.push((token) => {
          if (token) resolve(token);
          else reject(new Error("Refresh failed"));
        });
      });
    }

    const refreshToken = this.getCookie("refreshToken");
    if (!refreshToken) {
      this.logout();
      throw new Error("No refresh token available");
    }

    this.isRefreshing = true;
    console.log("Starting token refresh request...");

    try {
      // The endpoint defined in accounts/urls.py is 'refresh/' 
      // which is included under 'api/auth/' in garaad/urls.py
      const response = await axios.post(`${this.baseURL}/api/auth/refresh/`, {
        refresh: refreshToken,
      });

      const { access } = response.data;
      console.log("Token successfully refreshed");

      this.setCookie("accessToken", access, 1);
      this.token = access;

      // Set up the next auto-refresh
      this.setupRefreshTimer(access);

      // Notify all concurrent subscribers
      this.refreshSubscribers.forEach((callback) => callback(access));
      this.refreshSubscribers = [];

      return access;
    } catch (error) {
      console.error("Token refresh API call failed:", error);
      this.logout();
      this.refreshSubscribers.forEach((callback) => callback(""));
      this.refreshSubscribers = [];
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

  // Removed redundant _refreshAccessToken in favor of consolidated refreshAccessToken

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
        email?: string[];
        password?: string[];
        name?: string[];
        [key: string]: string | string[] | Record<string, string[]> | undefined;
      };

      const response = error.response?.data as ErrorResponse;
      console.log("Auth service error response:", response);

      // Handle field-specific errors
      if (response?.email && Array.isArray(response.email)) {
        const emailError = response.email[0];
        console.log("Processing email error:", emailError);

        // If it's a success/info message from our new signup_view logic, keep it
        if (emailError.includes("Premium")) {
          throw new Error(emailError);
        }

        if (emailError.includes("already exists") || emailError.includes("waa la isticmaalay")) {
          const errorMessage =
            "Emailkan horey ayaa loo diiwaangeliyay. Fadlan isticmaal email kale";
          console.log("Throwing email error:", errorMessage);
          throw new Error(errorMessage);
        } else {
          console.log("Throwing email error:", emailError);
          throw new Error(emailError);
        }
      }

      if (response?.password && Array.isArray(response.password)) {
        const passwordError = response.password[0];
        if (passwordError.includes("too short")) {
          throw new Error(
            "Furaha sirta ah waa inuu ahaadaa ugu yaraan 6 xaraf"
          );
        } else if (passwordError.includes("too common")) {
          throw new Error(
            "Furaha sirta ah waa mid aad u fudud. Fadlan isticmaal mid aad u xooggan"
          );
        } else {
          throw new Error(passwordError);
        }
      }

      if (response?.name && Array.isArray(response.name)) {
        const nameError = response.name[0];
        if (nameError.includes("required")) {
          throw new Error("Fadlan geli magacaaga");
        } else {
          throw new Error(nameError);
        }
      }

      if (response?.detail) {
        throw new Error(response.detail);
      }

      if (response?.errors) {
        const errorMessages = Object.entries(response.errors)
          .map(([field, messages]) => {
            const fieldName =
              field === "email"
                ? "Emailka"
                : field === "password"
                  ? "Furaha sirta ah"
                  : field === "name"
                    ? "Magaca"
                    : field;
            return `${fieldName}: ${messages.join(", ")}`;
          })
          .join("\n");
        throw new Error(errorMessages);
      }
    }

    throw error instanceof Error
      ? error
      : new Error("Wax khalad ah ayaa dhacay. Fadlan mar kale isku day.");
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

  // Add profile picture upload method
  public async uploadProfilePicture(file: File): Promise<User> {
    const token = await this.ensureValidToken();
    if (!token) {
      throw new Error("Lacag la'aan: Fadlan ku soo gal mar kale");
    }

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const response = await axios.post<{ user: User; message: string }>(
        `${this.baseURL}/api/auth/upload-profile-picture/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // Don't set Content-Type, let browser set it for FormData
          },
        }
      );

      // Update stored user data
      const updatedUser = response.data.user;
      this.user = updatedUser;
      this.setCookie("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error: any) {
      console.error("Profile picture upload failed:", error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Sawirka lama soo gelin karin");
    }
  }

  // Add profile picture delete method
  public async deleteProfilePicture(): Promise<User> {
    const token = await this.ensureValidToken();
    if (!token) {
      throw new Error("Lacag la'aan: Fadlan ku soo gal mar kale");
    }

    try {
      const response = await axios.delete<{ user: User; message: string }>(
        `${this.baseURL}/api/auth/delete-profile-picture/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update stored user data
      const updatedUser = response.data.user;
      this.user = updatedUser;
      this.setCookie("user", JSON.stringify(updatedUser));

      return updatedUser;
    } catch (error: any) {
      console.error("Profile picture delete failed:", error);
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error("Sawirka lama tirtiri karin");
    }
  }

  // New Profile Management APIs

  public async getDashboardProfile(): Promise<DashboardProfile> {
    return this.makeAuthenticatedRequest("get", "/api/auth/profile/");
  }

  public async getBasicProfile(): Promise<User> {
    return this.makeAuthenticatedRequest("get", "/api/auth/user-profile/");
  }

  public async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.makeAuthenticatedRequest<User>(
      "put",
      "/api/auth/update-user-profile/",
      data as Record<string, unknown>
    );
    this.setCurrentUser(response);
    return response;
  }

  // Onboarding Endpoints

  public async getOnboardingStatus(): Promise<{ has_completed_onboarding: boolean }> {
    return this.makeAuthenticatedRequest("get", "/api/auth/onboarding-status/");
  }

  public async completeOnboarding(data: OnboardingData): Promise<{ message: string }> {
    return this.makeAuthenticatedRequest("post", "/api/auth/complete-onboarding/", data as unknown as Record<string, unknown>);
  }
}

export default AuthService;
