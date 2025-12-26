import axios from "axios";
import { v4 as uuidv4 } from "uuid";

// Types
export interface WaafiPayConfig {
  merchantUid: string;
  apiUserId: string;
  apiKey: string;
  isTestMode: boolean;
  storeId: string;
  hppKey: string;
}

export interface PayerInfo {
  accountNo?: string;
  cardNumber?: string;
  cardHolderName?: string;
  cardExpiryMonth?: string;
  cardExpiryYear?: string;
  cardCvv?: string;
}

export interface TransactionInfo {
  referenceId: string;
  invoiceId: string;
  amount: string;
  currency: string;
  description: string;
}

export interface CardPaymentInfo {
  cardNumber: string;
  cardHolderName: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardCvv: string;
}

export type PaymentMethod =
  | "MWALLET_ACCOUNT"
  | "MWALLET_EVC"
  | "MWALLET_ZAAD"
  | "MWALLET_SAHAL"
  | "MWALLET_WAAFI"
  | "MWALLET_BANKACCOUNT"
  | "CARD_VISA"
  | "CARD_MASTERCARD"
  | "CARD_AMEX"
  | "CARD_DISCOVER";

interface ServiceParams {
  merchantUid: string;
  apiUserId: string;
  apiKey: string;
  paymentMethod: PaymentMethod;
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
    cardLastFour?: string;
    cardType?: string;
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

  public detectCardType(cardNumber: string): PaymentMethod {
    const cleanNumber = cardNumber.replace(/\s/g, "");

    if (/^4/.test(cleanNumber)) {
      return "CARD_VISA";
    } else if (/^5[1-5]/.test(cleanNumber)) {
      return "CARD_MASTERCARD";
    } else if (/^3[47]/.test(cleanNumber)) {
      return "CARD_AMEX";
    } else if (/^6(?:011|5)/.test(cleanNumber)) {
      return "CARD_DISCOVER";
    }

    // Default to Visa if we can't determine
    return "CARD_VISA";
  }

  async purchase(params: {
    accountNo?: string;
    amount: number;
    description: string;
    invoiceId: string;
    cardInfo?: CardPaymentInfo;
    walletType?: PaymentMethod;
  }): Promise<WaafiPayResponse> {
    let paymentMethod: PaymentMethod = "MWALLET_ACCOUNT";
    let payerInfo: PayerInfo = {};

    if (params.cardInfo) {
      paymentMethod = this.detectCardType(params.cardInfo.cardNumber);
      payerInfo = {
        cardNumber: params.cardInfo.cardNumber.replace(/\s/g, ""),
        cardHolderName: params.cardInfo.cardHolderName,
        cardExpiryMonth: params.cardInfo.cardExpiryMonth,
        cardExpiryYear: params.cardInfo.cardExpiryYear,
        cardCvv: params.cardInfo.cardCvv,
      };
    } else if (params.accountNo) {
      paymentMethod = params.walletType || "MWALLET_ACCOUNT";
      payerInfo = {
        accountNo: params.accountNo,
      };
    } else {
      throw new Error("Either accountNo or cardInfo must be provided");
    }

    const request = this.createRequest("API_PURCHASE", {
      paymentMethod,
      payerInfo,
      transactionInfo: {
        referenceId: uuidv4(),
        invoiceId: params.invoiceId,
        amount: params.amount.toString(),
        currency: "USD",
        description: params.description,
      },
    });

    try {
      // Debug: Log the request structure (without sensitive data)
      console.log("WaafiPay request structure:", {
        schemaVersion: request.schemaVersion,
        serviceName: request.serviceName,
        channelName: request.channelName,
        serviceParams: {
          merchantUid: request.serviceParams.merchantUid,
          apiUserId: request.serviceParams.apiUserId,
          apiKey: request.serviceParams.apiKey ? "SET" : "NOT SET",
          paymentMethod: request.serviceParams.paymentMethod,
          hasPayerInfo: !!request.serviceParams.payerInfo,
          hasTransactionInfo: !!request.serviceParams.transactionInfo,
        },
      });

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
      paymentMethod: "MWALLET_ACCOUNT", // This will be overridden by the API based on original transaction
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

  // Validate card number using Luhn algorithm
  validateCardNumber(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, "");
    if (!/^\d+$/.test(cleanNumber)) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i));

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  // Accept both 2-digit and 4-digit years for card expiry
  validateCardExpiry(month: string, year: string): boolean {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const expMonth = parseInt(month);
    let expYear = parseInt(year);
    if (year.length === 2) {
      expYear += 2000;
    }

    if (expYear < currentYear) return false;
    if (expYear === currentYear && expMonth < currentMonth) return false;
    if (expMonth < 1 || expMonth > 12) return false;

    return true;
  }

  // Validate CVV
  validateCvv(cvv: string, cardType: PaymentMethod): boolean {
    const cleanCvv = cvv.replace(/\s/g, "");
    if (!/^\d+$/.test(cleanCvv)) return false;

    if (cardType === "CARD_AMEX") {
      return cleanCvv.length === 4;
    } else {
      return cleanCvv.length === 3;
    }
  }

  async hppPurchase(params: {
    amount: number;
    description: string;
    invoiceId: string;
    referenceId: string;
    currency: string;
    successUrl: string;
    failureUrl: string;
  }): Promise<{ hppUrl: string; directPaymentLink: string }> {
    const request = {
      schemaVersion: "1.0",
      requestId: uuidv4(),
      timestamp: this.getTimestamp(),
      channelName: "WEB",
      serviceName: "HPP_PURCHASE",
      serviceParams: {
        merchantUid: this.config.merchantUid,
        storeId: this.config.storeId,
        hppKey: this.config.hppKey,
        paymentMethod: "CREDIT_CARD",
        hppSuccessCallbackUrl: params.successUrl,
        hppFailureCallbackUrl: params.failureUrl,
        hppRespDataFormat: 4,
        transactionInfo: {
          referenceId: params.referenceId,
          invoiceId: params.invoiceId,
          amount: params.amount,
          currency: params.currency,
          description: params.description,
        },
      },
    };

    interface HPPResponse {
      schemaVersion: string;
      timestamp: string;
      responseId: string;
      responseCode: string;
      errorCode: string;
      responseMsg: string;
      params: {
        hppUrl?: string;
        directPaymentLink?: string;
        orderId?: string;
        hppRequestId?: string;
        referenceId?: string;
      };
    }

    const response = await axios.post<HPPResponse>(this.baseUrl, request);
    if (response.data?.params?.hppUrl) {
      return {
        hppUrl: response.data.params.hppUrl,
        directPaymentLink:
          response.data.params.directPaymentLink || response.data.params.hppUrl,
      };
    } else {
      throw new Error(response.data?.responseMsg || "Failed to get HPP URL");
    }
  }
}

// Create and export a singleton instance
export const waafipayService = new WaafiPayService({
  merchantUid: process.env.WAAFI_MERCHANT_UID!,
  apiUserId: process.env.WAAFI_API_USER_ID!,
  apiKey: process.env.WAAFI_API_KEY!,
  isTestMode: process.env.WAAFI_TEST_MODE === "true",
  storeId: process.env.WAAFI_STORE_ID!,
  hppKey: process.env.WAAFI_HPP_KEY!,
});
