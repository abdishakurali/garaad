import axios from "axios";

// Types
export interface WaafiPayConfig {
  apiKey: string;
  storeId: number;
  merchantUID: string;
  environment: "sandbox" | "production";
}

export interface CreatePaymentParams {
  accountNumber: string;
  amount: number;
  description: string;
  referenceId: string;
}

export interface PaymentResponse {
  schemaVersion: string;
  timestamp: string;
  responseId: string;
  responseCode: string;
  errorCode: string;
  responseMsg: string;
  params: {
    accountNo: string;
    accountType: string;
    state: string;
    merchantCharges: string;
    referenceId: string;
    transactionId: string;
    issuerTransactionId: string;
    txAmount: string;
  };
}

class WaafiPayService {
  private apiKey: string;
  private storeId: number;
  private merchantUID: string;
  private baseURL: string;
  private sdkVersion = "0.0.2"; // Hardcoded version

  constructor(config: WaafiPayConfig) {
    this.apiKey = config.apiKey;
    this.storeId = config.storeId;
    this.merchantUID = config.merchantUID;
    this.baseURL =
      config.environment === "production"
        ? "https://api.waafipay.net/api/v1"
        : "https://sandbox.waafipay.net/api/v1";
  }

  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${this.baseURL}/payment`, {
        apiKey: this.apiKey,
        storeId: this.storeId,
        merchantUid: this.merchantUID,
        accountNumber: params.accountNumber,
        amount: params.amount,
        description: params.description,
        referenceId: params.referenceId,
        paymentMethod: "WALLET",
        sdkVersion: this.sdkVersion,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.responseMsg || "Payment processing error"
        );
      }
      throw error;
    }
  }

  private handleError(error: unknown): Error {
    if (axios.isAxiosError(error) && error.response?.data) {
      const responseCode = error.response.data.responseCode;
      switch (responseCode) {
        case "2001":
          return new Error("Payment successful");
        case "2002":
          return new Error("Payment pending");
        case "2003":
          return new Error("Payment failed");
        default:
          return new Error(
            error.response.data.responseMsg || "Payment processing error"
          );
      }
    }
    return error instanceof Error ? error : new Error("Unknown error occurred");
  }
}

// Create singleton instance
export const waafipayService = new WaafiPayService({
  apiKey: process.env.NEXT_PUBLIC_WAAFIPAY_API_KEY || "",
  storeId: Number(process.env.NEXT_PUBLIC_WAAFIPAY_STORE_ID) || 0,
  merchantUID: process.env.NEXT_PUBLIC_WAAFIPAY_MERCHANT_UID || "",
  environment:
    (process.env.NEXT_PUBLIC_WAAFIPAY_ENVIRONMENT as
      | "sandbox"
      | "production") || "sandbox",
});
