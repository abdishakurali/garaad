"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { usePostHog } from "posthog-js/react";
import { PLANS, FAQ, type SubscribePlanKey } from "@/config/subscribePlans";
import { pricingTranslations as t } from "@/config/translations/pricing";
import { EXPLORER_IS_FREE } from "@/config/featureFlags";
import PaymentModal from "@/components/PaymentModal";
import AuthService from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import Logo from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface LandingStats {
  students_count?: number;
  courses_count?: number;
  learners_this_month?: number;
}

function PlanComparisonTable() {
  const rows = [
    {
      label: t.compare_row_courses,
      bilaash: t.compare_explorer_courses,
      challenge: t.compare_challenge_courses,
    },
    {
      label: t.compare_row_support,
      bilaash: t.compare_explorer_support,
      challenge: t.compare_challenge_support,
    },
    {
      label: t.compare_row_certificate,
      bilaash: t.compare_bilaash_certificate,
      challenge: t.compare_challenge_certificate,
    },
  ];

  return (
    <div className="mb-10 sm:mb-12 overflow-x-auto rounded-2xl border border-border bg-card/50 shadow-sm">
      <table className="w-full min-w-[400px] text-left text-sm">
        <caption className="sr-only">{t.compare_title}</caption>
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th scope="col" className="p-3 sm:p-4 font-semibold text-foreground w-[34%]">
              {t.compare_col_features}
            </th>
            <th scope="col" className="p-3 sm:p-4 font-semibold text-foreground">
              Bilaash
            </th>
            <th scope="col" className="p-3 sm:p-4 font-semibold text-primary">
              Challenge
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th
                scope="row"
                className="p-3 sm:p-4 font-medium text-foreground align-top"
              >
                {row.label}
              </th>
              <td className="p-3 sm:p-4 text-foreground align-top">{row.bilaash}</td>
              <td className="p-3 sm:p-4 text-muted-foreground align-top">
                {row.challenge}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubscribePageInner() {
  const [selectedPlan, setSelectedPlan] = useState<SubscribePlanKey | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const viewCaptured = useRef(false);
  const storeUser = useAuthStore((s) => s.user);
  const explorerCtaUser = storeUser ?? AuthService.getInstance().getCurrentUser();

  const planFromQuery = searchParams.get("plan") as SubscribePlanKey | null;
  const refParam = searchParams.get("ref") ?? "";

  const { data: stats, error: statsError } = useSWR<LandingStats>(
    `${API_BASE_URL}/api/public/landing-stats/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );

  const { data: challengeStatus, loading: challengeStatusLoading } = useChallengeStatus();

  const joinCount =
    typeof stats?.learners_this_month === "number" && stats.learners_this_month > 0
      ? stats.learners_this_month
      : !statsError && typeof stats?.students_count === "number" && stats.students_count > 0
        ? Math.max(48, Math.round(stats.students_count * 0.08))
        : 186;

  useEffect(() => {
    const auth = AuthService.getInstance();
    const u = auth.getCurrentUser();
    if (EXPLORER_IS_FREE) {
      if (u?.is_premium && u?.subscription_type === "challenge") {
        router.replace("/dashboard");
      }
      return;
    }
    if (auth.isPremium()) {
      router.replace("/dashboard");
    }
  }, [router]);

  useEffect(() => {
    if (viewCaptured.current || !posthog) return;
    viewCaptured.current = true;
    posthog.capture("subscribe_page_view", { ref: refParam });
  }, [posthog, refParam]);

  useEffect(() => {
    if (planFromQuery !== "explorer" && planFromQuery !== "challenge") return;
    const el = document.getElementById(`plan-card-${planFromQuery}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [planFromQuery]);

  /** Smooth scroll when arriving from home hero (e.g. /subscribe#plan-card-explorer). */
  useEffect(() => {
    if (pathname !== "/subscribe" || typeof window === "undefined") return;
    const scrollToHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash !== "plan-card-explorer" && hash !== "plan-card-challenge") return;
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    scrollToHash();
    const raf = requestAnimationFrame(scrollToHash);
    const t = window.setTimeout(scrollToHash, 200);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname]);

  const handlePaymentSuccess = (planKey: SubscribePlanKey) => {
    router.push(`/dashboard?subscribed=${planKey}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center py-1" aria-label="Garaad home">
            <Logo
              priority
              loading="eager"
              className="h-10 w-auto sm:h-11"
              sizes="(max-width: 640px) 140px, 180px"
            />
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="px-4 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary via-violet-600 to-primary bg-clip-text text-transparent">
            {t.pricing_title}
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            {t.pricing_subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-8">
          {!stats && !statsError ? (
            <div
              className="h-6 max-w-md mx-auto rounded-md bg-muted animate-pulse mb-2"
              aria-hidden
            />
          ) : (
            <p className="text-center text-sm font-medium text-primary">
              {t.subscribe_social_month.replace("{n}", String(joinCount))}
            </p>
          )}
        </div>

        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-center mb-4 text-foreground">
            {t.compare_title}
          </h2>
          <PlanComparisonTable />
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 mb-16 md:mb-20 items-stretch">
          {(["challenge", "explorer"] as const).map((key) => {
            const plan = PLANS[key];
            const explorerFree = key === "explorer" && EXPLORER_IS_FREE;
            const priceLabel = explorerFree ? t.explorer_free_price_display : plan.priceDisplay;
            const perLabel = explorerFree ? t.explorer_free_per : plan.per;
            const yearlyNote =
              explorerFree ? null : "yearlyPriceNote" in plan ? plan.yearlyPriceNote : null;
            const isHighlightedFromUrl = planFromQuery === plan.key;
            const cohortStart =
              challengeStatus?.cohort_start_date ?? challengeStatus?.next_cohort_start_date;
            const cohortStartFmt =
              cohortStart != null
                ? new Date(cohortStart).toLocaleDateString("so-SO", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : null;

            return (
              <div
                id={`plan-card-${plan.key}`}
                key={plan.key}
                className={cn(
                  "relative rounded-3xl border-2 p-8 sm:p-9 flex flex-col h-full",
                  plan.key === "challenge"
                    ? "border-violet-500/60 bg-gradient-to-br from-violet-700 via-primary to-purple-900 text-primary-foreground shadow-2xl shadow-violet-500/25 lg:scale-[1.02] lg:z-10"
                    : "border-border bg-card/80 text-card-foreground backdrop-blur-sm",
                  isHighlightedFromUrl && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                {plan.badge && String(plan.badge).trim() !== "" ? (
                  <span
                    className={`absolute -top-3 left-6 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                      plan.key === "challenge"
                        ? "bg-amber-400 text-amber-950"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    ★ {plan.badge}
                  </span>
                ) : null}

                <h2
                  className={cn(
                    "text-xl font-bold mb-1",
                    plan.highlight ? "text-primary-foreground" : "text-card-foreground"
                  )}
                >
                  {plan.name}
                </h2>

                <p
                  className={cn(
                    "text-sm mb-6 leading-relaxed",
                    plan.highlight ? "text-primary-foreground/85" : "text-muted-foreground"
                  )}
                >
                  {plan.tagline}
                </p>

                <div className="mb-6">
                  <div className="flex items-end gap-1 flex-wrap">
                    <span
                      className={cn(
                        "text-5xl sm:text-6xl font-extrabold tabular-nums",
                        plan.highlight ? "text-primary-foreground" : "text-foreground"
                      )}
                    >
                      {priceLabel}
                    </span>
                    <span
                      className={cn(
                        "text-base mb-2 font-semibold",
                        plan.highlight ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}
                    >
                      {perLabel}
                    </span>
                  </div>
                  {yearlyNote ? (
                    <p
                      className={cn(
                        "mt-2 text-sm",
                        plan.highlight ? "text-primary-foreground/75" : "text-muted-foreground"
                      )}
                    >
                      {yearlyNote}
                    </p>
                  ) : null}
                </div>

                {plan.key === "challenge" ? (
                  <div
                    className={cn(
                      "mb-6 text-sm leading-snug",
                      plan.highlight ? "text-primary-foreground/95" : "text-muted-foreground"
                    )}
                  >
                    {challengeStatusLoading && !challengeStatus ? (
                      <div className="h-14 rounded-md bg-primary-foreground/10 animate-pulse" aria-hidden />
                    ) : challengeStatus ? (
                      <>
                        <p className="font-bold">
                          {challengeStatus.is_waitlist_only
                            ? t.challenge_waitlist_only
                            : t.challenge_spots_remaining.replace(
                                "{n}",
                                String(challengeStatus.spots_remaining)
                              )}
                        </p>
                        <p className="text-sm mt-1 font-semibold opacity-95">
                          {challengeStatus.spots_remaining} boos oo hadhay kooxdan
                        </p>
                        {cohortStartFmt ? (
                          <p className="mt-2 text-xs font-semibold opacity-95">
                            Kooxdu waxay bilaabaysaa: {cohortStartFmt}
                          </p>
                        ) : null}
                        {challengeStatus.is_waitlist_only &&
                        challengeStatus.next_cohort_start_date ? (
                          <p className="mt-1.5 text-xs opacity-90">
                            {t.challenge_next_cohort.replace(
                              "{date}",
                              challengeStatus.next_cohort_start_date
                            )}
                          </p>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                ) : null}

                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-snug">
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                          plan.highlight
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        ✓
                      </span>
                      <span
                        className={
                          plan.highlight ? "text-primary-foreground/90" : "text-muted-foreground"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {explorerFree ? (
                  <Link
                    href={explorerCtaUser ? "/dashboard" : "/signup"}
                    className="w-full py-4 rounded-xl font-bold text-base transition-all text-center block border-2 border-primary text-primary bg-transparent hover:bg-primary/10"
                  >
                    {explorerCtaUser ? t.explorer_free_cta_logged_in : t.explorer_free_cta_signup}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedPlan(plan.key)}
                    className={cn(
                      "w-full py-4 rounded-xl font-bold text-base transition-all",
                      plan.key === "challenge"
                        ? cn(
                            "bg-primary-foreground text-primary shadow-lg hover:bg-primary-foreground/90",
                            challengeStatus?.is_waitlist_only && "opacity-75"
                          )
                        : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                    )}
                  >
                    {plan.key === "challenge" && challengeStatus?.is_waitlist_only
                      ? t.challenge_cta_waitlist
                      : plan.cta}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="max-w-3xl mx-auto mb-16 grid gap-6 sm:grid-cols-2">
          <figure className="rounded-2xl border border-border bg-card/60 p-5">
            <blockquote className="text-sm text-muted-foreground leading-relaxed">
              &ldquo;Ugu mahadsanid — waxaan noqday developer Challenge-ka kadib.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-xs font-bold text-primary">
              — Abdiladif Salah · <span className="font-semibold text-muted-foreground">Front Developer</span>
            </figcaption>
          </figure>
          <figure className="rounded-2xl border border-border bg-card/60 p-5">
            <blockquote className="text-sm text-muted-foreground leading-relaxed">
              &ldquo;Waxaan dhisay shirkadda Sofaritech thanks to Garaad.&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-xs font-bold text-primary">
              — Abdiaziz · <span className="font-semibold text-muted-foreground">Aasaasaha Sofaritech</span>
            </figcaption>
          </figure>
        </div>

        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">
            {t.faq_title}
          </h3>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="border border-border rounded-xl overflow-hidden bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 sm:py-4 font-medium text-card-foreground flex justify-between items-center gap-4 hover:bg-primary/5 transition-colors"
                >
                  <span>{item.q}</span>
                  <span className="text-muted-foreground ml-4 shrink-0 tabular-nums w-6 text-center">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedPlan && (
          <PaymentModal
            plan={PLANS[selectedPlan]}
            onClose={() => setSelectedPlan(null)}
            onSuccess={() => handlePaymentSuccess(selectedPlan)}
          />
        )}
      </div>
    </div>
  );
}

function SubscribeFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-muted border-t-primary animate-spin" />
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<SubscribeFallback />}>
      <SubscribePageInner />
    </Suspense>
  );
}
