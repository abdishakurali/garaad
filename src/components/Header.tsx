"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthReady } from "@/hooks/useAuthReady";
import { usePathname, useRouter } from "next/navigation";
import { X, Menu, User, LogOut, LogIn, GraduationCap } from "lucide-react";
import clsx from "clsx";
import { useMemo, useCallback, useState, useEffect } from "react";
import AuthService from "@/services/auth";
import NotificationPanel from "./Notifications";
import Logo from "./ui/Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileDropdown } from "./layout/ProfileDropdown";
import ReferralModal from "./referrals/ReferralModal";
import StreakDisplay from "./StreakDisplay";
import { useGamificationData } from "@/hooks/useGamificationData";
import { pricingTranslations as pricingT } from "@/config/translations/pricing";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";

export function Header() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Gamification data for streak display and XP badge
  const { streak, progress: gamificationStatus, isLoading: streakLoading, hasError: streakError } = useGamificationData();
  const authReady = useAuthReady();
  const xp = (gamificationStatus ?? streak) as { xp?: number } | undefined;
  const xpValue = xp?.xp ?? 0;
  const [prevXp, setPrevXp] = useState(xpValue);
  const [xpPulse, setXpPulse] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const { data: challengeNav, loading: challengeNavLoading } = useChallengeStatus();
  const challengeSpots = challengeNav?.spots_remaining ?? 0;
  const challengeWaitlist = challengeNav?.is_waitlist_only ?? false;
  const challengeHref = challengeWaitlist ? "/subscribe?plan=challenge" : "/challenge";
  const showChallengeNavCta =
    !user ||
    !user.is_premium ||
    (user.subscription_type ?? "").toLowerCase() !== "challenge";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user && typeof window !== "undefined") {
      setIsPremium(AuthService.getInstance().isPremium());
    } else {
      setIsPremium(false);
    }
  }, [user]);

  useEffect(() => {
    if (xpValue !== prevXp && authReady) {
      setPrevXp(xpValue);
      setXpPulse(true);
      const t = setTimeout(() => setXpPulse(false), 200);
      return () => clearTimeout(t);
    }
  }, [xpValue, prevXp, authReady]);

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
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 min-h-14 sm:min-h-16 h-14 sm:h-16 dark:min-h-[4.25rem] sm:dark:min-h-[4.75rem] dark:h-auto sm:dark:h-auto flex items-center gap-2 sm:gap-3 w-full">
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

          {/* Center: nav (desktop) — flex-1 + min-w-0 avoids overlap with sides */}
          <nav
            className="hidden md:flex flex-1 min-w-0 items-center justify-center gap-0.5 lg:gap-1 px-1 overflow-x-auto overscroll-x-contain scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Main"
          >
            {navLinks.map(({ name, href }) => {
              const active = isLinkActive(href);
              const showCommunityLock = Boolean(user && href === "/community" && !isPremium);
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
                    {showCommunityLock && (
                      <span className="text-xs leading-none shrink-0" aria-hidden>
                        🔒
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
            {mounted && user && (
              <div className="hidden lg:block scale-90 origin-right shrink-0">
                <StreakDisplay
                  loading={streakLoading}
                    error={streakError ? "Xogtii waa la soo rari waayey — fadlan mar kale isku day." : null}
                  streakData={streak || null}
                />
              </div>
            )}

            <div className="hidden md:flex items-center gap-1 md:gap-1.5 shrink-0">
              {mounted && user && (
                <>
                  <button
                    onClick={() => setIsReferralModalOpen(true)}
                    className="relative p-1.5 lg:p-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-all group overflow-hidden border border-primary/10 shrink-0"
                    title="Fursadda la wadaag dadka kale"
                  >
                    <GraduationCap className="w-4 h-4 text-primary group-hover:scale-105 transition-transform relative z-10" />
                    <span className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                  </button>

                  <NotificationPanel />
                </>
              )}
              {authReady && user && isPremium && (
                <span
                  className={clsx(
                    "inline-flex items-center gap-0.5 rounded-full bg-purple-600/20 text-purple-400 px-1.5 lg:px-2 py-0.5 text-[10px] lg:text-xs font-medium border border-purple-500/30 transition-transform duration-200 shrink-0",
                    xpPulse && "motion-safe:scale-110"
                  )}
                  title={`${xpValue} XP`}
                >
                  <span aria-hidden>⚡</span>
                  <span className="hidden lg:inline">{xpValue} XP</span>
                </span>
              )}
              {mounted && showChallengeNavCta && (
                challengeNavLoading && !challengeNav ? (
                  <Link
                    href="/challenge"
                    className="hidden md:inline-flex items-center gap-1 text-[10px] lg:text-xs font-bold px-2 lg:px-3 py-1.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 shadow-sm shadow-violet-500/25 transition-colors shrink-0"
                  >
                    Challenge →
                  </Link>
                ) : (
                  <Link
                    href={challengeHref}
                    className={clsx(
                      "hidden md:inline-flex items-center justify-center gap-1 text-[10px] lg:text-xs font-bold px-2 lg:px-3 py-1.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 shadow-sm shadow-violet-500/25 transition-colors shrink-0 max-w-[9.5rem] lg:max-w-none truncate",
                      !challengeWaitlist && challengeSpots <= 3 && "relative pl-2.5 lg:pl-3"
                    )}
                    title={challengeWaitlist ? "Liiska sugitaanka" : `Challenge ${challengeSpots} boos`}
                  >
                    {!challengeWaitlist && challengeSpots <= 3 && (
                      <span
                        className="absolute left-1 lg:left-1.5 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-red-500 motion-safe:animate-pulse"
                        aria-hidden
                      />
                    )}
                    <span className="truncate">
                      {challengeWaitlist ? "Liiska sugitaanka" : `Challenge ${challengeSpots} boos`}
                    </span>
                  </Link>
                )
              )}
               
              <ThemeToggle />
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

            {/* Mobile: Only show essential icons + hamburger */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              {mounted && user && <NotificationPanel />}
              {mounted && showChallengeNavCta && (
                challengeNavLoading && !challengeNav ? (
                  <Link
                    href="/challenge"
                    className="text-[10px] font-bold px-2 py-1 rounded-full bg-violet-600 text-white shrink-0 shadow-sm shadow-violet-500/25"
                  >
                    Challenge →
                  </Link>
                ) : (
                  <Link
                    href={challengeHref}
                    className={clsx(
                      "text-[10px] font-bold px-2 py-1 rounded-full bg-violet-600 text-white shrink-0 shadow-sm shadow-violet-500/25 max-w-[9rem] truncate",
                      !challengeWaitlist && challengeSpots <= 3 && "ring-2 ring-red-500/60"
                    )}
                  >
                    {challengeWaitlist ? "Liiska sugitaanka →" : `${challengeSpots} boos →`}
                  </Link>
                )
              )}
               
              {authReady && user && isPremium && (
                <span
                  className={clsx(
                    "inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-600/20 text-purple-400 border border-purple-500/30 transition-transform duration-200",
                    xpPulse && "motion-safe:scale-110"
                  )}
                  title={`${xpValue} XP`}
                >
                  ⚡
                </span>
              )}
              <ThemeToggle />
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

      {/* Mobile Menu Overlay - Full Screen */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="absolute inset-x-0 top-0 bg-white dark:bg-black/95 border-b border-black/10 dark:border-white/10 shadow-xl animate-in slide-in-from-bottom duration-300 md:animate-in md:slide-in-from-top">
            {/* Header */}
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

            {/* Navigation Links */}
            <nav className="px-4 py-3 space-y-0.5">
              {navLinks.map(({ name, href }) => {
                const active = isLinkActive(href);
                const showCommunityLock = Boolean(user && href === "/community" && !isPremium);
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
                      {showCommunityLock && (
                        <span className="text-xs leading-none shrink-0" aria-hidden>
                          🔒
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="mx-6 border-t border-black/10 dark:border-white/10" />

            {/* User Section */}
            <div className="px-6 py-4 space-y-1">
              {mounted && user ? (
                <>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsReferralModalOpen(true);
                    }}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 transition-all w-full text-left border border-primary/30 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-sm">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black">Casuun Saaxiibbadaada</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-green-400">Casuun saaxiibada</span>
                    </div>
                    <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                  </button>

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

      {/* Referral Modal */}
      <ReferralModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />
    </>
  );
}
