import { NextRequest, NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";
import UserService from "@/services/user";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(
      new URL("/subscribe?error=no_session", request.url),
    );
  }

  try {
    // Get Stripe instance
    const stripeInstance = getServerStripe();

    // Retrieve the checkout session from Stripe
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.redirect(
        new URL("/subscribe?error=invalid_session", request.url),
      );
    }

    if (session.payment_status === "paid") {
      // Payment was successful
      console.log("Payment successful for session:", sessionId);

      const apiBase = (
        process.env.NEXT_PUBLIC_API_URL || "https://api.garaad.org"
      ).replace(/\/$/, "");
      try {
        const syncRes = await fetch(
          `${apiBase}/api/payment/stripe/complete-checkout/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ session_id: sessionId }),
          },
        );
        if (!syncRes.ok) {
          const body = await syncRes.text();
          console.error(
            "stripe complete-checkout failed",
            syncRes.status,
            body,
          );
        }
      } catch (e) {
        console.error("stripe complete-checkout error", e);
      }

      // Send user directly into the course — no intermediate success page
      const successPath = `/courses/freelancing?payment=done`;

      // Best-effort: update premium status if userId is in metadata.
      // The webhook handler is the reliable path and will grant premium via customer lookup.
      const userId = session.metadata?.userId;
      if (userId) {
        const userService = UserService.getInstance();
        const updateSuccess = await userService.updatePremiumStatus({
          userId,
          isPremium: true,
          subscriptionId: session.subscription as string,
        });
        if (updateSuccess) {
          console.log("stripe/success: premium granted via metadata userId", userId);
        } else {
          console.warn("stripe/success: updatePremiumStatus returned false for userId", userId, "— webhook will retry");
        }
      } else {
        console.warn("stripe/success: no userId in session metadata for", sessionId, "— relying on webhook for premium grant");
      }

      return NextResponse.redirect(new URL(successPath, request.url));
    } else {
      // Payment was not successful
      return NextResponse.redirect(
        new URL("/subscribe?error=payment_failed", request.url),
      );
    }
  } catch (error) {
    console.error("Error processing success:", error);
    return NextResponse.redirect(
      new URL("/subscribe?error=processing_error", request.url),
    );
  }
}
