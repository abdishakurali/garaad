"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { FolderDot, Home, X, Users, Menu, User, LogOut, LogIn } from "lucide-react";
import clsx from "clsx";
import StreakDisplay from "./StreakDisplay";
import { useMemo, useCallback, useState, useEffect } from "react";
import AuthService from "@/services/auth";
import useSWR from "swr";
import NotificationPanel from "./Notifications";
import Logo from "./ui/Logo";
import { API_BASE_URL } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { ProfileDropdown } from "./layout/ProfileDropdown";

const AuthDialog = dynamic(
  () => import("@/components/auth/AuthDialog").then((mod) => mod.AuthDialog),
  {
    loading: () => (
      <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-md" />
    ),
    ssr: false,
  }
);

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
    if (response.status === 401) {
      authService.logout();
      if (typeof window !== "undefined") {
        localStorage.clear();
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
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      dedupingInterval: 300000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      shouldRetryOnError: (error) => !error.message.includes("Session expired"),
    }
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = useMemo(
    () =>
      user
        ? [
          { name: "Koorsooyinka", href: "/courses", icon: FolderDot },
          { name: "5-Week Challenge", href: "/challenge", icon: Home },
          { name: "Bulshada", href: "/community", icon: Users },
        ]
        : [
          { name: "Koorsooyinka", href: "/courses", icon: FolderDot },
          { name: "5-Week Challenge", href: "/challenge", icon: Home },
          { name: "Bulshada", href: "/community-preview", icon: Users },
        ],
    [user]
  );

  const isLinkActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  const errorMessage = error
    ? "Lagu guuldaraaystay in la soo raro xogta streak-ga."
    : null;

  const handleLogout = () => {
    const authService = AuthService.getInstance();
    authService.logout();
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "py-2 glassmorphism mx-4 mt-4 rounded-2xl"
            : "py-5 bg-background/80 backdrop-blur-md"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Desktop Nav */}
          <div className="items-center gap-10 flex">
            <Link href="/" className="group flex items-center gap-2">
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
                      active
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon
                      className={clsx(
                        "w-3.5 h-3.5 transition-transform group-hover:scale-110",
                        active && "animate-pulse"
                      )}
                    />
                    <span>{name}</span>
                    {active && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop Right Side */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden lg:block">
                <StreakDisplay
                  loading={loading}
                  error={errorMessage}
                  streakData={streakData || null}
                />
              </div>
            )}

            <div className="hidden md:flex items-center gap-3">
              {user && <NotificationPanel />}
              <ThemeToggle />
              {user ? (
                <ProfileDropdown />
              ) : (
                <AuthDialog />
              )}
            </div>

            {/* Mobile: Only show essential icons + hamburger */}
            <div className="flex md:hidden items-center gap-2">
              {user && <NotificationPanel />}
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <Menu size={24} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay - Full Screen */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute inset-x-0 top-0 bg-background border-b border-border shadow-xl animate-in slide-in-from-top duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <Logo priority={false} loading="lazy" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Close menu"
              >
                <X size={24} className="text-foreground" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="px-6 py-4 space-y-1">
              {navLinks.map(({ name, href, icon: Icon }) => {
                const active = isLinkActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                      active
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="mx-6 border-t border-border" />

            {/* User Section */}
            <div className="px-6 py-4 space-y-1">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-foreground hover:bg-muted transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-base">Akoonkaaga</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-all w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-base">Ka bax</span>
                  </button>
                </>
              ) : (
                <AuthDialog
                  trigger={
                    <button
                      className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold transition-all w-full text-left"
                    >
                      <LogIn className="w-5 h-5" />
                      <span className="text-base">Soo gal</span>
                    </button>
                  }
                />
              )}
            </div>

            {/* Streak Display for logged-in users */}
            {user && streakData && (
              <div className="px-6 pb-6">
                <StreakDisplay
                  loading={loading}
                  error={errorMessage}
                  streakData={streakData}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
