"use client";

import Link from "next/link";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { SpotsBadge } from "@/components/ui/SpotsBadge";

function pickCopy(articleHint: string): { headline: string; body: string } {
  const h = articleHint.toLowerCase();
  if (/shaqo|job|career|developer|horumar|tech|software|coding|program/i.test(h)) {
    return {
      headline: "Shaqo tech ah raadsanaysaa?",
      body: "Challenge-ka Garaad wuxuu kugu siinayaa xirfad, mashruuc dhab ah, iyo taageero mentor 3 bilood gudahood.",
    };
  }
  if (/startup|saas|ganacsi|business|mashruuc/i.test(h)) {
    return {
      headline: "Mashruuc ama startup ma rabtaa inaad dhisto?",
      body: "3 bilood: fikrad ilaa macaamiil — koox, mentor, iyo jadwal la isku raaco.",
    };
  }
  return {
    headline: "Waxaad baratay maqaalkan — hadda waxaa xiga shaqada dhabta ah.",
    body: "Challenge-ka Garaad waxaad ku dhisaysaa mashruuc dhab ah 3 bilood gudahood — mentor xirfadle ah iyo koox ayaa kuu haysta gacanta.",
  };
}

function formatDeadline(dateStr: string | null | undefined): string {
  if (!dateStr) return "20 April";
  const date = new Date(dateStr);
  return date.toLocaleDateString("so-SO", { day: "numeric", month: "short" });
}

export function BlogChallengeCTA({ articleHint = "" }: { articleHint?: string }) {
  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining ?? 0;
  const waitlist = data?.is_waitlist_only ?? false;
  const cohortName = data?.active_cohort_name ?? "Challenge";
  const startDate = data?.cohort_start_date ?? data?.next_cohort_start_date;
  const deadline = formatDeadline(startDate);
  const { headline, body } = pickCopy(articleHint);

  return (
    <div className="mt-16 rounded-2xl border-2 border-violet-500/50 bg-gradient-to-b from-zinc-950 to-black p-8 text-center shadow-2xl shadow-violet-500/20">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-500/20 px-4 py-1.5 text-sm font-bold text-red-400">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
        </span>
        Lagu soo gaaray {deadline}
      </div>
      <h3 className="mb-3 text-2xl font-bold text-white">{headline}</h3>
      <p className="mx-auto mb-6 max-w-lg text-base leading-relaxed text-zinc-300">{body}</p>
      <div className="mb-6 flex justify-center">
        <SpotsBadge
          spots={spots}
          loading={loading && !data}
          waitlistOnly={waitlist}
          cohortName={cohortName}
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={waitlist ? "/subscribe?plan=challenge" : "/challenge"}
          className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-8 py-4 text-base font-bold text-white hover:bg-violet-500 shadow-lg shadow-violet-600/30 transition-all hover:scale-105"
        >
          {waitlist ? "Gali Liiska Sugitaanka Hadda" : `Gal Challenge-ka →`}
        </Link>
        <Link
          href="/subscribe"
          className="inline-flex items-center justify-center rounded-xl border-2 border-zinc-700 bg-transparent px-8 py-4 text-base font-bold text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900 hover:text-white transition-all"
        >
          View Pricing
        </Link>
      </div>
    </div>
  );
}