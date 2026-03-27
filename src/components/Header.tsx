"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { X, Menu, User, LogOut, LogIn } from "lucide-react";
import clsx from "clsx";
import { useMemo, useCallback, useState, useEffect } from "react";
import AuthService from "@/services/auth";
import NotificationPanel from "./Notifications";
import Logo from "./ui/Logo";
import { ProfileDropdown } from "./layout/ProfileDropdown";
import StreakDisplay from "./StreakDisplay";
import { useGamificationData } from "@/hooks/useGamificationData";

export function Header() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { streak, isLoading: streakLoading, hasError: streakError } = useGamificationData();

  useEffect(() => {
    setMounted(true);
  }, []);

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
          { name: "Koorsooyinka", href: "/courses" },
          { name: "Challenge", href: "/challenge" },
          { name: "Bulshada", href: "/community" },
          { name: "Blog", href: "/blog" },
          { name: "Launchpad", href: "/launchpad" },
        ]
        : [
          { name: "Koorsooyinka", href: "/courses" },
          { name: "Challenge", href: "/challenge" },
          { name: "Bulshada", href: "/communitypreview" },
          { name: "Blog", href: "/blog" },
          { name: "Launchpad", href: "/launchpad" },
        ],
    [user]
  );

  const isLinkActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  const handleLogout = () => {
    const authService = AuthService.getInstance();
    authService.logout();
    if (typeof window !== "undefined") {
      localStorage.clear();
      router.push("/courses");
    }
  };

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 transition-all duration-300",
          isScrolled
            ? "py-2 glassmorphism mx-3 mt-2 rounded-xl bg-white/90 dark:bg-black/80 border border-black/5 dark:border-white/10"
            : "py-3 bg-white dark:bg-black/95 backdrop-blur-md border-b border-black/5 dark:border-white/5"
        )}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 min-h-14 sm:min-h-16 h-14 sm:h-16 flex items-center gap-2 sm:gap-3 w-full">
          {/* Left: logo */}
          <div className="shrink-0 flex justify-start items-center">
            <Link
              href="/"
              className="group flex items-center shrink-0 py-0.5 pr-1 -ml-0.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              aria-label="Garaad home"
            >
              <Logo priority={true} loading="eager" />
            </Link>
          </div>

          {/* Center: nav (desktop) */}
          <nav
            className="hidden md:flex flex-1 min-w-0 items-center justify-center gap-0.5 lg:gap-1 px-1 overflow-x-auto overscroll-x-contain scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Main"
          >
            {navLinks.map(({ name, href }) => {
              const active = isLinkActive(href);
              const showCoursesFree = href === "/courses";
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "group font-display font-medium tracking-tight transition-all duration-200 shrink-0",
                    "text-[11px] lg:text-xs xl:text-sm py-2 px-1.5 lg:px-2 xl:px-2.5 rounded-md whitespace-nowrap",
                    active
                      ? "text-primary bg-primary/10 dark:bg-primary/15"
                      : "text-slate-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  <span className="relative inline-flex items-center gap-0.5 lg:gap-1">
                    {name}
                    {showCoursesFree && (
                      <span
                        className="rounded bg-emerald-500/15 px-1 py-px text-[8px] lg:text-[9px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400"
                        title="Bilaash"
                      >
                        Bilaash
                      </span>
                    )}
                    <span
                      className={clsx(
                        "absolute -bottom-0.5 left-0 h-px bg-primary transition-all duration-200 rounded-full",
                        active ? "w-full" : "w-0 group-hover:w-full"
                      )}
                    />
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right: actions */}
          <div className="shrink-0 flex items-center justify-end gap-1 sm:gap-1.5 md:gap-2 min-w-0">
            {/* Streak — desktop only, logged-in users */}
            {mounted && user && (
              <div className="hidden lg:block scale-90 origin-right shrink-0">
                <StreakDisplay
                  loading={streakLoading}
                  error={streakError ? "Xogtii waa la soo rari waayey — fadlan mar kale isku day." : null}
                  streakData={streak || null}
                />
              </div>
            )}

            {/* Desktop: notifications + profile/login */}
            <div className="hidden md:flex items-center gap-1 md:gap-1.5 shrink-0">
              {mounted && user && <NotificationPanel />}
              {mounted && user ? (
                <ProfileDropdown />
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Soo gal
                </Link>
              )}
            </div>

            {/* Mobile: notifications + hamburger */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              {mounted && user && <NotificationPanel />}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Open menu"
              >
                <Menu size={22} className="text-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute inset-x-0 top-0 bg-white dark:bg-black/95 border-b border-black/10 dark:border-white/10 shadow-xl animate-in slide-in-from-bottom duration-300 md:animate-in md:slide-in-from-top">
            <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 dark:border-white/10">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 -ml-1 rounded-lg active:opacity-80"
                aria-label="Garaad home"
              >
                <Logo priority={false} loading="lazy" />
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} className="text-slate-800 dark:text-white" />
              </button>
            </div>

            <nav className="px-4 py-3 space-y-0.5">
              {navLinks.map(({ name, href }) => {
                const active = isLinkActive(href);
                const showCoursesFree = href === "/courses";
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      "font-display text-sm font-medium tracking-tight",
                      "flex items-center justify-center px-4 py-2.5 rounded-lg transition-all text-center",
                      active
                        ? "bg-primary/10 dark:bg-primary/20 text-primary"
                        : "text-slate-600 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {name}
                      {showCoursesFree && (
                        <span
                          className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-400"
                          title="Bilaash"
                        >
                          Bilaash
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mx-6 border-t border-black/10 dark:border-white/10" />

            <div className="px-6 py-4 space-y-1">
              {mounted && user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    <User className="w-4 h-4" />
                    <span className="text-base">Akoonkaaga</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-base">Ka bax</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-4 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold transition-all w-full text-left"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="text-base">Soo gal</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
