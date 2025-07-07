import { baseURL } from "@/config";
import AuthService from "@/services/auth";
import {
  Order,
  OrderFilters,
  OrderListResponse,
  OrderDetailResponse,
  OrderStatsResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  ReceiptResponse,
  SUBSCRIPTION_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "@/types/order";

interface ApiError extends Error {
  status?: number;
  details?: Record<string, unknown>;
}

class OrderService {
  private static instance: OrderService;
  private authService: AuthService;

  private constructor() {
    this.authService = AuthService.getInstance();
  }

  public static getInstance(): OrderService {
    if (!OrderService.instance) {
      OrderService.instance = new OrderService();
    }
    return OrderService.instance;
  }

  /**
   * Get authentication headers for API requests
   */
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const token = await this.authService.ensureValidToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * Handle API errors and throw appropriate exceptions
   */
  private handleApiError(error: unknown, response?: Response): never {
    console.error("API Error:", error);

    let errorMessage = "An unexpected error occurred";
    let status = 500;

    if (response) {
      status = response.status;
      switch (response.status) {
        case 401:
          errorMessage = "Authentication required. Please log in again.";
          break;
        case 403:
          errorMessage = "Adiga don't have permission to access this resource.";
          break;
        case 404:
          errorMessage = "Resource not found.";
          break;
        case 409:
          errorMessage = "Resource already exists or conflict occurred.";
          break;
        case 422:
          errorMessage = "Invalid data provided.";
          break;
        case 500:
          errorMessage = "Server error. Please try again later.";
          break;
        default:
          errorMessage =
            ((error as Record<string, unknown>)?.message as string) ||
            "Request failed";
      }
    } else if (
      error instanceof TypeError &&
      error.message === "Failed to fetch"
    ) {
      errorMessage =
        "Unable to connect to the server. Please check your internet connection.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    const apiError = new Error(errorMessage) as ApiError;
    apiError.status = status;
    apiError.details = error as Record<string, unknown>;
    throw apiError;
  }

  /**
   * Get list of orders with optional filters
   */
  async getOrders(filters: OrderFilters = {}): Promise<OrderListResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const queryParams = new URLSearchParams();

      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${baseURL}/api/payment/orders/${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleApiError(errorData, response);
      }

      const data = await response.json();
      return data as OrderListResponse;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get order details by ID
   */
  async getOrderById(orderId: string): Promise<OrderDetailResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${baseURL}/api/payment/orders/${orderId}/`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleApiError(errorData, response);
      }

      const data = await response.json();
      return data as OrderDetailResponse;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<OrderStatsResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${baseURL}/api/payment/orders/stats/`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleApiError(errorData, response);
      }

      const data = await response.json();
      return data as OrderStatsResponse;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Create a new subscription order
   */
  async createSubscriptionOrder(
    request: CreateOrderRequest
  ): Promise<CreateOrderResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${baseURL}/api/payment/subscription/create/`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(request),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleApiError(errorData, response);
      }

      const data = await response.json();
      return data as CreateOrderResponse;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get receipt data for an order
   */
  async getReceiptData(orderId: string): Promise<ReceiptResponse> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${baseURL}/api/payment/orders/${orderId}/receipt/`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleApiError(errorData, response);
      }

      const data = await response.json();
      return data as ReceiptResponse;
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Download receipt for an order
   */
  async downloadReceipt(orderId: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(
        `${baseURL}/api/payment/orders/${orderId}/download_receipt/`,
        {
          method: "GET",
          headers,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        this.handleApiError(errorData, response);
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${orderId}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      this.handleApiError(error);
    }
  }

  /**
   * Get subscription price based on type and currency
   */
  getSubscriptionPrice(type: string, currency: string = "USD"): number {
    const subscription = SUBSCRIPTION_TYPE_OPTIONS.find(
      (sub) => sub.value === type
    );
    if (!subscription) return 0;

    switch (currency) {
      case "USD":
        return subscription.price_usd;
      case "EUR":
        return subscription.price_usd * 0.85; // Rough conversion
      case "SOS":
        return subscription.price_usd * 570; // Rough conversion
      default:
        return subscription.price_usd;
    }
  }

  /**
   * Get localized subscription name
   */
  getSubscriptionName(type: string, language: string = "en"): string {
    const subscription = SUBSCRIPTION_TYPE_OPTIONS.find(
      (sub) => sub.value === type
    );
    if (!subscription) return "Premium Subscription";

    return language === "so" ? subscription.label_somali : subscription.label;
  }

  /**
   * Get payment method display name
   */
  getPaymentMethodName(method: string, language: string = "en"): string {
    const paymentMethod = PAYMENT_METHOD_OPTIONS.find(
      (pm) => pm.value === method
    );
    if (!paymentMethod) return method;

    return language === "so" ? paymentMethod.label_somali : paymentMethod.label;
  }

  /**
   * Get currency display name
   */
  getCurrencyName(currency: string, language: string = "en"): string {
    const currencyOption = CURRENCY_OPTIONS.find((c) => c.value === currency);
    if (!currencyOption) return currency;

    return language === "so"
      ? currencyOption.label_somali
      : currencyOption.label;
  }

  /**
   * Format currency amount
   */
  formatCurrency(amount: number | string, currency: string = "USD"): string {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    const currencyOption = CURRENCY_OPTIONS.find((c) => c.value === currency);
    const symbol = currencyOption?.symbol || currency;

    return `${symbol}${numAmount.toFixed(2)}`;
  }

  /**
   * Format order date
   */
  formatOrderDate(dateString: string, language: string = "en"): string {
    const date = new Date(dateString);

    if (language === "so") {
      // Simple Somali date format
      return date.toLocaleDateString("so-SO");
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /**
   * Get order status color for UI
   */
  getOrderStatusColor(status: string): string {
    switch (status) {
      case "completed":
        return "green";
      case "pending":
        return "yellow";
      case "failed":
        return "red";
      case "cancelled":
        return "gray";
      case "refunded":
        return "blue";
      default:
        return "gray";
    }
  }

  /**
   * Check if order allows receipt download
   */
  canDownloadReceipt(order: Order): boolean {
    return order.status === "completed" && order.paid_at !== null;
  }

  /**
   * Get order summary for display
   */
  getOrderSummary(order: Order, language: string = "en"): string {
    const items = order.items_count;
    const itemText =
      language === "so"
        ? items === 1
          ? "shay"
          : "shayaadh"
        : items === 1
        ? "item"
        : "items";

    return `${items} ${itemText} • ${this.formatCurrency(
      order.total_amount,
      order.currency
    )}`;
  }

  /**
   * Validate order data before creation
   */
  validateOrderData(request: CreateOrderRequest): string[] {
    const errors: string[] = [];

    if (!request.subscription_type) {
      errors.push("Subscription type is required");
    } else if (
      !SUBSCRIPTION_TYPE_OPTIONS.find(
        (sub) => sub.value === request.subscription_type
      )
    ) {
      errors.push("Invalid subscription type");
    }

    if (!request.payment_method) {
      errors.push("Payment method is required");
    } else if (
      !PAYMENT_METHOD_OPTIONS.find((pm) => pm.value === request.payment_method)
    ) {
      errors.push("Invalid payment method");
    }

    if (!request.currency) {
      errors.push("Currency is required");
    } else if (!CURRENCY_OPTIONS.find((c) => c.value === request.currency)) {
      errors.push("Invalid currency");
    }

    return errors;
  }
}

export default OrderService;
