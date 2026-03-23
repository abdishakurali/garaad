"use client";

import Link from "next/link";
import Image from "next/image";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { SpotsBadge } from "@/components/ui/SpotsBadge";
import { TransformationSection } from "@/components/landing/TransformationSection";
import dynamic from "next/dynamic";

const FAQSection = dynamic(() =>
  import("@/components/landing/FAQSection").then((m) => m.FAQSection)
);
const ClosingCTA = dynamic(() =>
  import("@/components/landing/ClosingCTA").then((m) => m.ClosingCTA)
);

type GraduateCard = {
  name: string;
  tag: string;
  quote: string;
  badge: string;
  src: string;
  featured?: boolean;
  href?: string;
};

const graduateCards: GraduateCard[] = [
  {
    name: "Ilyas Omar",
    tag: "Bartay Tailwind CSS",
    quote:
      "When I started learning tailwind css, your course helped me understand more about tailwind.",
    badge: "Arday Guulaystay",
    src: "/images/review/1.png",
    featured: false,
  },
  {
    name: "Abdiladif Salah",
    tag: "Front Developer noqday",
    quote:
      "Pro thnks hada coding barashadii waa wada si aan inta barashada ku jiro ugu shaqaysto",
    badge: "Developer",
    src: "/images/review/2.png",
    featured: false,
  },
  {
    name: "Abdiaziz",
    tag: "Shirkad dhisay — Sofaritech",
    quote: "Waxaan dhisay mustaqbalkayga anigoo adeegsanaya wax kasta oo gacantayda soo galay",
    badge: "🏢 Shirkad Dhisay",
    src: "/images/review/3.jpeg",
    featured: true,
    href: "https://sofaritech-global-it-solutions.vercel.app",
  },
];

const checklist = [
  "Wicitaan todobaadleh (30 daqiiqo)",
  "Dib-u-eegista koodka",
  "Shahaadada MERN",
  "Koox gaar ah — 10 arday oo kaliya",
  "Mentor toos ah WhatsApp",
  "Launchpad — si aad startup u dhisto",
] as const;

function formatStartDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("so-SO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function ChallengePageClient() {
  const { data, loading } = useChallengeStatus();
  const spots = data?.spots_remaining ?? 0;
  const waitlist = data?.is_waitlist_only ?? false;
  const cohortName = data?.active_cohort_name ?? "Challenge";
  const startForCountdown = data?.cohort_start_date ?? data?.next_cohort_start_date ?? null;
  const nextLabel = formatStartDate(data?.next_cohort_start_date ?? null);

  const primaryHref = "/subscribe?plan=challenge";
  const primaryLabel = waitlist ? "Liiska Sugitaanka ku Biir" : "Ku biir Kohorta — Hadda →";

  const pricingFeatures = [...checklist];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 px-4">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-zinc-500 mb-4">
            4-6 TODOBAAD · 10 ARDAY KALIYA
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Dhis Ganacsigaaga{" "}
            <span className="text-purple-500">SaaS &amp; AI</span>
          </h1>

          <div className="mt-8 flex justify-center">
            <SpotsBadge spots={spots} loading={loading && !data} />
          </div>

          <div className="mt-8 flex flex-col items-center gap-1">
            <span className="text-5xl sm:text-6xl font-black tabular-nums text-white">$149</span>
            <span className="text-lg font-bold text-zinc-400">/bilaan</span>
          </div>

          <div className="mt-10 w-full max-w-xl mx-auto">
            <CountdownTimer
              targetDate={startForCountdown}
              label="Kohorta waxay bilaabantaa:"
            />
          </div>

          {waitlist && (
            <p className="mt-6 text-sm text-amber-200/95 max-w-lg mx-auto font-semibold leading-relaxed">
              Kohorta hadda waa buuxday — kii xiga: {nextLabel}
            </p>
          )}

          <div className="mt-8">
            <Link
              href={primaryHref}
              className={`inline-flex items-center justify-center w-full max-w-md rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-4 text-base sm:text-lg font-black shadow-lg shadow-purple-900/40 hover:opacity-95 transition-opacity ${
                waitlist ? "opacity-75" : ""
              }`}
            >
              {primaryLabel}
            </Link>
          </div>

          <ul className="mt-10 text-left max-w-md mx-auto space-y-2.5 text-sm text-zinc-300 font-medium">
            {checklist.map((line) => (
              <li key={line} className="flex gap-3">
                <span className="text-emerald-400 shrink-0 font-black">✓</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#0f0f0f] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-center text-2xl sm:text-3xl font-black text-white mb-2">
            Sheekooyinka Guusha
          </h2>
          <p className="text-center text-sm text-zinc-500 font-bold uppercase tracking-widest mb-10">
            Ardayda Challenge-ka hore
          </p>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-6">
            {graduateCards.map((g) => (
              <div
                key={g.name}
                className={`flex flex-col rounded-3xl border overflow-hidden bg-zinc-900/60 ${
                  g.featured
                    ? "lg:col-span-2 border-emerald-500/40 ring-1 ring-emerald-500/20 shadow-2xl shadow-black/50"
                    : "border-white/10"
                }`}
              >
                <div
                  className={`relative w-full ${
                    g.featured ? "min-h-[280px] sm:min-h-[320px]" : "aspect-[4/5] max-h-[400px]"
                  }`}
                >
                  <Image
                    src={g.src}
                    alt={g.name}
                    fill
                    className="object-cover object-top"
                    sizes={g.featured ? "(max-width:1024px) 100vw, 66vw" : "(max-width:768px) 100vw, 33vw"}
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full ${
                        g.featured
                          ? "bg-emerald-500 text-emerald-950"
                          : "bg-violet-600/90 text-white"
                      }`}
                    >
                      {g.badge}
                    </span>
                  </div>
                </div>
                <div className="p-5 sm:p-6 flex flex-col gap-2 flex-1">
                  <p className="text-lg font-black text-white">{g.name}</p>
                  <p className="text-xs font-bold text-violet-400">{g.tag}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed italic">&ldquo;{g.quote}&rdquo;</p>
                  {g.href ? (
                    <a
                      href={g.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex text-sm font-bold text-emerald-400 hover:underline w-fit"
                    >
                      Sofaritech →
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TransformationSection weekCount={5} />

      <section className="py-16 px-4 bg-[#0a0a0a] border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center rounded-3xl border border-violet-500/35 bg-gradient-to-b from-zinc-900/90 to-black p-8 sm:p-10">
          <h2 className="text-xl font-black text-white mb-2">Wax kasta oo ku jira Challenge-ka</h2>
          <p className="text-4xl sm:text-5xl font-black text-white my-4">
            $149<span className="text-lg text-zinc-500 font-bold">/bilaan</span>
          </p>
          <ul className="text-left text-sm text-zinc-300 space-y-2 mb-8 max-w-md mx-auto">
            {pricingFeatures.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                {c}
              </li>
            ))}
          </ul>
          {!loading && data && (
            <p className="text-sm font-bold text-violet-200/90 mb-2">
              Kohorta {cohortName}: {spots} boos oo hadhay · Waxay bilaabantaa {nextLabel}
            </p>
          )}
          <Link
            href="/subscribe?plan=challenge"
            className="inline-flex w-full max-w-md mx-auto justify-center rounded-2xl bg-violet-600 py-4 font-black text-base sm:text-lg hover:bg-violet-500 transition-colors"
          >
            Ku biir Kohorta — Hadda →
          </Link>
          <p className="mt-5 text-xs text-zinc-500 leading-relaxed max-w-sm mx-auto">
            Lacag celin haddaad 7 maalmood gudahood ku qanacsan tahayin.
          </p>
        </div>
      </section>

      <FAQSection />
      <ClosingCTA />
    </div>
  );
}
