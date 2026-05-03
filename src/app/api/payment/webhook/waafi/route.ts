import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { WaafiWebhookData } from "@/types/order";
import { API_BASE_URL } from "@/lib/constants";

const API_URL = API_BASE_URL;

type NormalizedWaafiTransfer = {
  amount: string;
  charges?: string;
  transferId: string;
  transferCode?: string;
  transactionDate?: string;
  transferStatus: string;
  currencySymbol?: string;
  referenceId: string;
  currencyCode?: string;
  description?: string;
};

function logWebhook(
  level: "info" | "warn" | "error",
  message: string,
  context: Record<string, unknown> = {}
) {
  const payload = {
    provider: "waafi",
    endpoint: "/api/payment/webhook/waafi",
    message,
    timestamp: new Date().toISOString(),
    ...context,
  };
  if (level === "error") console.error(payload);
  else if (level === "warn") console.warn(payload);
  else console.log(payload);
}

function timingSafeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function validateWebhookSignature(payload: string, signature: string | null): boolean {
  const secret = process.env.WAAFI_WEBHOOK_SECRET;
  if (!secret) {
    logWebhook("warn", "WAAFI_WEBHOOK_SECRET not configured; signature verification skipped");
    return true;
  }
  if (!signature) return false;

  const provided = signature.replace(/^sha256=/i, "").trim();
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return timingSafeEqual(provided, expected);
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}

function normalizeWaafiPayload(webhookData: Record<string, any>): {
  customerNumber: string;
  customerName: string;
  partnerUID: string;
  transferInfo: NormalizedWaafiTransfer;
} {
  const transferInfo = webhookData.transferInfo ?? webhookData.transfer_info ?? webhookData.params ?? {};
  const status = pickString(
    transferInfo.transferStatus,
    transferInfo.transfer_status,
    transferInfo.status,
    webhookData.status,
    webhookData.state
  );
  const transferId = pickString(
    transferInfo.transferId,
    transferInfo.transfer_id,
    transferInfo.transactionId,
    transferInfo.transaction_id,
    webhookData.transactionId,
    webhookData.transaction_id
  );
  const referenceId = pickString(
    transferInfo.referenceId,
    transferInfo.reference_id,
    transferInfo.invoiceId,
    transferInfo.invoice_id,
    webhookData.referenceId,
    webhookData.reference_id,
    webhookData.order_number
  );

  return {
    customerNumber: pickString(webhookData.customerNumber, webhookData.customer_number),
    customerName: pickString(webhookData.customerName, webhookData.customer_name),
    partnerUID: pickString(webhookData.partnerUID, webhookData.partner_uid, webhookData.merchantUid),
    transferInfo: {
      amount: pickString(transferInfo.amount, webhookData.amount),
      charges: pickString(transferInfo.charges, webhookData.charges),
      transferId,
      transferCode: pickString(transferInfo.transferCode, transferInfo.transfer_code),
      transactionDate: pickString(transferInfo.transactionDate, transferInfo.transaction_date),
      transferStatus: status,
      currencySymbol: pickString(transferInfo.currencySymbol, transferInfo.currency_symbol),
      referenceId,
      currencyCode: pickString(transferInfo.currencyCode, transferInfo.currency_code, webhookData.currency),
      description: pickString(transferInfo.description, webhookData.description),
    },
  };
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
  let body = "";
  try {
    const signature =
      request.headers.get("x-waafi-signature") ??
      request.headers.get("x-waafipay-signature") ??
      request.headers.get("x-signature");

    body = await request.text();
    const rawWebhookData = JSON.parse(body) as Record<string, any>;
    const webhookData = normalizeWaafiPayload(rawWebhookData) as WaafiWebhookData;

    // Log webhook data for debugging
    logWebhook("info", "webhook received", {
      customerNumber: webhookData.customerNumber,
      customerName: webhookData.customerName,
      transferId: webhookData.transferInfo.transferId,
      amount: webhookData.transferInfo.amount,
      status: webhookData.transferInfo.transferStatus,
      referenceId: webhookData.transferInfo.referenceId,
    });

    if (!validateWebhookSignature(body, signature)) {
      logWebhook("warn", "invalid webhook signature", { hasSignature: Boolean(signature) });
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Extract transfer information
    const { transferInfo } = webhookData;
    if (!transferInfo.transferId || !transferInfo.referenceId || !transferInfo.transferStatus) {
      logWebhook("warn", "missing required webhook fields", {
        transferId: transferInfo.transferId || null,
        referenceId: transferInfo.referenceId || null,
        transferStatus: transferInfo.transferStatus || null,
      });
      return NextResponse.json(
        { success: false, error: "Missing required webhook fields" },
        { status: 400 }
      );
    }

    const normalizedStatus = transferInfo.transferStatus.toUpperCase();
    const isSuccessful = ["3", "2001", "SUCCESS", "SUCCESSFUL", "COMPLETED", "APPROVED"].includes(normalizedStatus);
    const isFailed = ["4", "5", "FAILED", "DECLINED", "CANCELLED", "CANCELED", "ERROR"].includes(normalizedStatus);

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
      const errorText = await response.text().catch(() => "");
      let errorData: unknown = errorText;
      try {
        errorData = errorText ? JSON.parse(errorText) : {};
      } catch {
        /* keep raw text */
      }
      logWebhook(response.status >= 500 ? "error" : "warn", "backend webhook processing failed", {
        status: response.status,
        response: errorData,
        transactionId: transferInfo.transferId,
        referenceId: transferInfo.referenceId,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Webhook received but processing failed",
          details: errorData,
        },
        { status: response.status >= 500 ? 502 : 400 }
      );
    }

    const responseData = await response.json();

    // Log successful processing
    logWebhook("info", "webhook processed successfully", {
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
    logWebhook("error", "webhook handler error", {
      error: error instanceof Error ? error.message : "Unknown error",
      bodyLength: body.length,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Webhook processing failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
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
