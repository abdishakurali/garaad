"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Check } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import AuthService from "@/services/auth";
import StripeService from "@/services/stripe";
import Logo from "@/components/ui/Logo";
import { TechIcon } from "@/components/launchpad/TechIcon";
import { API_BASE_URL } from "@/lib/constants";

type PaymentProvider = "stripe" | "waafi";

// UPDATED: Stripe price IDs from env (fallback to existing IDs)
const STRIPE_PRICE_IDS = {
  explorer: process.env.NEXT_PUBLIC_STRIPE_EXPLORER_PRICE_ID || "price_1T8OAPKgtZOZZO8birrQijvZ",
  challenge: process.env.NEXT_PUBLIC_STRIPE_CHALLENGE_PRICE_ID || "price_1T8OASKgtZOZZO8bsw58rbVt",
  bundleOneTime: process.env.NEXT_PUBLIC_STRIPE_BUNDLE_ONETIME_PRICE_ID || "price_1T8OAWKgtZOZZO8bOwSKjaFm",
  bundleMonthly: process.env.NEXT_PUBLIC_STRIPE_BUNDLE_MONTHLY_PRICE_ID || "price_1T8OAcKgtZOZZO8bO574FFud",
};

// UPDATED: 4 plans, Waafi in KSh per spec; NOTE: Replace Waafi amounts with real values before shipping
const plans = [
  {
    name: "Explorer",
    popular: true,
    stripe: {
      priceId: STRIPE_PRICE_IDS.explorer,
      amount: "€29",
      billing: "subscription" as const,
    },
    waafi: { amount: "50,000 KSh", billing: "subscription" as const },
    features: [
      "All gamified courses",
      "Community access",
      "Launchpad (view only)",
    ],
  },
  {
    name: "Challenge",
    popular: false,
    stripe: {
      priceId: STRIPE_PRICE_IDS.challenge,
      amount: "€149",
      billing: "payment" as const,
    },
    waafi: { amount: "200,000 KSh", billing: "payment" as const },
    features: [
      "4–6 week mentorship",
      "Mentor access",
      "Launchpad (submit startup)",
    ],
  },
  {
    name: "Bundle (One-time)",
    popular: false,
    stripe: {
      priceId: STRIPE_PRICE_IDS.bundleOneTime,
      amount: "€149",
      billing: "payment" as const,
    },
    waafi: { amount: "200,000 KSh", billing: "payment" as const },
    features: [
      "Explorer + Challenge",
      "One-time payment",
    ],
  },
  {
    name: "Bundle (Monthly)",
    popular: false,
    stripe: {
      priceId: STRIPE_PRICE_IDS.bundleMonthly,
      amount: "€29",
      billing: "subscription" as const,
    },
    waafi: { amount: "50,000 KSh", billing: "subscription" as const },
    features: [
      "Explorer + Challenge",
      "Monthly subscription",
    ],
  },
];

const ERROR_TRANSLATIONS: Record<string, string> = {
  "Payment Failed (Receiver is Locked)":
    "Bixinta waa guuldareysatay (Qofka qaataha waa la xidhay)",
  "Payment Failed (Haraaga xisaabtaadu kuguma filna, mobile No: 252618995283)":
    "Bixinta waa guuldareysatay (Haraaga xisaabtaadu kuguma filna, lambarka: 252618995283)",
  "RCS_USER_REJECTED": "Bixinta waa la joojiyay adiga ayaa diiday",
  "Invalid card number": "Lambarka kaarka waa khaldan",
  "Invalid or expired card": "Kaarka waa khaldan ama waa dhammaystiran",
  "Invalid CVV": "CVV-ga waa khaldan",
};

function translateError(error: string) {
  for (const key in ERROR_TRANSLATIONS) {
    if (error.includes(key) || error === key) return ERROR_TRANSLATIONS[key];
  }
  return error;
}

const TRUST_LOGOS = ["Stripe", "Vercel", "Supabase", "Notion"];

