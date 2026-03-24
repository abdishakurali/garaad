"use client";

import Link from "next/link";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { SpotsBadge } from "@/components/ui/SpotsBadge";
import { pricingTranslations as t } from "@/config/translations/pricing";

export function BlogChallengeCTA() {
  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining ?? 0;
  const waitlist = data?.is_waitlist_only ?? false;
  const cohortName = data?.active_cohort_name ?? "Challenge";

  return (
    <div className="mt-16 rounded-2xl border border-violet-500/30 bg-gradient-to-b from-zinc-900 to-black p-8 text-center">
      <h3 className="mb-3 text-xl font-bold text-white">
        Waxaad baratay maqaalkan — hadda waxaa xiga shaqada dhabta ah.
      </h3>
      <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-zinc-400">
        Challenge-ka Garaad waxaad ku dhisaysaa mashruuc dhab ah 3 bilood gudahood — mentor xirfadle ah iyo koox ayaa
        kuu haysta gacanta.
      </p>
      <div className="mb-6 flex justify-center">
        <SpotsBadge
          spots={spots}
          loading={loading && !data}
          waitlistOnly={waitlist}
          cohortName={cohortName}
        />
      </div>
      <Link
        href={waitlist ? "/subscribe?plan=challenge" : "/challenge"}
        className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-500"
      >
        {waitlist ? "Gali Liiska Sugitaanka Hadda" : `${t.challenge_cta} →`}
      </Link>
    </div>
  );
}
