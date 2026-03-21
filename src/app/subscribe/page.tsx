"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PLANS, FAQ, type SubscribePlanKey } from "@/config/subscribePlans";
import { pricingTranslations as t } from "@/config/translations/pricing";
import PaymentModal from "@/components/PaymentModal";
import AuthService from "@/services/auth";
import Logo from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

const PLAN_KEYS: SubscribePlanKey[] = ["explorer", "challenge"];

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState<SubscribePlanKey | null>(
    null
  );
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (AuthService.getInstance().isPremium()) {
      router.replace("/dashboard");
    }
  }, [router]);

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
        <div className="text-center mb-12 sm:mb-14">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary via-violet-600 to-primary bg-clip-text text-transparent">
            {t.pricing_title}
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            {t.pricing_subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 md:mb-20">
          {PLAN_KEYS.map((key) => {
            const plan = PLANS[key];
            return (
              <div
                key={plan.key}
                className={`relative rounded-2xl border-2 p-8 flex flex-col ${
                  plan.key === "challenge"
                    ? "order-1 md:order-2"
                    : "order-2 md:order-1"
                } ${
                  plan.highlight
                    ? "border-primary bg-gradient-to-b from-primary to-violet-700 text-primary-foreground shadow-xl shadow-primary/20"
                    : "border-border bg-card text-card-foreground hover:border-primary/25 hover:shadow-lg hover:shadow-primary/5 transition-shadow"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
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

                <div className="flex items-end gap-1 mb-8">
                  <span
                    className={`text-5xl font-extrabold tabular-nums ${
                      plan.highlight
                        ? "text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    ${plan.price}
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
