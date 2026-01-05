export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  total_amount: string;
  currency: "USD" | "EUR" | "SOS";
  currency_display: string;
  payment_method: "waafi" | "zaad" | "evcplus" | "sahal" | "stripe" | "admin";
  payment_method_display: string;
  payment_method_somali: string;
  status: "pending" | "completed" | "failed" | "cancelled" | "refunded";
  status_display: string;
  status_somali: string;
  created_at: string;
  paid_at: string | null;
  description: string;
  items_count: number;

  // Waafi-specific fields
  waafi_transaction_id?: string;
  waafi_reference_id?: string;

  // Customer information
  customer_name?: string;
  customer_email?: string;

  // Subscription information
  subscription_info?: {
    type: "monthly" | "yearly" | "lifetime";
    start_date: string;
    end_date: string;
    name: string;
  };

  // Order items
  items?: OrderItem[];

  // Metadata
  metadata?: Record<string, any>;
}

export interface OrderItem {
  id: number;
  order_id: string;
  item_type: "subscription" | "feature" | "course";
  name: string;
  name_somali?: string;
  description: string;
  description_somali?: string;
  unit_price: string;
  quantity: number;
  total_price: string;

  // Subscription-specific fields
  subscription_type?: "monthly" | "yearly" | "lifetime";
  subscription_start_date?: string;
  subscription_end_date?: string;

  // Course-specific fields
  course_id?: string;
  course_slug?: string;

  // Feature-specific fields
  feature_code?: string;
  feature_duration?: number; // in days
}

export interface OrderListResponse {
  success: boolean;
  data: {
    orders: Order[];
    pagination: {
      total_count: number;
      page: number;
      page_size: number;
      total_pages: number;
    };
  };
}

export interface OrderDetailResponse {
  success: boolean;
  data: Order;
}

export interface OrderStatsResponse {
  success: boolean;
  data: {
    total_orders: number;
    total_amount: string;
    completed_orders: number;
    pending_orders: number;
    failed_orders: number;
    monthly_stats: {
      month: string;
      orders: number;
      amount: number;
    }[];
    payment_method_stats: Record<string, number>;
    currency_stats: Record<
      string,
      {
        count: number;
        total: number;
      }
    >;
    recent_orders: Order[];
  };
}

export interface CreateOrderRequest {
  subscription_type: "monthly" | "yearly" | "lifetime";
  payment_method: "waafi" | "zaad" | "evcplus" | "sahal" | "stripe";
  currency: "USD" | "EUR" | "SOS";
  customer_name?: string;
  customer_email?: string;
  metadata?: Record<string, any>;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface ReceiptData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: string;
  currency: string;
  currency_display: string;
  payment_method: string;
  payment_method_display: string;
  paid_at: string;
  description: string;
  items: OrderItem[];

  // Company information
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone?: string;
  company_website?: string;

  // Receipt metadata
  receipt_date: string;
  receipt_number: string;

  // Localized labels
  receipt_title: string;
  order_label: string;
  customer_label: string;
  amount_label: string;
  method_label: string;
  date_label: string;
  items_label: string;
  description_label: string;
  quantity_label: string;
  price_label: string;
  total_label: string;
  thank_you_message: string;

  // Additional receipt info
  notes?: string;
  terms?: string;
  footer_text?: string;
}

export interface ReceiptResponse {
  success: boolean;
  data: ReceiptData;
}

export interface OrderFilters {
  status?: string;
  payment_method?: string;
  start_date?: string;
  end_date?: string;
  search?: string;
  page?: number;
  page_size?: number;
}

export interface WaafiWebhookData {
  customerNumber: string;
  customerName: string;
  partnerUID: string;
  transferInfo: {
    amount: string;
    charges: string;
    transferId: string;
    transferCode: string;
    transactionDate: string;
    transferStatus: string; // "3" = completed, "4"/"5" = failed
    currencySymbol: string;
    referenceId: string;
    currencyCode: string;
    description: string;
  };
}

export interface PaymentMethodInfo {
  key: string;
  label: string;
  label_somali: string;
  icon: string;
  supported_currencies: string[];
  min_amount: number;
  max_amount: number;
  processing_fee: number;
  is_active: boolean;
}

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  name_somali: string;
  exchange_rate: number;
  is_default: boolean;
}

export interface OrderErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: Record<string, any>;
}

// Union type for all possible responses
export type OrderResponse =
  | OrderListResponse
  | OrderDetailResponse
  | OrderStatsResponse
  | CreateOrderResponse
  | ReceiptResponse
  | OrderErrorResponse;

// Utility types for form handling
export interface OrderFormData {
  subscription_type: "monthly" | "yearly" | "lifetime";
  payment_method: string;
  currency: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  description: string;
}

export interface OrderSearchFilters {
  status: string;
  payment_method: string;
  start_date: string;
  end_date: string;
  search: string;
}

// Constants
export const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending", label_somali: "Sugitaan" },
  { value: "completed", label: "Completed", label_somali: "Dhammaystiran" },
  { value: "failed", label: "Failed", label_somali: "Guuldaraystay" },
  { value: "cancelled", label: "Cancelled", label_somali: "La joojiyay" },
  { value: "refunded", label: "Refunded", label_somali: "La celiyay" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: "waafi", label: "Waafi", label_somali: "Waafi" },
  { value: "zaad", label: "ZAAD", label_somali: "ZAAD" },
  { value: "evcplus", label: "EVC Plus", label_somali: "EVC Plus" },
  { value: "sahal", label: "SAHAL", label_somali: "SAHAL" },
  { value: "stripe", label: "Credit Card", label_somali: "Kaarka Deegaanada" },
  { value: "admin", label: "Admin", label_somali: "Maamulaha" },
];

export const CURRENCY_OPTIONS = [
  {
    value: "USD",
    label: "US Dollar",
    label_somali: "Doolarka Maraykanka",
    symbol: "$",
  },
  { value: "EUR", label: "Euro", label_somali: "Yuuroo", symbol: "€" },
  {
    value: "SOS",
    label: "Somali Shilling",
    label_somali: "Shilin Soomaaliyeed",
    symbol: "SOS",
  },
];

export const SUBSCRIPTION_TYPE_OPTIONS = [
  {
    value: "monthly",
    label: "Monthly",
    label_somali: "Bishii",
    price_usd: 49.00,
  },
  {
    value: "yearly",
    label: "Yearly",
    label_somali: "Sanadkii",
    price_usd: 99.99,
  },
  {
    value: "lifetime",
    label: "Lifetime",
    label_somali: "Nolol dhan",
    price_usd: 299.99,
  },
];
