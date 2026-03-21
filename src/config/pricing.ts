/**
 * Garaad platform pricing — aligns with subscribe checkout (USD).
 * @see subscribePlans.ts for subscribe page copy; backend `PLAN_PRICING` for orders.
 */

export const PRICING = {
  /** Explorer — $29/month. All current courses, community, tracking. */
  EXPLORER: {
    priceUsd: 29,
    priceDisplay: "$29",
    interval: "month" as const,
    name: "Explorer",
    nameSo: "Explorer",
    description: "Dhammaan koorsooyinka hadda jira, raadinta casharrada, bulshada.",
    descriptionEn: "All current courses, lesson progress, community.",
  },
  /** Challenge — $149/month. Full stack intensive, direct support, certificates. */
  CHALLENGE: {
    priceUsd: 149,
    priceDisplay: "$149",
    interval: "month" as const,
    name: "Challenge",
    nameSo: "Challenge",
    description: "Full stack intensive, taageero toos ah, shahaadooyin.",
    descriptionEn: "Full stack intensive, direct support, certificates.",
  },
} as const;

/** Explorer monthly price (USD) for copy / helpers. */
export const EXPLORER_PRICE_NUMERIC = PRICING.EXPLORER.priceUsd;

/** Challenge monthly price (USD). */
export const CHALLENGE_PRICE_NUMERIC = PRICING.CHALLENGE.priceUsd;
