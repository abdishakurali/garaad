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

const SUBSCRIBE_EXPLORER_HREF =
  "/subscribe?plan=explorer&ref=lesson_gate" as const;

export interface LessonUpgradeModalProps {
  coursePath: string;
  courseTitle?: string;
  lessonTitle?: string;
  lessonId: number | string;
}

/**
 * Inline gate when a guest or free user opens lesson 2+ — not a full-page redirect.
 */
export function LessonUpgradeModal({
  coursePath,
  courseTitle,
  lessonTitle,
  lessonId,
}: LessonUpgradeModalProps) {
  const router = useRouter();
  const posthog = usePostHog();
  const captured = useRef(false);

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

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) router.push(coursePath);
      }}
    >
      <DialogContent className="sm:max-w-md border-2 border-primary/20 shadow-xl">
        <DialogHeader className="text-center sm:text-center space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20">
            <Lock className="h-8 w-8 text-primary" aria-hidden />
          </div>
          <DialogTitle className="text-xl font-bold">
            Fur dhammaan casharada koorsadan
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-3 text-left text-muted-foreground text-sm leading-relaxed">
              <p>
                <span className="font-medium text-foreground">
                  Waxaad isku dayaysaa inaad furto:{" "}
                </span>
                {lessonTitle
                  ? `“${lessonTitle}”`
                  : "cashar ka baxsan heerka bilaashka ah"}
                .
                {courseTitle
                  ? ` Koorsada ${courseTitle} waxay leedahay casharo badan oo kaliya ku jira qorshaha Explorer.`
                  : " Dhammaan casharada ka baxsan casharka 1aad waxay u baahan yihiin Explorer."}
              </p>
              <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-foreground">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Qiimaha
                </p>
                <p className="text-lg font-bold tabular-nums">
                  {explorer.name} — {explorer.priceDisplay}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    {explorer.per}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Jooji xilli kasta · Lacag bixinta ammaan ah
                </p>
              </div>
              <p className="flex items-start gap-2 text-xs">
                <Sparkles className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                <span>
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
            className="w-full font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Link href={SUBSCRIBE_EXPLORER_HREF}>
              Subscribe Now — {explorer.priceDisplay}/mo
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full gap-2 text-muted-foreground"
            onClick={() => router.push(coursePath)}
          >
            <ArrowLeft className="h-4 w-4" />
            Ku noqo bogga koorsada
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
