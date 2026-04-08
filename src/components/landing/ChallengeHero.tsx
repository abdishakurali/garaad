"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ChallengeHero() {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";

  const { user } = useAuthStore();
  void user;
  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining ?? 0;
  const cohortName = data?.active_cohort_name ?? "Challenge";
  const startForCountdown = data?.cohort_start_date ?? data?.next_cohort_start_date ?? null;
  void loading;
  void spots;
  void cohortName;

  const socialProofInitials = ["AA", "MA", "RR", "M"] as const;
  const socialProofRingClasses = isDark
    ? ["bg-emerald-600/90", "bg-violet-600/90", "bg-amber-600/90", "bg-cyan-600/90"]
    : ["bg-emerald-600", "bg-violet-600", "bg-amber-600", "bg-cyan-600"];

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

  const primaryHref = "/welcome";

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

        <h1 className="mx-auto mt-3 max-w-3xl text-balance text-center text-4xl font-bold leading-tight tracking-tight sm:mt-4 sm:text-5xl md:text-6xl lg:text-7xl">
          Full-Stack Dev iyo{" "}
          <span className="relative inline-block">
            AI
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 100 10"
              preserveAspectRatio="none"
              aria-hidden
            >
              <path
                d="M2 5 Q 25 9 50 5 T 98 5"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="5"
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

        {mounted && (
          <div className={cn(
            "mx-auto mt-6 flex w-fit items-center gap-3 rounded-full border px-4 py-2",
            isDark
              ? "border-white/10 bg-white/5"
              : "border-slate-200 bg-white shadow-sm"
          )}>
            <div className="flex items-center -space-x-2">
              {socialProofInitials.map((initials, idx) => (
                <div
                  key={`${initials}-${idx}`}
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-bold text-white",
                    isDark ? "border-zinc-900" : "border-white",
                    socialProofRingClasses[idx % socialProofRingClasses.length]
                  )}
                  aria-hidden
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className={cn("text-sm", isDark ? "text-zinc-400" : "text-slate-500")}>
              <span className={cn("font-semibold", isDark ? "text-zinc-200" : "text-slate-700")}>
                97+
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
