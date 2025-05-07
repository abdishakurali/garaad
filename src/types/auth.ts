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
  name?: string;
  avatar?: string;
  role?: string;
  profile?: Profile;
  createdAt?: string;
  updatedAt?: string;
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

export interface Tokens {
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

export interface LoginResponse {
  user: User;
  tokens: {
    refresh: string;
    access: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface ApiErrorResponse {
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

export interface SignUpData {
  email: string;
  password: string;
  name: string;
  // last_name: string;
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

export interface SignUpResponse {
  user: User;
  tokens: Tokens;
}
