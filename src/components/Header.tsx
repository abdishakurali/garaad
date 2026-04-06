"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthReady } from "@/hooks/useAuthReady";
import { usePathname, useRouter } from "next/navigation";
import { X, Menu, LogIn } from "lucide-react";
import clsx from "clsx";
import { useMemo, useCallback, useState, useEffect, useSyncExternalStore } from "react";
import AuthService from "@/services/auth";
import NotificationPanel from "./Notifications";
import Logo from "./ui/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileDropdown } from "./layout/ProfileDropdown";

// Hydration-safe mounted check
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function Header() {
  const mounted = useMounted();
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPremium = user ? AuthService.getInstance().isPremium() : false;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setIsScrolled(window.scrollY > 8);
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
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

  const navLinks = useMemo(() => [
    { name: "Koorsooyinka", href: "/courses" },
    { name: "Challenge", href: "/challenge" },
    { name: "Webinar", href: "/webinar" },
    { name: "Bulshada", href: user ? "/community" : "/communitypreview" },
    { name: "Blog", href: "/blog" },
  ], [user]);

  const isLinkActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  const handleLogout = () => {
    AuthService.getInstance().logout();
    if (typeof window !== "undefined") {
      localStorage.clear();
      router.push("/courses");
    }
  };

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-[#0a0a0f]/95 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/5"
            : "bg-white/80 dark:bg-[#0a0a0f]/80"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo priority={true} loading="eager" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                  isLinkActive(link.href)
                    ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-600/10"
                    : "text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-50 dark:hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {mounted && user ? (
              <ProfileDropdown />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Soo gal
              </Link>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-white dark:bg-[#0a0a0f] shadow-xl animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/10">
              <span className="font-semibold text-slate-800 dark:text-white">Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                    isLinkActive(link.href)
                      ? "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-600/10"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 dark:border-white/10">
              {mounted && user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-600/10 text-left"
                  >
                    Ka bax
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-base font-semibold rounded-lg bg-violet-600 text-white"
                >
                  <LogIn className="w-4 h-4" />
                  Soo gal
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
