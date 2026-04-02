import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, AuthState } from '@/types/auth';
import AuthService, { SignUpData, SignUpResponse } from '@/services/auth';
import { identifyUser } from '@/providers/PostHogProvider';

interface AuthStore extends AuthState {
    _hasHydrated: boolean;
    setUser: (user: User) => void;
    setLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    setHasHydrated: (value: boolean) => void;
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
            _hasHydrated: false,

            setHasHydrated: (value) => set({ _hasHydrated: value }),

            setUser: (user) => {
                set({ user, isAuthenticated: !!user });
                if (user) {
                    identifyUser({ id: user.id, email: user.email, name: user.name });
                }
            },

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
                        identifyUser({ id: response.user.id, email: response.user.email, name: response.user.name });
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
                        identifyUser({ id: response.user.id, email: response.user.email, name: response.user.name });
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
                if (typeof window !== 'undefined') {
                    import('@/providers/PostHogProvider').then(({ resetUser }) => resetUser());
                }
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
            /**
             * Mark rehydration complete in the same `set()` as merged state (zustand v5 runs the
             * post-rehydration callback in a later microtask, which can leave `_hasHydrated` false
             * while `isAuthenticated` is already true — e.g. community WS connects but UI stays on loading).
             */
            merge: (persistedState, currentState) => ({
                ...currentState,
                ...(persistedState as Partial<Pick<AuthStore, 'user' | 'isAuthenticated'>> | undefined ??
                    {}),
                _hasHydrated: true,
            }),
            onRehydrateStorage: () => (state, err) => {
                useAuthStore.getState().setHasHydrated(true);
            },
        }
    )
);