export default function SubscribePage() {
  const router = useRouter();
  useAuthStore();
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>("stripe");
  const [error, setError] = useState<string | null>(null);
  const [loadingPlanName, setLoadingPlanName] = useState<string | null>(null);
  // UPDATED: Live stats from Django backend (public landing-stats endpoint)
  const [liveStats, setLiveStats] = useState<{ students_count: number; courses_count: number } | null>(null);

  // UPDATED: Optional auto-detect provider from locale / timezone
  useEffect(() => {
    const locale = typeof navigator !== "undefined" ? navigator.language || "en" : "en";
    const tz = typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone : "";
    if (locale.startsWith("so") || tz.includes("Mogadishu")) {
      setSelectedProvider("waafi");
    }
  }, []);

  // UPDATED: Fetch live stats from backend (Django public endpoint)
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/api/public/landing-stats/`)
      .then((r) => r.json())
      .then((data: { students_count?: number; courses_count?: number }) => {
        if (!cancelled)
          setLiveStats({
            students_count: data.students_count ?? 0,
            courses_count: data.courses_count ?? 0,
          });
      })
      .catch(() => {
        if (!cancelled) setLiveStats(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Premium redirect
  useEffect(() => {
    const authService = AuthService.getInstance();
    if (authService.isPremium()) {
      router.push("/courses");
    }
  }, [router]);

  if (AuthService.getInstance().isPremium()) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/20 border-t-purple-500" />
      </div>
    );
  }

  const handleStripeCheckout = async (plan: (typeof plans)[number]) => {
    setError(null);
    setLoadingPlanName(plan.name);
    try {
      const stripeService = StripeService.getInstance();
      await stripeService.createCheckoutSessionWithPrice(
        plan.stripe.priceId,
        plan.stripe.billing === "subscription" ? "subscription" : "payment"
      );
    } catch (err) {
      setError(translateError(err instanceof Error ? err.message : String(err)));
    } finally {
      setLoadingPlanName(null);
    }
  };

  const handleWaafiCheckout = async (plan: (typeof plans)[number]) => {
    setError(null);
    setLoadingPlanName(plan.name);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan.name,
          amount: plan.waafi.amount,
          billing: plan.waafi.billing,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Bixinta waa guuldareysatay");
      }
      if (data.hppUrl) {
        window.location.href = data.hppUrl;
        return;
      }
      setError(data.message || "No redirect URL received");
    } catch (err) {
      setError(translateError(err instanceof Error ? err.message : String(err)));
    } finally {
      setLoadingPlanName(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center py-10 px-4 font-dmsans">
      <div className="w-full max-w-5xl">
        {/* Logo */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Logo
            width={180}
            height={54}
            className="h-12 w-auto sm:h-14 max-w-[180px] mb-6 drop-shadow-[0_0_24px_rgba(139,92,246,0.25)] rounded-xl"
            priority
            loading="eager"
            sizes="(max-width: 640px) 120px, 180px"
          />
          <h1 className="font-syne text-4xl sm:text-5xl font-bold text-white text-center mb-2">
            Choose Your Plan
          </h1>
          <p className="text-zinc-400 text-center text-base sm:text-lg max-w-xl">
            Start learning. Join the community. Launch your idea.
          </p>
          {/* UPDATED: Live stats from Django backend */}
          {liveStats != null && liveStats.students_count > 0 && (
            <p className="mt-2 text-xs text-zinc-500">
              Join {liveStats.students_count.toLocaleString()}+ learners · {liveStats.courses_count} courses
            </p>
          )}
        </motion.div>

        {/* Trust strip */}
        <motion.div
          className="flex justify-center items-center gap-8 sm:gap-12 py-6 overflow-x-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-500 shrink-0">
            Trusted tools inside
          </span>
          <div className="flex items-center gap-6 sm:gap-10 text-zinc-500">
            {TRUST_LOGOS.map((name) => (
              <span
                key={name}
                className="inline-flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                title={name}
              >
                <TechIcon name={name} className="w-6 h-6 sm:w-7 sm:h-7" />
              </span>
            ))}
          </div>
        </motion.div>

        {/* UPDATED: Payment method toggle — pill-style, lime active, helper text below */}
        <motion.div
          className="flex flex-col items-center mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <div
            className="inline-flex p-1 rounded-full bg-[#0a0a0f] border border-white/15 transition-all duration-300"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedProvider === "stripe"}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedProvider === "stripe"
                  ? "bg-[#C8F135] text-gray-900 shadow-sm"
                  : "bg-transparent text-zinc-400 hover:text-zinc-300 border border-transparent"
              }`}
              onClick={() => setSelectedProvider("stripe")}
            >
              🌍 International (Stripe)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={selectedProvider === "waafi"}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedProvider === "waafi"
                  ? "bg-[#C8F135] text-gray-900 shadow-sm"
                  : "bg-transparent text-zinc-400 hover:text-zinc-300 border border-transparent"
              }`}
              onClick={() => setSelectedProvider("waafi")}
            >
              🇸🇴 Somali (Waafi)
            </button>
          </div>
          <p className="mt-2 text-xs text-zinc-500 text-center max-w-sm">
            {selectedProvider === "stripe"
              ? "Pay with card, Apple Pay or Google Pay"
              : "Ku bixi lacagta Waafi Pay — Soomaali ku habboon"}
          </p>
        </motion.div>

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 border-red-500/30 bg-red-500/10 text-red-200"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* UPDATED: 4 plan cards — price fade 150ms on toggle, CTA text by provider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {plans.map((plan, i) => {
            const isStripe = selectedProvider === "stripe";
            const amount = isStripe ? plan.stripe.amount : plan.waafi.amount;
            const billing = isStripe ? plan.stripe.billing : plan.waafi.billing;
            const billingLabel = billing === "subscription" ? "/ month" : "one-time";
            const isLoading = loadingPlanName === plan.name;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1, duration: 0.45 }}
                className="group relative"
              >
                <div
                  className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:border-purple-500/50 hover:shadow-[0_0_40px_-8px_rgba(139,92,246,0.4)] transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-syne text-xl font-bold text-white mb-2">
                    {plan.name}
                  </h3>
                  {/* UPDATED: Price amount with 150ms fade when provider changes */}
                  <div className="flex items-baseline gap-1.5 mb-4">
                    <motion.span
                      key={`${plan.name}-${selectedProvider}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15 }}
                      className="text-3xl font-bold text-white"
                    >
                      {amount}
                    </motion.span>
                    <span className="text-sm text-zinc-500">{billingLabel}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm text-zinc-300"
                      >
                        <span className="flex-shrink-0 w-4 h-4 rounded-full bg-purple-500/30 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-purple-400" />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold py-6 relative overflow-hidden group/btn disabled:opacity-70"
                    disabled={!!loadingPlanName}
                    onClick={() =>
                      isStripe
                        ? handleStripeCheckout(plan)
                        : handleWaafiCheckout(plan)
                    }
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : isStripe ? (
                        "Pay with Stripe"
                      ) : (
                        "Ku Bixi Waafi"
                      )}
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 bg-[length:200%_100%] animate-shimmer" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <Button
            type="button"
            variant="outline"
            className="rounded-lg border-white/20 text-zinc-400 hover:bg-white/5 hover:text-white"
            onClick={() => router.back()}
          >
            Ka noqo
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
