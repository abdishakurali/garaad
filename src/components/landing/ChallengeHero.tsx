"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { useAuthStore } from "@/store/useAuthStore";
import { API_BASE_URL } from "@/lib/constants";
import { orderSocialProofForDisplay, type SocialProofUserRaw } from "@/lib/social-proof";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { useFetch } from "@/composables";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const AVATAR_RING_COLORS_LIGHT = [
  "bg-emerald-600 text-white",
  "bg-violet-600 text-white",
  "bg-amber-600 text-white",
  "bg-cyan-600 text-white",
] as const;

const AVATAR_RING_COLORS_DARK = [
  "bg-emerald-600/90 text-white",
  "bg-violet-600/90 text-white",
  "bg-amber-600/90 text-white",
  "bg-cyan-600/90 text-white",
] as const;

export function ChallengeHero() {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining ?? 0;
  const cohortName = data?.active_cohort_name ?? "Challenge";
  const startForCountdown = data?.cohort_start_date ?? data?.next_cohort_start_date ?? null;

  const proofQuery = useFetch<SocialProofUserRaw[]>(
    `${API_BASE_URL}/api/public/social-proof/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
  const proofUsers = proofQuery.data;

  const statsQuery = useFetch<{ students_count: number }>(
    `${API_BASE_URL}/api/public/landing-stats/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60000 }
  );
  const totalStudents = statsQuery.data?.students_count ?? 0;

  const heroAvatars = useMemo(() => {
    const ordered = orderSocialProofForDisplay(proofUsers ?? []);
    if (ordered.length === 0) return [];
    const colors = isDark ? AVATAR_RING_COLORS_DARK : AVATAR_RING_COLORS_LIGHT;
    return ordered.slice(0, 4).map((u, i) => {
      const fn = (u.first_name || "").trim();
      const ln = (u.last_name || "").trim();
      const initials = `${fn[0] || ""}${ln[0] || ""}`.toUpperCase() || (fn[0] || "?").toUpperCase();
      const src = u.profile_picture_url ? getAbsoluteImageUrl(u.profile_picture_url, "") : "";
      return { src, initials, alt: `${fn} ${ln}`.trim(), ringClass: colors[i % colors.length] };
    });
  }, [proofUsers, isDark]);

  if (!mounted) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
        <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-20 md:py-24 lg:px-8">
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-300">
              <Sparkles className="h-3 w-3" />
              3 bilood · lacag celin ah
            </span>
          </div>
          <div className="h-[400px] animate-pulse rounded-lg bg-zinc-900/50" />
        </div>
      </section>
    );
  }

  const primaryHref = "/subscribe?plan=challenge";

  const scrollToStory = () => {
    const el = document.getElementById("our-story");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={cn(
      "relative min-h-screen overflow-hidden",
      isDark
        ? "bg-zinc-950 text-zinc-100"
        : "bg-gradient-to-b from-white via-slate-50 to-white text-slate-900"
    )}>
      {/* Background effects - subtle for both modes */}
      <div className="absolute inset-0" aria-hidden>
        {isDark ? (
          <>
            <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-violet-600/8 blur-[150px]" />
            <div className="absolute bottom-0 right-0 h-[400px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-violet-500/5 blur-[100px]" />
          </>
        ) : (
          <>
            <div className="absolute left-1/4 top-0 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-violet-200/50 blur-[120px]" />
            <div className="absolute bottom-0 right-0 h-[300px] w-[400px] translate-x-1/4 translate-y-1/4 rounded-full bg-violet-100/40 blur-[80px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
          </>
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-20 md:py-24 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 sm:mb-8">
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
            isDark
              ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
              : "border-violet-200 bg-violet-50 text-violet-700"
          )}>
            <Sparkles className="h-3 w-3" />
            3 bilood · lacag celin ah
          </span>
        </div>

        <h1 className="mx-auto max-w-3xl text-balance text-center text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Laga soo bilaabo{" "}
          <span className={cn(
            "bg-clip-text text-transparent bg-gradient-to-r",
            isDark
              ? "from-violet-400 to-violet-300"
              : "from-violet-600 to-violet-500"
          )}>
            Eber
          </span>{" "}
          ilaa{" "}
          <span className="relative inline-block">
            Founder
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 100 6"
              preserveAspectRatio="none"
            >
              <path
                d="M0 3 L 70 3 Q 85 3 100 3"
                fill="none"
                stroke={isDark ? "#a78bfa" : "#7c3aed"}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        <p className={cn(
          "mx-auto mt-4 max-w-xl text-center text-lg leading-relaxed sm:mt-6",
          isDark ? "text-zinc-400" : "text-slate-500"
        )}>
          Dhis mashruucaaga SaaS, baro xirfadaha tech, oo hel shaqo{" "}
          <span className={isDark ? "text-zinc-200" : "text-slate-700"}>3 bilood gudahood</span>. Khibrad hore looma baahna.
        </p>

        {mounted && heroAvatars.length > 0 && (
          <div className={cn(
            "mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border px-4 py-2",
            isDark
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-white shadow-sm"
          )}>
            <div className="flex items-center -space-x-2">
              {heroAvatars.map((a, idx) => (
                <div
                  key={`${a.alt}-${idx}`}
                  className={cn(
                    "relative h-7 w-7 shrink-0 overflow-hidden rounded-full border-2",
                    isDark ? "border-zinc-900" : "border-white",
                    a.ringClass
                  )}
                  title={a.alt}
                >
                  {a.src ? (
                    <Image src={a.src} alt={a.alt} fill className="object-cover" sizes="28px" unoptimized />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] font-bold" aria-hidden>
                      {a.initials}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <span className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
              <span className={cn("font-semibold", isDark ? "text-zinc-200" : "text-slate-700")}>
                {totalStudents}+
              </span> Developer baranaya
            </span>
          </div>
        )}

        {/* CTA Row - Flex on desktop, stacked on mobile */}
        <div className="mx-auto mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href={primaryHref}
            className={cn(
              "order-1 flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all hover:shadow-xl sm:order-none sm:px-8 sm:py-4 sm:text-base",
              isDark
                ? "bg-white text-zinc-900 hover:bg-zinc-100 hover:shadow-violet-500/20"
                : "bg-violet-600 text-white hover:bg-violet-700 hover:shadow-violet-500/30"
            )}
          >
            Ku biir Challenge-ka
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <button
            onClick={scrollToStory}
            className={cn(
              "order-2 text-sm font-medium underline-offset-4 transition-colors hover:underline sm:order-none",
              isDark ? "text-zinc-500 hover:text-zinc-300" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Macluumaad dheeri ah ↓
          </button>
        </div>

        {/* Scarcity Row */}
        <div className="mx-auto mt-8 flex flex-col items-center gap-3 sm:mt-10">
          <CountdownTimer
            targetDate={startForCountdown}
            label="Kooxdu waxey bilaabaysaa:"
          />
        </div>

        {/* Video */}
        <div className="mx-auto mt-10 w-full max-w-2xl sm:mt-12">
          <Link
            href={primaryHref}
            className="group relative block overflow-hidden rounded-xl border border-white/10 bg-black"
          >
            <div className="relative w-full" style={{ padding: "56.25% 0 0 0" }}>
              <iframe
                src="https://player.vimeo.com/video/1152611300?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&controls=1&background=0"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                title="Garaad SaaS Challenge"
                loading="lazy"
              />
            </div>
          </Link>
        </div>

        <div className="mx-auto mt-8 text-center sm:mt-10">
          <p className={cn("text-sm", isDark ? "text-zinc-500" : "text-slate-500")}>
            Hada ma hubtaa?{" "}
            <Link href="/welcome" className={cn(
              "font-medium underline underline-offset-4 transition-colors hover:text-violet-300",
              isDark ? "text-violet-400" : "text-violet-600"
            )}>
              Ku bilow bilaash
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
