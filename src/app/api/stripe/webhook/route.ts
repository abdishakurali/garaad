import { NextRequest, NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type { Stripe } from "stripe";

export async function GET() {
  console.log("🔍 GET request to Stripe webhook endpoint");
  console.log("📅 Timestamp:", new Date().toISOString());
  console.log("🌍 Environment:", process.env.NODE_ENV);

  let stripeConfigured = false;
  try {
    getServerStripe();
    stripeConfigured = true;
  } catch {
    stripeConfigured = false;
  }

  console.log("🔑 Stripe configured:", stripeConfigured);
  console.log(
    "🔐 Webhook secret configured:",
    !!process.env.STRIPE_WEBHOOK_SECRET
  );

  try {
    return NextResponse.json(
      {
        status: "Webhook endpoint is accessible",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        stripe_configured: stripeConfigured,
        webhook_secret_configured: !!process.env.STRIPE_WEBHOOK_SECRET,
        message: "Stripe webhook endpoint is working correctly",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in GET webhook endpoint:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log("🔔 Stripe webhook received");

  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    console.log("📝 Webhook body length:", body.length);
    console.log("🔐 Signature present:", !!signature);

    if (!signature) {
      console.error("❌ No Stripe signature found");
      return NextResponse.json(
        { error: "No signature found" },
        { status: 400 }
      );
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error("❌ STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    let stripeInstance;
    try {
      stripeInstance = getServerStripe();
    } catch (error) {
      console.error("❌ Stripe not configured:", error);
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripeInstance.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log("✅ Webhook signature verified");
      console.log("📦 Event type:", event.type);
      console.log("🆔 Event ID:", event.id);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
      switch (event.type) {
        case "customer.subscription.created":
          console.log("🆕 Processing subscription.created");
          await handleSubscriptionCreated(
            event.data.object as Stripe.Subscription
          );
          break;
        case "customer.subscription.updated":
          console.log("🔄 Processing subscription.updated");
          await handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription
          );
          break;
        case "customer.subscription.deleted":
          console.log("🗑️ Processing subscription.deleted");
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
          break;
        case "invoice.payment_succeeded":
          console.log("✅ Processing payment.succeeded");
          await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;
        case "invoice.payment_failed":
          console.log("❌ Processing payment.failed");
          await handlePaymentFailed(event.data.object as Stripe.Invoice);
          break;
        case "checkout.session.completed":
          console.log("🛒 Processing checkout.session.completed");
          await handleCheckoutCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;
        default:
          console.log(`⚠️ Unhandled event type: ${event.type}`);
      }

      console.log("✅ Webhook processed successfully");
      return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
      console.error("❌ Error processing webhook:", error);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("❌ Unexpected error in webhook handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log("🆕 Subscription created:", subscription.id);
  console.log("👤 Customer ID:", subscription.customer);
  console.log("💰 Amount:", subscription.items.data[0]?.price?.unit_amount);

  // NOTE: Implement database update logic here
  // const userId = subscription.metadata.userId;
  // await updateUserPremiumStatus(userId, true, subscription.id);

  console.log("✅ User premium status should be updated to true");
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log("🔄 Subscription updated:", subscription.id);
  console.log("📊 Status:", subscription.status);
  console.log("👤 Customer ID:", subscription.customer);

  // NOTE: Implement subscription status update logic here
  // const userId = subscription.metadata.userId;
  // await updateUserSubscriptionStatus(userId, subscription.status, subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log("🗑️ Subscription deleted:", subscription.id);
  console.log("👤 Customer ID:", subscription.customer);

  // NOTE: Implement premium status revocation logic here
  // const userId = subscription.metadata.userId;
  // await updateUserPremiumStatus(userId, false, null);

  console.log("✅ User premium status should be updated to false");
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log("✅ Payment succeeded:", invoice.id);
  console.log("💰 Amount paid:", invoice.amount_paid);
  console.log("👤 Customer ID:", invoice.customer);
  console.log("📅 Period start:", new Date(invoice.period_start * 1000));
  console.log("📅 Period end:", new Date(invoice.period_end * 1000));

  // NOTE: Handle successful payment logic (email, metrics, etc.)
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log("❌ Payment failed:", invoice.id);
  console.log("💰 Amount due:", invoice.amount_due);
  console.log("👤 Customer ID:", invoice.customer);

  // NOTE: Handle failed payment logic (dunning emails, etc.)
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log("🛒 Checkout completed:", session.id);
  console.log("👤 Customer ID:", session.customer);
  console.log("💰 Amount total:", session.amount_total);
  console.log("📦 Mode:", session.mode);

  // NOTE: Handle completed checkout logic

}
