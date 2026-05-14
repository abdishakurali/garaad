"use client";

import Link from "next/link";
import { TrendingUp, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constants";

interface Track {
  id: number;
  slug: string;
  title: string;
  goal_description: string;
  income_target: string;
  week_count: number;
  is_published?: boolean;
}

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-border bg-card p-6">
      <div className="mb-3 h-5 w-3/4 rounded bg-muted" />
      <div className="mb-5 space-y-2">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
      <div className="mb-6 space-y-2">
        <div className="h-3 w-1/2 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
      </div>
      <div className="h-10 w-full rounded-xl bg-muted" />
    </div>
  );
}

export function TrackGridClient() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/lms/tracks/`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : (data?.results ?? []);
        setTracks(list);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold">
          Dooro waddadaada
        </p>
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          Maxaad doonaysaa inaad gaarto?
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground">
          Dooro yoolka la jaanqaadaya meesha aad rabto inaad tagto. Waddadaada,
          duruustaada, iyo hagidaada waxaa loo dhisay iyada oo taas laga duulayo.
        </p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        {loading && [0, 1, 2].map((i) => <CardSkeleton key={i} />)}

        {!loading && tracks.map((track, idx) => {
          const isFirst = idx === 0;
          const href = `/courses/${track.slug}`;

          return (
            <div
              key={track.id}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-6 transition-shadow",
                isFirst
                  ? "border-gold shadow-lg shadow-gold/10 hover:shadow-xl hover:shadow-gold/15"
                  : "border-border opacity-80"
              )}
            >
              {!isFirst && (
                <span className="absolute right-4 top-4 rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Dhowaan soo socda
                </span>
              )}

              <h2 className="mb-2 text-lg font-bold text-foreground">
                {track.title}
              </h2>
              <p className="mb-5 flex-1 text-sm text-muted-foreground">
                {track.goal_description}
              </p>

              <div className="mb-6 space-y-2 text-xs text-muted-foreground">
                {track.income_target && (
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span>{track.income_target}</span>
                  </div>
                )}
                {track.week_count > 0 && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{track.week_count} toddobaadyo</span>
                  </div>
                )}
              </div>

              {isFirst ? (
                <Link
                  href={href}
                  className="btn-gold flex items-center justify-center gap-2 py-3 text-sm font-semibold"
                >
                  Biloow waddadan →
                </Link>
              ) : (
                <button
                  disabled
                  className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border bg-muted py-3 text-sm font-semibold text-muted-foreground opacity-60"
                >
                  <Lock className="h-3.5 w-3.5" />
                  Dhowaan soo socda
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
