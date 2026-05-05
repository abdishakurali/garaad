"use client";

import { useEffect } from "react";
import AuthService from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { setUser, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const authService = AuthService.getInstance();

    const init = async () => {
      const isValid = await authService.ensureValidToken();
      if (isValid) {
        const user = authService.getCurrentUser();
        if (user) {
          setUser(user);
        }
      } else if (isAuthenticated) {
        logout();
      }
    };

    init();
  }, [setUser, logout, isAuthenticated]);

  return <>{children}</>;
}
