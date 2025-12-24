import { NextResponse } from "next/server";
import { waafipayService } from "@/services/waafipay";

interface WaafiPayError extends Error {
  code?: string;
}

interface PaymentRequest {
  accountNo?: string;
  amount: number;
  description: string;
  cardInfo?: {
    cardNumber: string;
    cardHolderName: string;
    cardExpiryMonth: string;
    cardExpiryYear: string;
    cardCvv: string;
  };
}

export async function POST(request: Request) {
  try {
    const body: PaymentRequest = await request.json();
    const { accountNo, amount, description, cardInfo } = body;

    // Validate required fields
    if (!amount || !description) {
      return NextResponse.json(
        { error: "Missing required fields: amount and description" },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!accountNo && !cardInfo) {
      return NextResponse.json(
        { error: "Either accountNo or cardInfo must be provided" },
        { status: 400 }
      );
    }

    // Validate card information if provided
    if (cardInfo) {
      const {
        cardNumber,
        cardHolderName,
        cardExpiryMonth,
        cardExpiryYear,
        cardCvv,
      } = cardInfo;

      if (
        !cardNumber ||
        !cardHolderName ||
        !cardExpiryMonth ||
        !cardExpiryYear ||
        !cardCvv
      ) {
        return NextResponse.json(
          { error: "Missing required card information" },
          { status: 400 }
        );
      }

      // Validate card number
      if (!waafipayService.validateCardNumber(cardNumber)) {
        return NextResponse.json(
          { error: "Invalid card number" },
          { status: 400 }
        );
      }

      // Validate expiry date
      if (
        !waafipayService.validateCardExpiry(cardExpiryMonth, cardExpiryYear)
      ) {
        return NextResponse.json(
          { error: "Invalid or expired card" },
          { status: 400 }
        );
      }

      // Validate CVV
      const cardType = waafipayService.detectCardType(cardNumber);
      if (!waafipayService.validateCvv(cardCvv, cardType)) {
        return NextResponse.json({ error: "Invalid CVV" }, { status: 400 });
      }
    }

    // Log the request (without sensitive card data)
    console.log("Payment request:", {
      paymentMethod: cardInfo ? "CARD" : "MWALLET",
      amount,
      description,
      timestamp: new Date().toISOString(),
    });

    // Debug: Log WaafiPay configuration (without sensitive data)
    console.log("WaafiPay config check:", {
      merchantUid: process.env.WAAFI_MERCHANT_UID ? "SET" : "NOT SET",
      apiUserId: process.env.WAAFI_API_USER_ID || "1008162",
      apiKey: process.env.WAAFI_API_KEY ? "SET" : "NOT SET",
      isTestMode: process.env.WAAFI_TEST_MODE === "true",
    });

    // If cardInfo is present, use HPP_PURCHASE
    if (cardInfo) {
      const referenceId = `INV-${Date.now()}`;
      const invoiceId = referenceId;
      const amountNum = parseFloat(amount.toString());
      const currency = "USD";
      const descriptionStr = description;
      const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://api.garaad.org"
        }/api/payment/success`;
      const failureUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://api.garaad.org"
        }/api/payment/failure`;
      try {
        const hpp = await waafipayService.hppPurchase({
          amount: amountNum,
          description: descriptionStr,
          invoiceId,
          referenceId,
          currency,
          successUrl,
          failureUrl,
        });
        return NextResponse.json({
          success: true,
          message: "Redirect to hosted payment page",
          hppUrl: hpp.hppUrl,
          directPaymentLink: hpp.directPaymentLink,
        });
      } catch (e: unknown) {
        // Handle authorization error specifically
        const errorMessage = e instanceof Error ? e.message : String(e);
        if (errorMessage.includes("not authorized")) {
          return NextResponse.json(
            {
              success: false,
              message:
                "Card payments are not currently available. Please use mobile wallet payment instead.",
              error: "HPP_NOT_AUTHORIZED",
              suggestion:
                "Contact WaafiPay support to enable card payment processing for your account.",
            },
            { status: 403 }
          );
        }

        return NextResponse.json(
          {
            success: false,
            message: errorMessage || "Failed to get HPP URL",
          },
          { status: 400 }
        );
      }
    }

    // Process payment using WaafiPay
    const response = await waafipayService.purchase({
      accountNo,
      amount: parseFloat(amount.toString()),
      description,
      invoiceId: `INV-${Date.now()}`, // Generate a unique invoice ID
      cardInfo,
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
