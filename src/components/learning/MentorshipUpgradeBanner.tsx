"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Star } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { Button } from "@/components/ui/button";

interface MentorshipUpgradeBannerProps {
  lessonId: number | string;
  /** "lesson_1_complete" | "lesson_3_complete" | "onboarding_complete" | "community" */
  trigger?: string;
  /** Auto-dismiss delay in ms. Set 0 to disable. Default: 8000 */
  autoDismissMs?: number;
  onDismiss?: () => void;
}

export function MentorshipUpgradeBanner({
  lessonId,
  trigger = "lesson_complete",
  autoDismissMs = 8000,
  onDismiss,
}: MentorshipUpgradeBannerProps) {
  const posthog = usePostHog();
  const captured = useRef(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (captured.current || !posthog) return;
    captured.current = true;
    posthog.capture("mentorship_upsell_shown", { trigger, lesson_id: lessonId });
  }, [posthog, trigger, lessonId]);

  useEffect(() => {
    if (!autoDismissMs) return;
    const t = setTimeout(() => setVisible(false), autoDismissMs);
    return () => clearTimeout(t);
  }, [autoDismissMs]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const handleCtaClick = () => {
    posthog?.capture("mentorship_upsell_clicked", { trigger, lesson_id: lessonId });
  };

  if (!visible) return null;

  return (
    <div className="pointer-events-auto w-full max-w-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="relative flex items-start gap-3 rounded-2xl border border-gold/30 bg-zinc-900/98 px-4 py-4 shadow-xl shadow-black/30">
        {/* Dismiss */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Xir"
          className="absolute right-3 top-3 rounded p-0.5 text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        {/* Gold star accent */}
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/15">
          <Star className="h-4 w-4 fill-gold text-gold" />
        </div>

        <div className="min-w-0 flex-1 pr-4">
          <p className="text-sm font-semibold leading-snug text-white">
            Sii wad oo mentor toos ah la hel
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-zinc-400">
            Casharka 1aad waa dhammaatay. Qorshaha 60-casho-ah, code review,
            iyo dammaanadda dakhliga ayaa kuu diyaar.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <Button
              asChild
              size="sm"
              onClick={handleCtaClick}
              className="h-8 rounded-lg bg-gold px-4 text-xs font-bold text-black hover:bg-gold/90"
            >
              <Link href={`/subscribe?ref=${trigger}`}>
                Mentorship bilow →
              </Link>
            </Button>
            <span className="text-[11px] text-zinc-500">
              $49/bilood · dammaanad
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
