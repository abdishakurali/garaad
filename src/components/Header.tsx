"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
// Removed static import for AuthDialog
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { ProfileDropdown } from "./layout/ProfileDropdown";
import { usePathname } from "next/navigation";
import { FolderDot, Home, ExternalLink, X, Loader2, Users, Menu } from "lucide-react";
import clsx from "clsx";
import StreakDisplay from "./StreakDisplay";
import { useMemo, useCallback, useState, useEffect } from "react";
import AuthService from "@/services/auth";
import useSWR from "swr";
import NotificationPanel from "./Notifications";
import Logo from "./ui/Logo";
import { API_BASE_URL } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // SWR hook for streak data with caching and automatic revalidation
  const {
    data: streakData,
    error,
    isLoading: loading,
  } = useSWR<StreakData>(
    user ? `${API_BASE_URL}/api/streaks/` : null,
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

  // Close mobile menu on pathname change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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


      <header className={clsx(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled ? "py-2 glassmorphism mx-4 mt-4 rounded-2xl" : "py-5 bg-background/80 backdrop-blur-md"
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
              <div className="hidden lg:block">
                <StreakDisplay
                  loading={loading}
                  error={errorMessage}
                  streakData={streakData || null}
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              {user && <NotificationPanel />}
              <ThemeToggle />
              <div className="hidden sm:block">
                {user ? <ProfileDropdown /> : <AuthDialog />}
              </div>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-500 hover:text-black transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={clsx(
          "md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 transform",
          isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
        )}>
          <div className="flex flex-col items-center justify-center h-full gap-8 p-6">
            {navLinks.map(({ name, href, icon: Icon }) => {
              const active = isLinkActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex flex-col items-center gap-3 text-2xl font-black transition-all",
                    active ? "text-primary scale-110" : "text-gray-400 hover:text-black"
                  )}
                >
                  {Icon && <Icon className={clsx("w-8 h-8", active && "animate-pulse")} />}
                  <span>{name}</span>
                </Link>
              );
            })}

            <div className="mt-8 pt-8 border-t border-gray-100 w-full flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                {user ? <ProfileDropdown /> : <AuthDialog />}
              </div>
              {user && (
                <StreakDisplay
                  loading={loading}
                  error={errorMessage}
                  streakData={streakData || null}
                />
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
