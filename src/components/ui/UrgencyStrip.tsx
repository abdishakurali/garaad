"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";

const SESSION_KEY = "garaad_urgency_strip_dismissed";

export function UrgencyStrip() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { data, loading } = useChallengeStatus();

  useEffect(() => {
    try {
      setDismissed(sessionStorage.getItem(SESSION_KEY) === "1");
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* private mode */
    }
    setDismissed(true);
  }, []);

  if (!mounted || dismissed) return null;

  if (loading && !data) {
    return (
      <div
        className="w-full py-2 px-4 bg-purple-600 animate-pulse"
        aria-hidden
      />
    );
  }

  if (!data?.active_cohort_name) return null;
  if (data.is_waitlist_only && data.spots_remaining === 0) return null;

  const start = data.cohort_start_date ?? data.next_cohort_start_date ?? null;
  const startFmt =
    start != null
      ? new Date(start).toLocaleDateString("so-SO", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="relative w-full bg-purple-600 hover:bg-purple-700 transition-colors">
      <Link
        href="/challenge"
        className="flex w-full items-center justify-center gap-2 py-2 px-10 text-sm font-medium text-white text-center"
      >
        <span aria-hidden>🚀</span>
        <span className="leading-snug">
          Kohorta {data.active_cohort_name}: {data.spots_remaining} boos oo hadhay · Waxay bilaabantaa{" "}
          {startFmt}
        </span>
      </Link>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-white/90 hover:bg-white/15 hover:text-white"
        aria-label="Xir ogeysiiska"
      >
        <X className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}
