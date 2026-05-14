"use client";

import Link from "next/link";
import { TrendingUp, Clock, ArrowRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackCard {
  title: string;
  goal: string;
  incomeTarget: string;
  weeks: number;
  buttonText: string;
  href: string;
  active: boolean;
}

const TRACKS: TrackCard[] = [
  {
    title: "Start Freelancing",
    goal: "Go from zero to landing your first paid client online",
    incomeTarget: "Your first $500 online",
    weeks: 4,
    buttonText: "Start this path →",
    href: "/courses/freelancing",
    active: true,
  },
  {
    title: "Get a Remote Job",
    goal: "Land a remote job with a real salary",
    incomeTarget: "A full-time remote salary",
    weeks: 8,
    buttonText: "Coming soon",
    href: "#",
    active: false,
  },
  {
    title: "Build a SaaS",
    goal: "Go from idea to a live product with paying users",
    incomeTarget: "Your first paying users",
    weeks: 12,
    buttonText: "Coming soon",
    href: "#",
    active: false,
  },
];

export function TrackGridClient() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">
          Choose your path
        </p>
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          What do you want to achieve?
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground">
          Pick the goal that matches where you want to go. Your path, lessons,
          and mentorship are built around it.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        {TRACKS.map((track) => (
          <div
            key={track.title}
            className={cn(
              "relative flex flex-col rounded-2xl border bg-card p-6 transition-shadow",
              track.active
                ? "border-gold shadow-lg shadow-gold/10 hover:shadow-xl hover:shadow-gold/15"
                : "border-border opacity-80"
            )}
          >
            {/* Coming soon badge */}
            {!track.active && (
              <span className="absolute right-4 top-4 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Coming soon
              </span>
            )}

            <h2 className="mb-2 text-lg font-bold text-foreground">
              {track.title}
            </h2>
            <p className="mb-5 flex-1 text-sm text-muted-foreground">
              {track.goal}
            </p>

            <div className="mb-6 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5 shrink-0 text-green-500" />
                <span>{track.incomeTarget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0" />
                <span>{track.weeks} weeks</span>
              </div>
            </div>

            {track.active ? (
              <Link
                href={track.href}
                className="btn-gold flex items-center justify-center gap-2 py-3 text-sm font-semibold"
              >
                {track.buttonText}
              </Link>
            ) : (
              <button
                disabled
                className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-muted py-3 text-sm font-semibold text-muted-foreground opacity-60"
              >
                <Lock className="h-3.5 w-3.5" />
                {track.buttonText}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
