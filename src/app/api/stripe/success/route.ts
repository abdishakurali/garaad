import { NextRequest, NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";
import UserService from "@/services/user";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(
      new URL("/subscribe?error=no_session", request.url)
    );
  }

  try {
    // Get Stripe instance
    const stripeInstance = getServerStripe();

    // Retrieve the checkout session from Stripe
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.redirect(
        new URL("/subscribe?error=invalid_session", request.url)
      );
    }

    if (session.payment_status === "paid") {
      // Payment was successful
      console.log("Payment successful for session:", sessionId);

      // Update user's premium status
      const userService = UserService.getInstance();

      // For now, we'll use a placeholder user ID
      // NOTE: Using userId from session metadata. Ensure this is populated during checkout creation.
      const userId = session.metadata?.userId || "temp_user_id";

      const updateSuccess = await userService.updatePremiumStatus({
        userId,
        isPremium: true,
        subscriptionId: session.subscription as string,
      });

      if (updateSuccess) {
        console.log("User premium status updated successfully");
        // Redirect to courses page with success message
        return NextResponse.redirect(
          new URL("/courses?success=payment_completed", request.url)
        );
      } else {
        console.error("Failed to update user premium status");
        return NextResponse.redirect(
          new URL("/subscribe?error=update_failed", request.url)
        );
      }
    } else {
      // Payment was not successful
      return NextResponse.redirect(
        new URL("/subscribe?error=payment_failed", request.url)
      );
    }
  } catch (error) {
    console.error("Error processing success:", error);
    return NextResponse.redirect(
      new URL("/subscribe?error=processing_error", request.url)
    );
  }
}
