"use client";

import Link from "next/link";

/**
 * Same ROI story as Challenge page — surfaced on the homepage for visibility.
 */
export function LandingPricingComparison() {
  const rows = [
    "Jaamacad: $10,000+ sanadkii. 4 sano. Af-Ingiriis. (Aragti u badan)",
    "Bootcamp US: $15,000+. Fiiso la'aan. Af-Ingiriis.",
    "YouTube: Bilaash, laakiin cidna kuma caawinayso markaad ku xannibanto koodhka.",
  ];

  return (
    <section
      aria-labelledby="landing-roi-heading"
      className="border-y border-border bg-gradient-to-b from-muted/40 via-background to-background py-14 md:py-20"
    >
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <h2
          id="landing-roi-heading"
          className="text-balance text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          Waa maxay sababta Garaad u tahay maalgelinta ugu fiican ee aad sameyso?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground md:text-base">
          Qiimaha, waqtiga, luuqadda, iyo caawimaadda — isbar dhig.
        </p>
        <div className="mt-8 space-y-2 sm:mt-10">
          {rows.map((line) => (
            <div
              key={line}
              className="rounded-xl border border-border bg-card/60 px-4 py-3 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:text-base"
            >
              <span className="mr-2 text-muted-foreground/80" aria-hidden>
                —
              </span>
              {line}
            </div>
          ))}
          <div className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-4 text-sm leading-relaxed text-foreground sm:px-5 sm:text-base">
            <span className="mr-1.5" aria-hidden>
              🔥
            </span>
            <span className="font-semibold text-foreground">Garaad Challenge:</span>{" "}
            <span className="font-medium text-foreground">Lacag celin ah</span>. 3 bilood. Af-Soomaali. Mentor toos kuu
            caawinaya, iyo shahaado.
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center text-sm text-muted-foreground">
          <Link href="/subscribe?plan=challenge" className="font-semibold text-primary hover:underline">
            Arag faahfaahinta Challenge-ka →
          </Link>
        </p>
      </div>
    </section>
  );
}
