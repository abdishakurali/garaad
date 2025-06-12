import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    // Try both prefixed and non-prefixed environment variables
    const apiKey =
      process.env.WAAFIPAY_API_KEY || process.env.NEXT_PUBLIC_WAAFIPAY_API_KEY;
    const storeId =
      process.env.WAAFIPAY_STORE_ID ||
      process.env.NEXT_PUBLIC_WAAFIPAY_STORE_ID;
    const merchantUid =
      process.env.WAAFIPAY_MERCHANT_UID ||
      process.env.NEXT_PUBLIC_WAAFIPAY_MERCHANT_UID;

    // Force production environment when in production
    const environment =
      process.env.NODE_ENV === "production"
        ? "production"
        : process.env.WAAFIPAY_ENVIRONMENT ||
          process.env.NEXT_PUBLIC_WAAFIPAY_ENVIRONMENT ||
          "sandbox";

    // Detailed environment variable logging
    console.log("=== Environment Variables Debug ===");
    console.log("WAAFIPAY_API_KEY:", apiKey ? "Set" : "Missing");
    console.log("WAAFIPAY_STORE_ID:", storeId ? "Set" : "Missing");
    console.log("WAAFIPAY_MERCHANT_UID:", merchantUid ? "Set" : "Missing");
    console.log("WAAFIPAY_ENVIRONMENT:", environment);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("=== Request Headers ===");
    console.log(
      "Authorization:",
      request.headers.get("authorization") ? "Present" : "Missing"
    );
    console.log("Content-Type:", request.headers.get("content-type"));
    console.log("================================");

    if (!apiKey || !storeId || !merchantUid) {
      console.error("Missing WaafiPay configuration:", {
        apiKey: !!apiKey,
        storeId: !!storeId,
        merchantUid: !!merchantUid,
        environment: environment,
      });
      return NextResponse.json(
        {
          error: "Payment service configuration error",
          details: "Please check server environment variables",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { accountNumber, amount, description, referenceId } = body;

    // Log request body
    console.log("=== Request Body ===");
    console.log("Account Number:", accountNumber);
    console.log("Amount:", amount);
    console.log("Description:", description);
    console.log("Reference ID:", referenceId);
    console.log("================================");

    // Validate request body
    if (!accountNumber || !amount || !description || !referenceId) {
      return NextResponse.json(
        { error: "Missing required payment information" },
        { status: 400 }
      );
    }

    const baseURL =
      environment === "production"
        ? "https://api.waafipay.net/api/v1"
        : "https://sandbox.waafipay.net/api/v1";

    console.log("Making payment request to:", baseURL);

    // Log the final request payload
    const requestPayload = {
      apiKey,
      storeId: Number(storeId),
      merchantUid,
      accountNumber,
      amount,
      description,
      referenceId,
      paymentMethod: "WALLET",
      sdkVersion: "0.0.2",
    };
    console.log("=== WaafiPay Request Payload ===");
    console.log(JSON.stringify(requestPayload, null, 2));
    console.log("================================");

    // Add additional headers for WaafiPay
    const response = await axios.post(`${baseURL}/payment`, requestPayload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
    });

    // Log the response
    console.log("=== WaafiPay Response ===");
    console.log(JSON.stringify(response.data, null, 2));
    console.log("================================");

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Payment processing error:", error);

    if (axios.isAxiosError(error) && error.response) {
      console.error("=== Error Response ===");
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
      console.error("================================");

      return NextResponse.json(
        {
          error: error.response.data.responseMsg || "Payment processing error",
        },
        { status: error.response.status }
      );
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
