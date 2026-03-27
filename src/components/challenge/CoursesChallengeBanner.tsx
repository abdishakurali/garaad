"use client";

import Link from "next/link";
import { pricingTranslations as t } from "@/config/translations/pricing";

export function CoursesChallengeBanner() {
  return (
    <div className="mb-12 rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-950/60 to-zinc-900/80 p-6 text-center md:p-8 md:text-left">
      <p className="mb-5 text-base font-medium leading-relaxed text-zinc-200 md:text-lg">
        Dhammaan casharrada waa bilaash. Haddii aad rabto waayo-aragnimo buuxda — koox, mentor, iyo taageero toos ah — eeg
        Challenge-ka; ma aha mid kugu qasab ah.
      </p>
      <Link
        href="/challenge"
        className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-500 md:w-auto"
      >
        {t.challenge_cta} — $149 hal mar →
      </Link>
    </div>
  );
}
