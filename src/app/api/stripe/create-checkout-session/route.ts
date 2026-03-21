import { NextRequest, NextResponse } from "next/server";
import { getServerStripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { STRIPE_USD_FALLBACK } from "@/config/stripeUsdFallback";
import { jwtDecode } from "jwt-decode";

// More flexible JWT payload interface to handle different token structures
interface JWTPayload {
  email?: string;
  sub?: string;
  user_id?: string;
  userId?: string;
  id?: string;
  username?: string;
  [key: string]: unknown; // Allow additional fields
}

// Helper function to extract user information from JWT token and request body
function getUserInfo(
  request: NextRequest,
  requestBody: Record<string, unknown>
) {
  const authHeader = request.headers.get("Authorization");
  let userEmail: string | null = null;
  let userId: string | null = null;

  // Strategy 1: Try to get from request body (if provided)
  if (requestBody?.email && typeof requestBody.email === "string") {
    userEmail = requestBody.email;
  }
  if (requestBody?.userId != null) {
    userId = typeof requestBody.userId === "string" ? requestBody.userId : String(requestBody.userId);
  }

  // Strategy 2: Extract from JWT token
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwtDecode<JWTPayload>(token);

      // Try multiple possible email fields
      if (!userEmail) {
        userEmail = decoded.email || decoded.username || null;
      }

      // Try multiple possible user ID fields
      if (!userId) {
        userId =
          decoded.user_id ||
          decoded.userId ||
          decoded.sub ||
          decoded.id ||
          null;
      }

      console.log("JWT payload:", {
        email: decoded.email,
        username: decoded.username,
        user_id: decoded.user_id,
        userId: decoded.userId,
        sub: decoded.sub,
        id: decoded.id,
      });
    } catch (error) {
      console.error("JWT decode error:", error);
    }
  }

  return { userEmail, userId };
}

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
    // Parse request body once
    const requestBody = await request.json();
    const {
      plan,
      priceId: bodyPriceId,
      mode: bodyMode,
      billingPlan,
      successUrl,
      cancelUrl,
      countryCode,
      email: providedEmail,
      orderId,
    } = requestBody;

    console.log("📧 Email extraction - Request body:", {
      providedEmail,
      plan,
      countryCode,
      priceId: bodyPriceId,
      mode: bodyMode,
    });

    // Get user information from JWT token and request body
    const { userEmail, userId } = getUserInfo(request, requestBody);

    // Use provided email from request if available, otherwise use extracted email
    const finalEmail = providedEmail || userEmail;

    console.log("📧 Email extraction results:", {
      providedEmail,
      extractedEmail: userEmail,
      finalEmail,
      userId,
    });

    // Validate that we have an email
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
      console.log(`✅ Using direct Price ID: ${bodyPriceId}, mode: ${sessionMode}`);
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
      console.log(`✅ Using USD price_data fallback for billingPlan=${billing}`);
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

      console.log(`💰 Price configuration:`, {
        plan,
        countryCode,
        priceType,
        priceId,
      });

      if (priceId && priceId.startsWith("price_")) {
        lineItems = [{ price: priceId, quantity: 1 }];
        sessionMode = "subscription";
        console.log(`✅ Using valid Price ID: ${priceId} for plan: ${plan}`);
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
        console.log(`⚠️ Using fallback price_data for plan: ${plan}, type: ${priceType}`);
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
        userId: String(userId || "unknown"),
        user_id: String(userId || "unknown"),
        order_id: orderId != null ? String(orderId) : "",
        countryCode: String(countryCode ?? ""),
        userEmail: finalEmail,
      },
      billing_address_collection: "required",
      customer_email: finalEmail,
    };
    if (sessionMode === "subscription") {
      sessionParams.allow_promotion_codes = true;
    }

    const session = await stripeInstance.checkout.sessions.create(sessionParams);

    console.log(`✅ Checkout session created successfully:`, {
      sessionId: session.id,
      customerEmail: finalEmail,
      userId: userId || "unknown",
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error: unknown) {
    console.error("❌ Error creating checkout session:", error);

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
