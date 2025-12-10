import Stripe from "stripe";

// Server-side Stripe instance (lazily created only on server)
let _stripe: Stripe | null = null;

export const getServerStripe = (): Stripe => {
  if (typeof window !== "undefined") {
    throw new Error("Stripe server instance cannot be used on the client");
  }

  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY environment variable is not set");
    }

    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-05-28.basil",
    });
  }

  return _stripe;
};

// Legacy export for backward compatibility (lazy-loaded)
export const stripe = typeof window === "undefined" ? getServerStripe : null;

// Client-side Stripe configuration
export const getStripe = async () => {
  if (typeof window !== "undefined") {
    const { loadStripe } = await import("@stripe/stripe-js");
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return null;
};

// Helper function to validate Price ID format
function validatePriceId(priceId: string | undefined): string | undefined {
  if (!priceId) return undefined;

  // Stripe Price IDs should start with "price_"
  if (priceId.startsWith("price_")) {
    return priceId;
  }

  // If it's not a valid Price ID format, return undefined to trigger fallback
  console.warn(
    `Invalid Price ID format: ${priceId}. Expected format: price_xxxxxxxxxx`
  );
  return undefined;
}

// Price IDs for your subscription plans
export const STRIPE_PRICE_IDS = {
  monthly: {
    SOMALIA: validatePriceId(process.env.STRIPE_MONTHLY_PRICE_ID_SOMALIA),
    INTERNATIONAL: validatePriceId(
      process.env.STRIPE_MONTHLY_PRICE_ID_INTERNATIONAL
    ),
  },
};

// Webhook events to handle
export const STRIPE_WEBHOOK_EVENTS = [
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.payment_succeeded",
  "invoice.payment_failed",
];
