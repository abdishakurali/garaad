"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
// Removed static import for AuthDialog
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { ProfileDropdown } from "./layout/ProfileDropdown";
import { usePathname } from "next/navigation";
import { FolderDot, Home, ExternalLink, X, Loader2, Users } from "lucide-react";
import clsx from "clsx";
import StreakDisplay from "./StreakDisplay";
import { useMemo, useCallback, useState, useEffect } from "react";
import AuthService from "@/services/auth";
import useSWR from "swr";
import NotificationPanel from "./Notifications";
import Logo from "./ui/Logo";

const AuthDialog = dynamic(() => import("@/components/auth/AuthDialog").then(mod => mod.AuthDialog), {
  loading: () => <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-md" />,
  ssr: false
});

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
    // Handle 401 Unauthorized error
    if (response.status === 401) {
      console.log(
        "401 Unauthorized - clearing session and redirecting to home"
      );

      // Clear all cookies and localStorage
      authService.logout();

      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      // Redirect to home page
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }

      throw new Error("Session expired. Please log in again.");
    }

    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export function Header() {
  const user = useSelector(selectCurrentUser);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // SWR hook for streak data with caching and automatic revalidation
  const {
    data: streakData,
    error,
    isLoading: loading,
  } = useSWR<StreakData>(
    user ? `${process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org"}/api/streaks/` : null,
    streakFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      shouldRetryOnError: (error) => {
        // Don't retry on 401 errors since we're handling the redirect
        return !error.message.includes("Session expired");
      },
      onSuccess: (data) => {
        console.log("Streak data loaded:", data);
        console.log("Username:", data.username);
      },
      onError: (err) => {
        console.error("Error fetching streak data:", err);
      },
    }
  );

  // Add scroll listener
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 10);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Memoized navigation links to prevent unnecessary re-renders
  const navLinks = useMemo(
    () =>
      user
        ? [
          { name: "Guriga", href: "/home", icon: Home },
          { name: "Koorsooyinka", href: "/courses", icon: FolderDot },
          { name: "Bulshada", href: "/community", icon: Users },
        ]
        : [{ name: "Guriga", href: "/", icon: Home }],
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

  return (
    <>
      {/* SaaS Challenge Alert Banner */}
      {showAlert && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">
                    Ku biir 5 toddobaadka SaaS challenge-ka
                  </span>
                  <Link
                    href="https://saas.garaad.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 text-white hover:text-blue-100 transition-colors duration-200 underline"
                  >
                    <span>saas.garaad.org</span>
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <button
                onClick={() => setShowAlert(false)}
                className="flex-shrink-0 text-white hover:text-blue-100 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={clsx(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "py-2 glassmorphism mx-4 mt-4 rounded-2xl" : "py-5 bg-white"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="items-center gap-10 flex">
            <Link
              href="/"
              className="group flex items-center gap-2"
            >
              <Logo priority={true} loading="eager" />
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(({ name, href, icon: Icon }) => {
                const active = isLinkActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "group relative flex items-center gap-2 text-xs font-bold transition-colors",
                      active ? "text-primary" : "text-gray-500 hover:text-black"
                    )}
                  >
                    {Icon && <Icon className={clsx("w-3.5 h-3.5 transition-transform group-hover:scale-110", active && "animate-pulse")} />}
                    <span>{name}</span>
                    {active && (
                      <div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full transition-all"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {user && (
              <div className="hidden sm:block">
                <StreakDisplay
                  loading={loading}
                  error={errorMessage}
                  streakData={streakData || null}
                />
              </div>
            )}

            {user && <NotificationPanel />}

            <div className="flex items-center gap-3">
              {user ? <ProfileDropdown /> : <AuthDialog />}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
