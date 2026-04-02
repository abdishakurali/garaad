"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { useSessionStorage } from "@/composables";

const SESSION_KEY = "garaad_urgency_strip_dismissed";

export function UrgencyStrip() {
  const { value: dismissed, setValue: setDismissed } = useSessionStorage<boolean>(SESSION_KEY, false);
  const { data, loading } = useChallengeStatus();

  const handleDismiss = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDismissed(true);
    },
    [setDismissed]
  );

  if (dismissed) return null;

  if (loading && !data) {
    return <div className="h-10 w-full animate-pulse bg-zinc-900" aria-hidden />;
  }

  if (!data?.active_cohort_name) return null;

  const start = data.cohort_start_date ?? data.next_cohort_start_date ?? null;
  const startFmt =
    start != null
      ? new Date(start).toLocaleDateString("so-SO", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  const waitlist = data.is_waitlist_only && data.spots_remaining === 0;

  return (
    <div className="relative w-full border-b border-white/10 bg-zinc-900">
      <Link
        href={waitlist ? "/subscribe?plan=challenge" : "/challenge"}
        className="flex w-full items-center justify-center px-10 py-2.5 text-center text-sm text-zinc-300 hover:text-zinc-100"
      >
        <span className="leading-snug">
          {waitlist ? (
            <>
              Kooxda {data.active_cohort_name} way buuxdaa. Ha seegin fursada xigta — geli liiska sugitaanka · Kooxda
              xigta: {startFmt}
            </>
          ) : (
            <>
              Challenge-ka hadda gal · Kooxda {data.active_cohort_name}:{" "}
              {data.spots_remaining} boos oo hadhay · Waxay bilaabaysaa {startFmt}
            </>
          )}
        </span>
      </Link>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
        aria-label="Xir ogeysiiska"
      >
        <X className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
