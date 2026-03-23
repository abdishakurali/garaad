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
        className={cn("mx-auto h-9 w-48 max-w-full animate-pulse rounded-lg bg-zinc-800", className)}
        aria-hidden
      />
    );
  }

  const tone =
    spots <= 3
      ? "border-violet-500/35 text-violet-200"
      : spots <= 6
        ? "border-white/15 text-zinc-300"
        : "border-white/10 text-zinc-400";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg border bg-zinc-900 px-3 py-2 text-sm font-medium sm:text-base",
        tone,
        className
      )}
      role="status"
    >
      <span>
        {spots} boos oo hadhay
      </span>
    </div>
  );
}
