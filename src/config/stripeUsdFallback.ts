/**
 * Stripe Checkout `price_data` when Price IDs are not configured (USD cents).
 * Explorer: $29/mo, Challenge: $149/mo.
 */
export const STRIPE_USD_FALLBACK = {
  explorer: {
    unit_amount: 2900,
    currency: "usd" as const,
    product_name: "Garaad Explorer",
    product_description:
      "All courses, lesson tracking, community. Billed monthly.",
  },
  challenge: {
    unit_amount: 14900,
    currency: "usd" as const,
    product_name: "Garaad Challenge",
    product_description:
      "Full stack intensive, direct support, certificates. Billed monthly.",
  },
} as const;
