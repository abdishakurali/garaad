"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

function parseTargetMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : null;
}

export interface CountdownTimerProps {
  targetDate: string | null | undefined;
  label?: string;
  className?: string;
}

export function CountdownTimer({ targetDate, label, className = "" }: CountdownTimerProps) {
  const { theme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = theme === "dark";
  const target = useMemo(() => parseTargetMs(targetDate ?? null), [targetDate]);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!mounted) return;
    setNow(Date.now());
    if (target == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [mounted, target]);

  if (!mounted) {
    return (
      <div className={className}>
        {label ? (
          <p className="mb-3 text-center text-sm text-zinc-500">{label}</p>
        ) : null}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {["maalmood", "saacadood", "daqiiqo", "ilbiriqsi"].map((label) => (
            <div
              key={label}
              className="min-w-[4rem] rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-center"
            >
              <div className="text-lg font-semibold tabular-nums text-zinc-100 sm:text-xl">0</div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (target == null) {
    return (
      <p className={cn("text-sm font-medium", isDark ? "text-zinc-500" : "text-slate-500", className)}>
        Taariikhda kooxdu ay ku bilaabeyso weli lama dhigin.
      </p>
    );
  }

  if (now === null) {
    return (
      <div className={cn(
        "animate-pulse h-24 rounded-lg",
        isDark ? "bg-zinc-800" : "bg-slate-200",
        className
      )} />
    );
  }

  const diff = Math.max(0, target - now);
  if (diff === 0) {
    return (
      <p className={cn("text-base font-medium", isDark ? "text-zinc-300" : "text-slate-600", className)}>
        Kooxdu way bilaabatay!
      </p>
    );
  }

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const cells: { label: string; value: number }[] = [
    { label: "maalmood", value: days },
    { label: "saacadood", value: hours },
    { label: "daqiiqo", value: minutes },
    { label: "ilbiriqsi", value: seconds },
  ];

  return (
    <div className={className}>
      {label ? (
        <p className={cn("mb-3 text-center text-sm", isDark ? "text-zinc-500" : "text-slate-500")}>{label}</p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {cells.map((c) => (
          <div
            key={c.label}
            className={cn(
              "min-w-[4rem] rounded-lg border px-3 py-2 text-center",
              isDark
                ? "border-white/10 bg-zinc-900"
                : "border-slate-200 bg-white"
            )}
          >
            <div className={cn("text-lg font-semibold tabular-nums sm:text-xl", isDark ? "text-zinc-100" : "text-slate-800")}>
              {c.value}
            </div>
            <div className={cn("text-[10px] font-medium uppercase tracking-wide", isDark ? "text-zinc-500" : "text-slate-500")}>
              {c.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
