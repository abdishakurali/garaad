"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Code2, Layers, Brain, Database, Server } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { getAbsoluteImageUrl } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

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

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <div className="hero-animate-done">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-primary/80">
              Natiijada · Full-Stack Developer
            </p>
            <h1 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-white">
              Noqo Full-Stack Developer
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                adigoo jooga gurigaaga
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-white/60">
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
              <Link
                href="/challenge"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground no-underline transition hover:opacity-90"
              >
                Ku biir Challenge-ka →
              </Link>
              <Link
                href="/courses"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border-2 border-white/45 bg-transparent px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-white/70 hover:bg-white/5"
              >
                Fiiri Koorsooyin
              </Link>
            </div>

            <div
              className="mt-8 inline-flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 sm:flex-row sm:items-center sm:gap-4"
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
