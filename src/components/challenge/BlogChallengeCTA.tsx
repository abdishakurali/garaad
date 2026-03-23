"use client";

import Link from "next/link";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { SpotsBadge } from "@/components/ui/SpotsBadge";

export function BlogChallengeCTA() {
  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining ?? 0;

  return (
    <div className="mt-16 rounded-2xl border border-violet-500/30 bg-gradient-to-b from-zinc-900 to-black p-8 text-center">
      <h3 className="mb-3 text-xl font-bold text-white">
        Waxaad baratay maqaalkan — hadda waxaa xiga shaqada dhabta ah.
      </h3>
      <p className="mx-auto mb-6 max-w-lg text-sm leading-relaxed text-zinc-400">
        Challenge-ka Garaad waxaad ku dhisaysaa mashruuc dhab ah 3 bilood gudahood — Abdishakuur ayaa kuu haya
        gacanta.
      </p>
      <div className="mb-6 flex justify-center">
        <SpotsBadge spots={spots} loading={loading && !data} />
      </div>
      <Link
        href="/challenge"
        className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-500"
      >
        Ku biir Challenge-ka →
      </Link>
    </div>
  );
}
