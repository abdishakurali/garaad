"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonStepBulletsProps {
  /** Zero-based index of the current block */
  currentIndex: number;
  totalSteps: number;
  onStepClick: (index: number) => void;
  coursePath: string;
  /** If set, back opens this (e.g. quit confirm) instead of navigating away immediately */
  onBackRequest?: () => void;
  /** e.g. "Casharka 2 / 12" */
  lessonPositionLabel?: string;
  /** Estimated minutes left in this lesson */
  estMinutesRemaining?: number;
}

/**
 * Minimal lesson chrome: back + bullet stepper (replaces the full LessonHeader).
 */
export function LessonStepBullets({
  currentIndex,
  totalSteps,
  onStepClick,
  coursePath,
  onBackRequest,
  lessonPositionLabel,
  estMinutesRemaining,
}: LessonStepBulletsProps) {
  const router = useRouter();
  const total = Math.max(1, totalSteps);

  const handleBack = () => {
    if (onBackRequest) onBackRequest();
    else router.push(coursePath);
  };

  return (
    <header
      className="sticky top-0 z-40 px-3 sm:px-5 pt-[max(1.25rem,calc(env(safe-area-inset-top)+0.75rem))] pb-3"
      style={{
        background:
          "linear-gradient(180deg, rgb(9 9 11 / 0.92) 0%, rgb(9 9 11 / 0.75) 70%, transparent 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-2xl mx-auto flex items-start gap-3">
        <button
          type="button"
          onClick={handleBack}
          className={cn(
            "mt-0.5 shrink-0 flex h-11 w-11 items-center justify-center rounded-2xl",
            "bg-white/[0.05] text-zinc-400 hover:bg-white/[0.09] hover:text-white",
            "border border-white/[0.08] transition-all duration-200 active:scale-95"
          )}
          aria-label="Dib u noqo koorsada"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </button>

        <div className="flex-1 min-w-0 pt-0.5">
          {(lessonPositionLabel || estMinutesRemaining != null) && (
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
              {lessonPositionLabel ? (
                <p className="text-sm font-black text-white tracking-tight">{lessonPositionLabel}</p>
              ) : (
                <span />
              )}
              {estMinutesRemaining != null ? (
                <p className="text-[11px] font-bold text-zinc-500 tabular-nums">
                  ~{estMinutesRemaining} daqiiqo ayaa haray
                </p>
              ) : null}
            </div>
          )}
          <div
            className={cn(
              "flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 py-3 px-3 sm:px-4 rounded-2xl",
              "bg-gradient-to-br from-white/[0.06] to-white/[0.02]",
              "border border-white/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
            )}
          >
            {Array.from({ length: total }).map((_, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onStepClick(i)}
                  className={cn(
                    "shrink-0 rounded-full transition-all duration-300 ease-out",
                    active &&
                      "h-2 w-9 sm:w-10 bg-violet-500 shadow-[0_0_16px_rgba(139,92,246,0.35)]",
                    done &&
                      !active &&
                      "h-2 w-2 bg-emerald-400/90 hover:bg-emerald-400 ring-2 ring-emerald-500/20",
                    !done &&
                      !active &&
                      "h-2 w-2 bg-zinc-700/90 hover:bg-zinc-600 ring-1 ring-zinc-600/40"
                  )}
                  aria-current={active ? "step" : undefined}
                  aria-label={
                    active
                      ? `Tallaabada hadda: ${i + 1} ka mid ah ${total}`
                      : `U gudub tallaabo ${i + 1}`
                  }
                />
              );
            })}
          </div>
          <p className="text-center text-[11px] sm:text-xs text-zinc-500 mt-2 font-medium tabular-nums tracking-wide">
            Tallaabo {currentIndex + 1} / {total}
          </p>
        </div>

      </div>
    </header>
  );
}
