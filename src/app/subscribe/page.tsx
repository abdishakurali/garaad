"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronDown,
  Check,
  ArrowRight,
  Star,
  Lock,
  Users,
  Zap,
  Shield,
} from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useAuthStore } from "@/store/useAuthStore";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import AuthService from "@/services/auth";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="group border-b border-border last:border-0"
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5">
        <span className="text-base font-medium text-foreground">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </summary>
      <p className="pb-5 pr-8 text-sm leading-relaxed text-muted-foreground">
        {a}
      </p>
    </details>
  );
}

const OUTCOMES = [
  {
    icon: Zap,
    title: "60 casho",
    sub: "Barnaamij habaysan",
  },
  {
    icon: Users,
    title: "Mentor toos ah",
    sub: "Xidhiidh shakhsi ah",
  },
  {
    icon: Star,
    title: "Dakhli dammaanad",
    sub: "Ama lacag-celin",
  },
  {
    icon: Lock,
    title: "54+ casharo",
    sub: "Oo dhan fur",
  },
];

const WHAT_UNLOCKS = [
  "Barnaamij habaysan 60 casho ah",
  "Xidhiidh toos ah oo Shakuur (daily check-ins)",
  "Code review shakhsi ah",
  "Dammaanad: dakhli bilowga 5-aad ama lacag-celin",
  "Community gaarka ah (arday horay u guulaystay)",
  "Koorsooyin dheeraad ah oo lagu daro",
];

const TESTIMONIALS = [
  {
    name: "Faadumo A.",
    text: "Casharku wuxuu ii tusinayay cabirka. Mentor-ku ayaa ii dhigay in aan si toos ah u shaqeeyo.",
    stars: 5,
  },
  {
    name: "Maxamed C.",
    text: "2 bilood ka dib ayaan lacag bilaabay. Dammaanadda ayaa i siday xor.",
    stars: 5,
  },
];

const REF_CONTEXT: Record<string, { headline: string; sub: string }> = {
  lesson_1_complete: {
    headline: "Casharku 1aad waa dhammaatay —",
    sub: "Hadda waxaad diyaar u tahay tallaabada xigta. Mentorship-ku wuxuu ku siinayaa qorshaha, jaangooyaha, iyo taageerada aad u baahan tahay si aad lacag uga gasho xirfaddaada.",
  },
  onboarding_complete: {
    headline: "Ku soo dhawow Garaad —",
    sub: "Aasaaska waa dhismay. Qorshaha horumarinta ee habaysan ayaa kaa diyaar.",
  },
  community: {
    headline: "Community-ga waa la arki karaa —",
    sub: "Kuwiinna kale ayaa hore uga guulaystay. Mentorship-ku wuxuu kuu furaa xiriirka iyo taageerada.",
  },
  free_lesson: {
    headline: "Casharku bilaash ah waa dhammaatay —",
    sub: "Waxaad aragtay nuxurka. Hadda waa la sii wadi karaa barnaamijka buuxa.",
  },
};

function SubscribePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const { user } = useAuthStore();
  const viewCaptured = useRef(false);
  const { data: challengeStatus } = useChallengeStatus();

  const ref = searchParams.get("ref") ?? "";
  const ctx = REF_CONTEXT[ref];

  useEffect(() => {
    if (viewCaptured.current || !posthog) return;
    viewCaptured.current = true;
    posthog.capture("subscribe_page_view", { ref });
  }, [posthog, ref]);

  const handleCtaClick = () => {
    posthog?.capture("mentorship_checkout_started", { ref, signed_in: !!user });

    if (challengeStatus?.is_waitlist_only) return;

    if (!user) {
      router.push(`/welcome?redirect=/subscribe/pay`);
      return;
    }

    if (user.is_email_verified === false) {
      const email =
        user.email ?? AuthService.getInstance().getCurrentUser()?.email ?? "";
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      return;
    }

    router.push("/subscribe/pay");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Contextual top message if coming from a trigger */}
      {ctx && (
        <div className="border-b border-gold/20 bg-gold/5 px-4 py-3 text-center text-sm">
          <span className="font-semibold text-gold">{ctx.headline}</span>{" "}
          <span className="text-muted-foreground">{ctx.sub}</span>
        </div>
      )}

      {/* Hero — value first, no price */}
      <section className="mx-auto max-w-2xl px-4 pb-10 pt-14 text-center sm:pt-18">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
          Mentorship · Gacan-qabasho
        </div>
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          Sii wad oo{" "}
          <span className="text-gold">mentor toos ah</span> la hel
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
          Aad baan u fariisanaysaa hore u goynta — casharrada bilaasha ah waxay
          ku tuseen xirfadda. Mentorship-ku wuxuu kugu daraa jaangooyaha,
          taageerada, iyo dammaanadda dakhliga.
        </p>
      </section>

      {/* Outcomes bar */}
      <section className="mx-auto max-w-2xl px-4 pb-10">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {OUTCOMES.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <Icon className="mx-auto mb-2 h-5 w-5 text-gold" />
              <p className="text-sm font-bold text-foreground">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What unlocks */}
      <section className="mx-auto max-w-2xl px-4 pb-12">
        <h2 className="mb-6 text-center text-lg font-bold">
          Maxaa kuu furma?
        </h2>
        <div className="rounded-2xl border border-border bg-card p-6">
          <ul className="space-y-3">
            {WHAT_UNLOCKS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                <span className="text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-2xl px-4 pb-12">
        <h2 className="mb-6 text-center text-lg font-bold">
          Ardayda dhahay
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {TESTIMONIALS.map(({ name, text, stars }) => (
            <div
              key={name}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="mb-3 flex gap-0.5">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-gold text-gold"
                  />
                ))}
              </div>
              <p className="mb-3 text-sm leading-relaxed text-foreground">
                &ldquo;{text}&rdquo;
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                — {name}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing — after all value context */}
      <section className="mx-auto max-w-md px-4 pb-12">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Hoos waxaa ku jira qorshaha
        </p>

        {challengeStatus?.is_waitlist_only ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="mb-2 text-lg font-semibold">Kooxda way buuxdaa</p>
            <p className="mb-6 text-sm text-muted-foreground">
              Geli liiska si aad u hesho kooxda xigta.
            </p>
            <p className="text-sm text-muted-foreground">
              Xiriir nala noqo si aad ugu biirto kooxda xigta.
            </p>
          </div>
        ) : (
          <div className="relative rounded-2xl border-2 border-gold bg-card p-8 shadow-xl shadow-gold/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-0.5 text-[11px] font-bold uppercase tracking-wide text-black">
              Lagu taliyay
            </div>

            <div className="mb-6 text-center">
              <p className="mb-1 text-sm font-medium text-gold">
                Mentorship
              </p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">
                  $49
                </span>
                <span className="text-sm text-muted-foreground">/bilood</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                ama $149 hal mar · 3 bilood
              </p>
            </div>

            <ul className="mb-8 space-y-3">
              {WHAT_UNLOCKS.slice(0, 4).map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-3 text-sm text-foreground"
                >
                  <Check className="h-4 w-4 shrink-0 text-gold" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleCtaClick}
              className="btn-gold flex w-full items-center justify-center gap-2 py-4 text-base font-bold"
            >
              Sii wad oo mentor la hel
              <ArrowRight className="h-4 w-4" />
            </button>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Hal mar bixin · Lacag-celinta 5 maalmood
            </p>
          </div>
        )}

        {/* Social proof */}
        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-muted-foreground">
          <div className="flex -space-x-2">
            {["M", "F", "C"].map((l) => (
              <div
                key={l}
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-gold text-[10px] font-bold text-black"
              >
                {l}
              </div>
            ))}
          </div>
          <span>+150 arday ayaa horey u bilaabay</span>
        </div>
      </section>

      {/* Guarantee callout */}
      <section className="mx-auto max-w-md px-4 pb-12">
        <div className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Dammaanad dakhli
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Haddii aad raacdo qorshaha oo aad lacag kasban waydo muddo 5
              casho ah, si shakhsi ah ayaan kula shaqaynayaa. Haddii aad wali
              ku qanci waydo, lacagtaada waan ku celinayaa.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-4 pb-24">
        <h2 className="mb-6 text-center text-lg font-bold">
          Su&apos;aalaha Inta Badan
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
          {[
            {
              q: "Casharka 1aad bilaash miyuu yahay?",
              a: "Haa. Casharrada 1-3aad bilaash ayay yihiin — ma baahna inaad lacag bixiso si aad u bilowdo. Mentorship-ku wuxuu ka sii furayaa oo dhan.",
            },
            {
              q: "Haddii aan bilaabin waxaan filayay, maxaan samayn karaa?",
              a: "Casharrada bilaasha ah billow — xawlaha aad u baahan tahay hore u ogaanso. Mentorship kuma bilowdo ilaa aad u diyaargashay.",
            },
            {
              q: "Runtii ma jirtaa dammaanad lacag-celin ah?",
              a: "Haa. Haddii aad raacdo qorshaha oo aad lacag kasban waydo muddo 5 casho ah, si shakhsi ah ayaan kula shaqaynayaa ilaa aad ka guulaysato. Haddii intaas ka dib aad wali ku qanci waydo, lacagtaada ayaan kuu soo celinayaa.",
            },
            {
              q: "Waa maxay farqiga Explorer iyo Mentorship?",
              a: "Explorer wuxuu ku siinayaa fursad aad casharrada ku barto xawaarahaaga. Mentorship waa barnaamij habaysan 60 casho ah, xidhiidh toos ah oo Shakuur, iyo dammaanad dakhli.",
            },
            {
              q: "Miyaan bixi karaa $149 hal mar?",
              a: "Haa. $149 hal mar ayaad bixin kartaa (3 bilood). Tani waa ikhtiyaar fiican haddii aad u diyaarsanaatid in aad si buuxda u gashid.",
            },
          ].map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        </div>
      }
    >
      <SubscribePageInner />
    </Suspense>
  );
}
