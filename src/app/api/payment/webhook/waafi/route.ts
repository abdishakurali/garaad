import { NextRequest, NextResponse } from "next/server";
import { WaafiWebhookData } from "@/types/order";
import { API_BASE_URL } from "@/lib/constants";

const API_URL = API_BASE_URL;

// Helper function to validate webhook signature (if needed)
function validateWebhookSignature(payload: string, signature: string): boolean {
  // TODO: Implement actual signature validation if required by Waafi
  // For now, we'll just log the webhook data
  console.log("Webhook signature:", signature);
  return true;
}

// Helper function to extract user info from reference ID
function extractUserInfoFromReference(referenceId: string): {
  userId?: string;
  orderNumber?: string;
} {
  try {
    // Expected format: GRD-YYYYMMDDHHMMSS-USERID or similar
    const parts = referenceId.split("-");
    if (parts.length >= 3) {
      return {
        orderNumber: referenceId,
        userId: parts[parts.length - 1],
      };
    }
    return { orderNumber: referenceId };
  } catch (error) {
    console.error("Error extracting user info from reference:", error);
    return { orderNumber: referenceId };
  }
}

// Helper function to determine subscription type from amount
function getSubscriptionTypeFromAmount(amount: number): string {
  // Common subscription amounts (approximate)
  if (amount >= 299) return "lifetime";
  if (amount >= 99) return "yearly";
  if (amount >= 9) return "monthly";
  return "monthly"; // default
}

// POST /api/payment/webhook/waafi/ - Waafi webhook endpoint
export async function POST(request: NextRequest) {
  try {
    // Get the webhook signature if present
    const signature = request.headers.get("x-waafi-signature");

    // Parse the webhook data
    const body = await request.text();
    const webhookData: WaafiWebhookData = JSON.parse(body);

    // Log webhook data for debugging
    console.log("Waafi webhook received:", {
      customerNumber: webhookData.customerNumber,
      customerName: webhookData.customerName,
      transferId: webhookData.transferInfo.transferId,
      amount: webhookData.transferInfo.amount,
      status: webhookData.transferInfo.transferStatus,
      referenceId: webhookData.transferInfo.referenceId,
      timestamp: new Date().toISOString(),
    });

    // Validate webhook signature if needed
    if (signature && !validateWebhookSignature(body, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Extract transfer information
    const { transferInfo } = webhookData;
    const isSuccessful = transferInfo.transferStatus === "3"; // 3 = completed
    const isFailed = ["4", "5"].includes(transferInfo.transferStatus); // 4/5 = failed

    // Extract user info from reference ID
    const { userId, orderNumber } = extractUserInfoFromReference(
      transferInfo.referenceId
    );

    // Prepare webhook data for backend
    const webhookPayload = {
      webhook_type: "waafi",
      webhook_data: webhookData,
      customer_number: webhookData.customerNumber,
      customer_name: webhookData.customerName,
      transaction_id: transferInfo.transferId,
      transaction_code: transferInfo.transferCode,
      amount: parseFloat(transferInfo.amount),
      currency: transferInfo.currencyCode === "840" ? "USD" : "SOS",
      currency_symbol: transferInfo.currencySymbol,
      status: isSuccessful ? "completed" : isFailed ? "failed" : "pending",
      reference_id: transferInfo.referenceId,
      order_number: orderNumber,
      user_id: userId,
      description: transferInfo.description,
      transaction_date: transferInfo.transactionDate,
      processing_charges: parseFloat(transferInfo.charges || "0"),

      // Additional order information
      subscription_type: getSubscriptionTypeFromAmount(
        parseFloat(transferInfo.amount)
      ),
      payment_method: "waafi",

      // Metadata
      metadata: {
        webhook_received_at: new Date().toISOString(),
        transfer_info: transferInfo,
        merchant_uid: webhookData.partnerUID,
        original_webhook: webhookData,
      },
    };

    // Forward to backend for processing
    const response = await fetch(`${API_URL}/api/payment/webhook/waafi/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any required authentication headers for internal API calls
        "X-Internal-API": "true",
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Backend webhook processing failed:", errorData);

      // Still return success to Waafi to prevent retries
      return NextResponse.json(
        {
          success: true,
          message: "Webhook received but processing failed",
          details: errorData,
        },
        { status: 200 }
      );
    }

    const responseData = await response.json();

    // Log successful processing
    console.log("Webhook processed successfully:", {
      orderId: responseData.order_id,
      userId: responseData.user_id,
      status: responseData.status,
      premium_updated: responseData.premium_updated,
    });

    // Return success response to Waafi
    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      data: {
        transaction_id: transferInfo.transferId,
        reference_id: transferInfo.referenceId,
        status: responseData.status,
        order_id: responseData.order_id,
        premium_updated: responseData.premium_updated,
      },
    });
  } catch (error) {
    console.error("Waafi webhook error:", error);

    // Log the error but still return success to prevent Waafi retries
    // In production, you might want to have a separate error handling system
    return NextResponse.json(
      {
        success: true,
        message: "Webhook received",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 }
    );
  }
}

// GET /api/payment/webhook/waafi/ - Webhook verification endpoint
export async function GET(request: NextRequest) {
  // This endpoint can be used for webhook verification if needed
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get("challenge");

  if (challenge) {
    // Return the challenge for webhook verification
    return NextResponse.json({ challenge });
  }

  return NextResponse.json({
    message: "Waafi webhook endpoint is active",
    timestamp: new Date().toISOString(),
    supported_methods: ["POST"],
  });
}
