import { NextRequest, NextResponse } from "next/server";
import { getServerStripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { STRIPE_USD_FALLBACK } from "@/config/stripeUsdFallback";
import { EXPLORER_IS_FREE } from "@/config/featureFlags";

// Legacy fallback: Explorer $29/mo when old `plan: monthly` + no Price ID
const FALLBACK_PRICES = {
  monthly: {
    SOMALIA: {
      unit_amount: 2900,
      currency: "usd",
    },
    INTERNATIONAL: {
      unit_amount: 2900,
      currency: "usd",
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const requestBody: Record<string, unknown> = await request.json();
    const {
      plan,
      priceId: bodyPriceId,
      mode: bodyMode,
      billingPlan,
      planType,
      successUrl,
      cancelUrl,
      countryCode,
      email: finalEmail,
      userId: rawUserId,
      orderId,
    } = requestBody;

    const userId: string | null = rawUserId != null
      ? typeof rawUserId === "string" ? rawUserId : String(rawUserId)
      : null;

    if (!finalEmail) {
      return NextResponse.json(
        { error: "User email is required for checkout" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(finalEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (
      EXPLORER_IS_FREE &&
      (billingPlan === "explorer" || plan === "monthly")
    ) {
      return NextResponse.json(
        {
          error:
            "Explorer is included free. Sign in with your account to access all lessons.",
        },
        { status: 400 }
      );
    }

    let stripeInstance;
    try {
      stripeInstance = getServerStripe();
    } catch (error) {
      console.error("Stripe initialization error:", error);
      return NextResponse.json(
        { error: "Stripe not configured properly" },
        { status: 500 }
      );
    }

    let lineItems: { price: string; quantity: number }[] | { price_data: { currency: string; product_data: { name: string; description: string }; unit_amount: number; recurring: { interval: "month" | "year" } }; quantity: number }[];
    let sessionMode: "subscription" | "payment";

    const billing =
      billingPlan === "explorer" || billingPlan === "challenge"
        ? billingPlan
        : undefined;

    // Path 1: Direct Stripe Price ID + mode (subscribe page when env IDs are set)
    if (
      bodyPriceId &&
      typeof bodyPriceId === "string" &&
      bodyPriceId.startsWith("price_") &&
      bodyMode &&
      (bodyMode === "subscription" || bodyMode === "payment")
    ) {
      lineItems = [{ price: bodyPriceId, quantity: 1 }];
      sessionMode = bodyMode;
    } else if (billing) {
      // Path 2: USD price_data — $29 Explorer / $149 Challenge per month (no Price ID)
      const fb = STRIPE_USD_FALLBACK[billing];
      lineItems = [
        {
          price_data: {
            currency: fb.currency,
            product_data: {
              name: fb.product_name,
              description: fb.product_description,
            },
            unit_amount: fb.unit_amount,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ];
      sessionMode = "subscription";
    } else {
      // Path 3: Legacy plan + countryCode
      if (!plan || !STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS]) {
        return NextResponse.json(
          { error: "Invalid plan specified" },
          { status: 400 }
        );
      }
      const priceType = countryCode === "SO" ? "SOMALIA" : "INTERNATIONAL";
      const priceId =
        STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS][priceType];

      if (priceId && priceId.startsWith("price_")) {
        lineItems = [{ price: priceId, quantity: 1 }];
        sessionMode = "subscription";
      } else {
        const fallbackPrice =
          FALLBACK_PRICES[plan as keyof typeof FALLBACK_PRICES][priceType];
        lineItems = [
          {
            price_data: {
              currency: fallbackPrice.currency,
              product_data: {
                name: "Garaad Explorer",
                description: "All courses, community. Billed monthly ($29).",
              },
              unit_amount: fallbackPrice.unit_amount,
              recurring: {
                interval:
                  plan === "monthly" ? ("month" as const) : ("year" as const),
              },
            },
            quantity: 1,
          },
        ];
        sessionMode = "subscription";
      }
    }

    // Build session params (allow_promotion_codes only valid for subscription mode)
    const sessionParams: Parameters<typeof stripeInstance.checkout.sessions.create>[0] = {
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: sessionMode,
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?canceled=true`,
      metadata: {
        plan:
          (billing as string) ||
          (plan as string) ||
          (bodyPriceId ? "direct" : ""),
        planType: String(planType || "installment"),
        userId: String(userId || "unknown"),
        user_id: String(userId || "unknown"),
        order_id: orderId != null ? String(orderId) : "",
        countryCode: String(countryCode ?? ""),
        userEmail: finalEmail,
      },
      client_reference_id: userId || undefined,
      billing_address_collection: "required",
      customer_email: finalEmail,
    };
    if (sessionMode === "subscription") {
      sessionParams.allow_promotion_codes = true;
    }

    const session = await stripeInstance.checkout.sessions.create(sessionParams);
    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) {
    console.error("Error creating checkout session:", error);

    const message =
      error instanceof Error
        ? error.message
        : typeof (error as { raw?: { message?: string } })?.raw?.message === "string"
          ? (error as { raw: { message: string } }).raw.message
          : "Failed to create checkout session";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
