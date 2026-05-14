"use client";

import { Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useAuthStore } from "@/store/useAuthStore";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { WaitlistForm } from "@/components/WaitlistForm";
import AuthService from "@/services/auth";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = [false, (_: boolean) => {}];
  return (
    <details className="group border-b border-border last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5">
        <span className="text-base font-medium text-foreground">{q}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <p className="pb-5 pr-8 text-sm leading-relaxed text-muted-foreground">{a}</p>
    </details>
  );
}

function SubscribePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const { user } = useAuthStore();
  const viewCaptured = useRef(false);
  const { data: challengeStatus } = useChallengeStatus();

  useEffect(() => {
    if (viewCaptured.current || !posthog) return;
    viewCaptured.current = true;
    posthog.capture("subscribe_page_view", { ref: searchParams.get("ref") ?? "" });
  }, [posthog, searchParams]);

  const handleCtaClick = () => {
    posthog?.capture("plan_cta_clicked", { plan: "challenge" });

    if (challengeStatus?.is_waitlist_only) return;

    // Not signed in → signup (will route back here after verification)
    if (!user) {
      router.push("/welcome?redirect=/subscribe/pay");
      return;
    }

    // Signed in but email not verified → verify first
    if (user.is_email_verified === false) {
      const email = user.email ?? AuthService.getInstance().getCurrentUser()?.email ?? "";
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      return;
    }

    // Authenticated & verified → go to checkout
    router.push("/subscribe/pay");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="mx-auto max-w-2xl px-4 pb-8 pt-16 text-center sm:pt-20">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gold" />
          Mentorship · Gacan-qabasho
        </div>
        <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">
          Halkan ayaad ka bilowdaa{" "}
          <span className="text-gold">guusha</span>
        </h1>
        <p className="mx-auto max-w-lg text-base leading-relaxed text-muted-foreground">
          60 casho oo habaysan. Mentor toos ah. Dammaanad dakhli — ama lacagta waan ku celinaa.
        </p>
      </section>

      {/* Plan card */}
      <section className="mx-auto max-w-md px-4 pb-12">
        {challengeStatus?.is_waitlist_only ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <p className="mb-2 text-lg font-semibold">Kooxda way buuxdaa</p>
            <p className="mb-6 text-sm text-muted-foreground">
              Geli liiska si aad u hesho kooxda xigta.
            </p>
            <WaitlistForm />
          </div>
        ) : (
          <div className="relative rounded-2xl border-2 border-gold bg-card p-8 shadow-xl shadow-gold/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-0.5 text-[11px] font-bold uppercase tracking-wide text-black">
              Lagu taliyay
            </div>

            <div className="mb-6 text-center">
              <p className="mb-1 text-sm font-medium text-gold">Mentorship</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">$49</span>
                <span className="text-sm text-muted-foreground">/bilood</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                ama $149 hal mar · 3 bilood
              </p>
            </div>

            <ul className="mb-8 space-y-3">
              {[
                "Barnaamij habaysan 60 casho",
                "Xidhiidh toos ah oo Shakuur",
                "Dammaanad: 5-casho lacag-celin",
                "Community + koorsooyin buuxa",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
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
              Ku soo biir hadda
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

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-4 pb-24">
        <h2 className="mb-6 text-center text-lg font-bold">
          Su&apos;aalaha Inta Badan
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
          {[
            {
              q: "Runtii ma jirtaa dammaanad lacag-celin ah?",
              a: "Haa. Haddii aad raacdo qorshaha oo aad lacag kasban waydo muddo 5 casho ah, si shakhsi ah ayaan kula shaqaynayaa ilaa aad ka guulaysato. Haddii intaas ka dib aad wali ku qanci waydo, lacagtaada ayaan kuu soo celinayaa.",
            },
            {
              q: "Waa maxay farqiga Explorer iyo Mentorship?",
              a: "Explorer wuxuu ku siinayaa fursad aad casharrada ku barto xawaarahaaga. Mentorship waa barnaamij habaysan 60 casho ah, xidhiidh toos ah oo Shakuur, iyo dammaanad dakhli.",
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
