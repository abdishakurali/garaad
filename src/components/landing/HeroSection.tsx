"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Code2, Layers, Brain, Database, Server, BookOpen, ArrowUpRight, Cloud } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { API_BASE_URL } from "@/lib/constants";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { useFirstFreeLessonHref } from "@/hooks/useFirstFreeLessonHref";
import { orderSocialProofForDisplay, type SocialProofUserRaw } from "@/lib/social-proof";
import { useFetch } from "@/composables";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CATEGORIES_SWR_KEY = `${API_BASE_URL}/api/lms/categories/`;

const ACCENT = "#7c3aed";

interface LandingStats {
  students_count: number;
  courses_count: number;
  learners_this_month?: number;
}

const AVATAR_RING_COLORS = [
  "bg-emerald-600/90 text-white",
  "bg-violet-600/90 text-white",
  "bg-amber-600/90 text-white",
] as const;

function resolveProofAvatarUrl(url: string | null | undefined): string | null {
  const u = typeof url === "string" ? url.trim() : "";
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return getAbsoluteImageUrl(u, "");
}

function useAnimatedCount(target: number, active: boolean) {
  const [v, setV] = useState(0);
  /* eslint-disable react-hooks/set-state-in-effect -- animation frame state updates */
  useEffect(() => {
    if (!active || target <= 0) {
      setV(target);
      return;
    }
    const start = Math.max(1, Math.floor(target * 0.88));
    let frame = 0;
    const t0 = performance.now();
    const dur = 2200;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const ease = 1 - (1 - p) * (1 - p);
      setV(Math.round(start + (target - start) * ease));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  /* eslint-enable react-hooks/set-state-in-effect */
  return v;
}

const TECH_ICONS = [
  { name: "React", Icon: Code2 },
  { name: "Next.js", Icon: Layers },
  { name: "AI", Icon: Brain },
  { name: "ExpressJS", Icon: Server },
  { name: "MongoDB", Icon: Database },
  { name: "PostgreSQL", Icon: Database },
] as const;

interface HeroCourse {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  is_published: boolean;
}

type HeroCourseWithCategory = HeroCourse & { categoryId: number };

function parseCategories(data: unknown): HeroCourseWithCategory[] {
  const categories = Array.isArray(data) ? data : (data as { results?: unknown[] })?.results ?? [];
  return (categories as { id: number; courses?: HeroCourse[] }[]).flatMap((cat) =>
    (cat.courses || []).filter((c) => c.is_published).map((c) => ({ ...c, categoryId: cat.id }))
  );
}

export function HeroSection() {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!user;
  const { href: firstFreeHref } = useFirstFreeLessonHref();

  const statsQuery = useFetch<LandingStats>(`${API_BASE_URL}/api/public/landing-stats/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    fallbackData: { students_count: 0, courses_count: 0, learners_this_month: 0 },
  });
  const stats = statsQuery.data;
  const statsError = statsQuery.error;

  const proofQuery = useFetch<SocialProofUserRaw[]>(`${API_BASE_URL}/api/public/social-proof/`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  const proofUsers = proofQuery.data;

  // Only show avatars after hydration to avoid mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const heroAvatars = useMemo(() => {
    const ordered = orderSocialProofForDisplay(proofUsers ?? []);
    if (ordered.length === 0) return [];
    const colors = AVATAR_RING_COLORS;
    return ordered.slice(0, 3).map((u, i) => {
      const fn = (u.first_name || "").trim();
      const ln = (u.last_name || "").trim();
      const initials = `${fn[0] || ""}${ln[0] || ""}`.toUpperCase() || (fn[0] || "?").toUpperCase();
      const src = u.profile_picture_url ? getAbsoluteImageUrl(u.profile_picture_url, "") : "";
      return { src, initials, alt: `${fn} ${ln}`.trim(), ringClass: colors[i % colors.length] };
    });
  }, [proofUsers]);

  const studentCount = stats?.students_count ?? 0;
  const countAnimActive = Boolean(stats != null && !statsError && studentCount > 0);
  const displayCount = useAnimatedCount(studentCount, countAnimActive);
  const learnersLabel = studentCount > 0 
    ? `${displayCount}+Developer`
    : "88+ Developer";

  const categoriesQuery = useFetch<unknown>(CATEGORIES_SWR_KEY, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });
  const categoriesData = categoriesQuery.data;
  const courses = parseCategories(categoriesData ?? []);

  const aiCourse = courses.find((c) => /ai|artificial|smart|machine/i.test(c.title));
  const saasCourse = courses.find((c) => /saas|software as a service|subscription|bixi/i.test(c.title));

  return (
    <div className="min-h-screen bg-[#f8f8fc] text-slate-900 transition-colors duration-300 dark:bg-[#0a0a0f] dark:text-white">
      <section
        className="relative flex min-h-screen flex-col justify-center px-6 py-24 sm:px-10 sm:py-28 md:px-12 lg:px-16 lg:py-32"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className="absolute left-1/2 top-[38%] h-[420px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.14] blur-[100px] dark:opacity-[0.22]"
            style={{
              background: `radial-gradient(circle, ${ACCENT} 0%, transparent 68%)`,
            }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center lg:gap-20 xl:gap-24">
          <div className="hero-animate-done order-1 max-w-xl lg:order-none">
            <p className="mb-6 text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500 dark:text-[#94a3b8] sm:text-xs">
              BARO · FULL-STACK &amp; AI
            </p>
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-slate-900 dark:text-white">
              Baro full-stack dev{" "}
              <span className="text-[#7c3aed]">&amp; AI</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-600 dark:text-[#94a3b8]">
              Koox xaddidan iyo mentor-la joogto ah — hal waddo cad iyo mashruuc dhab ah, afkaaga hooyo.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/challenge"
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#7c3aed] px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-500/20 no-underline transition hover:bg-[#6d28d9]"
              >
                Ku biir Challenge-ka →
              </Link>
              <Link
                href={firstFreeHref}
                className="inline-flex min-h-[48px] items-center justify-center rounded-xl border-2 border-slate-300 bg-transparent px-7 py-3.5 text-sm font-semibold text-slate-800 no-underline transition hover:border-slate-400 hover:bg-slate-100/80 dark:border-white/20 dark:text-white dark:hover:border-white/35 dark:hover:bg-white/[0.04]"
              >
                Ku bilow Bilaash
              </Link>
            </div>

            <div
              className="mt-10 flex max-w-lg flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white/70 px-4 py-3.5 backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4 dark:border-[#1e1e2e] dark:bg-white/[0.04]"
              role="status"
              aria-live="polite"
            >
              {mounted && heroAvatars.length > 0 && (
                <div className="flex shrink-0 items-center -space-x-2" aria-label="Recent learners">
                  {heroAvatars.map((a, idx) => (
                    <div
                      key={`${a.alt}-${idx}`}
                      className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm dark:border-[#0a0a0f] ${a.ringClass}`}
                      title={a.alt}
                    >
                      {a.src ? (
                        <Image src={a.src} alt={a.alt} fill className="object-cover" sizes="32px" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold" aria-hidden>
                          {a.initials}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="min-w-0 text-sm leading-snug text-slate-600 dark:text-[#94a3b8]">
                <span className="font-semibold tabular-nums text-slate-900 dark:text-white/90">
                  {learnersLabel} baranaya
                </span>
              </p>
            </div>
          </div>

          <div className="hero-animate-done relative order-2 space-y-4 lg:order-none">
          

            <div className="grid gap-3 sm:gap-4">
              <Link
                href={firstFreeHref}
                className="group relative block overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white/90 p-5 shadow-sm transition hover:border-[#cbd5e1] hover:shadow-md dark:border-[#1e1e2e] dark:bg-white/[0.03] dark:shadow-none dark:hover:border-white/15 dark:hover:shadow-lg dark:hover:shadow-[#7c3aed]/10 sm:p-6"
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-25 blur-2xl transition group-hover:opacity-40 dark:opacity-40 dark:group-hover:opacity-70"
                  style={{
                    background: `radial-gradient(circle, color-mix(in srgb, ${ACCENT} 35%, transparent) 0%, transparent 70%)`,
                  }}
                />
                <div className="relative flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-[#7c3aed] shadow-inner transition group-hover:border-[#7c3aed]/30 dark:border-white/10 dark:bg-white/5 dark:text-[#a78bfa] dark:group-hover:border-[#7c3aed]/30 dark:group-hover:bg-[#7c3aed]/10">
                    <BookOpen className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#7c3aed] sm:text-xs dark:border-[#7c3aed]/25 dark:bg-[#7c3aed]/10 dark:text-[#c4b5fd]">
                      Koorsooyin
                    </span>
                    <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-slate-900 sm:text-xl dark:text-white">
                      Dhis portfolio aad shaqo ku heli karto
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#94a3b8]">
                      Mashaariic dhab ah (apps, websites) oo aad ku muujin karto xirfadahaaga.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#7c3aed] transition group-hover:gap-2 dark:text-[#a78bfa]">
                      Bilow hadda
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>

              <Link
                href={
                  isLoggedIn
                    ? saasCourse
                      ? `/courses/${saasCourse.categoryId}/${saasCourse.slug}`
                      : "/courses"
                    : "/welcome"
                }
                className="group relative block overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white/90 p-5 shadow-sm transition hover:border-sky-200 hover:shadow-md dark:border-[#1e1e2e] dark:bg-white/[0.03] dark:shadow-none dark:hover:border-sky-500/35 dark:hover:shadow-lg dark:hover:shadow-sky-500/5 sm:p-6"
              >
                <div className="pointer-events-none absolute -right-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-sky-200/40 blur-2xl transition group-hover:bg-sky-300/50 dark:bg-sky-500/15 dark:group-hover:bg-sky-400/25" />
                <div className="relative flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-sky-50 text-sky-600 shadow-inner transition group-hover:border-sky-300 dark:border-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-hover:border-sky-400/40 dark:group-hover:bg-sky-500/15">
                    <Cloud className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-700 sm:text-xs dark:border-sky-400/25 dark:bg-sky-500/10 dark:text-sky-200/90">
                      SaaS
                    </span>
                    <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-slate-900 sm:text-xl dark:text-white">
                      {saasCourse ? saasCourse.title : "Dhis badeecad SaaS oo isticmaale leh"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#94a3b8]">
                      Auth, biilka, deployment, iyo isticmaalayaal dhab ah — qaab casri ah oo ganacsi u diyaar ah.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 transition group-hover:gap-2 dark:text-sky-300">
                      Baro SaaS-ka
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>

              <Link
                href={
                  isLoggedIn
                    ? aiCourse
                      ? `/courses/${aiCourse.categoryId}/${aiCourse.slug}`
                      : "/courses"
                    : "/welcome"
                }
                className="group relative block overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white/90 p-5 shadow-sm transition hover:border-violet-200 hover:shadow-md dark:border-[#1e1e2e] dark:bg-white/[0.03] dark:shadow-none dark:hover:border-[#7c3aed]/45 dark:hover:shadow-lg dark:hover:shadow-[#7c3aed]/15 sm:p-6"
              >
                <div
                  className="pointer-events-none absolute -left-4 -bottom-10 h-32 w-32 rounded-full opacity-30 blur-3xl transition group-hover:opacity-50 dark:bottom-[-2.5rem] dark:h-36 dark:w-36 dark:opacity-50 dark:group-hover:opacity-80"
                  style={{
                    background: `radial-gradient(circle, color-mix(in srgb, ${ACCENT} 40%, transparent) 0%, transparent 65%)`,
                  }}
                />
                <div className="relative flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-200 bg-violet-50 text-[#7c3aed] shadow-inner transition group-hover:border-violet-300 dark:border-[#7c3aed]/35 dark:bg-[#7c3aed]/20 dark:text-[#c4b5fd] dark:group-hover:border-[#7c3aed]/50 dark:group-hover:bg-[#7c3aed]/25">
                    <Brain className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#7c3aed] sm:text-xs dark:border-[#7c3aed]/35 dark:bg-[#7c3aed]/20 dark:text-[#ddd6fe]">
                      Koorsada AI
                    </span>
                    <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-slate-900 sm:text-xl dark:text-white">
                      {aiCourse ? aiCourse.title : "Baro AI — Af-Soomaali"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-[#94a3b8]">
                      {aiCourse
                        ? "Ku baro AI si habboon — bilaaw maanta."
                        : "Ku baro AI, machine learning iyo automation — tallaabo tallaabo."}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#7c3aed] transition group-hover:gap-2 dark:text-[#a78bfa]">
                      Bilaaw koorsada AI
                      <ArrowUpRight className="h-4 w-4" aria-hidden />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="border-y border-slate-200/90 bg-white/60 py-8 dark:border-[#1e1e2e] dark:bg-[#0a0a0f]/80">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-x-14 gap-y-8 px-6 sm:gap-x-16">
          {TECH_ICONS.map(({ name, Icon }) => (
            <span
              key={name}
              className="flex shrink-0 items-center justify-center gap-2.5 text-slate-500 dark:text-[#94a3b8]"
              title={name}
            >
              <Icon className="h-6 w-6 text-[#7c3aed]" strokeWidth={1.5} />
              <span className="font-mono text-xs font-medium uppercase tracking-wider">{name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
