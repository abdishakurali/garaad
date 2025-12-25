import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SUBSCRIPTION_TYPE_OPTIONS } from "@/types/order";
import { API_BASE_URL } from "@/lib/constants";

const API_URL = API_BASE_URL;

// Helper function to get auth token
async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("accessToken")?.value || null;
}

// Helper function to get user from cookies
async function getCurrentUser() {
  const cookieStore = await cookies();
  const userStr = cookieStore.get("user")?.value;
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Failed to parse user from cookies:", error);
    return null;
  }
}

// Helper function to get subscription price
function getSubscriptionPrice(type: string, currency: string = "USD"): number {
  const subscription = SUBSCRIPTION_TYPE_OPTIONS.find(
    (sub) => sub.value === type
  );
  if (!subscription) return 0;

  // For now, we only have USD pricing
  // In the future, this could be expanded to handle other currencies
  switch (currency) {
    case "USD":
      return subscription.price_usd;
    case "EUR":
      return subscription.price_usd * 0.85; // Rough conversion
    case "SOS":
      return subscription.price_usd * 570; // Rough conversion
    default:
      return subscription.price_usd;
  }
}

// POST /api/payment/subscription/create/ - Create subscription order
export async function POST(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const user = await getCurrentUser();

    if (!token || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { subscription_type, payment_method, currency } = body;

    if (!subscription_type || !payment_method || !currency) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: subscription_type, payment_method, currency",
          message:
            "Qolkaaga lama buuxin si sax ah. Fadlan buuxi dhammaan xogaaga.",
        },
        { status: 400 }
      );
    }

    // Validate subscription type
    const validSubscriptionTypes = SUBSCRIPTION_TYPE_OPTIONS.map(
      (sub) => sub.value
    );
    if (!validSubscriptionTypes.includes(subscription_type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid subscription type",
          message: "Nooca ishtiraakaa waa khaldan. Fadlan dooro mid sax ah.",
        },
        { status: 400 }
      );
    }

    // Check if user is already premium
    if (user.is_premium) {
      return NextResponse.json(
        {
          success: false,
          error: "User is already premium",
          message: "Horay baad u haysta ishtiraak premium ah.",
        },
        { status: 400 }
      );
    }

    // Calculate price
    const amount = getSubscriptionPrice(subscription_type, currency);

    // Get subscription details
    const subscriptionDetails = SUBSCRIPTION_TYPE_OPTIONS.find(
      (sub) => sub.value === subscription_type
    );
    const subscriptionName =
      subscriptionDetails?.label_somali ||
      subscriptionDetails?.label ||
      "Premium Subscription";

    // Prepare order data
    const orderData = {
      subscription_type,
      payment_method,
      currency,
      amount,
      description: `Garaad ${subscriptionName}`,
      customer_name:
        body.customer_name || `${user.first_name} ${user.last_name}`.trim(),
      customer_email: body.customer_email || user.email,
      user_id: user.id,
      item_type: "subscription",
      metadata: {
        subscription_type,
        user_id: user.id,
        original_request: body,
      },
    };

    // Forward request to backend
    const response = await fetch(
      `${API_URL}/api/payment/subscription/create/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle specific error cases
      if (response.status === 400) {
        return NextResponse.json(
          {
            success: false,
            error: errorData.message || "Invalid request data",
            message:
              errorData.message_somali ||
              "Xogaaga waa khaldan. Fadlan dib u eeg.",
          },
          { status: 400 }
        );
      }

      if (response.status === 409) {
        return NextResponse.json(
          {
            success: false,
            error: "Subscription already exists",
            message: "Horay baad u haysta ishtiraak.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to create subscription order",
          message:
            errorData.message_somali ||
            "Dalashada ishtiraakaa waa guuldaraystay. Fadlan mar kale isku day.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Add success message in Somali
    const responseData = {
      ...data,
      message: data.message || "Dalbashada waa la sameeyay si guul leh",
      message_somali:
        "Dalashada ishtiraakaa waa guulaystay. Fadlan dhammaystir bixinta.",
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Subscription creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Qalad ayaa ka dhacay server-ka. Fadlan mar kale isku day.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
