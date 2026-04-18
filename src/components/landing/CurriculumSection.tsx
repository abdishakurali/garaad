"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Code2, Server, Zap, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";

// ─── FadeIn ───────────────────────────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const MONTHS = [
  {
    month: "Bisha 1-aad",
    title: "Aasaaska (Foundations)",
    subtitle: "HTML · CSS · JavaScript · React",
    icon: Code2,
    accent: "text-violet-500",
    accentBg: "bg-violet-600",
    border: "border-violet-500/30",
    lessons: [
      "HTML & CSS — Dhis waxyaabaha muuqda",
      "JavaScript basics — la hadal browser-ka",
      "React — UIs-ka casriga ah",
      "Git & VS Code — agabka developer-ka",
    ],
    outcome: "Dhis: website Portfolio ah oo shaqaynaya",
  },
  {
    month: "Bisha 2-aad",
    title: "Full-Stack",
    subtitle: "Node.js · Express · MongoDB · API",
    icon: Server,
    accent: "text-purple-500",
    accentBg: "bg-purple-600",
    border: "border-purple-500/30",
    lessons: [
      "Node.js & Express — dhis server-ka",
      "MongoDB — kaydi xogta",
      "REST API — isku xir front iyo back",
      "User Authentication (Auth)",
    ],
    outcome: "Dhis: app full-stack ah oo xog kaydinaya",
  },
  {
    month: "Bisha 3-aad",
    title: "SaaS & AI",
    subtitle: "Next.js · TypeScript · AI Integration",
    icon: Zap,
    accent: "text-fuchsia-500",
    accentBg: "bg-fuchsia-600",
    border: "border-fuchsia-500/30",
    lessons: [
      "Next.js — web apps heer shirkadeed ah",
      "TypeScript — kood ammaan ah",
      "AI API (ChatGPT/Claude) — ku dar garaad macmal ah",
      "Deploy & launch — hawada geli aduunka oo dhan",
    ],
    outcome: "Dhis: wax soo saar SaaS ah oo leh isticmaalayaal dhab ah",
  },
];

