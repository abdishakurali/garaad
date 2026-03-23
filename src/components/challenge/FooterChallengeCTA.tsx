"use client";

import Link from "next/link";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { SpotsBadge } from "@/components/ui/SpotsBadge";

export function FooterChallengeCTA() {
  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining ?? 0;

  return (
    <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-gray-800 bg-zinc-950/80 px-4 py-6 sm:flex-row sm:justify-center sm:gap-6">
      <span className="text-sm font-semibold text-gray-200">Diyaar ma tahay?</span>
      <Link
        href="/challenge"
        className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
      >
        Ku biir Challenge-ka →
      </Link>
      <SpotsBadge spots={spots} loading={loading && !data} className="border-violet-500/40" />
    </div>
  );
}
