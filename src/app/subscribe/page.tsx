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
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100">
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur">
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

      <div className="px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t.pricing_title}
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-base">
            {t.pricing_subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
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
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                }`}
              >
                {plan.badge && (
                  <span className="absolute -top-3 left-6 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ★ {plan.badge}
                  </span>
                )}

                <h2
                  className={`text-xl font-bold mb-1 ${
                    plan.highlight
                      ? "text-white"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h2>

                <p
                  className={`text-sm mb-6 ${
                    plan.highlight
                      ? "text-gray-300"
                      : "text-gray-500 dark:text-zinc-400"
                  }`}
                >
                  {plan.tagline}
                </p>

                <div className="flex items-end gap-1 mb-8">
                  <span
                    className={`text-5xl font-extrabold ${
                      plan.highlight
                        ? "text-white"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    ${plan.price}
                  </span>
                  <span
                    className={`text-base mb-2 ${
                      plan.highlight
                        ? "text-gray-400"
                        : "text-gray-400 dark:text-zinc-500"
                    }`}
                  >
                    {plan.per}
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span
                        className={`mt-0.5 font-bold ${
                          plan.highlight
                            ? "text-green-400"
                            : "text-green-600 dark:text-green-500"
                        }`}
                      >
                        ✓
                      </span>
                      <span
                        className={
                          plan.highlight
                            ? "text-gray-200"
                            : "text-gray-700 dark:text-zinc-300"
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
                  className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
                    plan.highlight
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            {t.faq_title}
          </h3>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden bg-white dark:bg-zinc-900"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 font-medium text-gray-900 dark:text-white flex justify-between items-center hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <span>{item.q}</span>
                  <span className="text-gray-400 ml-4 shrink-0">
                    {openFaq === i ? "−" : "+"}
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 dark:text-zinc-400 leading-relaxed">
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
