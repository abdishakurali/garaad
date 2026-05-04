"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Volume2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useTheme } from "next-themes";
import { usePostHog } from "posthog-js/react";
import { getMediaUrl } from "@/lib/utils";

interface LandingStats {
    students_count: number;
    courses_count: number;
    learners_this_month: number;
}

interface LearnerUser {
    id: number;
    first_name: string;
    profile_picture?: string;
}

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
          loading="lazy"
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

// ─── Component ────────────────────────────────────────────────────────────────
export function ChallengeHero() {
  const [stats, setStats] = useState<LandingStats | null>(null);
  const [socialUsers, setSocialUsers] = useState<LearnerUser[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/landing-stats/`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
    
    // Fetch social proof users (prioritizes those with profile pictures)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/social-proof/`)
      .then((res) => res.json())
      .then((data) => setSocialUsers(data.slice(0, 5)))
      .catch(() => {});
  }, []);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const { user } = useAuthStore();
  void user;
  const posthog = usePostHog();

  const scrollToCurriculum = () => {
    document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth" });
  };

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

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-6 pb-8 sm:px-6 sm:pt-16 sm:pb-12 md:pt-20 md:pb-14 lg:px-8">

        {/* Headline - New branding */}
        <h1 className="mx-auto mt-2 sm:mt-4 max-w-3xl text-center font-bold leading-[1.1] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white">
          Isticmaal AI.<br />
          Samee lacag.<br />
          <span className="text-violet-600 dark:text-violet-400">Xor noqo maanta.</span>
        </h1>

        {/* Subtext */}
        <p className={`mx-auto mt-3 sm:mt-4 max-w-lg text-center text-base text-slate-600 dark:text-zinc-400`}>
          Sheekooyinka isbeddelka — laga soo bilaabo eber ilaa xirfad dhab ah ama ganacsi.
        </p>

        {/* CTA */}
        <div className="mx-auto mt-6 sm:mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
          <Link
            href="/welcome"
            onClick={() => posthog?.capture("homepage_cta_clicked", { source: "hero_primary" })}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500 sm:w-auto sm:py-3.5 sm:text-base"
          >
            Bilow hadda — $49/bish
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/mentorship"
            onClick={() => posthog?.capture("homepage_cta_clicked", { source: "hero_secondary" })}
            className={`flex w-full items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-medium transition-all sm:w-auto sm:py-3.5 sm:text-base ${
              isDark
                ? "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            Arag sida ay u shaqeyso
          </Link>
        </div>

        {/* Trust indicators with profile images */}
        <div className={`mx-auto mt-6 flex items-center justify-center gap-4 text-xs ${
          isDark ? "text-zinc-400" : "text-slate-600"
        }`}>
          <div className="flex items-center -space-x-2">
            {socialUsers.slice(0, 5).map((user, i) => (
              user.profile_picture ? (
                <img
                  key={user.id}
                  src={getMediaUrl(user.profile_picture, "profile_pics")}
                  alt={user.first_name}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 object-cover ring-2 ring-transparent"
                  style={{ zIndex: 5 - i }}
                />
              ) : (
                <div
                  key={user.id}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-violet-600 flex items-center justify-center text-white text-xs font-bold"
                  style={{ zIndex: 5 - i }}
                >
                  {user.first_name?.[0]?.toUpperCase() || "?"}
                </div>
              )
            ))}
            {socialUsers.length > 0 && socialUsers.length < 5 && stats?.students_count && stats.students_count > socialUsers.length && (
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 text-xs font-bold ring-2 ring-transparent">
                +{stats.students_count - socialUsers.length}
              </div>
            )}
          </div>
          {stats?.students_count && stats.students_count > 0 && (
            <span className="font-semibold">{stats.students_count} aya kuso biiray</span>
          )}
        </div>

        {/* Video */}
        <div className="mx-auto mt-6 w-full max-w-2xl sm:mt-8">
          <VimeoHeroPlayer />
        </div>

      </div>
    </section>
  );
}
