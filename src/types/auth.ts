
type UserIdentity = "explorer" | "builder" | "solver" | "mentor";

interface NextAction {
  title: string;
  action_type: string;
  priority: "normal" | "high" | "low";
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
  profile_picture?: string;
  bio?: string;
  is_premium: boolean;
  /** Backend: monthly | yearly | lifetime | challenge — use `challenge` for Challenge plan badge. */
  subscription_type?: string | null;
  is_email_verified?: boolean;
  preferences?: {
    language: string;
    theme: string;
    notifications: boolean;
  };
  name?: string;
  avatar?: string;
  role?: string;
  profile?: Profile;
  createdAt?: string;
  updatedAt?: string;
  /** When false, user must complete /welcome before accessing /post-verification-choice */
  has_completed_onboarding?: boolean;
  /** E.164 WhatsApp number from profile */
  whatsapp_number?: string;
}

export interface Profile {
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

interface Tokens {
  refresh: string;
  access: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface LoginResponse {
  user: User;
  tokens: {
    refresh: string;
    access: string;
  };
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthError {
  message: string;
  status?: number;
}

interface ApiErrorResponse {
  message?: string;
  error?: string;
  detail?: string;
  response?: {
    status?: number;
    data?: {
      message?: string;
      error?: string;
      detail?: string;
      email?: string[];
      password?: string[];
      name?: string[];
      [key: string]: string | string[] | undefined;
    };
  };
}

interface SignUpData {
  email: string;
  password?: string;
  name?: string;
  // last_name: string;
  age?: number;
  onboarding_data?: {
    goal: string;
    preferred_study_time: string;
    topic: string;
    math_level: string;
    minutes_per_day: number;
  };
  promo_code?: string;
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
  location?: string;
  country_flag?: string;
}

interface SignUpResponse {
  user: User;
  tokens: Tokens;
}
