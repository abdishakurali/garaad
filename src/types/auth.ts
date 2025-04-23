export interface User {
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
  first_name: string;
  last_name: string;
}

export interface SignUpResponse {
  user: User;
  tokens: Tokens;
}
