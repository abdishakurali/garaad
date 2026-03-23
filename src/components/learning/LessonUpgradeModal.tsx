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
import { Sparkles, ArrowLeft } from "lucide-react";
import { grantLessonGatePreview } from "@/lib/lessonGatePreview";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";

export interface LessonUpgradeModalProps {
  coursePath: string;
  courseId: number | string;
  courseTitle?: string;
  lessonTitle?: string;
  lessonId: number | string;
}

/**
 * Gate for lessons beyond the free tier (lesson 4+) — Challenge upsell.
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
  const { data: status } = useChallengeStatus();

  const grantPreviewAndGoCourse = () => {
    grantLessonGatePreview(courseId, Number(lessonId));
    router.push(`${coursePath}#free-lessons`);
  };

  useEffect(() => {
    if (captured.current || !posthog) return;
    captured.current = true;
    posthog.capture("upgrade_prompt_shown", {
      trigger: "lesson_gate",
      lesson_id: lessonId,
      plan: "challenge",
    });
  }, [posthog, lessonId]);

  const spots = status?.spots_remaining;
  const waitlist = status?.is_waitlist_only;

  return (
    <Dialog
      open
      onOpenChange={(next) => {
        if (!next) grantPreviewAndGoCourse();
      }}
    >
      <DialogContent className="sm:max-w-md border-2 border-violet-500/50 bg-zinc-950 shadow-xl dark:bg-zinc-950 dark:shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_25px_50px_-12px_rgba(0,0,0,0.6)]">
        <DialogHeader className="text-center sm:text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 ring-1 ring-violet-400/40">
            <Sparkles className="h-7 w-7 text-violet-300" aria-hidden />
          </div>
          <DialogTitle className="text-xl font-black text-white">
            🔓 Casharkaan wuxuu u baahan yahay Challenge
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-4 text-left text-zinc-300 text-sm leading-relaxed">
              {lessonTitle ? (
                <p>
                  <span className="font-semibold text-white">Casharka: </span>
                  &ldquo;{lessonTitle}&rdquo;
                  {courseTitle ? ` — ${courseTitle}` : ""}
                </p>
              ) : null}
              {spots != null ? (
                <p className="rounded-xl border border-violet-500/40 bg-violet-950/50 px-4 py-3 text-center font-bold text-violet-100">
                  {spots} boos oo hadhay kohortan
                  {waitlist ? " — liiska sugitaanka ayaa furan" : ""}
                </p>
              ) : null}
              <p className="text-center text-base font-black text-white">Ku biir Challenge-ka — $149/bilaan</p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            asChild
            className="w-full font-bold bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white h-12 rounded-xl"
          >
            <Link href="/subscribe?plan=challenge&ref=lesson_gate">Ku biir Challenge-ka</Link>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full text-violet-200/90 hover:text-white hover:bg-violet-500/10"
          >
            <Link href={`${coursePath}#free-lessons`}>Ama sii wad bilaash — casharka 1-3 fur</Link>
          </Button>
          <Button
            variant="ghost"
            className="w-full gap-2 text-zinc-500 hover:text-zinc-200"
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
