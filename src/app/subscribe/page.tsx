"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { usePostHog } from "posthog-js/react";
import { PLANS, FAQ, type SubscribePlanKey } from "@/config/subscribePlans";
import { pricingTranslations as t } from "@/config/translations/pricing";
import PaymentModal from "@/components/PaymentModal";
import AuthService from "@/services/auth";
import Logo from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PLAN_KEYS: SubscribePlanKey[] = ["explorer", "challenge"];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface LandingStats {
  students_count?: number;
  courses_count?: number;
  learners_this_month?: number;
}

function PlanComparisonTable() {
  const rows = [
    {
      label: t.compare_row_price,
      free: t.compare_free_price,
      explorer: t.compare_explorer_price,
      challenge: t.compare_challenge_price,
    },
    {
      label: t.compare_row_lessons,
      free: t.compare_free_lessons,
      explorer: t.compare_explorer_lessons,
      challenge: t.compare_challenge_lessons,
    },
    {
      label: t.compare_row_courses,
      free: t.compare_free_courses,
      explorer: t.compare_explorer_courses,
      challenge: t.compare_challenge_courses,
    },
    {
      label: t.compare_row_support,
      free: t.compare_free_support,
      explorer: t.compare_explorer_support,
      challenge: t.compare_challenge_support,
    },
  ];

  return (
    <div className="mb-10 sm:mb-12 overflow-x-auto rounded-2xl border border-border bg-card/50 shadow-sm">
      <table className="w-full min-w-[520px] text-left text-sm">
        <caption className="sr-only">{t.compare_title}</caption>
        <thead>
          <tr className="border-b border-border bg-muted/40">
            <th scope="col" className="p-3 sm:p-4 font-semibold text-foreground w-[28%]">
              {t.compare_col_features}
            </th>
            <th scope="col" className="p-3 sm:p-4 font-semibold text-muted-foreground">
              Free
            </th>
            <th scope="col" className="p-3 sm:p-4 font-semibold text-primary">
              Explorer
            </th>
            <th scope="col" className="p-3 sm:p-4 font-semibold text-muted-foreground">
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
              <td className="p-3 sm:p-4 text-muted-foreground align-top">
                {row.free}
              </td>
              <td className="p-3 sm:p-4 text-foreground align-top">{row.explorer}</td>
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

  const planFromQuery = searchParams.get("plan") as SubscribePlanKey | null;
  const refParam = searchParams.get("ref") ?? "";

  const { data: stats, error: statsError } = useSWR<LandingStats>(
    `${API_BASE_URL}/api/public/landing-stats/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 60 * 1000 }
  );

  const joinCount =
    typeof stats?.learners_this_month === "number" && stats.learners_this_month > 0
      ? stats.learners_this_month
      : !statsError && typeof stats?.students_count === "number" && stats.students_count > 0
        ? Math.max(48, Math.round(stats.students_count * 0.08))
        : 186;

  useEffect(() => {
    if (AuthService.getInstance().isPremium()) {
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

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 md:mb-20">
          {PLAN_KEYS.map((key) => {
            const plan = PLANS[key];
            const isHighlightedFromUrl = planFromQuery === plan.key;
            return (
              <div
                id={`plan-card-${plan.key}`}
                key={plan.key}
                className={cn(
                  `relative rounded-2xl border-2 p-8 flex flex-col`,
                  plan.key === "challenge"
                    ? "order-1 md:order-2"
                    : "order-2 md:order-1",
                  plan.highlight
                    ? "border-primary bg-gradient-to-b from-primary to-violet-700 text-primary-foreground shadow-xl shadow-primary/20"
                    : "border-border bg-card text-card-foreground hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-shadow",
                  isHighlightedFromUrl && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                {plan.badge && (
                  <span
                    className={`absolute -top-3 left-6 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                      plan.key === "explorer"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    ★ {plan.badge}
                  </span>
                )}

                <h2
                  className={`text-xl font-bold mb-1 ${
                    plan.highlight
                      ? "text-primary-foreground"
                      : "text-card-foreground"
                  }`}
                >
                  {plan.name}
                </h2>

                <p
                  className={`text-sm mb-6 leading-relaxed ${
                    plan.highlight
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {plan.tagline}
                </p>

                <div className="mb-8">
                  <div className="flex items-end gap-1">
                    <span
                      className={`text-5xl font-extrabold tabular-nums ${
                        plan.highlight
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {plan.priceDisplay}
                    </span>
                    <span
                      className={`text-base mb-2 ${
                        plan.highlight
                          ? "text-primary-foreground/70"
                          : "text-muted-foreground"
                      }`}
                    >
                      {plan.per}
                    </span>
                  </div>
                  {"yearlyPriceNote" in plan && plan.yearlyPriceNote ? (
                    <p
                      className={`mt-2 text-sm ${
                        plan.highlight
                          ? "text-primary-foreground/75"
                          : "text-muted-foreground"
                      }`}
                    >
                      {plan.yearlyPriceNote}
                    </p>
                  ) : null}
                </div>

                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm leading-snug">
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          plan.highlight
                            ? "bg-primary-foreground/20 text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        ✓
                      </span>
                      <span
                        className={
                          plan.highlight
                            ? "text-primary-foreground/90"
                            : "text-muted-foreground"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan.key)}
                  className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                    plan.highlight
                      ? "bg-primary-foreground text-primary shadow-md hover:bg-primary-foreground/90"
                      : "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
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
