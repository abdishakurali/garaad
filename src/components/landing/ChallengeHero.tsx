"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Users, Trophy, Clock } from "lucide-react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";

// ─── Animated code-rain canvas ────────────────────────────────────────────────
function CodeRainCanvas({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "01アイウエオ{}=>/[]();:,.+-*#ReactNextNodeMongo".split("");
    const fontSize = 13;
    let columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops.length = 0;
      for (let i = 0; i < columns; i++) drops[i] = Math.random() * -50;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let rafId: number;
    let lastTime = 0;

    function draw(now: number) {
      rafId = requestAnimationFrame(draw);
      if (now - lastTime < 60) return;
      lastTime = now;
      if (!ctx || !canvas) return;

      // Fade trail
      ctx.fillStyle = isDark ? "rgba(9,9,15,0.18)" : "rgba(248,248,252,0.22)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        if (isDark) {
          const r = 120 + Math.floor(Math.random() * 60);
          const b = 200 + Math.floor(Math.random() * 55);
          ctx.fillStyle = `rgba(${r},40,${b},0.55)`;
        } else {
          ctx.fillStyle = `rgba(124,58,237,${0.08 + Math.random() * 0.1})`;
        }
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5;
      }
    }

    rafId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${isDark ? "opacity-30" : "opacity-60"}`}
      aria-hidden
    />
  );
}

// ─── Static data ──────────────────────────────────────────────────────────────
const AVATARS = [
  { initials: "AA", bg: "bg-emerald-600/90" },
  { initials: "MA", bg: "bg-violet-600/90" },
  { initials: "RR", bg: "bg-amber-600/90" },
  { initials: "M",  bg: "bg-cyan-600/90" },
];

const STATS = [
  { icon: Users,  label: "97+ arday",  sub: "hadda wax baranaya" },
  { icon: Trophy, label: "Mentor 1:1", sub: "hanuunin toos ah" },
  { icon: Clock,  label: "30 daqiiqo", sub: "maalintii waa ku filan tahay" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function ChallengeHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  const { user } = useAuthStore();
  void user;
  const { data, loading } = useChallengeStatus();
  void loading;

  const scrollToCurriculum = () => {
    document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (!mounted) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-background">
        <div className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
          <div className="h-[420px] animate-pulse rounded-2xl bg-muted" />
        </div>
      </section>
    );
  }

  return (
    <section className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
      isDark
        ? "bg-zinc-950 text-zinc-100"
        : "bg-slate-50 text-slate-900"
    }`}>
      {/* Code rain */}
      <CodeRainCanvas isDark={isDark} />

      {/* Glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className={`absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[160px] ${
          isDark ? "bg-violet-700/10" : "bg-violet-300/40"
        }`} />
        <div className={`absolute bottom-0 right-0 h-[400px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full blur-[120px] ${
          isDark ? "bg-purple-600/8" : "bg-violet-200/50"
        }`} />
        {!isDark && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.025)_1px,transparent_1px)] bg-[size:64px_64px]" />
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-20 md:py-24 lg:px-8">

        {/* Headline */}
        <h1 className="mx-auto max-w-3xl text-balance text-center text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
          Noqo{" "}
          <span className="relative inline-block text-violet-500 dark:text-violet-400">
            Developer
            <svg className="absolute -bottom-1 left-0 w-full sm:-bottom-2" viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden>
              <path d="M2 4 Q 25 8 50 4 T 98 4" fill="none" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </span>{" "}
          3 Bilood gudahood
        </h1>

        {/* Subtext */}
        <p className={`mx-auto mt-4 max-w-xl text-balance text-center text-base leading-relaxed sm:mt-6 sm:text-lg ${
          isDark ? "text-zinc-400" : "text-slate-600"
        }`}>
          Mentor Somali ah ayaa{" "}
          <span className={`font-semibold ${isDark ? "text-zinc-200" : "text-slate-800"}`}>tallaabo-tallaabo</span>{" "}
          kuu hagi doona. Dhis mashruucyo dhab ah, baro xirfadaha suuqu rabo, horey u soco —{" "}
          <span className={`font-semibold ${isDark ? "text-zinc-200" : "text-slate-800"}`}>30 daqiiqo</span> maalintii.
        </p>

        {/* Social proof */}
        <div className={`mx-auto mt-5 flex w-fit items-center gap-3 rounded-full border px-4 py-2 sm:mt-6 ${
          isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white shadow-sm"
        }`}>
          <div className="flex items-center -space-x-2">
            {AVATARS.map(({ initials, bg }) => (
              <div key={initials} className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-[9px] font-bold text-white ${bg} ${
                isDark ? "border-zinc-900" : "border-white"
              }`} aria-hidden>
                {initials}
              </div>
            ))}
          </div>
          <span className={`text-sm ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
            <span className={`font-semibold ${isDark ? "text-zinc-200" : "text-slate-800"}`}>97+</span> developers oo baranaya
          </span>
        </div>

        {/* CTA */}
        <div className="mx-auto mt-7 flex flex-col items-center gap-3 sm:mt-9 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/welcome"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/25 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
          >
            Ku biir Challenge-ka
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            onClick={scrollToCurriculum}
            className={`text-sm font-medium underline-offset-4 transition-colors hover:underline ${
              isDark ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Arag manhajka ↓
          </button>
        </div>

        {/* Stat chips */}
        <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-2 sm:mt-10 sm:gap-3">
          {STATS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className={`flex flex-col items-center rounded-xl border px-2 py-3 text-center sm:px-3 ${
              isDark ? "border-white/8 bg-white/5" : "border-slate-200 bg-white shadow-sm"
            }`}>
              <Icon className={`mb-1 h-4 w-4 sm:h-5 sm:w-5 ${isDark ? "text-violet-400" : "text-violet-600"}`} />
              <span className={`text-xs font-bold sm:text-sm ${isDark ? "text-zinc-200" : "text-slate-800"}`}>{label}</span>
              <span className={`mt-0.5 text-[10px] sm:text-xs ${isDark ? "text-zinc-500" : "text-slate-500"}`}>{sub}</span>
            </div>
          ))}
        </div>

        {/* Video */}
        <div className="mx-auto mt-4 w-full max-w-2xl sm:mt-5">
          <Link href="/welcome" className="group relative block overflow-hidden rounded-xl border bg-black border-white/10">
            <div className="relative w-full" style={{ padding: "56.25% 0 0 0" }}>
              <iframe
                src="https://player.vimeo.com/video/1152611300?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&controls=1&background=0"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                title="Garaad Challenge"
                loading="lazy"
              />
            </div>
          </Link>
        </div>

        {/* Soft note */}
        <p className={`mt-6 text-center text-xs sm:mt-7 sm:text-sm ${isDark ? "text-zinc-600" : "text-slate-400"}`}>
          Haddii aad rabto inaad marka hore tijaabiso —{" "}
          <Link href="/welcome" className="font-medium text-violet-500 underline-offset-4 hover:underline">
            koorsooyinka ku billow lacag la&apos;aan
          </Link>
          . Laakiin xasuuso: koorsooyinka kaligood kuma filna khibrad dhammaystiran.
        </p>
      </div>
    </section>
  );
}
