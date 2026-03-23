"use client";

const steps = [
  {
    n: 1,
    title: "Ku biir",
    body: "$149 hal mar. Cohort-ka gal.",
  },
  {
    n: 2,
    title: "Baro oo dhis",
    body: "3 bilood — casharrada, wicitaannada, iyo koodhka dib u eegista.",
  },
  {
    n: 3,
    title: "Shaqo ama bilow",
    body: "Ka bax Challenge-ka adigoo haysta shahaado, portfolio, iyo xirfad.",
  },
];

export function ChallengeHowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="border-b border-white/5 px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-20"
    >
      <div className="mx-auto max-w-3xl">
        <h2 id="how-it-works-heading" className="text-center text-xl font-bold text-zinc-50 sm:text-2xl md:text-3xl">
          Sidee u shaqaysaa?
        </h2>
        <ol className="mt-10 space-y-8">
          {steps.map((s) => (
            <li
              key={s.n}
              className="flex gap-4 rounded-lg border border-white/10 bg-zinc-900/40 p-5 sm:gap-5 sm:p-6"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600 text-lg font-black text-white"
                aria-hidden
              >
                {s.n}
              </span>
              <div>
                <h3 className="text-lg font-bold text-zinc-50">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400 sm:text-base">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
