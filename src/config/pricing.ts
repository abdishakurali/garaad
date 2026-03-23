/**
 * Numeric fields align with backend settlement; `priceDisplay` is USD marketing copy.
 * @see subscribePlans.ts for subscribe UI; backend `PLAN_PRICING` for charged amounts.
 */

export const PRICING = {
  /** Bilaash (free forever); legacy paid Explorer removed from marketing UI. */
  EXPLORER: {
    priceUsd: 0,
    priceDisplay: "$0",
    interval: "month" as const,
    name: "Bilaash",
    nameSo: "Bilaash",
    description: "Dhammaan koorsooyinka hadda jira, raadinta casharrada, bulshada.",
    descriptionEn: "All current courses, lesson progress, community.",
  },
  /** Challenge — $149 one-time display; charged per backend. */
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

/** Free tier display price (USD); legacy Explorer billing uses backend constants if still enabled. */
export const EXPLORER_PRICE_NUMERIC = PRICING.EXPLORER.priceUsd;

/** Challenge monthly price (USD). */
export const CHALLENGE_PRICE_NUMERIC = PRICING.CHALLENGE.priceUsd;
