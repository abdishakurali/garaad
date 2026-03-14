import { NextResponse } from "next/server";
import { waafipayService } from "@/services/waafipay";

export async function GET() {
  try {
    // Test the configuration without making an actual payment
    const config = {
      merchantUid: process.env.WAAFI_MERCHANT_UID,
      apiUserId: process.env.WAAFI_API_USER_ID,
      apiKey: process.env.WAAFI_API_KEY,
      isTestMode: process.env.WAAFI_TEST_MODE === "true",
    };

    // Test card detection
    const testCardNumber = "4111111111111111";
    const cardType = waafipayService.detectCardType(testCardNumber);
    const isValidCard = waafipayService.validateCardNumber(testCardNumber);

    return NextResponse.json({
      success: true,
      message: "WaafiPay configuration test",
      config: {
        merchantUid: config.merchantUid,
        apiUserId: config.apiUserId,
        apiKey: config.apiKey ? "SET" : "NOT_SET",
        isTestMode: config.isTestMode,
      },
      cardTest: {
        cardNumber: testCardNumber,
        detectedType: cardType,
        isValid: isValidCard,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("WaafiPay configuration test error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Configuration test failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
