import { NextRequest, NextResponse } from "next/server";
import { getServerStripe } from "@/lib/stripe";
import { headers } from "next/headers";
import type { Stripe } from "stripe";
import UserService from "@/services/user";

async function getUserIdFromStripe(customerId: string): Promise<string | null> {
  try {
    const response = await fetch(
      `${process.env.DJANGO_INTERNAL_URL}/api/accounts/find-by-stripe/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": process.env.INTERNAL_API_SECRET!,
        },
        body: JSON.stringify({ stripe_customer_id: customerId }),
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.user_id || null;
  } catch (error) {
    console.error("Error in getUserIdFromStripe:", error);
    return null;
  }
}

export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint is accessible" }, { status: 200 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
    }

    const stripeInstance = getServerStripe();
    const event = stripeInstance.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    const userService = UserService.getInstance();

    switch (event.type) {
      case "customer.subscription.created":
        const subCreated = event.data.object as Stripe.Subscription;
        const userIdCreated = await getUserIdFromStripe(subCreated.customer as string);
        if (userIdCreated) {
          const planType = (subCreated.metadata?.planType as "installment" | "full") || "installment";
          await userService.updatePremiumStatus({
            userId: userIdCreated,
            isPremium: true,
            planType,
          });
          console.log("Subscription created for user:", userIdCreated);
        }
        break;

      case "customer.subscription.updated":
        const subUpdated = event.data.object as Stripe.Subscription;
        const userIdUpdated = await getUserIdFromStripe(subUpdated.customer as string);
        if (userIdUpdated) {
          if (subUpdated.status === "active") {
            const planType = (subUpdated.metadata?.planType as "installment" | "full") || "installment";
            await userService.updatePremiumStatus({
              userId: userIdUpdated,
              isPremium: true,
              planType,
            });
            console.log("Subscription activated for user:", userIdUpdated);
          } else if (["canceled", "unpaid", "past_due"].includes(subUpdated.status)) {
            await userService.updatePremiumStatus({
              userId: userIdUpdated,
              isPremium: false,
              planType: "none" as any,
            });
            console.log("Access revoked for user:", userIdUpdated);
          }
        }
        break;

      case "customer.subscription.deleted":
        const subDeleted = event.data.object as Stripe.Subscription;
        const userIdDeleted = await getUserIdFromStripe(subDeleted.customer as string);
        if (userIdDeleted) {
          await userService.updatePremiumStatus({
            userId: userIdDeleted,
            isPremium: false,
            planType: "none" as any,
          });
          console.log("Access revoked for user:", userIdDeleted);
        }
        break;

      case "invoice.payment_succeeded":
        const invoice = event.data.object as Stripe.Invoice;
        const userIdInv = await getUserIdFromStripe(invoice.customer as string);
        if (userIdInv) {
          const amount = invoice.amount_paid;
          const planType = amount >= 14900 ? "full" : "installment";
          await userService.updatePremiumStatus({
            userId: userIdInv,
            isPremium: true,
            planType,
          });
          console.log("Payment succeeded for user:", userIdInv);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
