import { pricingTranslations as t } from "./translations/pricing";

export const PLANS = {
  explorer: {
    key: "explorer" as const,
    name: t.explorer_name,
    tagline: t.explorer_tagline,
    /** Shown in UI only; backend still settles in USD for Waafi/Stripe as configured. */
    priceDisplay: "€29",
    yearlyPriceNote: t.explorer_yearly_hint,
    per: t.explorer_per_month,
    highlight: false,
    badge: t.explorer_popular_badge,
    features: [
      t.explorer_feature_1,
      t.explorer_feature_2,
      t.explorer_feature_3,
      t.explorer_feature_4,
      t.explorer_feature_5,
    ],
    cta: t.explorer_cta,
    payButton: t.modal_pay_explorer,
  },
  challenge: {
    key: "challenge" as const,
    name: t.challenge_name,
    tagline: t.challenge_tagline,
    priceDisplay: "€149",
    per: t.challenge_per_one_time,
    highlight: true,
    badge: t.challenge_badge,
    features: [
      t.challenge_feature_1,
      t.challenge_feature_2,
      t.challenge_feature_3,
      t.challenge_feature_4,
      t.challenge_feature_5,
      t.challenge_feature_6,
    ],
    cta: t.challenge_cta,
    payButton: t.modal_pay_challenge,
  },
};

export type SubscribePlanKey = keyof typeof PLANS;
export type SubscribePlan = (typeof PLANS)[SubscribePlanKey];

/** Optional Stripe Price IDs — if unset, checkout uses server `price_data` fallback. */
export const SUBSCRIBE_STRIPE_PRICE_IDS = {
  explorer: process.env.NEXT_PUBLIC_STRIPE_EXPLORER_PRICE_ID ?? "",
  challenge: process.env.NEXT_PUBLIC_STRIPE_CHALLENGE_PRICE_ID ?? "",
};

export function isValidSubscribeStripePriceId(id: string | undefined): boolean {
  return typeof id === "string" && id.startsWith("price_");
}

export const FAQ = [
  { q: t.faq_1_q, a: t.faq_1_a },
  { q: t.faq_2_q, a: t.faq_2_a },
  { q: t.faq_3_q, a: t.faq_3_a },
  { q: t.faq_4_q, a: t.faq_4_a },
  { q: t.faq_5_q, a: t.faq_5_a },
];
