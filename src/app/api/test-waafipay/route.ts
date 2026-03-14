import { NextResponse } from "next/server";
import { waafipayService } from "@/services/waafipay";

/** Disabled in production to avoid leaking config or test endpoints. */
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  try {
    // Test the configuration without making an actual payment (dev only)
    const config = {
      apiKeySet: !!process.env.WAAFI_API_KEY,
      isTestMode: process.env.WAAFI_TEST_MODE === "true",
    };

    const testCardNumber = "4111111111111111";
    const cardType = waafipayService.detectCardType(testCardNumber);
    const isValidCard = waafipayService.validateCardNumber(testCardNumber);

    return NextResponse.json({
      success: true,
      message: "WaafiPay configuration test (dev only)",
      config: {
        apiKeySet: config.apiKeySet,
        isTestMode: config.isTestMode,
      },
      cardTest: {
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
