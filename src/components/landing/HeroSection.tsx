"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import useSWR from "swr";
import { useAuthStore } from "@/store/useAuthStore";
import { Code2, Layers, Brain, Database, Server, BookOpen } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const TECH_ICONS = [
  { name: "React", Icon: Code2 },
  { name: "Next.js", Icon: Layers },
  { name: "AI", Icon: Brain },
  { name: "Django", Icon: Server },
  { name: "PostgreSQL", Icon: Database },
] as const;

const FLOAT_ICONS = [
  { icon: "</> ", top: "12%", left: "72%", size: 32, delay: 0, opacity: 0.08 },
  { icon: "∑", top: "65%", left: "78%", size: 48, delay: 1.2, opacity: 0.06 },
  { icon: "⟨⟩", top: "25%", left: "88%", size: 24, delay: 0.6, opacity: 0.07 },
  { icon: "λ", top: "80%", left: "65%", size: 40, delay: 1.8, opacity: 0.05 },
  { icon: "∞", top: "8%", left: "60%", size: 28, delay: 0.4, opacity: 0.06 },
] as const;

const FEATURE_PILLS = [
  { label: "Af-Soomaali", icon: "🌍" },
  { label: "Full-Stack & AI", icon: "🧠" },
  { label: "Baro si Habboon", icon: "🚀" },
  { label: "Portfolio-Ready", icon: "⚡" },
] as const;

const LESSON_ITEMS = [
  { label: "JSX iyo Components", done: true },
  { label: "State Management", done: true },
  { label: "API Calls", active: true },
  { label: "AI Integration", done: false },
] as const;

const IS_LIVE = true; // Currently live session (hardcoded for now)

interface LandingStats {
  students_count: number;
  courses_count: number;
}

interface HeroCourse {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  is_published: boolean;
}

