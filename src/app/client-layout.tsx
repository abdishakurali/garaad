// app/ClientLayout.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
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

  const pathname = usePathname();

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
          // Skip if on community page, as that page handles its own connection logic
          if (!pathname?.startsWith('/community')) {
            const { CommunityWebSocket } = await import("@/services/communityWebSocket");
            CommunityWebSocket.getInstance().connect(null, dispatch as any); // Connect to 'global' room
          }
        }
      } else {
        dispatch(logout());
      }
    };

    init();
  }, [dispatch, pathname]);

  // Just render children - no Providers here
  return (
    <>
      <PushNotificationManager />
      {children}
    </>
  );
}
