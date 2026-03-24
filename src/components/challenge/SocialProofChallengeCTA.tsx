"use client";

import Link from "next/link";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { pricingTranslations as t } from "@/config/translations/pricing";

export function SocialProofChallengeCTA() {
  const { data } = useChallengeStatus();
  const waitlist = data?.is_waitlist_only ?? false;

  return (
    <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-violet-500/25 bg-zinc-900/50 px-6 py-8 text-center">
      <p className="mb-6 text-sm leading-relaxed text-zinc-300 sm:text-base">
        Abdiaziz, Ilyas, Abdiladif — dhammaan waxay ka soo baxeen Challenge-ka. Tan xigta adiga ayay noqon kartaa.
      </p>
      <Link
        href={waitlist ? "/subscribe?plan=challenge" : "/challenge"}
        className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-500"
      >
        {waitlist ? "Gali Liiska Sugitaanka Hadda" : `${t.challenge_cta} →`}
      </Link>
    </div>
  );
}
