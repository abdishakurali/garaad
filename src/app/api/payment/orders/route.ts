import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
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

// GET /api/payment/orders/ - List user's orders
export async function GET(request: NextRequest) {
  try {
    const token = await getAuthToken();
    const user = await getCurrentUser();

    if (!token || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();

    // Forward request to backend
    const response = await fetch(
      `${API_URL}/api/payment/orders/?${queryString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to fetch orders",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Order list error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST /api/payment/orders/ - Create a new order
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
        },
        { status: 400 }
      );
    }

    // Add user information to the request
    const requestData = {
      ...body,
      user_id: user.id,
      customer_name:
        body.customer_name || `${user.first_name} ${user.last_name}`.trim(),
      customer_email: body.customer_email || user.email,
    };

    // Forward request to backend
    const response = await fetch(`${API_URL}/api/payment/orders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to create order",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
