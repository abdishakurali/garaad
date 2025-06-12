import { NextResponse } from "next/server";
import { waafipayService } from "@/services/waafipay";

interface WaafiPayError extends Error {
  code?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { accountNo, amount, description } = body;

    // Validate required fields
    if (!accountNo || !amount || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Log the request
    console.log("Payment request:", {
      accountNo,
      amount,
      description,
      timestamp: new Date().toISOString(),
    });

    // Process payment using WaafiPay
    const response = await waafipayService.purchase({
      accountNo,
      amount: parseFloat(amount),
      description,
      invoiceId: `INV-${Date.now()}`, // Generate a unique invoice ID
    });

    // Log the response
    console.log("Payment response:", {
      responseCode: response.responseCode,
      responseMsg: response.responseMsg,
      transactionId: response.params?.transactionId,
      timestamp: new Date().toISOString(),
    });

    // Check if payment was successful
    if (response.responseCode === "2001") {
      return NextResponse.json({
        success: true,
        message: "Payment processed successfully",
        data: response,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: response.responseMsg || "Payment processing failed",
          error: response.errorCode,
        },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Payment processing error:", error);
    const waafiError = error as WaafiPayError;
    return NextResponse.json(
      {
        success: false,
        message: waafiError.message || "Payment processing failed",
        error: waafiError.code || "UNKNOWN_ERROR",
      },
      { status: 500 }
    );
  }
}
