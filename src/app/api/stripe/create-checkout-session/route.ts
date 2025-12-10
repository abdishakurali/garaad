import { NextRequest, NextResponse } from "next/server";
import { getServerStripe, STRIPE_PRICE_IDS } from "@/lib/stripe";
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
  if (requestBody?.userId && typeof requestBody.userId === "string") {
    userId = requestBody.userId;
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
    // Parse request body once
    const requestBody = await request.json();
    const {
      plan,
      successUrl,
      cancelUrl,
      countryCode,
      email: providedEmail,
    } = requestBody;

    console.log("📧 Email extraction - Request body:", {
      providedEmail,
      plan,
      countryCode,
    });

    // Validate plan
    if (!plan || !STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS]) {
      return NextResponse.json(
        { error: "Invalid plan specified" },
        { status: 400 }
      );
    }

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

    // Get the correct price ID based on location
    const priceType = countryCode === "SO" ? "SOMALIA" : "INTERNATIONAL";
    const priceId =
      STRIPE_PRICE_IDS[plan as keyof typeof STRIPE_PRICE_IDS][priceType];

    console.log(`💰 Price configuration:`, {
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
    const session = await stripeInstance.checkout.sessions.create({
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
        userId: userId || "unknown",
        countryCode,
        userEmail: finalEmail,
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_email: finalEmail,
    });

    console.log(`✅ Checkout session created successfully:`, {
      sessionId: session.id,
      customerEmail: finalEmail,
      userId: userId || "unknown",
    });

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
