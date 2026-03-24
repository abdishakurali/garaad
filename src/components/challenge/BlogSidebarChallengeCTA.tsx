"use client";

import Link from "next/link";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";

export function BlogSidebarChallengeCTA() {
  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining ?? 0;
  const waitlist = data?.is_waitlist_only ?? false;
  const cohort = data?.active_cohort_name ?? "Challenge";

  const statusLine =
    loading && !data
      ? "Challenge-ka — boosyo xaddidan"
      : waitlist
        ? `Kooxda ${cohort} waa buuxdaa — diiradda saar kooxda xigta`
        : `Challenge-ka — ${spots} boos ayaa haray`;

  return (
    <div className="sticky top-24 rounded-2xl border border-violet-500/25 bg-zinc-900/40 p-5 text-center">
      <p className="text-sm font-semibold leading-snug text-zinc-200">{statusLine}</p>
      <Link
        href={waitlist ? "/subscribe?plan=challenge" : "/challenge"}
        className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-500"
      >
        {waitlist ? "Gali Liiska Sugitaanka Hadda" : "Ku biir →"}
      </Link>
    </div>
  );
}
