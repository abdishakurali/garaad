"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { CheckCircle2, Shield } from "lucide-react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { OurStorySection } from "@/components/landing/OurStorySection";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { SpotsBadge } from "@/components/ui/SpotsBadge";
import { TransformationSection } from "@/components/landing/TransformationSection";
import { ChallengeHowItWorks } from "@/components/challenge/ChallengeHowItWorks";
import { SocialProofChallengeCTA } from "@/components/challenge/SocialProofChallengeCTA";
import {
  DEFAULT_WHATSAPP_MESSAGE,
  WHATSAPP_DISPLAY,
  whatsappHref,
} from "@/lib/whatsapp";
import dynamic from "next/dynamic";

const FAQSection = dynamic(() =>
  import("@/components/landing/FAQSection").then((m) => m.FAQSection)
);
const ClosingCTA = dynamic(() =>
  import("@/components/landing/ClosingCTA").then((m) => m.ClosingCTA)
);

const CHALLENGE_GUARANTEE_SO =
  "7-maalmood dammaanad lacag celin ah. Su'aalna lagu weydiin maayo.";

const curriculumTeaserWeeks: { n: number; line: string }[] = [
  { n: 1, line: "Fikrad → MVP + baaritaanka suuqa" },
  { n: 2, line: "Dhismaha aaladda (auth, DB, API)" },
  { n: 3, line: "AI, otomaatig, isdhexgalka" },
  { n: 4, line: "Suuqa, macaamiisha, lacag bixinta" },
  { n: 5, line: "Go'aanka: shaqo ama startup" },
];

const outcomeBullets: string[] = [
  "Su'aalo ka jawaabid toos ah — isbuuc kasta",
  "Koodhkaaga la eeg si aan khalad loo shaqo qaadin",
  "Shahaado aad LinkedIn ku dhejin karto",
  "Saaxiibo tech ah oo adiga kaa horumarsan (koox 10 arday)",
  "Qof kuu jawaabaya marka aad xanaaqdid (mentor + WhatsApp)",
  "Wadada buuxda: fikrad ilaa macmiil lacag bixiya",
];

type GraduateCard = {
  name: string;
  /** One-line transformation (e.g. Name — laga soo bilaabo … ilaa …). */
  byline?: string;
  tag: string;
  quote: string;
  outcomeLine?: string;
  kicker?: string;
  badge: string;
  src: string;
  featured?: boolean;
  href?: string;
  linkLabel?: string;
};

const graduateCards: GraduateCard[] = [
  {
    name: "Ilyas Omar",
    byline:
      "Ilyas Omar — Laga soo bilaabo barashada aasaasiga ah ilaa xirfadle layout & Tailwind CSS",
    tag: "Xirfad cusub oo shaqo u horseeda",
    quote:
      "When I started learning tailwind css, your course helped me understand more about tailwind.",
    outcomeLine: "Natiijada: wuxuu xoojiyay aqoonta CSS / Tailwind si uu ugu dhow u noqdo shaqooyinka dhabta ah.",
    kicker: "Tan xigta adiga ayay noqon kartaa.",
    badge: "Arday Guulaystay",
    src: "/images/review/1.png",
    featured: false,
  },
  {
    name: "Abdiladif Salah",
    byline:
      "Abdiladif Salah — Laga soo bilaabo barashada ilaa horumariye coding wax ku ool ah",
    tag: "Xirfadda coding-ka wax ku ool u adeegso",
    quote:
      "Pro thnks hada coding barashadii waa wada si aan inta barashada ku jiro ugu shaqaysto",
    outcomeLine: "Natiijada: barashadii waxay noqotay shaqo dhab ah oo isku xiran — ma ahan kaliya teori.",
    kicker: "Tan xigta adiga ayay noqon kartaa.",
    badge: "Developer",
    src: "/images/review/2.png",
    featured: false,
  },
  {
    name: "Abdiaziz",
    byline:
      "Abdiaziz — Laga soo bilaabo 'Eber' ilaa Milkiile Shirkad (Sofaritech)",
    tag: "Shirkad IT + macaamiil 3 bilood gudahood",
    quote: "Waxaan dhisay mustaqbalkayga anigoo adeegsanaya wax kasta oo gacantayda soo galay",
    outcomeLine:
      "Natiijada: 3 bilood kadib, wuxuu dhisay shirkad IT ah oo macaamiil la leh.",
    kicker: "Tan xigta adiga ayay noqon kartaa.",
    badge: "🏢 Shirkad Dhisay",
    src: "/images/review/3.jpeg",
    featured: true,
    href: "https://sofaritech-global-it-solutions.vercel.app",
    linkLabel: "Bogga Sofaritech →",
  },
];

