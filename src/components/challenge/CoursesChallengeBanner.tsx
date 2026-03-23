"use client";

import Link from "next/link";

export function CoursesChallengeBanner() {
  return (
    <div className="mb-12 rounded-2xl border border-violet-500/25 bg-gradient-to-r from-violet-950/60 to-zinc-900/80 p-6 text-center md:p-8 md:text-left">
      <p className="mb-5 text-base font-medium leading-relaxed text-zinc-200 md:text-lg">
        Koorsooyinkan waa qeyb yar oo kamid ah waxa aad garaad ka heleyso, haddii ad rabto adeegena oo dhameystiran kuso biir Challenge-ga.
      </p>
      <Link
        href="/challenge"
        className="inline-flex w-full items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white hover:bg-violet-500 md:w-auto"
      >
        Ku biir Challenge-ka →
      </Link>
    </div>
  );
}
