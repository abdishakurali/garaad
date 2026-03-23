"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { OurStorySection } from "@/components/landing/OurStorySection";
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
  const waitlist = data?.is_waitlist_only ?? false;
  const cohortName = data?.active_cohort_name ?? "Challenge";
  const startForCountdown = data?.cohort_start_date ?? data?.next_cohort_start_date ?? null;
  const nextLabel = formatStartDate(data?.next_cohort_start_date ?? null);

  const primaryHref = "/subscribe?plan=challenge";
  const primaryLabel = waitlist ? "Liiska Sugitaanka ku Biir" : "Ku biir Kohorta — Hadda →";

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="relative overflow-hidden px-3 pb-14 pt-20 sm:px-4 sm:pb-16 sm:pt-24 md:px-6 md:pb-20">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto w-full min-w-0 max-w-4xl text-center">
          <span className="mb-3 inline-block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 sm:mb-4 sm:text-xs sm:tracking-[0.25em]">
            4-6 TODOBAAD · 10 ARDAY KALIYA
          </span>

          <h1 className="text-balance text-3xl font-black leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl">
            Dhis Ganacsigaaga{" "}
            <span className="text-purple-500">SaaS &amp; AI</span>
          </h1>

          <div className="mt-6 flex justify-center sm:mt-8">
            <SpotsBadge spots={spots} loading={loading && !data} />
          </div>

          <div className="mt-6 flex flex-col items-center gap-0.5 sm:mt-8 sm:gap-1">
            <span className="text-4xl font-black tabular-nums text-white sm:text-5xl md:text-6xl">$149</span>
            <span className="text-base font-bold text-zinc-400 sm:text-lg">/bilaan</span>
          </div>

          <div className="mx-auto mt-8 w-full min-w-0 max-w-xl sm:mt-10">
            <CountdownTimer
              targetDate={startForCountdown}
              label="Kohorta waxay bilaabantaa:"
            />
          </div>

          {waitlist && (
            <p className="mx-auto mt-5 max-w-lg px-1 text-sm font-semibold leading-relaxed text-amber-200/95 sm:mt-6">
              Kohorta hadda waa buuxday — kii xiga: {nextLabel}
            </p>
          )}

          <div className="mt-6 sm:mt-8">
            <Link
              href={primaryHref}
              className={`inline-flex w-full max-w-md items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-3.5 text-base font-black shadow-lg shadow-purple-900/40 transition-opacity hover:opacity-95 sm:px-8 sm:py-4 sm:text-lg ${
                waitlist ? "opacity-75" : ""
              }`}
            >
              {primaryLabel}
            </Link>
          </div>

          <p className="mt-8 text-center text-[11px] font-bold uppercase tracking-widest text-purple-400 sm:mt-10 sm:text-sm">
            Baro Sida uu u Shaqeeyo →
          </p>
          <div className="mx-auto mt-3 w-full min-w-0 max-w-4xl overflow-hidden rounded-xl border-2 border-white/10 bg-white/5 shadow-2xl backdrop-blur-sm sm:mt-4">
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

      <div className="dark">
        <OurStorySection />
      </div>

      <section className="border-y border-white/5 bg-[#0f0f0f] px-3 py-12 sm:px-4 sm:py-16 md:px-6 md:py-20">
        <div className="mx-auto w-full min-w-0 max-w-7xl">
          <div className="mx-auto mb-8 max-w-2xl px-1 text-center sm:mb-10 md:mb-12">
            <h2 className="text-balance text-2xl font-black text-white sm:text-3xl md:text-4xl">
              Sheekooyinka <span className="text-purple-400">Guusha</span>
            </h2>
            <p className="mt-2 text-xs font-bold uppercase tracking-widest text-zinc-500 sm:mt-3 sm:text-sm">
              Ardayda Challenge-ka hore
            </p>
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {graduateCards.map((g) => (
              <div
                key={g.name}
                className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-zinc-900/60 shadow-lg sm:rounded-3xl ${
                  g.featured
                    ? "border-emerald-500/35 ring-1 ring-emerald-500/15 sm:col-span-2 lg:col-span-2"
                    : "border-white/10"
                }`}
              >
                <div
                  className={`relative w-full overflow-hidden ${
                    g.featured
                      ? "aspect-video min-h-[200px] sm:min-h-[240px] lg:aspect-[21/9] lg:min-h-[260px]"
                      : "aspect-square max-h-[min(72vh,480px)] sm:aspect-[4/5] sm:max-h-none"
                  }`}
                >
                  <Image
                    src={g.src}
                    alt={g.name}
                    fill
                    className="object-cover object-top"
                    sizes={
                      g.featured
                        ? "(max-width:640px) 100vw, (max-width:1280px) 100vw, 66vw"
                        : "(max-width:640px) 100vw, (max-width:1280px) 50vw, 33vw"
                    }
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                  <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-black sm:px-3 sm:text-xs ${
                        g.featured ? "bg-emerald-500 text-emerald-950" : "bg-violet-600/90 text-white"
                      }`}
                    >
                      {g.badge}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-1.5 p-4 sm:gap-2 sm:p-6">
                  <p className="text-base font-black text-white sm:text-lg">{g.name}</p>
                  <p className="text-xs font-bold text-violet-400">{g.tag}</p>
                  <p className="text-sm leading-relaxed text-zinc-400 italic sm:text-base">
                    &ldquo;{g.quote}&rdquo;
                  </p>
                  {g.href ? (
                    <a
                      href={g.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex w-fit text-sm font-bold text-emerald-400 hover:underline sm:mt-2"
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
