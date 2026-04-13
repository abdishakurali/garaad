"use client";

import Link from "next/link";
import { ArrowRight, Code2, Server, Zap, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const MONTHS = [
  {
    month: "Bisha 1-aad",
    title: "Aasaaska (Foundations)",
    subtitle: "HTML · CSS · JavaScript · React",
    icon: Code2,
    gradientLight: "from-violet-600 to-violet-500",
    gradientDark: "from-violet-600 to-violet-500",
    borderLight: "border-violet-300/60",
    borderDark: "border-violet-500/40",
    lessons: [
      "HTML & CSS — Dhis waxyaabaha muuqda",
      "JavaScript basics — la hadal browser-ka",
      "React — UIs-ka casriga ah",
      "Git & VS Code — agabka developer-ka",
    ],
    outcome: "Dhis: website Portfolio ah oo shaqaynaya",
    outcomeColorLight: "text-violet-700",
    outcomeColorDark: "text-violet-300",
  },
  {
    month: "Bisha 2-aad",
    title: "Full-Stack",
    subtitle: "Node.js · Express · MongoDB · API",
    icon: Server,
    gradientLight: "from-purple-600 to-purple-500",
    gradientDark: "from-purple-600 to-purple-500",
    borderLight: "border-purple-300/60",
    borderDark: "border-purple-500/40",
    lessons: [
      "Node.js & Express — dhis server-ka",
      "MongoDB — kaydi xogta",
      "REST API — isku xir front iyo back",
      "User Authentication (Auth)",
    ],
    outcome: "Dhis: app full-stack ah oo xog kaydinaya",
    outcomeColorLight: "text-purple-700",
    outcomeColorDark: "text-purple-300",
  },
  {
    month: "Bisha 3-aad",
    title: "SaaS & AI",
    subtitle: "Next.js · TypeScript · AI Integration",
    icon: Zap,
    gradientLight: "from-fuchsia-600 to-fuchsia-500",
    gradientDark: "from-fuchsia-600 to-fuchsia-500",
    borderLight: "border-fuchsia-300/60",
    borderDark: "border-fuchsia-500/40",
    lessons: [
      "Next.js — web apps heer shirkadeed ah",
      "TypeScript — kood ammaan ah",
      "AI API (ChatGPT/Claude) — ku dar garaad macmal ah",
      "Deploy & launch — hawada geli aduunka oo dhan",
    ],
    outcome: "Dhis: wax soo saar SaaS ah oo leh isticmaalayaal dhab ah",
    outcomeColorLight: "text-fuchsia-700",
    outcomeColorDark: "text-fuchsia-300",
  },
];

const OUTCOMES = [
  {
    emoji: "💼",
    title: "Shaqo Hel",
    body: "Portfolio + certification + xirfadaha suuqa shaqadu u baahan yahay.",
  },
  {
    emoji: "🚀",
    title: "Dhis Wax-soo-saar (Product)",
    body: "SaaS product shaqaynaya, oo ay isticmaalayaashu isticmaalayaan.",
  },
  {
    emoji: "🌍",
    title: "Ka shaqayso Freelance",
    body: "Portfolio aad u tustid macaamiisha caalamiga ah.",
  },
];

export function CurriculumSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  return (
    <section
      id="curriculum"
      className={`relative overflow-hidden py-16 sm:py-20 md:py-24 transition-colors duration-300 ${
        isDark ? "bg-zinc-950 text-zinc-100" : "bg-white text-slate-900"
      }`}
    >
      {/* Grid pattern (dark only) */}
      {isDark && (
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
          aria-hidden
        />
      )}
      {/* Light grid */}
      {!isDark && (
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(124,58,237,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(124,58,237,0.04)_1px,transparent_1px)] bg-[size:48px_48px]"
          aria-hidden
        />
      )}
      {/* Center glow */}
      <div
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] ${
          isDark ? "bg-violet-700/6" : "bg-violet-200/50"
        }`}
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-center sm:mb-14">
          <span className={`mb-3 inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
            isDark
              ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
              : "border-violet-200 bg-violet-50 text-violet-700"
          }`}>
            Barnaamijka 3-Bilood ah
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl">
            Waxaad{" "}
            <span className={isDark ? "text-violet-400" : "text-violet-600"}>Baran doonto</span>{" "}
            &{" "}
            <span className={isDark ? "text-violet-400" : "text-violet-600"}>Dhisi doonto</span>
          </h2>
          <p className={`mx-auto mt-3 max-w-xl text-sm leading-relaxed sm:text-base ${
            isDark ? "text-zinc-400" : "text-slate-500"
          }`}>
            Koorso kasta waxay ku dhammaanaysaa mashruuc dhab ah. Markaad dhammayso 3-da bilood —
            waxaad yeelan doontaa portfolio, xirfado, iyo khibrad aad ugu diyaar tahay suuqa shaqada.
          </p>
        </div>

        {/* Month cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {MONTHS.map(({ month, title, subtitle, icon: Icon, gradientLight, gradientDark, borderLight, borderDark, lessons, outcome, outcomeColorLight, outcomeColorDark }) => (
            <div
              key={month}
              className={`relative flex flex-col rounded-2xl border p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 sm:rounded-3xl sm:p-6 ${
                isDark
                  ? `${borderDark} bg-zinc-900/70 hover:shadow-xl`
                  : `${borderLight} bg-white hover:shadow-xl hover:shadow-violet-100`
              }`}
            >
              <div className="mb-4 flex items-center gap-2">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg sm:h-10 sm:w-10 ${
                  isDark ? gradientDark : gradientLight
                }`}>
                  <Icon className="h-4 w-4 text-white sm:h-5 sm:w-5" />
                </div>
                <div>
                  <p className={`text-[10px] font-semibold uppercase tracking-widest sm:text-xs ${
                    isDark ? "text-zinc-500" : "text-slate-400"
                  }`}>{month}</p>
                  <p className={`text-sm font-bold sm:text-base ${
                    isDark ? "text-zinc-100" : "text-slate-900"
                  }`}>{title}</p>
                </div>
              </div>

              <p className={`mb-4 text-[11px] font-semibold uppercase tracking-wider sm:text-xs ${
                isDark ? "text-zinc-600" : "text-slate-400"
              }`}>{subtitle}</p>

              <ul className="mb-5 flex-1 space-y-2">
                {lessons.map((lesson) => (
                  <li key={lesson} className={`flex items-start gap-2 text-xs sm:text-sm ${
                    isDark ? "text-zinc-400" : "text-slate-600"
                  }`}>
                    <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4 ${
                      isDark ? "text-violet-500" : "text-violet-600"
                    }`} />
                    {lesson}
                  </li>
                ))}
              </ul>

              <div className={`rounded-xl border p-3 ${
                isDark
                  ? "border-white/8 bg-white/4"
                  : "border-violet-100 bg-violet-50/60"
              }`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest sm:text-xs ${
                  isDark ? "text-zinc-600" : "text-slate-500"
                }`}>Natiijada</p>
                <p className={`mt-1 text-xs font-semibold sm:text-sm ${
                  isDark ? outcomeColorDark : outcomeColorLight
                }`}>{outcome}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-12 flex items-center gap-4 sm:my-14">
          <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${
            isDark ? "via-zinc-700" : "via-slate-200"
          } to-transparent`} />
          <span className={`text-xs font-semibold uppercase tracking-widest ${
            isDark ? "text-zinc-600" : "text-slate-400"
          }`}>
            Markaad dhammayso 3-da bilood
          </span>
          <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${
            isDark ? "via-zinc-700" : "via-slate-200"
          } to-transparent`} />
        </div>

        {/* Outcome cards */}
        <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {OUTCOMES.map(({ emoji, title, body }) => (
            <div key={title} className={`rounded-2xl border p-4 text-center sm:p-6 ${
              isDark
                ? "border-white/8 bg-zinc-900/60"
                : "border-slate-200 bg-slate-50"
            }`}>
              <span className="text-3xl sm:text-4xl" aria-hidden>{emoji}</span>
              <h3 className={`mt-3 text-sm font-bold sm:text-base ${
                isDark ? "text-zinc-100" : "text-slate-800"
              }`}>{title}</h3>
              <p className={`mt-1.5 text-xs leading-relaxed sm:text-sm ${
                isDark ? "text-zinc-500" : "text-slate-500"
              }`}>{body}</p>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className={`mt-12 overflow-hidden rounded-2xl border p-6 text-center sm:mt-14 sm:rounded-3xl sm:p-8 ${
          isDark
            ? "border-violet-500/30 bg-gradient-to-r from-violet-950/70 to-zinc-900/80"
            : "border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50"
        }`}>
          <p className={`text-xs font-semibold uppercase tracking-widest sm:text-sm ${
            isDark ? "text-violet-400" : "text-violet-600"
          }`}>
            Maxaad sugaysaa?
          </p>
          <h3 className={`mt-2 text-xl font-extrabold sm:text-2xl md:text-3xl ${
            isDark ? "text-zinc-100" : "text-slate-900"
          }`}>
            Ku biir Challenge-ka — Mentor ayaa kula joogi doona
          </h3>
          <p className={`mx-auto mt-3 max-w-lg text-sm leading-relaxed sm:text-base ${
            isDark ? "text-zinc-400" : "text-slate-600"
          }`}>
            Koorsooyinka kaligood kuma filna. Challenge-ka dhexdiisa waxaad ka helaysaa mentor 1:1 ah,
            cohort, iyo taageero toos ah — tallaabo-tallaabo ilaa dhammaadka.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/welcome"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/25 sm:w-auto"
            >
              Billow Challenge-ka
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/welcome" className={`text-sm font-medium underline-offset-4 hover:underline ${
              isDark ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-700"
            }`}>
              Marka hore tijaabi koorsooyinka →
            </Link>
          </div>
          <p className={`mt-4 text-xs ${isDark ? "text-zinc-600" : "text-slate-400"}`}>
            ✓ 7-bari dammaanad lacag celin ah &nbsp;·&nbsp; ✓ Lacagta waa la soo celin karaa &nbsp;·&nbsp; ✓ Kaliya 10 arday cohort kasta
          </p>
        </div>

      </div>
    </section>
  );
}
