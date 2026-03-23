"use client";

import { cn } from "@/lib/utils";

export interface SpotsBadgeProps {
  spots: number;
  loading?: boolean;
  className?: string;
}

/**
 * Live cohort spots: red (≤3), orange (≤6), green (>6).
 */
export function SpotsBadge({ spots, loading, className }: SpotsBadgeProps) {
  if (loading) {
    return (
      <div
        className={cn("h-9 w-56 max-w-full rounded-full bg-white/10 animate-pulse mx-auto", className)}
        aria-hidden
      />
    );
  }

  const tone =
    spots <= 3
      ? "bg-red-500/20 text-red-300 border-red-500/50 motion-safe:animate-pulse"
      : spots <= 6
        ? "bg-orange-500/20 text-orange-200 border-orange-500/40"
        : "bg-emerald-500/15 text-emerald-300 border-emerald-500/35";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-sm sm:text-base font-black",
        tone,
        className
      )}
      role="status"
    >
      <span aria-hidden>{spots <= 3 ? "🔴" : spots <= 6 ? "🟠" : "🟢"}</span>
      <span>
        {spots} boos oo hadhay
      </span>
    </div>
  );
}
