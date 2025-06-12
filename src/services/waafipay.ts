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
  async createPayment(params: CreatePaymentParams): Promise<PaymentResponse> {
    try {
      // Get the auth token from localStorage or your auth service
      const token = localStorage.getItem("token");

      const response = await axios.post("/api/payment", params, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data.error || "Payment processing error"
        );
      }
      throw error instanceof Error
        ? error
        : new Error("Unknown error occurred");
    }
  }
}

// Create singleton instance
export const waafipayService = new WaafiPayService();
