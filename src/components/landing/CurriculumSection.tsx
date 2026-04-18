"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
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
      { threshold: 0.12 }
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
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const OUTCOMES = [
  {
    num: "01",
    so: "Hel shaqo teknoolajiyada",
    en: "Get a job in tech",
  },
  {
    num: "02",
    so: "Dhis product-kaaga oo gaarsii suuqa",
    en: "Build and ship your own product",
  },
  {
    num: "03",
    so: "Ka shaqee anywhere-ka dunida oo dhan",
    en: "Work remotely from anywhere",
  },
  {
    num: "04",
    so: "Noqo developer xirfadlaha ah 3 bilood gudahood",
    en: "Become a professional developer in 3 months",
  },
];

const MONTHS = [
  {
    num: "01",
    so: "Aasaaska",
    en: "Foundations",
    stack: "HTML · CSS · JavaScript · React",
    desc: "Waxaad baranaysaa sida shabakaddu u shaqayso, sida aad ula xiriirtid browser-ka, iyo sida aad ku dhisid UI-yada casriga ah React-ka.",
    descEn: "How the web works, how to talk to the browser, and how to build modern UIs with React.",
    outcome: "Dhis: Portfolio website oo shaqaynaysa",
  },
  {
    num: "02",
    so: "Full-Stack",
    en: "Back-end & Database",
    stack: "Node.js · Express · MongoDB · REST API",
    desc: "Waxaad dhisaysaa server-ka, kaydisaa xogta, iyo ku xiraysaa front-end iyo back-end si xogtu u socoto labada dhinac.",
    descEn: "Build the server, save real data, and connect front-end to back-end so information flows both ways.",
    outcome: "Dhis: App full-stack ah oo xog kaydinaysa",
  },
  {
    num: "03",
    so: "SaaS & AI",
    en: "Production & AI",
    stack: "Next.js · TypeScript · AI API · Deploy",
    desc: "Waxaad baranaysaa sida aad ku dhisid app-yada heer shirkadeed ah, ku dartid garaadka macmalka (AI), oo aduunka u geysid.",
    descEn: "Build production-grade apps, integrate AI intelligence, and deploy to the world.",
    outcome: "Dhis: SaaS app leh isticmaalayaal dhab ah",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function CurriculumSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { resolvedTheme } = useTheme();
  const isDark = mounted ? resolvedTheme === "dark" : true;

  const border = isDark ? "border-white/10" : "border-slate-200";
  const muted = isDark ? "text-zinc-500" : "text-slate-400";
  const subtle = isDark ? "text-zinc-400" : "text-slate-500";
  const heading = isDark ? "text-zinc-100" : "text-slate-900";
  const bg = isDark ? "bg-zinc-950" : "bg-white";
  const cardBg = isDark ? "bg-zinc-900/60 border-white/8" : "bg-slate-50 border-slate-200";

  return (
    <section
      id="curriculum"
      className={`relative overflow-hidden transition-colors duration-300 ${bg}`}
    >
      {/* Thin top border rule */}
      <div className={`w-full border-t ${border}`} />

      <div className="mx-auto max-w-4xl px-5 sm:px-8 lg:px-10">

        {/* ── Hero headline ───────────────────────────────────────────────── */}
        <FadeIn className="py-16 sm:py-20 md:py-24 text-center">
          <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${muted}`}>
            Barnaamijka 3-Bilood ah
          </p>
          <h2
            className={`font-[family-name:var(--font-dm-serif-display)] text-4xl leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl ${heading}`}
          >
            Ku baro code-ka.{" "}
            <span className="italic text-violet-500">Hel shaqo.</span>{" "}
            Dhis wax aad leedahay.
          </h2>
          <p className={`mx-auto mt-6 max-w-xl text-sm leading-relaxed sm:text-base ${subtle}`}>
            Koorso kasta waxay ku dhammaanaysaa mashruuc dhab ah —
            markaad dhammayso waxaad yeelan doontaa portfolio, xirfado, iyo khibrad suuqa shaqada u diyaar ah.
          </p>
        </FadeIn>

        <div className={`border-t ${border}`} />

        {/* ── Outcomes numbered list ───────────────────────────────────────── */}
        <div className="py-12 sm:py-16">
          <FadeIn>
            <p className={`mb-8 text-xs font-semibold uppercase tracking-[0.2em] ${muted}`}>
              Waxa aad ka heli doontaa
            </p>
          </FadeIn>

          {OUTCOMES.map(({ num, so, en }, i) => (
            <FadeIn key={num} delay={i * 80}>
              <div className={`flex items-start gap-5 border-t py-5 sm:py-6 ${border}`}>
                <span
                  className={`font-[family-name:var(--font-dm-serif-display)] text-sm italic shrink-0 pt-0.5 ${muted}`}
                >
                  {num}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-semibold sm:text-lg ${heading}`}>{so}</p>
                  <p className={`mt-0.5 text-sm italic ${muted}`}>{en}</p>
                </div>
              </div>
            </FadeIn>
          ))}

          <div className={`border-t ${border}`} />
        </div>

        <div className={`border-t ${border}`} />

        {/* ── What you learn ───────────────────────────────────────────────── */}
        <div className="py-12 sm:py-16">
          <FadeIn>
            <p className={`mb-10 text-xs font-semibold uppercase tracking-[0.2em] ${muted}`}>
              Manhajka — Waxa aad baran doontaa
            </p>
          </FadeIn>

          <div className="space-y-12 sm:space-y-14">
            {MONTHS.map(({ num, so, en, stack, desc, descEn, outcome }, i) => (
              <FadeIn key={num} delay={i * 100}>
                <div className={`grid gap-6 sm:grid-cols-[1fr_2fr] sm:gap-10 border-t pt-8 ${border}`}>
                  {/* Left: number + labels */}
                  <div>
                    <span
                      className={`block font-[family-name:var(--font-dm-serif-display)] text-6xl leading-none sm:text-7xl ${isDark ? "text-zinc-800" : "text-slate-200"}`}
                    >
                      {num}
                    </span>
                    <p className={`mt-3 text-lg font-bold sm:text-xl ${heading}`}>{so}</p>
                    <p className={`mt-0.5 text-sm italic ${muted}`}>{en}</p>
                    <p className={`mt-3 text-[11px] font-semibold uppercase tracking-wider ${muted}`}>{stack}</p>
                  </div>

                  {/* Right: description + outcome */}
                  <div className="flex flex-col justify-center gap-4">
                    <div>
                      <p className={`text-sm leading-relaxed sm:text-base ${subtle}`}>{desc}</p>
                      <p className={`mt-1.5 text-sm italic ${muted}`}>{descEn}</p>
                    </div>
                    <div className={`rounded-xl border px-4 py-3 ${cardBg}`}>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${muted}`}>Natiijada</p>
                      <p className={`mt-1 text-sm font-semibold text-violet-500`}>{outcome}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className={`border-t ${border}`} />

        {/* ── Honesty section ──────────────────────────────────────────────── */}
        <FadeIn className="py-12 sm:py-16 max-w-2xl">
          <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${muted}`}>
            Daacadnimo
          </p>
          <p
            className={`font-[family-name:var(--font-dm-serif-display)] text-2xl leading-snug sm:text-3xl ${heading}`}
          >
            Koorsooyinka kaligood kuma filna.
          </p>
          <p className={`mt-4 text-sm leading-relaxed sm:text-base ${subtle}`}>
            Waxa xaqiiqa ah — koorsooyinka online ee badan waxaad ka dhammaysataa aad ogaatay sida ay waxyaabuhu u shaqeeyaan, laakiin aadan wax dhisi karin oo suuqa loogu sheegi karo.
            Taas ayuu Challenge-ku xaliyaa: mentor gaar ah, koox kaa daba socota, iyo mashruucyo dhab ah oo laga dhaafsado tutorial-ka.
          </p>
          <p className={`mt-2 text-sm italic leading-relaxed ${muted}`}>
            Courses alone rarely lead to jobs. The Challenge adds a mentor, a cohort, and real projects — the pieces that actually matter.
          </p>
        </FadeIn>

        <div className={`border-t ${border}`} />

        {/* ── CTA ──────────────────────────────────────────────────────────── */}
        <FadeIn className="py-16 sm:py-20 text-center">
          <p
            className={`font-[family-name:var(--font-dm-serif-display)] text-3xl sm:text-4xl md:text-5xl ${heading}`}
          >
            Diyaar baad tahay?
          </p>
          <p className={`mx-auto mt-4 max-w-md text-sm leading-relaxed sm:text-base ${subtle}`}>
            Ku biir Challenge-ka — mentor ayaa tallaabo kasta kula joogi doona.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/welcome"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-violet-500 hover:shadow-xl hover:shadow-violet-500/25 sm:w-auto"
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
          <p className={`mt-6 text-xs ${muted}`}>
            ✓ 7-bari dammaanad lacag-celin · ✓ Kaliya 10 arday cohort kasta · ✓ Lacagta waa la soo celin karaa
          </p>
        </FadeIn>

      </div>

      {/* Thin bottom border rule */}
      <div className={`w-full border-b ${border}`} />
    </section>
  );
}
