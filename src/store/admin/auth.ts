import { create } from "zustand";

interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_premium: boolean;
    is_superuser: boolean;
    has_completed_onboarding: boolean;
}

interface AdminAuthState {
    user: User | null;
    /**
     * Returns the access token from the cookie set by AuthService.
     * The token itself is never stored in localStorage — only the user
     * metadata lives there to survive page refreshes.
     */
    getToken: () => string | null;
    /**
     * Backward-compatible alias: stores user metadata and cleans up legacy
     * localStorage token keys. Token params are accepted but ignored here
     * because AuthService already sets the cookies at login time.
     */
    setTokens: (token: string, refreshToken: string, user: User) => void;
    setUser: (user: User) => void;
    clearTokens: () => void;
    isAuthenticated: () => boolean;
    isSuperuser: () => boolean;
}

function readCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length !== 2) return null;
    const raw = parts.pop()?.split(";").shift() ?? null;
    if (!raw) return null;
    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
    user:
        typeof window !== "undefined"
            ? (() => {
                  try {
                      return JSON.parse(localStorage.getItem("admin_user") || "null");
                  } catch {
                      return null;
                  }
              })()
            : null,

    getToken: () => readCookie("accessToken"),

    setTokens: (_token: string, _refreshToken: string, user: User) => {
        // Token params intentionally ignored: AuthService.setTokens() already
        // wrote the cookies before this is called. We only persist user metadata.
        get().setUser(user);
    },

    setUser: (user: User) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("admin_user", JSON.stringify(user));
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_refreshToken");
        }
        set({ user });
    },

    clearTokens: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("admin_user");
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_refreshToken");
            // accessToken + refreshToken are httpOnly — only the backend can clear them
            const base = process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org";
            const apiBase = base.endsWith("/api") ? base : `${base}/api`;
            fetch(`${apiBase}/auth/logout/`, { method: "POST", credentials: "include" }).catch(() => {});
        }
        set({ user: null });
    },

    isAuthenticated: () => !!get().user,

    isSuperuser: () => get().user?.is_superuser ?? false,
}));
