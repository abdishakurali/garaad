import { jwtDecode } from "jwt-decode";
import { User } from "@/types/auth";
import { validateEmail } from "@/lib/email-validation";
import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/constants";
import { userHasExplorerContentAccess } from "@/config/featureFlags";

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
    topic: string;
    math_level: string;
    minutes_per_day: number;
    preferred_study_time: string;
    learning_approach?: string;
    learning_goal?: string;
    project_idea?: string;
    project_description?: string | null;
    experience?: string;
    barrier?: string | null;
    wizard_progress?: Record<string, unknown>;
  };
  location?: string;
  country_flag?: string;
}

export interface OnboardingData {
  goal: string;
  learning_approach: string;
  topic: string;
  math_level: string;
  minutes_per_day: number;
  preferred_study_time: string;
  /** Welcome wizard snapshot from the server (merged on PATCH progress). */
  wizard_progress?: Record<string, unknown>;
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
  /** Server path to first lesson or dashboard (e.g. /courses/.../lessons/1/) */
  redirect_url?: string;
  tokens?: {
    refresh: string;
    access: string;
  };
}

export interface GoogleAuthPayload {
  credential: string;
  onboarding_data?: SignUpData["onboarding_data"];
  referral_code?: string;
  promo_code?: string;
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

/** Django returns either nested `tokens` (signup) or top-level `access`/`refresh` (login, Google). */
type ApiAuthPayload = {
  user?: User;
  tokens?: { access?: string; refresh?: string };
  access?: string;
  refresh?: string;
};

export class AuthService {
  private static instance: AuthService;
  private user: User | null = null;

  private constructor() {
    this.loadFromStorage();
  }

  private applySessionFromApiAuthPayload(response: ApiAuthPayload): void {
    const access =
      response.tokens?.access ??
      (typeof response.access === "string" ? response.access : undefined);
    const refresh =
      response.tokens?.refresh ??
      (typeof response.refresh === "string" ? response.refresh : undefined);
    if (access && refresh) {
      this.setTokens(access, refresh);
    }
    if (response.user) {
      this.setCurrentUser(response.user);
    }
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
    if (parts.length === 2) {
      const rawValue = parts.pop()?.split(";").shift() || null;
      try {
        return rawValue ? decodeURIComponent(rawValue) : null;
      } catch (e) {
        return rawValue; // Fallback to raw if decoding fails
      }
    }
    return null;
  }

  private setCookie(name: string, value: string, days: number = 7): void {
    if (typeof document === "undefined") return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;

    const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");
    const encodedValue = encodeURIComponent(value);

    const hostname = typeof window !== "undefined" ? window.location.hostname : "";
    const domain = hostname.includes("garaad.org") ? "; domain=.garaad.org" : "";

    if (isLocalhost || !isHttps) {
      document.cookie = `${name}=${encodedValue}; ${expires}; path=/; SameSite=Lax${domain}`;
    } else {
      document.cookie = `${name}=${encodedValue}; ${expires}; path=/; SameSite=Lax; Secure${domain}`;
    }
  }

  private deleteCookie(name: string): void {
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    const isLocalhost = host === "localhost" || host === "127.0.0.1";
    const domain = host.includes("garaad.org") ? "; domain=.garaad.org" : "";

    if (isLocalhost) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
      if (domain) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax${domain}`;
    } else {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure`;
      if (domain) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax; Secure${domain}`;
    }
  }

  /**
   * Explorer-tier access (lessons, community): paid subscriber or free Explorer when enabled.
   */
  public isPremium(): boolean {
    return userHasExplorerContentAccess(this.user);
  }

  /** True when the user has an active paid subscription record (Challenge or legacy Explorer). */
  public isPayingSubscriber(): boolean {
    return !!this.user?.is_premium;
  }

  public async signUp(data: SignUpData): Promise<SignUpResponse> {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error || "Fadlan geli email sax ah");
    }

    try {
      const response = await api.post<SignUpResponse>("/api/auth/signup/", data);
      this.applySessionFromApiAuthPayload(response as ApiAuthPayload);
      return response;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  public async signIn(data: SignInData): Promise<SignInResponse> {
    try {
      const response = await api.post<SignInResponse>("/api/auth/signin/", data);
      this.applySessionFromApiAuthPayload(response as unknown as ApiAuthPayload);
      return response;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  /** Google Identity Services JWT — optional onboarding_data matches welcome wizard signup. */
  public async signInWithGoogle(payload: GoogleAuthPayload): Promise<SignUpResponse> {
    try {
      const response = await api.post<SignUpResponse>("/api/auth/google/", payload);
      this.applySessionFromApiAuthPayload(response as unknown as ApiAuthPayload);
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
      // Store minimal info for middleware (e.g. onboarding gate) and display
      const minimalUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        is_premium: user.is_premium,
        is_superuser: user.is_superuser,
        is_email_verified: user.is_email_verified ?? false,
        // So middleware can redirect to /welcome when false
        has_completed_onboarding: user.has_completed_onboarding !== false,
      };
      this.setCookie("user", JSON.stringify(minimalUser));
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

  public async getOnboardingStatus(): Promise<{
    has_completed_onboarding: boolean;
    goal?: string;
    goal_label?: string;
  }> {
    return api.get("/api/auth/onboarding-status/");
  }

  /** Fetch current user's onboarding data (for settings/profile). */
  public async getOnboarding(): Promise<OnboardingData & { has_completed_onboarding?: boolean }> {
    return api.get("/api/auth/onboarding/");
  }

  public async completeOnboarding(
    data: OnboardingData
  ): Promise<
    OnboardingData & {
      redirect_url?: string;
      success?: boolean;
      destination_lesson_id?: number | null;
    }
  > {
    return api.post("/api/auth/complete-onboarding/", data);
  }

  /** Public: first lesson URL for onboarding topic (no auth required). */
  public async getOnboardingFirstLesson(topic: string): Promise<{
    path: string | null;
    lesson_id: number | null;
  }> {
    return api.get("/api/auth/onboarding-first-lesson/", {
      topic: topic.trim(),
    });
  }

  /** Authenticated: first lesson path for the signed-up user's enrolled track. */
  public async getFirstLessonRedirect(): Promise<string | null> {
    try {
      const res = await api.get<{ redirect_url: string }>(
        "/api/auth/first-lesson-redirect/"
      );
      const url = res?.redirect_url?.trim();
      return url && url.startsWith("/") ? url : null;
    } catch {
      return null;
    }
  }

  /** Update learning path (goal, track, level, time) from settings. Uses PATCH for partial update. */
  public async updateOnboarding(data: Partial<OnboardingData>): Promise<OnboardingData & { has_completed_onboarding?: boolean }> {
    return api.patch("/api/auth/complete-onboarding/", data);
  }

  /** Merge welcome wizard state (step, selections) without completing onboarding. */
  public async patchOnboardingWizardProgress(
    data: Record<string, unknown>
  ): Promise<{ wizard_progress: Record<string, unknown>; success?: boolean }> {
    return api.patch("/api/auth/onboarding/progress/", data);
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
