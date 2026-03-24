"use client";

import Link from "next/link";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { pricingTranslations as t } from "@/config/translations/pricing";

export function CommunityChallengeBanner() {
  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining;

  const waitlist = data?.is_waitlist_only ?? false;

  const ctaLabel =
    loading && !data
      ? "Ku biir — …"
      : waitlist
        ? "Gali Liiska Sugitaanka Hadda"
        : typeof spots === "number"
          ? `${t.challenge_cta} — ${spots} boos →`
          : `${t.challenge_cta} →`;

  return (
    <div className="border-b border-gray-100 bg-gradient-to-r from-violet-950/40 to-transparent px-4 py-6 dark:border-white/5 dark:from-violet-950/30 lg:px-8">
      <h2 className="text-xl font-black text-gray-900 dark:text-white">Bulshada Garaad</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        Challenge-ka ardaydiisu waxay halkan ku wadaagaan mashruucyadooda, su&apos;aalahooda, iyo guushooda.
      </p>
      <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-zinc-200">Ma jirtid Challenge-ka?</p>
      <Link
        href={waitlist ? "/subscribe?plan=challenge" : "/challenge"}
        className="mt-4 inline-flex w-full max-w-md items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white hover:bg-violet-500 sm:w-auto"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
