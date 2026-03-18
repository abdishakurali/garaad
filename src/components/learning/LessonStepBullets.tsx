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
}

/**
 * Minimal lesson chrome: back + bullet stepper (replaces the full LessonHeader).
 */
export function LessonStepBullets({
  currentIndex,
  totalSteps,
  onStepClick,
  coursePath,
}: LessonStepBulletsProps) {
  const router = useRouter();
  const total = Math.max(1, totalSteps);

  return (
    <header
      className="sticky top-0 z-40 px-3 sm:px-5 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3"
      style={{
        background:
          "linear-gradient(180deg, rgb(9 9 11 / 0.92) 0%, rgb(9 9 11 / 0.75) 70%, transparent 100%)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-2xl mx-auto flex items-start gap-3">
        <button
          type="button"
          onClick={() => router.push(coursePath)}
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

        {/* Balance layout with back button */}
        <div className="w-11 shrink-0" aria-hidden />
      </div>
    </header>
  );
}
