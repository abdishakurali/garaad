// app/ClientLayout.tsx
"use client";

import { useEffect } from "react";
import AuthService from "@/services/auth";
import { useDispatch } from "react-redux";
import { setUser, logout } from "@/store/features/authSlice";
import { PushNotificationManager } from "@/components/PushNotificationManager";

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
        if (user) {
          dispatch(setUser(user));

          // Fetch initial community data
          const { fetchNotifications, fetchUserProfile } = await import("@/store/features/communitySlice");
          dispatch(fetchNotifications({ reset: true }) as any);
          dispatch(fetchUserProfile() as any);

          // Initialize Global WebSocket for real-time notifications
          const { CommunityWebSocket } = await import("@/services/communityWebSocket");
          const ws = new CommunityWebSocket();
          ws.connect(null, dispatch as any); // Connect to 'global' room
        }
      } else {
        dispatch(logout());
      }
    };

    init();
  }, [dispatch]);

  // Just render children - no Providers here
  return (
    <>
      <PushNotificationManager />
      {children}
    </>
  );
}
