"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { CheckCircle2, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/config/subscribePlans";
import { EXPLORER_IS_FREE } from "@/config/featureFlags";
import { pricingTranslations as pricingT } from "@/config/translations/pricing";
import { cn } from "@/lib/utils";

interface LessonCompleteModalProps {
  lessonTitle: string;
  /** Quiz score 0–100 when the lesson had problem blocks; ignored when hasQuiz is false */
  score: number;
  /** When false, the score stat is hidden */
  hasQuiz?: boolean;
  /** Course progress 0–100 from CourseEnrollment */
  courseProgressPercent: number;
  /** Completed lessons count (e.g. 3) */
  completedLessonsCount: number;
  /** Total lessons in course (e.g. 10) */
  totalLessonsCount: number;
  /** Whether there is a next lesson in the course sequence */
  hasNextLesson: boolean;
  /** True when every lesson in the course is completed (including this one) */
  courseFullyComplete: boolean;
  onNextLesson: () => void;
  onReview: () => void;
  onDashboard: () => void;
  lessonId: number | string;
  /** Non-premium: subtle upsell banner (auto-dismiss 5s). */
  showExplorerUpsell?: boolean;
}

export function LessonCompleteModal({
  lessonTitle,
  score,
  hasQuiz = false,
  courseProgressPercent,
  completedLessonsCount,
  totalLessonsCount,
  hasNextLesson,
  courseFullyComplete,
  onNextLesson,
  onReview,
  onDashboard,
  lessonId,
  showExplorerUpsell = false,
}: LessonCompleteModalProps) {
  const primaryCtaLabel = hasNextLesson
    ? "Casharka xiga →"
    : courseFullyComplete
      ? "Koorsada dhamee ✓"
      : "Ku laabo koorsada →";
  const router = useRouter();
  const posthog = usePostHog();
  const [celebrationIntro, setCelebrationIntro] = useState(true);
  const [upsellVisible, setUpsellVisible] = useState(showExplorerUpsell);
  const upsellCaptured = useRef(false);

  useEffect(() => {
    const t = window.setTimeout(() => setCelebrationIntro(false), 1500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!showExplorerUpsell) return;
    const t = setTimeout(() => setUpsellVisible(false), 5000);
    return () => clearTimeout(t);
  }, [showExplorerUpsell]);

  useEffect(() => {
    if (!upsellVisible || !posthog || upsellCaptured.current) return;
    upsellCaptured.current = true;
    posthog.capture("upgrade_prompt_shown", {
      trigger: "lesson_complete_banner",
      lesson_id: lessonId,
      plan: "explorer",
    });
  }, [upsellVisible, posthog, lessonId]);

  const handleDashboard = useCallback(() => {
    onDashboard();
    router.push("/dashboard");
  }, [onDashboard, router]);

  if (celebrationIntro) {
    return (
      <div
        className="fixed inset-0 z-[55] flex flex-col items-center justify-center bg-black/85 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lesson-celebration-heading"
      >
        <style>{`
          @keyframes lessonConfetti {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
          .lesson-confetti-piece {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 2px;
            animation: lessonConfetti 2s ease-in forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .lesson-confetti-piece { animation: none; opacity: 0.3; }
          }
        `}</style>
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {["#7c3aed", "#a78bfa", "#22c55e", "#38bdf8", "#f472b6"].map((color, i) => (
            <span
              key={i}
              className="lesson-confetti-piece"
              style={{
                left: `${12 + i * 18}%`,
                top: "-5%",
                backgroundColor: color,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          ))}
        </div>
        <span className="text-6xl motion-safe:animate-bounce" aria-hidden>
          🎉
        </span>
        <h2 id="lesson-celebration-heading" className="mt-4 text-2xl font-black text-white">
          Hambalyo! Waxaad dhamaysay casharkii
        </h2>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-center p-4 bg-black/70 backdrop-blur-sm"
      style={{ animation: "none" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lesson-complete-heading"
    >
      <div
        className="flex flex-1 items-center justify-center min-h-0 w-full"
      >
      <div
        className={cn(
          "w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl",
          "transition-all duration-300 ease-out",
          "scale-100 opacity-100"
        )}
        style={{
          animation: "lessonCompleteEntry 300ms ease-out forwards",
        }}
      >
        <style>{`
          @keyframes lessonCompleteEntry {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @media (prefers-reduced-motion: reduce) {
            @keyframes lessonCompleteEntry {
              from, to { opacity: 1; transform: scale(1); }
            }
          }
        `}</style>

        <div className="p-8 space-y-6">
          {/* 1. CELEBRATION HEADER */}
          <div className="text-center space-y-2">
            <div
              className="mx-auto w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center motion-safe:animate-bounce"
              style={{ backgroundColor: "#7c3aed" }}
            >
              <CheckCircle2 className="w-9 h-9 text-white" strokeWidth={2.5} />
            </div>
            <h2
              id="lesson-complete-heading"
              className="text-2xl font-extrabold text-white"
              style={{ fontFamily: "var(--font-display), Inter, sans-serif" }}
            >
              Hambalyo! Waxaad dhamaysay casharkii
            </h2>
            <p className="text-sm text-gray-400">{lessonTitle}</p>
          </div>

          {/* 2. STATS ROW */}
          <div className={cn("grid gap-3 grid-cols-1")}>
            {hasQuiz && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-3 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide">Score</p>
                <p className="text-lg font-bold text-white">{score}%</p>
              </div>
            )}
          </div>

          {/* 3. PROGRESS BAR */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-300">
              Koorsada horumarinta
            </p>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-600 transition-[width] duration-600 ease-out"
                style={{
                  width: `${courseProgressPercent}%`,
                  backgroundColor: "#7c3aed",
                  boxShadow: "0 0 8px #7c3aed",
                }}
              />
            </div>
            <p className="text-xs text-gray-400">
              {completedLessonsCount} / {totalLessonsCount} casharro
            </p>
          </div>

          {courseFullyComplete && (
            <div className="rounded-xl border border-emerald-500/35 bg-emerald-950/50 p-4 text-center space-y-2">
              <h3 className="text-base font-black text-white">Kooras-kii waad dhamaysay! 🏆</h3>
              <div className="mx-auto h-20 max-w-[200px] rounded-lg border-2 border-dashed border-emerald-500/40 bg-emerald-900/20 flex items-center justify-center text-[10px] font-bold text-emerald-200/70 px-2">
                Shahaadada (preview)
              </div>
              <Button
                asChild
                className="w-full h-10 text-sm font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border-0"
              >
                <Link href="/dashboard">Download-gareyso shahaadada</Link>
              </Button>
            </div>
          )}

          {/* 4. NEXT LESSON CTA */}
          <Button
            onClick={onNextLesson}
            className="w-full h-12 text-base font-semibold rounded-xl bg-purple-600 hover:bg-purple-700 text-white border-0"
            style={{ backgroundColor: "#7c3aed" }}
          >
            {primaryCtaLabel}
          </Button>

          <Button
            variant="outline"
            asChild
            className="w-full h-10 rounded-xl border-white/20 text-zinc-200 hover:bg-white/10"
          >
            <Link href="/courses">Koorsooyin kale →</Link>
          </Button>

          {/* 5. SECONDARY ACTIONS */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onReview}
              className="flex-1 rounded-xl border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Dib u eeg
            </Button>
            <Button
              variant="outline"
              onClick={handleDashboard}
              className="flex-1 rounded-xl border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Guriga
            </Button>
          </div>
        </div>
      </div>
      </div>

      {upsellVisible && (
        <div className="pointer-events-auto shrink-0 w-full max-w-lg mx-auto pb-4 px-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-zinc-900/95 px-4 py-3 text-sm text-zinc-200 shadow-lg">
            <p className="text-left leading-snug">
              {EXPLORER_IS_FREE ? (
                <>
                  Fur 54+ casharo —{" "}
                  <span className="font-semibold text-white">
                    {pricingT.explorer_free_price_display}
                  </span>{" "}
                  (samee akoon)
                </>
              ) : (
                <>
                  Fur 54+ casharo —{" "}
                  <span className="font-semibold text-white">
                    {PLANS.explorer.priceDisplay}
                    {PLANS.explorer.per}
                  </span>
                </>
              )}
            </p>
            <Button
              asChild
              size="sm"
              className="shrink-0 rounded-lg bg-violet-600 hover:bg-violet-500 text-white"
            >
              <Link
                href={
                  EXPLORER_IS_FREE
                    ? "/signup?ref=lesson_complete_banner"
                    : "/subscribe?plan=explorer&ref=lesson_complete_banner"
                }
              >
                {EXPLORER_IS_FREE ? "Samee akoon" : "Ku biir"}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
