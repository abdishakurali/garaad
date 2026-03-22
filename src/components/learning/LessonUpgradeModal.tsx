"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Lock, Sparkles, ArrowLeft } from "lucide-react";
import { PLANS } from "@/config/subscribePlans";
import { EXPLORER_IS_FREE } from "@/config/featureFlags";
import { pricingTranslations as pricingT } from "@/config/translations/pricing";
import { grantLessonGatePreview } from "@/lib/lessonGatePreview";

const SUBSCRIBE_EXPLORER_HREF =
  "/subscribe?plan=explorer&ref=lesson_gate" as const;

export interface LessonUpgradeModalProps {
  coursePath: string;
  /** Numeric course id (for one-time preview token). */
  courseId: number | string;
  courseTitle?: string;
  lessonTitle?: string;
  lessonId: number | string;
}

/**
 * Inline gate when a guest or free user opens lesson 2+ — not a full-page redirect.
 */
export function LessonUpgradeModal({
  coursePath,
  courseId,
  courseTitle,
  lessonTitle,
  lessonId,
}: LessonUpgradeModalProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const captured = useRef(false);

  const grantPreviewAndGoCourse = () => {
    grantLessonGatePreview(courseId, Number(lessonId));
    router.push(coursePath);
  };

  useEffect(() => {
    if (captured.current || !posthog) return;
    captured.current = true;
    posthog.capture("upgrade_prompt_shown", {
      trigger: "lesson_gate",
      lesson_id: lessonId,
      plan: "explorer",
    });
  }, [posthog, lessonId]);

  const explorer = PLANS.explorer;
  const gateHref = EXPLORER_IS_FREE ? "/signup" : SUBSCRIBE_EXPLORER_HREF;
  const priceMain = EXPLORER_IS_FREE
    ? pricingT.explorer_free_price_display
    : explorer.priceDisplay;
  const pricePer = EXPLORER_IS_FREE ? pricingT.explorer_free_per : explorer.per;
  const ctaLabel = EXPLORER_IS_FREE
    ? pricingT.explorer_free_cta_signup
    : `Bilow Hadda — ${explorer.priceDisplay}${explorer.per}`;

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) grantPreviewAndGoCourse();
      }}
    >
      <DialogContent
        className="sm:max-w-md border-2 border-primary/20 bg-background shadow-xl dark:border-violet-500/35 dark:bg-slate-950 dark:shadow-[0_0_0_1px_rgba(139,92,246,0.15),0_25px_50px_-12px_rgba(0,0,0,0.6)]"
      >
        <DialogHeader className="text-center sm:text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 dark:from-violet-500/25 dark:to-purple-600/20 dark:ring-1 dark:ring-violet-500/30">
            <Lock
              className="h-8 w-8 text-primary dark:text-violet-400"
              aria-hidden
            />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground dark:text-slate-50">
            Fur dhammaan casharada koorsadan
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-left text-muted-foreground text-sm leading-relaxed dark:text-slate-400">
              <p>
                <span className="font-medium text-foreground dark:text-slate-100">
                  Waxaad isku dayaysaa inaad furto:{" "}
                </span>
                {lessonTitle
                  ? `“${lessonTitle}”`
                  : "cashar ka baxsan heerka bilaashka ah"}
                .
                {EXPLORER_IS_FREE
                  ? " Samee akoon ama soo gal si aad u hesho dhammaan casharrada — Explorer waa bilaash."
                  : courseTitle
                    ? ` Koorsada ${courseTitle} waxay leedahay casharo badan oo kaliya ku jira qorshaha Explorer.`
                    : " Dhammaan casharada ka baxsan casharka 1aad waxay u baahan yihiin Explorer."}
              </p>
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-foreground dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground dark:text-slate-500 mb-1">
                  Qiimaha
                </p>
                <p className="text-lg font-bold tabular-nums">
                  {explorer.name} — {priceMain}
                  {pricePer ? (
                    <span className="text-sm font-normal text-muted-foreground dark:text-slate-400">
                      {" "}
                      {pricePer}
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-muted-foreground dark:text-slate-500 mt-1">
                  {EXPLORER_IS_FREE
                    ? "Ma jiro lacag bixin looga baahan yahay Explorer."
                    : "Jooji xilli kasta · Lacag bixinta ammaan ah"}
                </p>
              </div>
              <p className="flex items-start gap-2 text-xs">
                <Sparkles className="h-4 w-4 shrink-0 text-primary dark:text-violet-400 mt-0.5" />
                <span className="dark:text-slate-300">
                  Hel dhammaan casharada, XP, streaks, iyo bulshada — casharka
                  1aad wali waa bilaash.
                </span>
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            asChild
            className="w-full font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 dark:from-violet-600 dark:to-purple-600 dark:hover:from-violet-500 dark:hover:to-purple-500"
          >
            <Link href={gateHref}>{ctaLabel}</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full gap-2 text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
            onClick={grantPreviewAndGoCourse}
          >
            <ArrowLeft className="h-4 w-4" />
            Ku noqo bogga koorsada
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
