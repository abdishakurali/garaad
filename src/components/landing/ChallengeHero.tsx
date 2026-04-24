"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Volume2 } from "lucide-react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";
import { usePostHog } from "posthog-js/react";

// ─── Vimeo player ─────────────────────────────────────────────────────────────
// Browsers block unmuted autoplay. Strategy: autoplay muted, show a centered
// play button overlay. Clicking it unmutes + hides the overlay permanently.
function VimeoHeroPlayer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const send = (method: string, value?: unknown) =>
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method, ...(value !== undefined && { value }) }),
      "https://player.vimeo.com"
    );

  const handlePlay = () => {
    send("play");
    send("setVolume", 1);
    send("setMuted", false);
    setPlaying(true);
  };

  const handlePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    send("pause");
    setPlaying(false);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    send("setVolume", muted ? 1 : 0);
    send("setMuted", !muted);
    setMuted((m) => !m);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black select-none">
      <div style={{ padding: "56.29% 0 0 0", position: "relative" }}>
        <iframe
          ref={iframeRef}
          src="https://player.vimeo.com/video/1186028450?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=0&muted=0&controls=0"
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
          title="garaad"
        />

        {/* Play button overlay — shown before first play */}
        {!playing && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={handlePlay}
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border-2 border-white/50 shadow-2xl transition-all duration-200 hover:bg-white/30 hover:scale-105">
              <svg viewBox="0 0 24 24" fill="white" className="w-9 h-9 ml-1.5 drop-shadow">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Controls — visible once playing */}
        {playing && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white px-3 py-1.5 text-xs font-semibold hover:bg-black/80 transition-colors"
              aria-label={muted ? "Unmute" : "Mute"}
            >
              <Volume2 className="w-3.5 h-3.5" />
              {muted ? "Dhageyso" : "Aamusi"}
            </button>
            <button
              onClick={handlePause}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm border border-white/20 text-white hover:bg-black/80 transition-colors"
              aria-label="Pause"
            >
              <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

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

  const posthog = usePostHog();

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
    <section className={`relative overflow-hidden transition-colors duration-300 ${
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

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-10 pb-12 sm:px-6 sm:pt-24 sm:pb-14 md:pt-28 md:pb-16 lg:px-8">

        {/* Badges row — hidden on mobile so CTA stays above fold */}
        <div className="hidden sm:flex flex-wrap justify-center gap-2 mb-2">
          {/* Live badge */}
          <span className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
            isDark
              ? "border-violet-500/25 bg-violet-500/10 text-violet-400"
              : "border-violet-200 bg-violet-50 text-violet-600"
          }`}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Cohort #2 hadda furan
          </span>

          {/* Social proof */}
          <div className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 ${
            isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-white shadow-sm"
          }`}>
            <div className="flex items-center -space-x-2">
              {AVATARS.map(({ initials, bg }) => (
                <div key={initials} className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[7px] font-bold text-white ${bg} ${
                  isDark ? "border-zinc-900" : "border-white"
                }`} aria-hidden>
                  {initials}
                </div>
              ))}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
              <span className={`font-bold ${isDark ? "text-violet-400" : "text-violet-600"}`}>97+</span> developer oo baranaya
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="mx-auto mt-4 sm:mt-7 max-w-3xl text-center font-black leading-[1.08] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Noqo{" "}
          <span className="text-violet-500 dark:text-violet-400">Full-Stack Developer</span>
        </h1>

        {/* Mobile-only primary CTA — above fold on 375px */}
        <div className="mt-6 flex sm:hidden justify-center">
          <Link
            href="/welcome"
            onClick={() => posthog?.capture("homepage_cta_clicked", { source: "hero_mobile_top" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-3.5 text-base font-bold text-white min-h-[44px] transition-all hover:bg-violet-500 active:scale-[0.98]"
          >
            Bilow Hadda
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Benefits — block on mobile (guaranteed left-alignment), flex row on desktop */}
        <ul className={`mx-auto mt-7 sm:mt-8 w-full px-8 sm:px-0 sm:w-auto sm:flex sm:flex-wrap sm:justify-center sm:items-center sm:gap-x-5 space-y-2.5 sm:space-y-0 text-sm sm:text-base ${
          isDark ? "text-zinc-400" : "text-slate-500"
        }`}>
          {[
            "mento khaas ah, tech casri ah & AI",
            "mashaariic dhab ah",
            "hel la talin bilash ah",
          ].map((text) => (
            <li key={text} className="flex items-center gap-2">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                isDark ? "bg-violet-500/15 text-violet-400" : "bg-violet-100 text-violet-600"
              }`}>
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="mx-auto mt-8 flex flex-col items-center gap-3 sm:mt-9 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/welcome"
            onClick={() => posthog?.capture("homepage_cta_clicked", { source: "hero_primary" })}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-violet-500 hover:shadow-2xl hover:shadow-violet-500/30 sm:w-auto sm:text-base"
          >
            Hel la talin bilash ah
            <ArrowRight className="h-4 w-4" />
          </Link>
<Link
              href="/mentorship"
              className={`text-sm font-medium underline-offset-4 transition-colors hover:underline ${
                isDark ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Arag manhajka ↓
            </Link>
        </div>

        {/* Video */}
        <div className="mx-auto mt-6 w-full max-w-2xl sm:mt-8">
          <VimeoHeroPlayer />
        </div>

      </div>
    </section>
  );
}
