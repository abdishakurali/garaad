"use client";

import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Lock, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserProgress } from "@/hooks/useApi";

interface Week {
  number: number;
  title: string;
  incomeMilestone: string;
  estimatedTime: string;
  lessons: number;
  active: boolean;
  href?: string;
}

const WEEKS: Week[] = [
  {
    number: 1,
    title: "Build your skill foundation with AI",
    incomeMilestone: "Understand how to use AI to work faster than any competitor",
    estimatedTime: "4 hours",
    lessons: 6,
    active: true,
    href: "/courses/saas-challenge/html-css",
  },
  {
    number: 2,
    title: "Learn HTML, CSS and JavaScript",
    incomeMilestone: "Build and deliver your first real website",
    estimatedTime: "8 hours",
    lessons: 18,
    active: false,
  },
  {
    number: 3,
    title: "Build with ReactJS",
    incomeMilestone: "Deliver a modern web app a client would pay for",
    estimatedTime: "3 hours",
    lessons: 5,
    active: false,
  },
  {
    number: 4,
    title: "Land your first client",
    incomeMilestone: "Close your first paid project",
    estimatedTime: "2 hours",
    lessons: 0,
    active: false,
  },
];

export function FreelancingDashboardClient() {
  const { progress } = useUserProgress();

  // Compute overall percent from any enrolled courses in this track
  // For now default to 0 until wired to real data
  const overallPercent: number = 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Back link */}
      <Link
        href="/courses"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All paths
      </Link>

      {/* Track header */}
      <div className="mb-8">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-xs font-semibold text-muted-foreground">
            Your first $500 online
          </span>
        </div>
        <h1 className="mb-4 text-2xl font-bold text-foreground sm:text-3xl">
          Start Freelancing
        </h1>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Overall progress</span>
            <span>{overallPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gold transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Week list */}
      <div className="space-y-3">
        {WEEKS.map((week) => (
          <div
            key={week.number}
            className={cn(
              "rounded-2xl border bg-card p-5 transition-shadow",
              week.active
                ? "border-gold shadow-md shadow-gold/10"
                : "border-border opacity-75"
            )}
          >
            <div className="flex items-start gap-4">
              {/* Week number bubble */}
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  week.active
                    ? "bg-gold text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {week.active ? week.number : <Lock className="h-4 w-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Week {week.number}
                    </p>
                    <h2 className="font-semibold text-foreground">{week.title}</h2>
                  </div>
                  {/* Status badge */}
                  {week.active ? (
                    <span className="shrink-0 rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                      Active
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Coming soon
                    </span>
                  )}
                </div>

                {/* Income milestone */}
                <p className="mt-1 text-xs text-muted-foreground">
                  🎯 {week.incomeMilestone}
                </p>

                {/* Meta row */}
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {week.estimatedTime}
                  </span>
                  {week.lessons > 0 && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {week.lessons} lessons
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-4">
                  {week.active && week.href ? (
                    <Link
                      href={week.href}
                      className="btn-gold inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold"
                    >
                      Start week <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      🔒 Complete week {week.number - 1} first
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
