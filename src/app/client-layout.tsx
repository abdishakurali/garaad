// app/ClientLayout.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import AuthService from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useCommunityStore } from "@/store/useCommunityStore";
import communityService from "@/services/community";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser, logout, isAuthenticated } = useAuthStore();
  const { setNotifications, setUserProfile } = useCommunityStore();

  const pathname = usePathname();
  /** Avoid re-running full init on every route change (was reconnecting global WS and refetching profile each time). */
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    const authService = AuthService.getInstance();

    const init = async () => {
      const isValid = await authService.ensureValidToken();
      if (isValid) {
        const user = authService.getCurrentUser();
        if (user) {
          setUser(user);

          try {
            const profile = await communityService.profile.getUserProfile().catch(err => {
              console.warn("Failed to fetch community profile:", err);
              return null;
            });
            const notifs = await communityService.notification.getNotifications().catch(err => {
              console.warn("Failed to fetch notifications:", err);
              return { results: [] };
            });

            if (profile) setUserProfile(profile as any);
            if (notifs) setNotifications(((notifs as any).results || notifs) as any[]);
          } catch (err) {
            console.error("Failed to fetch initial community data:", err);
          }

          // Global WS for notifications outside /community (community page owns its room).
          if (!pathnameRef.current?.startsWith("/community")) {
            const { default: CommunityWebSocket } = await import("@/services/communityWebSocket");
            CommunityWebSocket.getInstance().connect(null);
          }
        }
      } else if (isAuthenticated) {
        logout();
      }
    };

    init();
  }, [setUser, logout, isAuthenticated, setNotifications, setUserProfile]);

  // Reconnect global notification WS only when navigating away from /community (not on every route).
  const prevPathnameRef = useRef<string | null>(null);
  useEffect(() => {
    if (!isAuthenticated) {
      prevPathnameRef.current = pathname ?? null;
      return;
    }
    const prev = prevPathnameRef.current;
    const cur = pathname ?? "";
    prevPathnameRef.current = cur;
    if (prev?.startsWith("/community") && !cur.startsWith("/community")) {
      void import("@/services/communityWebSocket").then(({ default: CommunityWebSocket }) => {
        CommunityWebSocket.getInstance().connect(null);
      });
    }
  }, [pathname, isAuthenticated]);

  // Just render children - no Providers here
  return (
    <>
      {children}
    </>
  );
}
