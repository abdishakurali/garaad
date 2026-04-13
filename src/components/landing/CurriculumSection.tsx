"use client";

import Link from "next/link";
import { ArrowRight, Code2, Server, Zap, CheckCircle2 } from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const MONTHS = [
  {
    month: "Bilood 1",
    title: "Aasaaska",
    subtitle: "HTML · CSS · JavaScript · React",
    icon: Code2,
    color: "from-violet-600 to-violet-500",
    borderColor: "border-violet-500/40",
    glowColor: "shadow-violet-500/15",
    lessons: [
      "HTML & CSS — Dhis wax ka muuqda",
      "JavaScript aasaaska — ku hadal browser-ka",
      "React — UI-yada casriga ah",
      "Git & VS Code — qalab horumariyaha",
    ],
    outcome: "Dhis: Portfolio website oo shaqaynaysa",
    outcomeColor: "text-violet-300",
  },
  {
    month: "Bilood 2",
    title: "Full-Stack",
    subtitle: "Node.js · Express · MongoDB · API",
    icon: Server,
    color: "from-purple-600 to-purple-500",
    borderColor: "border-purple-500/40",
    glowColor: "shadow-purple-500/15",
    lessons: [
      "Node.js & Express — server-ka dib u dhis",
      "MongoDB — xogta keydi",
      "API REST — front iyo back xidh",
      "Xaqiijinta isticmaalaha (Auth)",
    ],
    outcome: "Dhis: Full-stack app oo xog keydisa",
    outcomeColor: "text-purple-300",
  },
  {
    month: "Bilood 3",
    title: "SaaS & AI",
    subtitle: "Next.js · TypeScript · AI Integration",
    icon: Zap,
    color: "from-fuchsia-600 to-fuchsia-500",
    borderColor: "border-fuchsia-500/40",
    glowColor: "shadow-fuchsia-500/15",
    lessons: [
      "Next.js — web apps heerka korporaatka",
      "TypeScript — code ammaan ah",
      "AI API (ChatGPT/Claude) — ku dar garaadka",
      "Deploy & launch — adduunka soo geli",
    ],
    outcome: "Dhis: SaaS product oo macaamiil leh",
    outcomeColor: "text-fuchsia-300",
  },
];

const OUTCOMES = [
  {
    emoji: "💼",
    title: "Hel Shaqo",
    body: "Portfolio + shahado + xirfado suuqa shaqada looga baahan yahay.",
  },
  {
    emoji: "🚀",
    title: "Dhis Mashruuc",
    body: "Alaab SaaS ah oo shaqaynaysa, joogaan macaamiil la hadlayaan.",
  },
  {
    emoji: "🌍",
    title: "Shaqo Madax-banaan",
    body: "Portfolio leh oo macaamiisha caalamiga ah lagu tusayo.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function CurriculumSection() {
  return (
    <section
      id="curriculum"
      className="relative overflow-hidden bg-zinc-950 py-16 text-zinc-100 sm:py-20 md:py-24"
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
        aria-hidden
      />
      {/* Glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/6 blur-[140px]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-10 text-center sm:mb-14">
          <span className="mb-3 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-300">
            Barnaamijka 3-Bilood
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
            Waxa Aad{" "}
            <span className="text-violet-400">Baran</span> &{" "}
            <span className="text-violet-400">Dhisan</span> Doontid
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Koorso kasta waxay kugu dhammaanaysaa mashruuc dhab ah. Markaad 3da bilood dhammaato —
            waxaad haysan doontaa portfolio, xirfado, iyo waayo-aragnimo diyaar u ah suuqa shaqada.
          </p>
        </div>

        {/* Month cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {MONTHS.map(({ month, title, subtitle, icon: Icon, color, borderColor, glowColor, lessons, outcome, outcomeColor }) => (
            <div
              key={month}
              className={`relative flex flex-col rounded-2xl border ${borderColor} bg-zinc-900/70 p-5 shadow-xl ${glowColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:rounded-3xl sm:p-6`}
            >
              {/* Month badge */}
              <div className={`mb-4 flex items-center gap-2`}>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg sm:h-10 sm:w-10`}>
                  <Icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500 sm:text-xs">
                    {month}
                  </p>
                  <p className="text-sm font-bold text-zinc-100 sm:text-base">{title}</p>
                </div>
              </div>

              <p className="mb-4 text-[11px] font-semibold uppercase tracking-wider text-zinc-600 sm:text-xs">
                {subtitle}
              </p>

              {/* Lesson list */}
              <ul className="mb-5 flex-1 space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson} className="flex items-start gap-2 text-xs text-zinc-400 sm:text-sm">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-500 sm:h-4 sm:w-4" />
                    {lesson}
                  </li>
                ))}
              </ul>

              {/* Outcome */}
              <div className="rounded-xl border border-white/8 bg-white/4 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 sm:text-xs">
                  Natiijada
                </p>
                <p className={`mt-1 text-xs font-semibold ${outcomeColor} sm:text-sm`}>
                  {outcome}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider with label */}
        <div className="my-12 flex items-center gap-4 sm:my-14">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
          <span className="text-xs font-semibold uppercase tracking-widest text-zinc-600">
            Markad 3da bilood dhammaato
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
        </div>

        {/* Outcomes grid */}
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {OUTCOMES.map(({ emoji, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/8 bg-zinc-900/60 p-4 text-center sm:p-6"
            >
              <span className="text-3xl sm:text-4xl" aria-hidden>{emoji}</span>
              <h3 className="mt-3 text-sm font-bold text-zinc-100 sm:text-base">{title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 sm:text-sm">{body}</p>
            </div>
          ))}
        </div>

        {/* Challenge CTA banner */}
        <div className="mt-12 overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/70 to-zinc-900/80 p-6 text-center sm:mt-14 sm:rounded-3xl sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-violet-400 sm:text-sm">
            Maxaad sugaysaa?
          </p>
          <h3 className="mt-2 text-xl font-extrabold text-zinc-100 sm:text-2xl md:text-3xl">
            Ku biir Challenge-ka — Mentor Ayaa Kula Joogi Doona
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-zinc-400 sm:text-base">
            Casharrada oo kaliya kuuma filan. Challenge-ka waxaad helaysaa mentor 1:1,
            koox, iyo taageero toos ah — tallaabaad ka tallaabaad ilaa dhammaadka.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/welcome"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/25 sm:w-auto"
            >
              Bilaaw Challenge-ka
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/welcome"
              className="text-sm font-medium text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline"
            >
              Marka hore casharrada tijaabi →
            </Link>
          </div>
          <p className="mt-4 text-xs text-zinc-600">
            ✓ 7 maalmood oo damaanad ah &nbsp;·&nbsp; ✓ Lacag celin ah &nbsp;·&nbsp; ✓ Kaliya 10 arday koox kasta
          </p>
        </div>

      </div>
    </section>
  );
}
