"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { usePathname, useRouter } from "next/navigation";
import { FolderDot, Home, X, Users, Menu, User, LogOut, LogIn, GraduationCap } from "lucide-react";
import clsx from "clsx";
import { useMemo, useCallback, useState, useEffect } from "react";
import AuthService from "@/services/auth";
import NotificationPanel from "./Notifications";
import Logo from "./ui/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileDropdown } from "./layout/ProfileDropdown";
import ReferralModal from "./referrals/ReferralModal";

const AuthDialog = dynamic(
  () => import("@/components/auth/AuthDialog").then((mod) => mod.AuthDialog),
  {
    loading: () => (
      <div className="h-10 w-24 bg-gray-100 animate-pulse rounded-md" />
    ),
    ssr: false,
  }
);

export function Header() {
  const user = useSelector(selectCurrentUser);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

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
          { name: "Bulshada", href: "/communitypreview", icon: Users },
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
            <div className="hidden md:flex items-center gap-3">
              {user && (
                <>
                  <button
                    onClick={() => setIsReferralModalOpen(true)}
                    className="relative p-2.5 rounded-xl bg-primary/5 hover:bg-primary/10 transition-all group overflow-hidden border border-primary/10"
                    title="Share the Opportunity"
                  >
                    <GraduationCap className="w-5 h-5 text-primary group-hover:scale-110 transition-transform relative z-10" />
                    <span className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                  </button>

                  <NotificationPanel />
                </>
              )}
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
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsReferralModalOpen(true);
                    }}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10 transition-all w-full text-left border border-primary/20 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-primary/20 flex items-center justify-center shadow-sm">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black">Casuun Saaxiibbadaada</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-green-600 dark:text-green-400">Hel 20% Commission</span>
                    </div>
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  </button>

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
          </div>
        </div>
      )}

      {/* Referral Modal */}
      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </>
  );
}
