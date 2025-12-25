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

// GET /api/payment/orders/[id]/ - Get specific order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthToken();
    const user = await getCurrentUser();

    if (!token || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Forward request to backend
    const response = await fetch(`${API_URL}/api/payment/orders/${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: "Order not found",
            message:
              "Dalashadan lama helin ama adigu ma lihid fasax aad u eegto",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to fetch order details",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Order details error:", error);
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

// PUT /api/payment/orders/[id]/ - Update order (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = await getAuthToken();
    const user = await getCurrentUser();

    if (!token || !user) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Order ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Forward request to backend
    const response = await fetch(`${API_URL}/api/payment/orders/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 404) {
        return NextResponse.json(
          {
            success: false,
            error: "Order not found",
            message:
              "Dalashadan lama helin ama adigu ma lihid fasax aad u wax ka baddalo",
          },
          { status: 404 }
        );
      }

      if (response.status === 403) {
        return NextResponse.json(
          {
            success: false,
            error: "Permission denied",
            message: "Ma lihid fasax aad dalashadan wax ka baddalo",
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: errorData.message || "Failed to update order",
          details: errorData,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Order update error:", error);
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
