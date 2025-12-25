import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_BASE_URL } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      transactionId,
      referenceId,
      state,
      subscriptionType = "monthly",
    } = body;

    // Validate required fields
    if (!transactionId || !referenceId || !state) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if payment is approved
    if (state !== "APPROVED") {
      return NextResponse.json(
        { error: "Payment not approved" },
        { status: 400 }
      );
    }

    // Get user from cookie
    const cookieStore = await cookies();
    const userStr = cookieStore.get("user")?.value;

    if (!userStr) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    try {
      const user = JSON.parse(userStr);

      // Calculate subscription dates
      const startDate = new Date();
      const endDate = new Date();
      if (subscriptionType === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1);
      } else if (subscriptionType === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }

      // Get access token from cookie
      const accessToken = cookieStore.get("access_token")?.value;
      if (!accessToken) {
        throw new Error("No access token found");
      }

      // Update premium status in the backend
      const updateResponse = await fetch(
        `${API_BASE_URL}/api/auth/update-premium/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            is_premium: true,
            subscription_type: subscriptionType,
            subscription_start_date: startDate.toISOString(),
            subscription_end_date:
              subscriptionType === "lifetime" ? null : endDate.toISOString(),
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update premium status in backend");
      }

      // Update user premium status in cookie
      const updatedUser = {
        ...user,
        is_premium: true,
        premium_since: startDate.toISOString(),
        transaction_id: transactionId,
        subscription_type: subscriptionType,
        subscription_start_date: startDate.toISOString(),
        subscription_end_date:
          subscriptionType === "lifetime" ? null : endDate.toISOString(),
      };

      // Create response with updated user data
      const response = NextResponse.json({
        success: true,
        data: {
          user: updatedUser,
        },
      });

      // Set the updated user cookie
      response.cookies.set("user", JSON.stringify(updatedUser), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      });

      return response;
    } catch (error) {
      console.error("Error updating premium status:", error);
      return NextResponse.json(
        { error: "Failed to update premium status" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment success error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