export function HeroSection() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [featuredCourse, setFeaturedCourse] = useState<HeroCourse | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { data: stats } = useSWR<LandingStats>(
    `${API_BASE_URL}/api/public/landing-stats/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );
  const studentCount = stats?.students_count ?? 0;

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/lms/categories/`)
      .then((r) => r.json())
      .then((data: { results?: { courses?: HeroCourse[] }[] } | HeroCourse[]) => {
        if (cancelled) return;
        const categories = Array.isArray(data) ? data : data?.results ?? [];
        const first = (categories as { courses?: HeroCourse[] }[]).flatMap((c) =>
          (c.courses || []).filter((c) => c.is_published)
        )[0];
        if (first) setFeaturedCourse(first);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const floatStyle = (factor = 1, delay = 0) => ({
    transform: `translate(${mousePos.x * 12 * factor}px, ${mousePos.y * 12 * factor}px)`,
    transition: `transform ${0.4 + delay * 0.1}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
  });

  return (
    <div className="min-h-screen overflow-hidden bg-[#050508] dark:bg-[#050508]">
      <style>{`
        .hero-shimmer-text {
          background: linear-gradient(90deg, var(--primary) 0%, rgba(255,255,255,0.9) 30%, var(--primary) 60%, var(--primary) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: hero-shimmer 4s linear infinite;
        }
        @keyframes hero-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .hero-cta-primary {
          background: var(--primary);
          color: var(--primary-foreground);
          border: none;
          padding: 18px 40px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          cursor: pointer;
          clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .hero-cta-primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.2);
          transform: translateX(-100%) skewX(-15deg);
          transition: transform 0.4s ease;
        }
        .hero-cta-primary:hover::after { transform: translateX(100%) skewX(-15deg); }
        .hero-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 40px color-mix(in srgb, var(--primary) 30%, transparent);
        }
        .hero-cta-secondary {
          background: transparent;
          color: rgba(255,255,255,0.7);
          border: 1px solid rgba(255,255,255,0.12);
          padding: 17px 32px;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hero-cta-secondary:hover {
          border-color: color-mix(in srgb, var(--primary) 40%, transparent);
          color: var(--primary);
          background: color-mix(in srgb, var(--primary) 5%, transparent);
        }
        .hero-feature-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          transition: all 0.25s ease;
          cursor: default;
        }
        .hero-feature-pill:hover {
          background: color-mix(in srgb, var(--primary) 7%, transparent);
          border-color: color-mix(in srgb, var(--primary) 25%, transparent);
          color: rgba(255,255,255,0.9);
        }
        .hero-scroll-indicator {
          width: 28px;
          height: 44px;
          border: 1.5px solid rgba(255,255,255,0.2);
          border-radius: 14px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 8px;
        }
        .hero-scroll-dot {
          width: 4px;
          height: 8px;
          background: var(--primary);
          border-radius: 2px;
          animation: hero-slide-up 1.5s ease-in-out infinite;
        }
        @keyframes hero-slide-up {
          from { opacity: 0; transform: translateY(0); }
          to { opacity: 1; transform: translateY(12px); }
        }
        .hero-grid-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }
        .hero-scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 120px;
          background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--primary) 1.5%, transparent), transparent);
          animation: hero-scan 8s linear infinite;
          pointer-events: none;
        }
        @keyframes hero-scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .hero-corner-bracket {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: color-mix(in srgb, var(--primary) 40%, transparent);
          border-style: solid;
        }
        .hero-corner-tl { top: -1px; left: -1px; border-width: 1.5px 0 0 1.5px; }
        .hero-corner-tr { top: -1px; right: -1px; border-width: 1.5px 1.5px 0 0; }
        .hero-corner-bl { bottom: -1px; left: -1px; border-width: 0 0 1.5px 1.5px; }
        .hero-corner-br { bottom: -1px; right: -1px; border-width: 0 1.5px 1.5px 0; }
        .hero-noise-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 1000;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        .hero-ticker-track {
          display: flex;
          gap: 3rem;
          animation: hero-ticker 25s linear infinite;
          white-space: nowrap;
        }
        @keyframes hero-ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div className="hero-noise-overlay" aria-hidden />

      <section
        ref={heroRef}
        className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-20 sm:px-8 md:px-10 lg:px-12 xl:px-16"
        style={{ maxWidth: 1400, margin: "0 auto" }}
      >
        <div className="hero-grid-lines" aria-hidden />
        <div className="hero-scan-line" aria-hidden />

        {/* Background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute right-[10%] top-[5%] h-[600px] w-[600px] rounded-full animate-pulse-glow"
            style={{
              ...floatStyle(0.3),
              background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 8%, transparent) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[10%] left-[5%] h-[500px] w-[500px] rounded-full"
            style={{
              ...floatStyle(0.2, 2),
              background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 6%, transparent) 0%, transparent 70%)",
              animation: "pulse-glow 8s ease-in-out infinite 2s",
            }}
          />
          <div
            className="absolute left-1/2 top-[40%] h-[300px] w-[300px] -translate-x-1/2 rounded-full"
            style={{
              background: "radial-gradient(circle, color-mix(in srgb, var(--primary) 4%, transparent) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Floating background icons */}
        {FLOAT_ICONS.map((item, i) => (
          <div
            key={i}
            className="pointer-events-none select-none font-mono"
            style={{
              position: "absolute",
              top: item.top,
              left: item.left,
              fontSize: item.size,
              color: "var(--primary)",
              opacity: item.opacity,
              animation: `${i % 2 === 0 ? "float" : "float-alt"} ${5 + i}s ease-in-out infinite ${item.delay}s`,
            }}
          >
            {item.icon}
          </div>
        ))}

        {/* Main content grid */}
        <div className="relative z-10 grid gap-12 pt-20 pb-20 lg:grid-cols-2 lg:gap-20 lg:pt-24 lg:pb-24">
          {/* Left — Text content */}
          <div className="relative z-[2]">
            <div className="hero-animate-badge mb-7">
              <div className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 pl-2 text-xs font-semibold uppercase tracking-[0.06em] text-[var(--primary)]"
                style={{
                  background: "color-mix(in srgb, var(--primary) 8%, transparent)",
                  borderColor: "color-mix(in srgb, var(--primary) 20%, transparent)",
                }}
              >
                <div
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px]"
                  style={{ background: "color-mix(in srgb, var(--primary) 15%, transparent)" }}
                >
                  ✦
                </div>
                Jiilka Cusub ee STEM
              </div>
            </div>

            <div className="hero-animate-headline mb-6 text-left">
              <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-extrabold leading-[1] tracking-[-0.03em] text-white text-left">
                <span className="mb-1 block">Baro</span>
                <span className="mb-1 block">Full-Stack</span>
                <span className="hero-shimmer-text block text-[clamp(3rem,6vw,5.5rem)]">
                  Dev & AI
                </span>
              </h1>
              <div
                className="mt-4 h-0.5 w-20 rounded-sm"
                style={{ background: "linear-gradient(90deg, var(--primary), transparent)" }}
              />
            </div>

            <div className="hero-animate-desc mb-8">
              <p className="max-w-[480px] text-[17px] font-normal leading-[1.7] text-white/50">
                Ku dhiso apps adoo baranaya{" "}
                <span className="font-semibold text-white/85">React, Next.js iyo AI</span>
                {" "}— dhammaan{" "}
                <span className="font-semibold text-[var(--primary)]">Af-Soomaali</span>
                . Koorsooyin tallaabo-tallaabo ah oo kuu diyaar gelinaya suuqa shaqada.
              </p>
            </div>

            <div className="hero-animate-pills mb-10 flex flex-wrap gap-2">
              {FEATURE_PILLS.map((pill, i) => (
                <div key={i} className="hero-feature-pill">
                  <div
                    className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ background: "var(--primary)" }}
                  />
                  <span className="mr-1">{pill.icon}</span>
                  {pill.label}
                </div>
              ))}
            </div>

            <div className="hero-animate-cta flex flex-wrap items-center gap-3">
              <Link
                href={isLoggedIn ? "/courses" : "/welcome"}
                className="hero-cta-primary inline-flex items-center justify-center no-underline"
              >
                <span className="flex items-center gap-2.5">
                  <span>▶</span>
                  {isLoggedIn ? "Sii wad Barashada" : "Ku Soo Biir Maanta"}
                </span>
              </Link>
              <Link
                href="/courses"
                className="hero-cta-secondary inline-flex items-center justify-center no-underline"
              >
                Arag Koorsooyin →
              </Link>
            </div>

            {/* Trust: real-time stats + testimonial */}
            <div className="hero-animate-stats mt-8 space-y-4">
              <div className="flex items-center gap-5">
                <div className="flex items-center">
                  {["var(--primary)", "#a78bfa", "#fff", "#f59e0b"].map((c, i) => (
                    <div
                      key={i}
                      className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#050508] text-[10px] font-bold text-[#050508]"
                      style={{
                        background: c,
                        marginLeft: i > 0 ? -8 : 0,
                      }}
                    >
                      {["A", "B", "M", "F"][i]}
                    </div>
                  ))}
                </div>
                <span className="text-[13px] text-white/40">
                  <span className="font-semibold tabular-nums text-white/80">{studentCount}+</span> arday ayaa bilaabay
                </span>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex gap-0.5 text-primary">
                  {"★★★★★".split("").map((s, i) => (
                    <span key={i} className="text-xs">{s}</span>
                  ))}
                </div>
              </div>
              <blockquote className="border-l-2 border-primary/40 pl-4 text-[13px] italic text-white/50">
                &ldquo;Garaad ayaa i caawisay inaan shaqo helo 3 bilood kadib.&rdquo;
                <footer className="mt-1.5 not-italic text-white/70 font-medium">— Axmed C., Mogadishu</footer>
              </blockquote>
            </div>
          </div>

          {/* Right — On small: one "Koorsooyin Tayo leh" card; on lg: full course preview panel */}
          <div className="relative">
            {featuredCourse && (
              <Link
                href="/welcome"
                className="lg:hidden block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-primary/20 hover:bg-white/[0.06]"
              >
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  <BookOpen className="h-3.5 w-3.5" />
                  Koorsooyin Tayo leh
                </div>
                <h3 className="font-display text-lg font-bold text-white line-clamp-2">
                  {featuredCourse.title}
                </h3>
                <p className="mt-2 text-sm text-white/50 line-clamp-2">
                  Baro si habboon — bilaaw koorsada
                </p>
                <span className="mt-3 inline-block text-sm font-semibold text-primary">
                  Bilaaw Hadda →
                </span>
              </Link>
            )}

            <div className="hidden lg:block relative" style={floatStyle(0.15)}>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] shadow-xl shadow-black/20 backdrop-blur-sm">
              {/* Window header — garaad.org / React Bilow + Currently Live */}
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                      <div key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                  <div
                    className="ml-2 flex items-center gap-1.5 rounded-md border border-white/10 bg-black/30 px-3 py-1.5 font-mono text-[11px] tracking-wide text-white/70"
                    style={{ borderLeftColor: "var(--primary)" }}
                  >
                    <span className="text-white/40">garaad.org</span>
                    <span className="text-white/30">/</span>
                    <span className="font-medium text-primary">React Bilow</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {IS_LIVE && (
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      Currently Live
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                {/* Code block — Koorsada React Lesson 4 */}
                <div className="mb-5 overflow-hidden rounded-xl border border-white/[0.06] bg-black/60 shadow-inner">
                  <div className="border-b border-white/[0.06] bg-white/[0.02] px-3 py-2 font-mono text-[10px] text-white/35">
                    // Koorsada React — Lesson 4
                  </div>
                  <pre className="p-4 font-mono text-[12px] leading-[1.85] sm:text-[13px]" aria-label="React code snippet">
                    <code className="block text-white/90">
                      <span className="text-[var(--primary)]">const</span>
                      <span className="text-white/80"> App </span>
                      <span className="text-white/50">=</span>
                      <span className="text-white/50"> () </span>
                      <span className="text-[var(--primary)]">{"=>"}</span>
                      <span className="text-white/50"> {"{"}</span>
                      {"\n"}
                      <span className="text-white/60">  </span>
                      <span className="text-emerald-400">return</span>
                      <span className="text-white/60"> </span>
                      <span className="text-white/50">{"<"}</span>
                      <span className="text-amber-400">div</span>
                      <span className="text-white/50">{">"}</span>
                      <span className="text-white/70">Adduunka React</span>
                      <span className="text-white/50">{"</"}</span>
                      <span className="text-amber-400">div</span>
                      <span className="text-white/50">{">"}</span>
                      {"\n"}
                      <span className="text-white/50">{"}"}</span>
                    </code>
                  </pre>
                </div>

                {/* Progress — Horumarka Koorso 68% */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-white/50">Horumarka Koorso</span>
                    <span className="font-mono text-xs font-bold tabular-nums text-[var(--primary)]">68%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: "68%",
                        background: "linear-gradient(90deg, var(--primary), #10b981)",
                        boxShadow: "0 0 14px color-mix(in srgb, var(--primary) 40%, transparent)",
                      }}
                    />
                  </div>
                </div>

                {/* Lesson list — checkmarks + HADDA */}
                <div className="flex flex-col gap-1.5">
                  {LESSON_ITEMS.map((lesson, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
                      style={{
                        background: lesson.active ? "color-mix(in srgb, var(--primary) 8%, transparent)" : "transparent",
                        border: lesson.active ? "1px solid color-mix(in srgb, var(--primary) 20%, transparent)" : "1px solid transparent",
                      }}
                    >
                      <div
                        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                        style={{
                          background: lesson.done ? "var(--primary)" : lesson.active ? "color-mix(in srgb, var(--primary) 25%, transparent)" : "rgba(255,255,255,0.06)",
                          border: lesson.done ? "none" : "1px solid " + (lesson.active ? "color-mix(in srgb, var(--primary) 50%, transparent)" : "rgba(255,255,255,0.12)"),
                          color: lesson.done ? "var(--primary-foreground)" : "transparent",
                        }}
                      >
                        {lesson.done ? "✓" : ""}
                      </div>
                      <span
                        className="flex-1 text-[13px] font-medium"
                        style={{
                          color: lesson.active ? "rgba(255,255,255,0.95)" : lesson.done ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.35)",
                        }}
                      >
                        {lesson.label}
                      </span>
                      {lesson.active && (
                        <span
                          className="rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider"
                          style={{ color: "var(--primary)", background: "color-mix(in srgb, var(--primary) 15%, transparent)", border: "1px solid color-mix(in srgb, var(--primary) 30%, transparent)" }}
                        >
                          HADDA
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="absolute -right-5 -top-5 rounded-lg px-4 py-2.5 font-mono text-[11px] font-bold text-[var(--primary-foreground)] shadow-lg animate-float"
              style={{ background: "var(--primary)", boxShadow: "0 8px 32px color-mix(in srgb, var(--primary) 30%, transparent)" }}
            >
              🔥 12 Arday Online
            </div>

            <div
              className="absolute -bottom-4 -left-6 rounded-lg border px-4 py-2.5 font-mono text-[11px] font-semibold animate-float-alt"
              style={{
                background: "color-mix(in srgb, var(--primary) 12%, transparent)",
                borderColor: "color-mix(in srgb, var(--primary) 25%, transparent)",
                color: "var(--primary)",
              }}
            >
              ✓ Certificate Joogto ah
            </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          style={{
            opacity: scrollY > 50 ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        >
          <div className="hero-scroll-indicator">
            <div className="hero-scroll-dot" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.12em] text-white/20">
            HOOS U DHAADHAC
          </span>
        </div>
      </section>

      {/* Tech icons ticker */}
      <div className="border-t border-b border-white/10 bg-white/[0.02] py-4 overflow-hidden">
        <div className="hero-ticker-track w-max flex items-center gap-12">
          {[...Array(2)].map((_, outer) =>
            TECH_ICONS.map(({ name, Icon }, i) => (
              <span
                key={`${outer}-${i}`}
                className="flex shrink-0 items-center gap-2 text-white/40"
                title={name}
              >
                <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
                <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                  {name}
                </span>
              </span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
