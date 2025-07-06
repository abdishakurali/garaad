import { NextRequest, NextResponse } from "next/server";
import { stripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  email: string;
  sub: string;
  user_id: string;
}

// Fallback price configuration when price IDs are not available
const FALLBACK_PRICES = {
  monthly: {
    SOMALIA: {
      unit_amount: 1900, // $19.00 in cents
      currency: "usd",
    },
    INTERNATIONAL: {
      unit_amount: 4900, // $49.00 in cents
      currency: "usd",
    },
  },
};

export async function POST(request: NextRequest) {
  try {
    const { plan, successUrl, cancelUrl, countryCode } = await request.json();

    // Validate plan
    if (!plan || !STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS]) {
      return NextResponse.json(
        { error: "Invalid plan specified" },
        { status: 400 }
      );
    }

    // Get user from auth token
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    let userEmail: string;
    let userId: string;

    try {
      const decoded = jwtDecode<JWTPayload>(token);
      userEmail = decoded.email;
      userId = decoded.user_id;
    } catch {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    // Get the correct price ID based on location
    const priceType = countryCode === "SO" ? "SOMALIA" : "INTERNATIONAL";
    const priceId =
      STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS][priceType];

    console.log(`Request details:`, {
      plan,
      countryCode,
      priceType,
      priceId,
      envVars: {
        SOMALIA: process.env.STRIPE_MONTHLY_PRICE_ID_SOMALIA,
        INTERNATIONAL: process.env.STRIPE_MONTHLY_PRICE_ID_INTERNATIONAL,
      },
    });

    // Prepare line items - use price ID if available, otherwise use price_data as fallback
    let lineItems;

    if (priceId && priceId.startsWith("price_")) {
      // Use price ID if available and valid
      lineItems = [
        {
          price: priceId,
          quantity: 1,
        },
      ];
      console.log(
        `✅ Using valid Price ID: ${priceId} for plan: ${plan}, type: ${priceType}`
      );
    } else {
      // Use price_data as fallback
      const fallbackPrice =
        FALLBACK_PRICES[plan as keyof typeof FALLBACK_PRICES][priceType];
      lineItems = [
        {
          price_data: {
            currency: fallbackPrice.currency,
            product_data: {
              name: `Garaad ${
                plan === "monthly" ? "Monthly" : "Yearly"
              } Subscription`,
              description: `Access to all premium features and content`,
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
      console.log(
        `⚠️  Using fallback price_data for plan: ${plan}, type: ${priceType}`
      );
      console.log(
        `   Price: ${fallbackPrice.unit_amount} ${fallbackPrice.currency}`
      );
      console.log(
        `   Reason: ${
          !priceId ? "No Price ID found" : "Invalid Price ID format"
        }`
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "subscription",
      success_url:
        successUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:
        cancelUrl ||
        `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?canceled=true`,
      metadata: {
        plan,
        userId,
        countryCode,
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_email: userEmail,
    });

    console.log(`✅ Checkout session created successfully: ${session.id}`);
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("❌ Error creating checkout session:", error);

    // Log detailed error information for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }

    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
