"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useAuthStore } from "@/store/useAuthStore";
import { Code2, Layers, Brain, Database, Server, BookOpen, Cloud, ArrowUpRight } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { getAbsoluteImageUrl } from "@/lib/utils";
import { useFirstFreeLessonHref } from "@/hooks/useFirstFreeLessonHref";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const CATEGORIES_SWR_KEY = `${API_BASE_URL}/api/lms/categories/`;

const TECH_ICONS = [
  { name: "React", Icon: Code2 },
  { name: "Next.js", Icon: Layers },
  { name: "AI", Icon: Brain },
  { name: "Django", Icon: Server },
  { name: "PostgreSQL", Icon: Database },
] as const;

interface LandingStats {
  students_count: number;
  courses_count: number;
  learners_this_month?: number;
}

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

interface PublicProofUser {
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string | null;
}

const AVATAR_RING_COLORS = [
  "bg-emerald-600/90 text-white",
  "bg-violet-600/90 text-white",
  "bg-amber-600/90 text-white",
] as const;

function SocialProofAvatar({
  src,
  alt,
  initials,
  ringClass,
}: {
  src: string | null;
  alt: string;
  initials: string;
  ringClass: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;
  return (
    <div
      className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[#050508] ring-1 ring-white/10"
      title={alt}
    >
      {showImage ? (
        <Image
          src={src!}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="40px"
          unoptimized
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center text-[10px] font-bold ${ringClass}`}
          aria-hidden
        >
          {initials}
        </div>
      )}
    </div>
  );
}

function resolveProofAvatarUrl(url: string | null | undefined): string | null {
  const u = typeof url === "string" ? url.trim() : "";
  if (!u) return null;
  if (u.startsWith("http://") || u.startsWith("https://")) return u;
  return getAbsoluteImageUrl(u, "");
}

function useAnimatedCount(target: number, active: boolean) {
  const [v, setV] = useState(0);
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
  return v;
}

export function HeroSection() {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!user;
  const { href: firstFreeHref } = useFirstFreeLessonHref();
  const { data: stats, error: statsError } = useSWR<LandingStats>(
    `${API_BASE_URL}/api/public/landing-stats/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );

  const { data: proofUsers } = useSWR<PublicProofUser[]>(
    `${API_BASE_URL}/api/public/social-proof/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );

  const heroAvatars = useMemo(() => {
    if (!Array.isArray(proofUsers) || proofUsers.length === 0) return [];
    const colors = AVATAR_RING_COLORS;
    return proofUsers.slice(0, 3).map((u, i) => {
      const fn = (u.first_name || "").trim();
      const ln = (u.last_name || "").trim();
      const initials =
        `${fn[0] || ""}${ln[0] || ""}`.toUpperCase() || (fn[0] || "?").toUpperCase();
      const label = ln ? `${fn} ${ln[0]}.`.trim() : fn || "Arday";
      const src = resolveProofAvatarUrl(u.profile_picture_url ?? null);
      return {
        src,
        initials,
        alt: `${label} — arday Garaad`,
        ringClass: colors[i % colors.length],
      };
    });
  }, [proofUsers]);
  const studentCount = stats?.students_count ?? 0;
  const countAnimActive = Boolean(stats != null && !statsError && studentCount > 0);
  const displayCount = useAnimatedCount(studentCount, countAnimActive);
  /** Fixed first paint avoids hydration mismatch (SWR can have cache on client only). */
  const [learnersLabel, setLearnersLabel] = useState("Ku biir 88+ Developer oo hadda baranaya");
  useEffect(() => {
    if (statsError || stats == null) return;
    if (studentCount > 0) {
      setLearnersLabel(`Ku biir ${studentCount}+ Developer oo hadda baranaya`);
    }
  }, [stats, statsError, studentCount]);
  useEffect(() => {
    if (!countAnimActive || displayCount <= 0) return;
    setLearnersLabel(`Ku biir ${displayCount}+ Developer oo hadda baranaya`);
  }, [displayCount, countAnimActive]);

  const { data: categoriesData } = useSWR<unknown>(CATEGORIES_SWR_KEY, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 1000,
  });
  const courses = parseCategories(categoriesData ?? []);

  const aiCourse = courses.find((c) => /ai|artificial|smart|machine/i.test(c.title));
  const saasCourse = courses.find((c) => /saas|software as a service|subscription|bixi/i.test(c.title));

  return (
    <div className="min-h-screen bg-[#050508] dark:bg-[#050508]">
      <section
        className="relative flex min-h-screen flex-col justify-center px-6 py-20 sm:px-8 md:px-10 lg:px-12 xl:px-16"
        style={{ maxWidth: 1200, margin: "0 auto" }}
      >
        {/* Single soft glow */}
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden
        >
          <div
            className="absolute left-1/2 top-1/2 h-[480px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-[100px]"
            style={{
              background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 12%, transparent) 0%, transparent 65%)",
            }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Copy first on mobile; cards follow */}
          <div className="hero-animate-done order-1 lg:order-none">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
              Natiijada · Full-Stack Developer
            </p>
            <h1 className="text-left font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-white">
              Noqo Full-Stack Developer
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                adigoo jooga gurigaaga
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
              Baro koodhka casriga ah iyo AI adigoo isticmaalaya afkaaga hooyo. 30 daqiiqo maalintiiba waa nagu filan
              tahay.{" "}
              {stats != null && !statsError && studentCount > 0 ? (
                <>
                  <span className="font-semibold tabular-nums text-white/75">{displayCount || studentCount}+ arday</span>{" "}
                  ayaa hadda dhisaya mustaqbalkooda.
                </>
              ) : (
                <>
                  <span className="font-semibold text-white/75">100+ arday</span> ayaa hadda dhisaya mustaqbalkooda.
                </>
              )}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Link
                href="/challenge"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground no-underline transition hover:opacity-90"
              >
                Ku biir Challenge-ka →
              </Link>
              <Link
                href={firstFreeHref}
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border-2 border-white/45 bg-transparent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-white/70 hover:bg-white/5"
              >
                Ku bilow Bilaash
              </Link>
            </div>
            <Link
              href="/welcome"
              className="mt-2 inline-flex text-sm font-semibold text-white/50 underline-offset-4 transition hover:text-white/75 hover:underline"
            >
              Bilow 6-tallaabo — shaqsiyeeyn (~2 daqiiqo) →
            </Link>
            <p className="mt-4 max-w-md rounded-lg border border-amber-500/35 bg-amber-950/35 px-3 py-2 text-xs font-semibold leading-snug text-amber-100/95 sm:text-sm">
              Kooxda dambe wey furmeysaa — boosaska way xadidan yihiin.
            </p>

            <div
              className="mt-8 flex max-w-lg flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
              role="status"
              aria-live="polite"
            >
              {heroAvatars.length > 0 ? (
                <div
                  className="flex shrink-0 items-center -space-x-2"
                  aria-label="Sawirro ka mid ah ardayda diiwaangashan"
                >
                  {heroAvatars.map((a, idx) => (
                    <SocialProofAvatar
                      key={`${a.alt}-${idx}`}
                      src={a.src}
                      alt={a.alt}
                      initials={a.initials}
                      ringClass={a.ringClass}
                    />
                  ))}
                </div>
              ) : null}
              <p className="min-w-0 text-sm leading-snug text-white/55">
                <span className="font-semibold tabular-nums text-white/80">{learnersLabel}</span>
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="hero-animate-done relative order-2 space-y-4 lg:order-none">
            <Link
              href="/challenge"
              className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/35 bg-gradient-to-r from-violet-950/80 to-violet-900/50 px-4 py-3 text-center text-[11px] font-bold uppercase tracking-wide text-violet-100 shadow-[0_0_24px_-8px_rgba(139,92,246,0.45)] backdrop-blur-sm transition hover:border-violet-400/50 hover:from-violet-900/90 hover:to-violet-800/60 sm:text-xs"
            >
              Challenge-ka ku jiro — dhammaan fur
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
            </Link>

            <div className="grid gap-3 sm:gap-4">
              <Link
                href={firstFreeHref}
                className="group relative block overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset] transition hover:border-primary/25 hover:shadow-lg hover:shadow-primary/10 sm:p-6"
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-2xl transition group-hover:opacity-70"
                  style={{
                    background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 35%, transparent) 0%, transparent 70%)",
                  }}
                />
                <div className="relative flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] transition group-hover:border-primary/20 group-hover:bg-primary/10">
                    <BookOpen className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
                      Koorsooyin
                    </span>
                    <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-white sm:text-xl">
                      Dhis portfolio aad shaqo ku heli karto
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      Mashaariic dhab ah (apps, websites) oo aad ku muujin karto xirfadahaaga.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-2">
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
                className="group relative block overflow-hidden rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/40 via-white/[0.03] to-transparent p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset] transition hover:border-sky-400/35 hover:shadow-[0_0_40px_-12px_rgba(56,189,248,0.2)] sm:p-6"
              >
                <div className="pointer-events-none absolute -right-6 top-1/2 h-28 w-28 -translate-y-1/2 rounded-full bg-sky-500/15 blur-2xl transition group-hover:bg-sky-400/25" />
                <div className="relative flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-500/25 bg-sky-500/10 text-sky-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition group-hover:border-sky-400/40 group-hover:bg-sky-500/15">
                    <Cloud className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/25 bg-sky-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-200/90 sm:text-xs">
                      SaaS
                    </span>
                    <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-white sm:text-xl">
                      {saasCourse ? saasCourse.title : "Dhis badeecad SaaS oo isticmaale leh"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">
                      Auth, biilka, deployment, iyo isticmaalayaal dhab ah — qaab casri ah oo ganacsi u diyaar ah.
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky-300 transition group-hover:gap-2">
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
                className="group relative block overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset] transition hover:border-primary/45 hover:shadow-lg hover:shadow-primary/15 sm:p-6"
              >
                <div
                  className="pointer-events-none absolute -left-4 -bottom-10 h-36 w-36 rounded-full opacity-50 blur-3xl transition group-hover:opacity-80"
                  style={{
                    background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 40%, transparent) 0%, transparent 65%)",
                  }}
                />
                <div className="relative flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/35 bg-primary/20 text-primary shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition group-hover:border-primary/50 group-hover:bg-primary/25">
                    <Brain className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/35 bg-primary/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
                      Koorsada AI
                    </span>
                    <h3 className="font-display mt-3 text-lg font-semibold leading-snug text-white sm:text-xl">
                      {aiCourse ? aiCourse.title : "Baro AI — Af-Soomaali"}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {aiCourse
                        ? "Ku baro AI si habboon — bilaaw maanta."
                        : "Ku baro AI, machine learning iyo automation — tallaabo tallaabo."}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary transition group-hover:gap-2">
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

      {/* Tech strip */}
      <div className="border-y border-white/10 bg-white/[0.02] py-6">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-12 px-6 sm:gap-16">
          {TECH_ICONS.map(({ name, Icon }) => (
            <span
              key={name}
              className="flex shrink-0 items-center justify-center gap-2.5 text-white/50"
              title={name}
            >
              <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
              <span className="font-mono text-xs font-medium uppercase tracking-wider">{name}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
