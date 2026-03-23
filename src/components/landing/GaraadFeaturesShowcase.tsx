"use client";

import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Sparkles,
  Zap,
  Users,
  MessageCircle,
  Code2,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useFirstFreeLessonHref } from "@/hooks/useFirstFreeLessonHref";

/** Small Vercel-style triangle accent */
function VercelMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 76 65"
      className={cn("shrink-0 opacity-90", className)}
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M37.5274 0L75.0548 65H0L37.5274 0Z"
      />
    </svg>
  );
}

type FeatureDef = {
  title: string;
  desc: string;
  icon: LucideIcon;
  ctaLabel: string;
  /** Use "__FIRST_LESSON__" for dynamic first-lesson href from hook */
  ctaHref: string;
};

const features: FeatureDef[] = [
  {
    title: "Koorsooyin Af-Soomaali",
    desc: "Full-Stack, AI, iyo STEM — dhammaan waxaa lagu sharxayaa afkaaga hooyo.",
    icon: BookOpen,
    ctaLabel: "Arag koorsooyinka →",
    ctaHref: "/courses",
  },
  {
    title: "Casharro isdhexgal ah",
    desc: "Video, su’aalaha tooska ah, iyo tallaabo tallaabo — ma aha kaliya fiidiyowyo.",
    icon: Sparkles,
    ctaLabel: "Bilow cashar →",
    ctaHref: "__FIRST_LESSON__",
  },
  {
    title: "Horumar & XP",
    desc: "Streak, dhibco, iyo aragti ku saabsan sida aad u socotid.",
    icon: Zap,
    ctaLabel: "Arag heerkaaga →",
    ctaHref: "/dashboard",
  },
  {
    title: "Bulshada",
    desc: "La wadaag, weydii, kora asxaabtaada baraya.",
    icon: Users,
    ctaLabel: "Ku biir bulshada →",
    ctaHref: "/community",
  },
  {
    title: "Caawiye AI",
    desc: "Weydii su’aal kasta oo ku saabsan koorsooyinka — mar walba diyaar.",
    icon: MessageCircle,
    ctaLabel: "Isku day →",
    ctaHref: "/courses",
  },
  {
    title: "Tech casri ah",
    desc: "Next.js, React, AI APIs — waxa suuqa u baahan yahay.",
    icon: Code2,
    ctaLabel: "Bilow maanta →",
    ctaHref: "/subscribe",
  },
];

function FeatureCard({
  title,
  desc,
  icon: Icon,
  ctaLabel,
  ctaHref,
  firstFreeLessonHref,
}: FeatureDef & { firstFreeLessonHref: string }) {
  const resolvedHref = ctaHref === "__FIRST_LESSON__" ? firstFreeLessonHref : ctaHref;

  return (
    <Reveal>
      <div
        className={cn(
          "group relative flex h-full flex-col rounded-2xl border p-5 sm:p-6 transition-all duration-300",
          "bg-background/60 dark:bg-white/[0.03] backdrop-blur-sm",
          "border-black/[0.06] dark:border-white/[0.08]",
          "hover:border-primary/25 dark:hover:border-primary/30",
          "hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10",
          "hover:-translate-y-0.5"
        )}
      >
        <div className="absolute top-4 right-4 text-foreground/10 dark:text-white/15 group-hover:text-primary/30 transition-colors">
          <VercelMark className="h-4 w-[18px]" />
        </div>
        <div
          className={cn(
            "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl",
            "bg-primary/8 dark:bg-primary/15 text-primary",
            "ring-1 ring-primary/10"
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-semibold tracking-tight text-foreground pr-8">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {desc}
        </p>
        <div className="mt-4 pt-2">
          <Link
            href={resolvedHref}
            className="text-sm font-semibold text-primary hover:underline underline-offset-4"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

export function GaraadFeaturesShowcase() {
  const { href: firstFreeLessonHref } = useFirstFreeLessonHref();

  return (
    <section className="relative py-16 sm:py-24 px-4 overflow-hidden border-t border-border/40">
      {/* Dot grid — Vercel-ish subtle texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(circle at center, currentColor 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
          color: "hsl(var(--muted-foreground) / 0.15)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-transparent to-background dark:from-[#09090b] dark:via-transparent dark:to-[#09090b]" />

      {/* Soft glow orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/8 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-violet-500/6 blur-[90px]" />

      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <span className="flex h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
              <VercelMark className="h-2.5 w-[11px] text-foreground/70" />
              <span className="tracking-wide">Waxa Garaad kuu diyaariyey</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Barasho casri ah,{" "}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                hab nadiif ah
              </span>
            </h2>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Platform-kaaga oo isku xiran — koorso ilaa bulshada ilaa caawiyaha AI.
            </p>
          </div>
        </Reveal>

        {/* Connecting network (desktop) */}
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-0 top-0 hidden h-full w-full md:block"
            viewBox="0 0 1200 520"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <defs>
              <linearGradient id="garaad-line" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Horizontal connectors row 1 */}
            <path
              d="M 200 120 L 600 120 L 1000 120"
              stroke="url(#garaad-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 200 120 L 200 280 L 400 380"
              stroke="url(#garaad-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity={0.6}
            />
            <path
              d="M 600 120 L 600 280 L 600 380"
              stroke="url(#garaad-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity={0.6}
            />
            <path
              d="M 1000 120 L 1000 280 L 800 380"
              stroke="url(#garaad-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity={0.6}
            />
            {/* Row 2 subtle join */}
            <path
              d="M 400 380 L 600 380 L 800 380"
              stroke="url(#garaad-line)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              opacity={0.5}
            />
            {/* Nodes */}
            {[
              [200, 120],
              [600, 120],
              [1000, 120],
              [400, 380],
              [600, 380],
              [800, 380],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <circle
                  cx={cx}
                  cy={cy}
                  r="5"
                  className="fill-background stroke-primary/40 dark:fill-[#09090b]"
                  strokeWidth="1.5"
                />
                <circle cx={cx} cy={cy} r="2" className="fill-primary/80" />
              </g>
            ))}
          </svg>

          <div className="relative z-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 md:pt-4 md:pb-8">
            {features.slice(0, 3).map((f) => (
              <div key={f.title} className="md:pt-8 md:pb-4">
                <FeatureCard {...f} firstFreeLessonHref={firstFreeLessonHref} />
              </div>
            ))}
          </div>

          {/* Mobile: vertical connector + dots */}
          <div className="relative z-10 flex justify-center py-2 md:hidden">
            <div className="flex flex-col items-center gap-1">
              <div className="h-8 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
              <div className="flex gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shadow-[0_0_8px_hsl(var(--primary)/0.5)]" />
              </div>
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-primary/20 to-primary/40" />
            </div>
          </div>

          <div className="relative z-10 mt-0 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 md:mt-0">
            {features.slice(3, 6).map((f) => (
              <FeatureCard key={f.title} {...f} firstFreeLessonHref={firstFreeLessonHref} />
            ))}
          </div>
        </div>

        <Reveal>
          <div className="mt-14 flex flex-col items-center gap-3 text-center sm:mt-16">
            <Link
              href="/challenge"
              className="group inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-violet-500"
            >
              Challenge-ka ku jiro
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
