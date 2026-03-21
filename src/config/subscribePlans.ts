/**
 * Subscribe page — public plan copy and USD amounts ($29 Explorer, $149 Challenge / month).
 * Backend mirrors amounts in `payment.services.PLAN_PRICING`.
 */
export const PLANS = {
  explorer: {
    name: "Explorer",
    price: 29,
    currency: "USD",
    per: "month",
    description: "All courses, lesson tracking, community",
    features: [
      "All published courses",
      "Lesson progress tracking",
      "Community access",
      "30 min/day learning path",
    ],
  },
  challenge: {
    name: "Challenge",
    price: 149,
    currency: "USD",
    per: "month",
    description: "Full stack intensive with direct support",
    features: [
      "Everything in Explorer",
      "Fullstack MERN track",
      "Direct support from founder",
      "Certificate on completion",
      "Project reviews",
    ],
  },
} as const;

export type SubscribePlanKey = keyof typeof PLANS;
