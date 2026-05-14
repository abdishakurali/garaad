"use client";

import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Lock, ArrowRight, TrendingUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserProgress } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

interface Week {
  id: number;
  title: string;
  slug: string;
  week_number: number;
  income_milestone: string;
  estimated_time_hours: string;
  lesson_count: number;
  category_id: number | null;
  is_published: boolean;
}

interface Track {
  id: number;
  slug: string;
  title: string;
  goal_description: string;
  income_target: string;
  week_count: number;
  courses: Week[];
}

function WeekSkeleton() {
  return (
    <div className="relative flex gap-4 animate-pulse">
      <div className="relative z-10 mt-5 h-9 w-9 shrink-0 rounded-full bg-muted" />
      <div className="flex-1 rounded-2xl border border-border bg-card p-5">
        <div className="mb-3 h-4 w-24 rounded bg-muted" />
        <div className="mb-2 h-5 w-3/4 rounded bg-muted" />
        <div className="mb-4 h-4 w-full rounded bg-muted" />
        <div className="flex gap-4">
          <div className="h-3 w-20 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function FreelancingDashboardClient() {
  const { progress } = useUserProgress();
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lms/tracks/freelancing/`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setTrack(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const weeks = track?.courses ?? [];
  const totalLessons = weeks.reduce((s, w) => s + w.lesson_count, 0);
  const overallPercent = 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      {/* Back */}
      <Link
        href="/courses"
        className="mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Dhammaan waddooyinka
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {track?.income_target ?? "$500 kaaga ugu horreeya ee online ah"}
          </span>
        </div>
        <h1 className="mb-1 text-3xl font-bold text-foreground sm:text-4xl">
          {track?.title ?? "Bilow Shaqo Madax-bannaan"}
        </h1>
        {!loading && (
          <p className="mb-6 text-sm text-muted-foreground">
            {weeks.length} toddobaadyo · {totalLessons} cashar
          </p>
        )}

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Horumarka guud</span>
            <span className="font-bold tabular-nums text-foreground">{overallPercent}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gold transition-all duration-700"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            0 / {weeks.length || "—"} toddobaadyo la dhammaystay
          </p>
        </div>
      </div>

      {/* Week list */}
      <div className="relative">
        <div className="absolute left-[17px] top-5 bottom-5 w-px bg-border" />
        <div className="space-y-4">
          {loading && [0, 1, 2, 3, 4].map((i) => <WeekSkeleton key={i} />)}

          {error && (
            <p className="text-sm text-muted-foreground text-center py-8">
              Wax khalad ah ayaa dhacay. Dib u tijaabi.
            </p>
          )}

          {!loading && !error && weeks.map((week, idx) => {
            const isActive = idx === 0;
            const weekHref = week.category_id
              ? `/courses/${week.category_id}/${week.slug}`
              : null;
            const weekLabel = `Toddobaadka ${week.week_number || idx + 1}-aad`;

            return (
              <div key={week.id} className="relative flex gap-4">
                {/* Step bubble */}
                <div
                  className={cn(
                    "relative z-10 mt-5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                    isActive
                      ? "border-gold bg-gold text-white"
                      : "border-border bg-card text-muted-foreground"
                  )}
                >
                  {isActive ? (week.week_number || idx + 1) : <Lock className="h-3.5 w-3.5" />}
                </div>

                {/* Card */}
                <div
                  className={cn(
                    "flex-1 rounded-2xl border bg-card p-5 transition-shadow",
                    isActive
                      ? "border-gold shadow-md shadow-gold/10"
                      : "border-border opacity-70"
                  )}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {weekLabel}
                      </p>
                      <h2 className="text-base font-bold leading-snug text-foreground">
                        {week.title}
                      </h2>
                    </div>
                    {isActive ? (
                      <span className="shrink-0 rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
                        Firfircoon
                      </span>
                    ) : (
                      <span className="shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Dhowaan soo socda
                      </span>
                    )}
                  </div>

                  {week.income_milestone && (
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      🎯 {week.income_milestone}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {week.estimated_time_hours && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {week.estimated_time_hours}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5" />
                      {week.lesson_count} cashar
                    </span>
                  </div>

                  <div className="mt-5">
                    {isActive && weekHref ? (
                      <Link
                        href={weekHref}
                        className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold"
                      >
                        Bilow {weekLabel} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        🔒 Dhammaystir Toddobaadka {idx} horta
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
