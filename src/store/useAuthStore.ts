import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types/auth';
import AuthService, { SignUpData, SignUpResponse } from '@/services/auth';

interface AuthStore extends AuthState {
    setUser: (user: User) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    login: (credentials: { email: string; password: string }) => Promise<void>;
    signUp: (data: SignUpData) => Promise<SignUpResponse | void>;
    logout: () => void;
    hydrate: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user
            }),

            setLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ error }),

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await AuthService.getInstance().signIn(credentials);
                    if (response?.user) {
                        set({
                            user: response.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    }
                } catch (error: any) {
                    set({
                        error: error.message || 'Login failed',
                        isLoading: false
                    });
                    throw error;
                }
            },

            signUp: async (data) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await AuthService.getInstance().signUp(data);
                    if (response?.user) {
                        set({
                            user: response.user,
                            isAuthenticated: true,
                            isLoading: false,
                        });
                    }
                    return response;
                } catch (error: any) {
                    set({
                        error: error.message || 'Signup failed',
                        isLoading: false
                    });
                    throw error;
                }
            },

            logout: () => {
                AuthService.getInstance().logout();
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                    error: null,
                });
            },

            hydrate: () => {
                const authService = AuthService.getInstance();
                const user = authService.getCurrentUser();
                const token = authService.getToken();
                if (user && token) {
                    set({ user, isAuthenticated: true });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);
