"use client";

import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { Sparkles } from "lucide-react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { pricingTranslations as t } from "@/config/translations/pricing";

/**
 * Optional Challenge hint on lesson 4+ — does not block content.
 */
export function LessonChallengeSoftInvite() {
  const posthog = usePostHog();
  const { data: status } = useChallengeStatus();
  const spots = status?.spots_remaining;
  const waitlist = status?.is_waitlist_only;

  return (
    <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-950/25 px-4 py-4 text-zinc-200 shadow-sm sm:px-5">
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-300">
          <Sparkles className="h-4 w-4" aria-hidden />
        </div>
        <div className="min-w-0 space-y-2 text-sm leading-relaxed">
          <p className="font-semibold text-zinc-100">Waayo-aragnimo buuxda (ikhtiyaari ah)</p>
          <p className="text-zinc-400">
            Dhammaan casharrada waa bilaash — sii wad sida aad rabto. Haddii aad rabto koox, mentor, iyo
            taageero toos ah, Challenge-ka waa ikhtiyaar: ma ahan mid kugu qasab ah.
          </p>
          {spots != null ? (
            <p className="text-xs font-medium text-violet-200/90">
              {spots} boos ayaa ka haray kooxdan
              {waitlist ? " — liiska sugitaanka ayaa sidoo kale furan" : ""}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-1">
            <Link
              href="/subscribe?plan=challenge&ref=lesson_soft"
              className="inline-flex items-center font-bold text-violet-300 underline-offset-4 hover:text-violet-200 hover:underline"
              onClick={() =>
                posthog?.capture("challenge_soft_cta_clicked", { source: "lesson_inline" })
              }
            >
              {t.challenge_cta_compact} — lacag celin ah
            </Link>
            <span className="hidden text-zinc-600 sm:inline" aria-hidden>
              ·
            </span>
            <Link
              href="/subscribe?plan=challenge"
              className="text-xs font-medium text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline"
              onClick={() =>
                posthog?.capture("challenge_soft_info_clicked", { source: "lesson_inline" })
              }
            >
              Faahfaahin Challenge
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
