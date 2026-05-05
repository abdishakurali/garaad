"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname, useRouter } from "next/navigation";
import { X, Menu, LogIn } from "lucide-react";
import clsx from "clsx";
import { useMemo, useCallback, useState, useEffect, useSyncExternalStore } from "react";
import AuthService from "@/services/auth";
import Logo from "./ui/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileDropdown } from "./layout/ProfileDropdown";

function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

const NAV_LINKS = [
  { name: "Courses", href: "/courses" },
  { name: "Mentorship", href: "/mentorship" },
  { name: "Blog", href: "/blog" },
];

export function Header() {
  const mounted = useMounted();
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setIsScrolled(window.scrollY > 8);
      handleScroll();
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const isLinkActive = useCallback(
    (href: string) => pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  const handleLogout = () => {
    AuthService.getInstance().logout();
    if (typeof window !== "undefined") {
      localStorage.clear();
      router.push("/");
    }
  };

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-md shadow-sm border-b border-black/5 dark:border-white/5"
            : "bg-white/80 dark:bg-[#0a0a0a]/80"
        )}
      >
        <div className="max-w-6xl mx-auto px-4 h-14 md:h-16 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <Logo priority={true} loading="eager" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isLinkActive(link.href)
                    ? "text-[#7c3aed] bg-[#7c3aed]/10"
                    : "text-slate-600 dark:text-slate-300 hover:text-foreground hover:bg-slate-50 dark:hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {mounted && user ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-foreground transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/subscribe"
                  className="px-4 py-2 text-sm font-bold rounded-lg bg-[#7c3aed] text-white hover:bg-[#6d28d9] transition-colors"
                >
                  Join the Challenge →
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-[100dvh] w-72 max-w-[85vw] flex-col bg-white dark:bg-[#0a0a0a] shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/10 p-4">
              <Logo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-lg hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "flex items-center min-h-[44px] px-4 py-2.5 text-base font-medium rounded-lg transition-colors",
                    isLinkActive(link.href)
                      ? "text-gold bg-gold/10"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-slate-100 dark:border-white/10 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] space-y-3">
              {mounted && user ? (
                <>
                  <div className="px-2 py-1 text-sm text-slate-500 dark:text-slate-400 truncate">
                    {user.email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full min-h-[44px] px-4 py-2.5 text-sm font-medium text-destructive rounded-lg hover:bg-destructive/10 text-left"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost w-full">
                    Log in
                  </Link>
                  <Link href="/subscribe" className="btn-gold w-full">
                    Join the Challenge →
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
