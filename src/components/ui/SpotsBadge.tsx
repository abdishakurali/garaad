"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

export interface SpotsBadgeProps {
  spots: number;
  loading?: boolean;
  className?: string;
  waitlistOnly?: boolean;
  cohortName?: string | null;
}

export function SpotsBadge({
  spots,
  loading,
  className,
  waitlistOnly,
  cohortName,
}: SpotsBadgeProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (loading) {
    return (
      <div
        className={cn(
          "mx-auto h-9 w-48 max-w-full animate-pulse rounded-lg",
          isDark ? "bg-zinc-800" : "bg-slate-200",
          className
        )}
        aria-hidden
      />
    );
  }

  if (waitlistOnly) {
    const label = cohortName?.trim() ? cohortName.trim() : "Kooxdan";
    return (
      <div
        className={cn(
          "inline-flex max-w-full items-center justify-center rounded-lg border px-3 py-2 text-center text-sm font-semibold sm:text-base",
          isDark 
            ? "border-violet-500/40 bg-violet-950/40 text-violet-100" 
            : "border-violet-200 bg-violet-50 text-violet-700",
          className
        )}
        role="status"
      >
        <span className="text-balance">
          Kooxda {label} way buuxdaa — diiradda saar kooxda xigta
        </span>
      </div>
    );
  }

  const tone =
    spots <= 3
      ? isDark ? "border-violet-500/35 text-violet-200" : "border-violet-300 text-violet-700"
      : spots <= 6
        ? isDark ? "border-white/15 text-zinc-300" : "border-slate-300 text-slate-600"
        : isDark ? "border-white/10 text-zinc-400" : "border-slate-200 text-slate-500";

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium sm:text-base",
        isDark ? "bg-zinc-900" : "bg-white",
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
