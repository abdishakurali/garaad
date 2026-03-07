/**
 * Garaad platform pricing — single source of truth.
 * TIER 1 Explorer: core subscription. TIER 2 Challenge: quarterly add-on.
 */

export const PRICING = {
  /** TIER 1 — Explorer: €29/month. All courses, community, launchpad (view only). */
  EXPLORER: {
    priceEur: 29,
    priceDisplay: "€29",
    interval: "month" as const,
    name: "Explorer",
    nameSo: "Explorer",
    description: "Koorsooyinka oo dhan, bulshada, iyo launchpad (aragti oo keliya).",
    descriptionEn: "All gamified courses, community, and launchpad (view only).",
  },
  /** TIER 2 — Challenge: €149 one-time per cohort. 4–6 week mentorship, launchpad submit. Quarterly. */
  CHALLENGE: {
    priceEur: 149,
    priceDisplay: "€149",
    oneTime: true,
    name: "Challenge",
    nameSo: "Challenge",
    description: "4–6 toddobaad oo mentorship, mentor access, launchpad (gudbi startup). Loo qaabily qeybta (4x sannadkii).",
    descriptionEn: "4–6 week group mentorship program, mentor access, launchpad (submit a startup). Runs quarterly (4x per year).",
    noteNoCourseAccess: "Ma ku jiraan koorsooyinka joogta ah ee Explorer haddii aad isku darkaysato.",
  },
} as const;

/** Explorer monthly price for payment/API (same value for all regions). */
export const EXPLORER_PRICE_NUMERIC = PRICING.EXPLORER.priceEur;

/** Challenge one-time price for payment/API. */
export const CHALLENGE_PRICE_NUMERIC = PRICING.CHALLENGE.priceEur;
