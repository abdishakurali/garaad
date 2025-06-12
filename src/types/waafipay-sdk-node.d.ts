declare module "waafipay-sdk-node" {
  export interface WaafiPayConfig {
    apiKey: string;
    apiUserId: string;
    merchantKey: string;
    isTestMode: boolean;
  }

  export interface PurchaseParams {
    accountNo: string;
    amount: number;
    currency?: string;
    description: string;
  }

  export interface PaymentResponse {
    schemaVersion: string;
    timestamp: string;
    requestId: string;
    sessionId: string | null;
    responseCode: string;
    errorCode: string;
    responseMsg: string;
    params: {
      issuerApprovalCode: string;
      accountNo: string;
      accountType: string;
      accountholder: string;
      state: string;
      merchantCharges: string;
      customerCharges: string;
      referenceId: string;
      transactionId: string;
      accountExpDate: string;
      issuerTransactionId: string;
      txAmount: string;
    };
  }

  export class WaafiAPI {
    constructor(
      apiKey: string,
      apiUserId: string,
      merchantKey: string,
      isTestMode: boolean
    );

    apiPurchase(params: PurchaseParams): Promise<PaymentResponse>;
    creditAccount(params: {
      accountNo: string;
      accountHolder: string;
      amount: number;
      currency?: string;
      description: string;
      accountType: "CUSTOMER" | "MERCHANT";
    }): Promise<PaymentResponse>;
  }
}
