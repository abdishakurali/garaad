"use client";

import Link from "next/link";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { ProfileDropdown } from "./layout/ProfileDropdown";
import { usePathname } from "next/navigation";
import { FolderDot, Home } from "lucide-react";
import clsx from "clsx";
import StreakDisplay from "./StreakDisplay";
import { useMemo, useCallback } from "react";
import AuthService from "@/services/auth";
import useSWR from "swr";
import NotificationPanel from "./Notifications";
import Logo from "./ui/Logo";

interface DailyActivity {
  date: string;
  day: string;
  status: "complete" | "none";
  problems_solved: number;
  lesson_ids: number[];
  isToday: boolean;
}

interface StreakData {
  userId: string;
  username: string;
  current_streak: number;
  max_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  energy: {
    current: number;
    max: number;
    next_update: string;
  };
  dailyActivity: DailyActivity[];
  xp: number;
  daily_xp: number;
}

// SWR fetcher function with authentication
const streakFetcher = async (url: string): Promise<StreakData> => {
  const authService = AuthService.getInstance();
  const token = authService.getToken();

  if (!token) {
    throw new Error("No authentication token available");
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export function Header() {
  const user = useSelector(selectCurrentUser);
  const pathname = usePathname();

  // SWR hook for streak data with caching and automatic revalidation
  const {
    data: streakData,
    error,
    isLoading: loading,
  } = useSWR<StreakData>(
    user ? `${process.env.NEXT_PUBLIC_API_URL}/api/streaks/` : null,
    streakFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onSuccess: (data) => {
        console.log("Streak data loaded:", data);
        console.log("Username:", data.username);
      },
      onError: (err) => {
        console.error("Error fetching streak data:", err);
      },
    }
  );

  // Memoized navigation links to prevent unnecessary re-renders
  const navLinks = useMemo(
    () =>
      user
        ? [
          { name: "Guriga", href: "/home", icon: Home },
          { name: "Koorsooyinka", href: "/courses", icon: FolderDot },
        ]
        : [
          { name: "Guriga", href: "/", icon: Home },
        ],
    [user]
  );

  // Memoized function to check if a link is active
  const isLinkActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  // Convert SWR error to string for StreakDisplay component
  const errorMessage = error
    ? "Lagu guuldaraaystay in la soo raro xogta streak-ga. Fadlan mar kale isku day."
    : null;

  console.log("user:", user);
  console.log("streak:", streakData);

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="items-center gap-6 flex">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight text-black font-[fkGrotesk,Fallback] md:text-3xl md:flex"
          >
            <Logo priority={true} loading="eager" />
          </Link>

          <nav className="flex items-center gap-6 md:gap-8 lg:gap-10 h-full">
            {navLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "text-gray-600 hover:text-black transition-all duration-300 font-medium flex items-center gap-1 py-1 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full",
                  isLinkActive(href) && "text-primary after:w-full"
                )}
                style={{ alignItems: 'center', display: 'flex', height: '100%' }}
              >
                {/* icon */}
                <span className="w-4 h-4">
                  {Icon && <Icon className="w-4 h-4" />}
                </span>
                <span className="hidden md:block text-base">{name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <StreakDisplay
              loading={loading}
              error={errorMessage}
              streakData={streakData || null}
            />
          )}

          {user && <NotificationPanel />}

          {user ? <ProfileDropdown /> : <AuthDialog />}
        </div>
      </div>
    </header>
  );
}
