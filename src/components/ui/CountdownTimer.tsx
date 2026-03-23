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
        Taariikhda bilowga waxaa la xaqiijin doonaa.
      </p>
    );
  }

  const diff = Math.max(0, target - now);
  if (diff === 0) {
    return (
      <p className={`text-base font-black text-emerald-400 ${className}`}>
        Kohorta waa bilaabatay!
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
        <p className="text-sm font-bold text-zinc-300 mb-3 text-center">{label}</p>
      ) : null}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {cells.map((c) => (
          <div
            key={c.label}
            className="min-w-[4.25rem] rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center backdrop-blur-sm"
          >
            <div className="text-xl sm:text-2xl font-black tabular-nums text-white">{c.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
