"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { useAuthStore } from "@/store/useAuthStore";
import { Code2, Layers, Brain, Database, Server, BookOpen } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
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

const AVATAR_SAMPLES = [
  { initials: "IO", className: "bg-emerald-600/90 text-white" },
  { initials: "AS", className: "bg-violet-600/90 text-white" },
  { initials: "A", className: "bg-amber-600/90 text-white" },
] as const;

export function HeroSection() {
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = !!user;
  const { href: firstFreeHref } = useFirstFreeLessonHref();
  const { data: stats, error: statsError } = useSWR<LandingStats>(
    `${API_BASE_URL}/api/public/landing-stats/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );
  const studentCount = stats?.students_count ?? 0;
  /** Fixed first paint avoids hydration mismatch (SWR can have cache on client only). */
  const [learnersLabel, setLearnersLabel] = useState("85+ arday ayaa bilaabay");
  useEffect(() => {
    if (statsError || stats == null) return;
    if (studentCount > 0) {
      setLearnersLabel(`${studentCount}+ arday ayaa bilaabay`);
    }
  }, [stats, statsError, studentCount]);

  const { data: categoriesData } = useSWR<unknown>(CATEGORIES_SWR_KEY, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60 * 1000,
  });
  const courses = parseCategories(categoriesData ?? []);

  const aiCourse = courses.find((c) => /ai|artificial|smart|machine/i.test(c.title));
  const otherCourses = courses.filter((c) => c.id !== aiCourse?.id);

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
              Af-Soomaali · Full-Stack & AI
            </p>
            <h1 className="text-left font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-white">
              Baro
              <br />
              Full-Stack
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Horumarinta &amp; AI
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-white/60">
              Koorsooyinka HTML, JavaScript, React, iyo AI — af Soomaali. 30 daqiiqo maalintiiba. Bilow
              maanta.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <Link
                href="/challenge"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground no-underline transition hover:opacity-90"
              >
                Ku biir Challenge-ka →
              </Link>
              <Link
                href={firstFreeHref}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white/55 underline underline-offset-4 decoration-white/30 hover:text-white/80"
              >
                Ama bilaash ku bilow — koorsada 1-aad fur
              </Link>
            </div>
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/45">
              <span>✓ Jooji xilli kasta</span>
              <span>✓ Waafi &amp; Stripe</span>
              <span>✓ Af Soomaali 100%</span>
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="flex -space-x-2" aria-hidden>
                {AVATAR_SAMPLES.map((a) => (
                  <div
                    key={a.initials}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#050508] text-[10px] font-bold ${a.className}`}
                  >
                    {a.initials}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40">
                <span className="font-semibold tabular-nums text-white/70">{learnersLabel}</span>
              </p>
            </div>
          </div>

          {/* Cards */}
          <div className="hero-animate-done relative order-2 space-y-5 lg:order-none">
            <Link
              href={firstFreeHref}
              className="relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-primary/20 hover:bg-white/8"
            >
              <div className="absolute bottom-3 left-3 right-3 z-10 rounded-lg border border-violet-500/40 bg-violet-950/90 px-3 py-2 text-center text-[11px] font-bold text-violet-100 backdrop-blur-sm sm:text-xs">
                Challenge-ka ku jiro — dhammaan fur →
              </div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                Koorsooyin
              </div>
              <h3 className="font-display text-xl font-semibold text-white">Full-Stack &amp; AI af Soomaali</h3>
              <p className="mt-2 text-sm text-white/50">
                Tallaabo tallaabo. Dhis portfolio. Diyaar u noqo shaqada tech-ka.
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary">Bilow hadda →</span>
            </Link>

            <Link
              href={
                isLoggedIn
                  ? aiCourse
                    ? `/courses/${aiCourse.categoryId}/${aiCourse.slug}`
                    : "/courses"
                  : "/welcome"
              }
              className="relative block overflow-hidden rounded-2xl border border-primary/20 bg-primary/10 p-6 transition hover:border-primary/30 hover:bg-primary/15"
            >
              <div className="absolute bottom-3 left-3 right-3 z-10 rounded-lg border border-violet-500/40 bg-violet-950/90 px-3 py-2 text-center text-[11px] font-bold text-violet-100 backdrop-blur-sm sm:text-xs">
                Challenge-ka ku jiro — dhammaan fur →
              </div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                <Brain className="h-3.5 w-3.5" />
                Koorsada AI
              </div>
              <h3 className="font-display text-xl font-semibold text-white">
                {aiCourse ? aiCourse.title : "Baro AI — Af-Soomaali"}
              </h3>
              <p className="mt-2 text-sm text-white/60">
                {aiCourse
                  ? "Ku baro AI si habboon — bilaaw maanta."
                  : "Ku baro AI, machine learning iyo automation — tallaabo tallaabo."}
              </p>
              <span className="mt-4 inline-block text-sm font-semibold text-primary">Bilaaw koorsada AI →</span>
            </Link>
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