export function ChallengePageClient() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining ?? 0;
  const cohortName = data?.active_cohort_name ?? "Challenge";
  const startForCountdown = data?.cohort_start_date ?? data?.next_cohort_start_date ?? null;

  const primaryHref = "/subscribe?plan=challenge";
  /** Hero stays “open / starting soon” with the countdown; checkout still handles full cohorts. */
  const primaryLabel = "Ku biir Kooxda — Hadda →";
  const showSpotsBadgeRow = (loading && !data) || spots > 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <section className="scroll-mt-16 border-b border-white/5 px-3 pb-12 pt-20 sm:px-4 sm:pb-14 sm:pt-24 md:px-6 md:pb-16">
        <div className="mx-auto w-full min-w-0 max-w-4xl text-center">
          <span className="mb-3 inline-block text-[10px] font-semibold uppercase tracking-widest text-zinc-500 sm:mb-4 sm:text-xs">
            3 bilood · 10 arday · Af Soomaali
          </span>

          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight text-zinc-50 sm:text-4xl md:text-5xl">
            Laga soo bilaabo <span className="text-violet-400">Eber</span> ilaa{" "}
             <span className="text-zinc-400">(Founder)</span> ama{" "}
             <span className="text-zinc-400">(Developer)</span>.
          </h1>

          <div className="mx-auto mt-4 max-w-2xl space-y-3 px-1 text-base leading-relaxed text-zinc-400 sm:mt-5 sm:text-lg">
            <p className="text-balance">
              Baro koodhka, dhis mashruucaaga SaaS, oo hel shaqadaada tech-da ee ugu horreysa{" "}
              <span className="font-semibold text-zinc-200">3 bilood gudahood</span>.
            </p>
            <p className="text-balance text-zinc-300">
              Khibrad hore looma baahna. Mentor toos ah. Af-Soomaali.
            </p>
          </div>

          <div className="mx-auto mt-6 w-full max-w-xl rounded-lg border border-white/10 bg-zinc-900/50 px-4 py-3 text-left sm:mt-7 sm:px-5 sm:py-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Jadwalka 5-todobaadka (qaab kooban)
            </p>
            <ul className="space-y-1.5 text-xs leading-snug text-zinc-400 sm:text-sm">
              {curriculumTeaserWeeks.map((w) => (
                <li key={w.n}>
                  <span className="font-semibold text-zinc-300">T{w.n}:</span> {w.line}
                </li>
              ))}
            </ul>
          </div>

          {showSpotsBadgeRow ? (
            <div className="mt-6 flex justify-center sm:mt-8">
              <SpotsBadge
                spots={spots}
                loading={loading && !data}
                waitlistOnly={false}
                cohortName={cohortName}
              />
            </div>
          ) : null}

          <div className="mt-6 flex flex-col items-center gap-0.5 sm:mt-8 sm:gap-1">
            <span className="text-4xl font-bold tabular-nums text-zinc-50 sm:text-5xl">$149</span>
            <span className="text-sm text-zinc-500 sm:text-base">hal mar</span>
          </div>

          <div className="mx-auto mt-8 w-full min-w-0 max-w-xl sm:mt-10">
            <CountdownTimer
              targetDate={startForCountdown}
              label="Kooxdu waxay bilaabaysaa:"
            />
          </div>

          <div className="mt-6 flex w-full flex-col items-center justify-center px-1 sm:mt-8">
            <Link
              href={primaryHref}
              className="inline-flex w-full max-w-md items-center justify-center rounded-lg bg-violet-600 px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-violet-500 sm:px-8 sm:py-3.5"
            >
              {primaryLabel}
            </Link>
          </div>

          <div className="mx-auto mt-5 w-full max-w-lg px-1 sm:mt-6">
            <div className="flex gap-3 rounded-lg border border-white/10 bg-zinc-900 px-4 py-4 text-left sm:px-5 sm:py-4">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" aria-hidden />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Dammaanad lacag celin
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-300 sm:text-base">
                  {CHALLENGE_GUARANTEE_SO}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-xs font-medium uppercase tracking-wide text-zinc-500 sm:mt-10 sm:text-sm">
            Baro sida uu u shaqeeyo
          </p>
          <div className="mx-auto mt-3 w-full min-w-0 max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-black sm:mt-4">
            <div className="relative w-full" style={{ padding: "56.25% 0 0 0" }}>
              <iframe
                src="https://player.vimeo.com/video/1152611300?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&controls=1&background=0"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                title="Garaad SaaS Challenge"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <ChallengeHowItWorks />

      <section
        aria-labelledby="mentor-heading"
        className="border-b border-white/5 px-3 py-12 sm:px-4 sm:py-14 md:px-6 md:py-16"
      >
        <div className="mx-auto flex w-full min-w-0 max-w-4xl flex-col items-center gap-6 rounded-lg border border-white/10 bg-zinc-900/40 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg border border-white/10 sm:h-40 sm:w-40">
            <Image
              src="/images/builder.png"
              alt="Mentor xirfadle ah — Garaad Challenge"
              fill
              className="object-cover object-top"
              sizes="176px"
              unoptimized
            />
          </div>
          <div className="min-w-0 text-center sm:text-left">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Mentorship xirfadle ah
            </p>
            <h2 id="mentor-heading" className="mt-1 text-xl font-bold text-zinc-50 sm:text-2xl">
              Kooxda Garaad
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Challenge-ka wuxuu ku siinayaa mentor xirfadle ah oo xiriir toos ah: laga bilaabo aasaaska tech-ka ilaa
              mashruuc dhab ah, dhammaan af Soomaali, koox toban arday ah oo isla socota.
            </p>
            <a
              href={whatsappHref(DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 sm:mt-5"
            >
              WhatsApp: {WHATSAPP_DISPLAY}
            </a>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 sm:text-sm">
              Caadi ahaan waxaan ku jawaabaa 2 saac gudahood.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="outcomes-heading"
        className="border-b border-white/5 px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-20"
      >
        <div className="mx-auto w-full min-w-0 max-w-3xl">
          <h2
            id="outcomes-heading"
            className="text-center text-xl font-bold text-zinc-50 sm:text-2xl md:text-3xl"
          >
            Maxaad <span className="text-violet-400">ka heleysaa</span>?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-500 sm:mt-3">
            Ma aha kaliya wicitaan — waa natiijooyin la taaban karo.
          </p>
          <ul className="mt-8 divide-y divide-white/10 rounded-lg border border-white/10 sm:mt-10">
            {outcomeBullets.map((line) => (
              <li key={line} className="flex gap-3 px-4 py-3.5 sm:px-5 sm:py-4">
                <CheckCircle2
                  className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500"
                  aria-hidden
                />
                <span className="text-left text-sm leading-relaxed text-zinc-300 sm:text-base">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-labelledby="roi-heading"
        className="border-b border-white/5 px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-20"
      >
        <div className="mx-auto w-full min-w-0 max-w-3xl">
          <h2 id="roi-heading" className="text-center text-xl font-bold text-zinc-50 sm:text-2xl md:text-3xl">
            Waa maxay sababta Garaad u tahay maalgelinta ugu fiican ee aad sameyso?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-zinc-500 sm:mt-3">
            Qiimaha, waqtiga, luuqadda, iyo caawimaadda — isbar dhig.
          </p>
          <div className="mt-8 space-y-2 sm:mt-10">
            {[
              "Jaamacad: $10,000+ sanadkii. 4 sano. Af-Ingiriis. (Aragti u badan)",
              "Bootcamp US: $15,000+. Fiiso la'aan. Af-Ingiriis.",
              "YouTube: Bilaash, laakiin cidna kuma caawinayso markaad ku xannibanto koodhka.",
            ].map((line) => (
              <div
                key={line}
                className="rounded-lg border border-white/10 px-4 py-3 text-sm leading-relaxed text-zinc-400 sm:px-5 sm:text-base"
              >
                <span className="mr-2 text-zinc-600" aria-hidden>
                  —
                </span>
                {line}
              </div>
            ))}
            <div className="rounded-lg border border-violet-500/30 bg-zinc-900/50 px-4 py-4 text-sm leading-relaxed text-zinc-200 sm:px-5 sm:py-4 sm:text-base">
              <span className="mr-1.5" aria-hidden>
                🔥
              </span>
              <span className="font-semibold text-zinc-50">Garaad Challenge:</span>{" "}
              <span className="font-medium text-zinc-50">$149 (Hal mar)</span>. 3 bilood. Af-Soomaali. Mentor toos kuu
              caawinaya, iyo shahaado.
            </div>
          </div>
          <div className="mt-8 rounded-lg border border-white/10 bg-zinc-900/30 p-5 sm:mt-10 sm:p-6">
            <p className="text-sm font-semibold text-zinc-200 sm:text-base">Sida lacagtaadu kuugu soo noqonayso:</p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
              Hal mashruuc oo Freelance ah ($500) ama 3 macmiil oo SaaS ah ($50/bishii) ayaa lacagtaadii iyo macaashba
              kuu soo celinaya.
            </p>
          </div>
        </div>
      </section>

      <OurStorySection
        forceLight
        className="border-y border-white/10 py-12 md:py-16"
        innerClassName="px-3 sm:px-4 md:px-6 lg:px-8"
      />

      <div className="border-b border-white/5 bg-zinc-950 px-3 py-10 sm:px-4 sm:py-12 md:px-6 md:py-14">
        <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-zinc-300 sm:text-lg">
          Waxaan soo maray wadadii adkayd ee is-baridda. Garaad waxaan u dhisay inaan ku siiyo khariidadda (roadmap) aan
          anigu jeclaan lahaa inaan haysto markaan bilaabayay.
        </p>
      </div>

      <section className="border-b border-white/5 px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-20">
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          <div className="mx-auto mb-8 max-w-2xl px-1 text-center sm:mb-10 md:mb-12">
            <h2 className="text-balance text-xl font-bold text-zinc-50 sm:text-2xl md:text-3xl">
              Sheekooyinka <span className="text-violet-400">Guusha</span>
            </h2>
            <p className="mt-2 text-xs font-medium uppercase tracking-wide text-zinc-500 sm:mt-3 sm:text-sm">
              Ardayda Challenge-ka hore
            </p>
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
            {graduateCards.map((g) => (
              <div
                key={g.name}
                className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-zinc-900/30"
              >
                <div
                  className={`relative w-full overflow-hidden ${
                    g.featured
                      ? "aspect-[4/3] min-h-[180px] sm:aspect-[4/5] sm:min-h-0"
                      : "aspect-square max-h-[min(72vh,480px)] sm:aspect-[4/5] sm:max-h-none"
                  }`}
                >
                  <Image
                    src={g.src}
                    alt={g.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width:768px) 100vw, 33vw"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-medium sm:text-xs ${
                        g.featured ? "bg-zinc-100 text-zinc-900" : "bg-zinc-900/90 text-zinc-200"
                      }`}
                    >
                      {g.badge}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4 sm:gap-2 sm:p-5">
                  <p className="text-base font-semibold leading-snug text-zinc-50 sm:text-lg">{g.byline ?? g.name}</p>
                  <p className="text-xs font-medium text-zinc-500">{g.tag}</p>
                  <p className="text-sm leading-relaxed text-zinc-400 italic sm:text-base">
                    &ldquo;{g.quote}&rdquo;
                  </p>
                  {g.outcomeLine ? (
                    <p className="mt-1 border-l-2 border-violet-500/80 pl-3 text-sm font-medium leading-relaxed text-zinc-200 sm:text-base">
                      {g.outcomeLine}
                    </p>
                  ) : null}
                  {g.kicker ? (
                    <p className="text-sm font-medium text-zinc-400 sm:text-base">{g.kicker}</p>
                  ) : null}
                  {g.href ? (
                    <a
                      href={g.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex w-fit text-sm font-medium text-violet-400 hover:underline sm:mt-2"
                    >
                      {g.linkLabel ?? "Bogga →"}
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <SocialProofChallengeCTA />
        </div>
      </section>

      <div className="border-t border-white/5">
        <TransformationSection weekCount={5} />
      </div>

      <div className="border-t border-white/5">
        <FAQSection />
      </div>
      <div className="border-t border-white/5">
        <ClosingCTA />
      </div>
    </div>
  );
}