const OUTCOMES = [
  { emoji: "💼", title: "Shaqo Hel", body: "Portfolio + certification + xirfadaha suuqa shaqadu u baahan yahay." },
  { emoji: "🚀", title: "Dhis Wax-soo-saar (Product)", body: "SaaS product shaqaynaya, oo ay isticmaalayaashu isticmaalayaan." },
  { emoji: "🌍", title: "Ka shaqayso Freelance", body: "Portfolio aad u tustid macaamiisha caalamiga ah." },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function CurriculumSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  const borderRule = isDark ? "border-white/8" : "border-slate-200";
  const muted = isDark ? "text-zinc-500" : "text-slate-400";
  const subtle = isDark ? "text-zinc-400" : "text-slate-600";
  const strong = isDark ? "text-zinc-100" : "text-slate-900";
  const bg = isDark ? "bg-zinc-950" : "bg-white";
  const cardBg = isDark ? "bg-zinc-900/70 border-white/8" : "bg-white border-slate-200";
  const outcomeBg = isDark ? "border-white/6 bg-white/4" : "border-violet-100 bg-violet-50/60";
  const chipBg = isDark ? "border-zinc-800 bg-zinc-900/60" : "border-slate-200 bg-slate-50";

  return (
    <section
      id="curriculum"
      className={`relative overflow-hidden transition-colors duration-300 ${bg}`}
    >
      <div className={`w-full border-t ${borderRule}`} />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <FadeIn className="py-14 text-center sm:py-18 md:py-20">
          <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest ${
            isDark ? "border-violet-500/30 bg-violet-500/10 text-violet-300" : "border-violet-200 bg-violet-50 text-violet-700"
          }`}>
            Barnaamijka 3-Bilood ah
          </span>
          <h2
            className={`mt-4 font-[family-name:var(--font-dm-serif-display)] text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl ${strong}`}
          >
            Waxaad{" "}
            <span className="italic text-violet-500">Baran doonto</span>{" "}
            &{" "}
            <span className="italic text-violet-500">Dhisi doonto</span>
          </h2>
          <p className={`mx-auto mt-4 max-w-xl text-sm leading-relaxed sm:text-base ${subtle}`}>
            Koorso kasta waxay ku dhammaanaysaa mashruuc dhab ah. Markaad dhammayso 3-da bilood —
            waxaad yeelan doontaa portfolio, xirfado, iyo khibrad aad ugu diyaar tahay suuqa shaqada.
          </p>
        </FadeIn>

        <div className={`border-t ${borderRule}`} />

        {/* ── Month cards ─────────────────────────────────────────────────── */}
        <div className="grid gap-5 py-12 sm:py-14 md:grid-cols-3 md:gap-6">
          {MONTHS.map(({ month, title, subtitle, icon: Icon, accent, accentBg, border, lessons, outcome }, i) => (
            <FadeIn key={month} delay={i * 90}>
              <div className={`flex h-full flex-col rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6 ${cardBg}`}>
                {/* Icon + labels */}
                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${accentBg}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-widest ${muted}`}>{month}</p>
                    <p className={`text-sm font-bold ${strong}`}>{title}</p>
                  </div>
                </div>

                <p className={`mb-4 text-[11px] font-semibold uppercase tracking-wider ${muted}`}>{subtitle}</p>

                {/* Lessons */}
                <ul className="mb-5 flex-1 space-y-2">
                  {lessons.map((lesson) => (
                    <li key={lesson} className={`flex items-start gap-2 text-xs sm:text-sm ${subtle}`}>
                      <CheckCircle2 className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${accent}`} />
                      {lesson}
                    </li>
                  ))}
                </ul>

                {/* Outcome */}
                <div className={`rounded-xl border p-3 ${outcomeBg}`}>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>Natiijada</p>
                  <p className={`mt-1 text-xs font-semibold sm:text-sm ${accent}`}>{outcome}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className={`border-t ${borderRule}`} />

        {/* ── Divider label ───────────────────────────────────────────────── */}
        <FadeIn className="flex items-center gap-4 py-10 sm:py-12">
          <div className={`h-px flex-1 ${isDark ? "bg-zinc-800" : "bg-slate-200"}`} />
          <span className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>
            Markaad dhammayso 3-da bilood
          </span>
          <div className={`h-px flex-1 ${isDark ? "bg-zinc-800" : "bg-slate-200"}`} />
        </FadeIn>

        {/* ── Outcome chips ────────────────────────────────────────────────── */}
        <div className="grid gap-4 pb-12 sm:grid-cols-3 sm:gap-6 sm:pb-14">
          {OUTCOMES.map(({ emoji, title, body }, i) => (
            <FadeIn key={title} delay={i * 80}>
              <div className={`rounded-2xl border p-5 text-center sm:p-6 ${chipBg}`}>
                <span className="text-3xl sm:text-4xl" aria-hidden>{emoji}</span>
                <h3 className={`mt-3 text-sm font-bold sm:text-base ${strong}`}>{title}</h3>
                <p className={`mt-1.5 text-xs leading-relaxed sm:text-sm ${subtle}`}>{body}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className={`border-t ${borderRule}`} />

        {/* ── CTA banner ──────────────────────────────────────────────────── */}
        <FadeIn className="py-12 sm:py-14">
          <div className={`overflow-hidden rounded-2xl border p-6 text-center sm:rounded-3xl sm:p-10 ${
            isDark
              ? "border-violet-500/20 bg-gradient-to-br from-violet-950/60 to-zinc-900/80"
              : "border-violet-200 bg-gradient-to-br from-violet-50 to-purple-50"
          }`}>
            <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? "text-violet-400" : "text-violet-600"}`}>
              Maxaad sugaysaa?
            </p>
            <h3
              className={`mt-3 font-[family-name:var(--font-dm-serif-display)] text-2xl sm:text-3xl md:text-4xl ${strong}`}
            >
              Ku biir Challenge-ka — Mentor ayaa kula joogi doona
            </h3>
            <p className={`mx-auto mt-3 max-w-lg text-sm leading-relaxed sm:text-base ${subtle}`}>
              Koorsooyinka kaligood kuma filna. Challenge-ka dhexdiisa waxaad ka helaysaa mentor 1:1 ah,
              cohort, iyo taageero toos ah — tallaabo-tallaabo ilaa dhammaadka.
            </p>
            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/welcome"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/25 sm:w-auto"
              >
                Billow Challenge-ka
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/welcome"
                className={`text-sm font-medium underline-offset-4 hover:underline ${isDark ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-700"}`}
              >
                Marka hore tijaabi koorsooyinka →
              </Link>
            </div>
            <p className={`mt-5 text-xs ${muted}`}>
              ✓ 7-bari dammaanad lacag celin ah &nbsp;·&nbsp; ✓ Lacagta waa la soo celin karaa &nbsp;·&nbsp; ✓ Kaliya 10 arday cohort kasta
            </p>
          </div>
        </FadeIn>

      </div>

      <div className={`w-full border-b ${borderRule}`} />
    </section>
  );
}
