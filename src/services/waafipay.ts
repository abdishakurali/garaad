import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Types
export interface WaafiPayConfig {
  merchantUid: string;
  apiUserId: string;
  apiKey: string;
  isTestMode: boolean;
}

export interface PayerInfo {
  accountNo: string;
}

export interface TransactionInfo {
  referenceId: string;
  invoiceId: string;
  amount: string;
  currency: string;
  description: string;
}

interface ServiceParams {
  merchantUid: string;
  apiUserId: string;
  apiKey: string;
  paymentMethod: string;
  payerInfo?: PayerInfo;
  transactionInfo?: TransactionInfo;
  transactionId?: string;
  referenceId?: string;
  description?: string;
}

export interface WaafiPayRequest {
  schemaVersion: string;
  requestId: string;
  timestamp: string;
  channelName: string;
  serviceName: string;
  serviceParams: ServiceParams;
}

export interface WaafiPayResponse {
  schemaVersion: string;
  timestamp: string;
  responseId: string;
  responseCode: string;
  errorCode: string;
  responseMsg: string;
  params: {
    accountNo?: string;
    accountType?: string;
    state?: string;
    merchantCharges?: string;
    referenceId?: string;
    transactionId?: string;
    issuerTransactionId?: string;
    txAmount?: string;
    description?: string;
  };
}

class WaafiPayService {
  private config: WaafiPayConfig;
  private baseUrl: string;

  constructor(config: WaafiPayConfig) {
    this.config = config;
    this.baseUrl = config.isTestMode
      ? "http://sandbox.waafipay.net/asm"
      : "https://api.waafipay.com/asm";
  }

  private getTimestamp(): string {
    return new Date().toISOString().replace("T", " ").slice(0, 23);
  }

  private createRequest(
    serviceName: string,
    serviceParams: Omit<ServiceParams, "merchantUid" | "apiUserId" | "apiKey">
  ): WaafiPayRequest {
    return {
      schemaVersion: "1.0",
      requestId: uuidv4(),
      timestamp: this.getTimestamp(),
      channelName: "WEB",
      serviceName,
      serviceParams: {
        merchantUid: this.config.merchantUid,
        apiUserId: this.config.apiUserId,
        apiKey: this.config.apiKey,
        ...serviceParams,
      },
    };
  }

  async purchase(params: {
    accountNo: string;
    amount: number;
    description: string;
    invoiceId: string;
  }): Promise<WaafiPayResponse> {
    const request = this.createRequest("API_PURCHASE", {
      paymentMethod: "MWALLET_ACCOUNT",
      payerInfo: {
        accountNo: params.accountNo,
      },
      transactionInfo: {
        referenceId: uuidv4(),
        invoiceId: params.invoiceId,
        amount: params.amount.toString(),
        currency: "USD",
        description: params.description,
      },
    });

    try {
      const response = await axios.post<WaafiPayResponse>(
        this.baseUrl,
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.responseMsg || "Payment processing failed"
        );
      }
      throw error;
    }
  }

  async cancelPurchase(params: {
    transactionId: string;
    referenceId: string;
    description?: string;
  }): Promise<WaafiPayResponse> {
    const request = this.createRequest("API_CANCELPURCHASE", {
      paymentMethod: "MWALLET_ACCOUNT",
      transactionId: params.transactionId,
      referenceId: params.referenceId,
      description: params.description || "Cancelled",
    });

    try {
      const response = await axios.post<WaafiPayResponse>(
        this.baseUrl,
        request
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.responseMsg || "Payment cancellation failed"
        );
      }
      throw error;
    }
  }
}

// Create and export a singleton instance
export const waafipayService = new WaafiPayService({
  merchantUid: process.env.WAAFI_MERCHANT_UID || "",
  apiUserId: process.env.WAAFI_API_USER_ID || "",
  apiKey: process.env.WAAFI_API_KEY || "",
  isTestMode: process.env.WAAFI_TEST_MODE === "true",
});
