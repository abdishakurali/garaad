import { jwtDecode } from "jwt-decode";
import { User } from "@/types/auth";
import { validateEmail } from "@/lib/email-validation";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  username?: string;
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
  token?: string;
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

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export class AuthService {
  private static instance: AuthService;
  private user: User | null = null;

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

    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";

    if (isLocalhost || !isHttps) {
      document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
    } else {
      document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Strict; Secure`;
    }
  }

  private deleteCookie(name: string): void {
    if (typeof document === "undefined") return;
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    if (isLocalhost) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
    } else {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict; Secure`;
    }
  }

  /**
   * Check if the current user has premium status
   */
  public isPremium(): boolean {
    return this.user?.is_premium || false;
  }

  public async signUp(data: SignUpData): Promise<SignUpResponse> {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error || "Fadlan geli email sax ah");
    }

    try {
      const response = await api.post<SignUpResponse>("/api/auth/signup/", data);
      if (response.tokens) {
        this.setTokens(response.tokens.access, response.tokens.refresh);
        this.setCurrentUser(response.user);
      }
      return response;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async signIn(data: SignInData): Promise<SignInResponse> {
    try {
      const response = await api.post<SignInResponse>("/api/auth/signin/", data);
      if (response.tokens) {
        this.setTokens(response.tokens.access, response.tokens.refresh);
        this.setCurrentUser(response.user);
      }
      return response;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async forgotPassword(email: string): Promise<any> {
    return api.post("/api/auth/forgot-password/", { email });
  }

  public logout(): void {
    this.deleteCookie("accessToken");
    this.deleteCookie("refreshToken");
    this.deleteCookie("user");
    this.user = null;
  }

  public setCurrentUser(user: User): void {
    this.user = user;
    if (typeof window !== "undefined") {
      this.setCookie("user", JSON.stringify(user));
    }
  }

  public getCurrentUser(): User | null {
    return this.user;
  }

  public getToken(): string | null {
    return this.getCookie("accessToken");
  }

  public isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  public setTokens(access: string, refresh: string): void {
    this.setCookie("accessToken", access, 1);
    this.setCookie("refreshToken", refresh, 7);
  }

  public async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getCookie("refreshToken");
    if (!refreshToken) return null;

    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

    try {
      const response = await fetch(
        `${cleanBaseUrl}/api/auth/refresh/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        this.setTokens(data.access, refreshToken);
        return data.access;
      }
    } catch (e) {
      console.error("Token refresh failed:", e);
    }

    return null;
  }

  public async ensureValidToken(): Promise<string | null> {
    const token = this.getToken();
    if (token) {
      try {
        const decoded = jwtDecode<JWTPayload>(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (!isExpired) return token;
      } catch (e) {
        // invalid token
      }
    }

    return await this.refreshAccessToken();
  }

  public async uploadProfilePicture(file: File): Promise<User> {
    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const data = await api.post<{ user: User }>("/api/auth/upload-profile-picture/", formData);
      this.setCurrentUser(data.user);
      return data.user;
    } catch (error: any) {
      throw new Error(error.data?.error || "Sawirka lama soo gelin karin");
    }
  }

  public async deleteProfilePicture(): Promise<User> {
    try {
      const data = await api.delete<{ user: User }>("/api/auth/delete-profile-picture/");
      this.setCurrentUser(data.user);
      return data.user;
    } catch (error: any) {
      throw new Error(error.data?.error || "Sawirka lama tirtiri karin");
    }
  }

  public async getDashboardProfile(): Promise<DashboardProfile> {
    return api.get("/api/auth/profile/");
  }

  public async getBasicProfile(): Promise<User> {
    return api.get("/api/auth/profile/");
  }

  public async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>("/api/auth/update-user-profile/", data);
    this.setCurrentUser(response);
    return response;
  }

  public async getOnboardingStatus(): Promise<{ has_completed_onboarding: boolean }> {
    return api.get("/api/auth/onboarding-status/");
  }

  public async completeOnboarding(data: OnboardingData): Promise<{ message: string }> {
    return api.post("/api/auth/complete-onboarding/", data);
  }

  /**
   * Update the email verification status of the current user locally
   */
  public updateEmailVerificationStatus(status: boolean): void {
    if (this.user) {
      this.user.is_email_verified = status;
      this.setCurrentUser(this.user);
    }
  }

  /**
   * Fetch latest user data from backend and update local profile
   */
  public async fetchAndUpdateUserData(token?: string): Promise<User | null> {
    try {
      // Use the provided token or the current one
      const effectiveToken = token || this.getToken();

      const options = effectiveToken ? {
        headers: {
          'Authorization': `Bearer ${effectiveToken}`
        }
      } : {};

      const response = await api.get<User>("/api/auth/profile/", {}, options);

      if (response) {
        this.setCurrentUser(response);
        return response;
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
    return null;
  }

  /**
   * Generic wrapper for authenticated requests
   */
  public async makeAuthenticatedRequest<T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    options: any = {}
  ): Promise<T> {
    const methodUpper = method.toUpperCase() as any;
    return api.request<T>(url, {
      ...options,
      method: methodUpper,
      body: data
    });
  }

  private handleError(error: any): never {
    const response = error.data;
    if (response) {
      if (response.detail) throw new Error(response.detail);
      if (response.error) throw new Error(response.error);
      if (response.message) throw new Error(response.message);

      // Handle Django-style field errors
      const errors = response.errors || response;
      if (typeof errors === 'object') {
        const messages = Object.entries(errors)
          .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`)
          .join("\n");
        if (messages) throw new Error(messages);
      }
    }
    throw error;
  }
}

export default AuthService;
