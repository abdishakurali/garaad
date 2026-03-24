"use client";

import { useEffect, useMemo, useState } from "react";

function parseTargetMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return Number.isFinite(t) ? t : null;
}

export interface CountdownTimerProps {
  /** ISO 8601 target instant */
  targetDate: string | null | undefined;
  /** Optional label above the timer */
  label?: string;
  className?: string;
}

/**
 * Countdown with Somali unit labels. At zero shows completion message.
 */
export function CountdownTimer({ targetDate, label, className = "" }: CountdownTimerProps) {
  const target = useMemo(() => parseTargetMs(targetDate ?? null), [targetDate]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (target == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (target == null) {
    return (
      <p className={`text-sm text-zinc-500 font-medium ${className}`}>
        Taariikhda kooxdu ay ku bilaabeyso weli lama dhigin.
      </p>
    );
  }

  const diff = Math.max(0, target - now);
  if (diff === 0) {
    return (
      <p className={`text-base font-medium text-zinc-300 ${className}`}>
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
        <p className="mb-3 text-center text-sm text-zinc-500">{label}</p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {cells.map((c) => (
          <div
            key={c.label}
            className="min-w-[4rem] rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-center"
          >
            <div className="text-lg font-semibold tabular-nums text-zinc-100 sm:text-xl">{c.value}</div>
            <div className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
