// app/ClientLayout.tsx
"use client";

import { useEffect } from "react";
import AuthService from "@/services/auth";
import { useDispatch } from "react-redux";
import { setUser, logout } from "@/store/features/authSlice";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const authService = AuthService.getInstance();

    const init = async () => {
      const isValid = await authService.ensureValidToken();
      if (isValid) {
        const user = authService.getCurrentUser();
        if (user) dispatch(setUser(user));
      } else {
        dispatch(logout());
      }
    };

    init();
  }, [dispatch]);

  // Just render children - no Providers here
  return <>{children}</>;
}
