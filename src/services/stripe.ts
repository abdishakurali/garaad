import { getStripe } from "@/lib/stripe";
import type {
  Stripe,
  StripeCardElement,
  PaymentMethod,
} from "@stripe/stripe-js";
import AuthService from "@/services/auth";

class StripeService {
  private static instance: StripeService;
  private stripe: Stripe | null = null;

  private constructor() {}

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  private async getStripeInstance() {
    if (!this.stripe) {
      this.stripe = await getStripe();
    }
    return this.stripe;
  }

  /** Create checkout with explicit Stripe price ID and mode (subscription or one-time payment). */
  async createCheckoutSessionWithPrice(
    priceId: string,
    mode: "subscription" | "payment",
    orderId?: string,
    billingPlan?: "explorer" | "challenge",
    planType?: "installment" | "full"
  ) {
    try {
      const authService = AuthService.getInstance();
      const token = authService.getToken();
      let currentUser = authService.getCurrentUser();

      if (!token) {
        throw new Error("User not authenticated");
      }

      if (!currentUser?.email && typeof authService.fetchAndUpdateUserData === "function") {
        const refreshed = await authService.fetchAndUpdateUserData(token);
        currentUser = refreshed ?? currentUser;
      }

      const userEmail = currentUser?.email;
      const userId = currentUser?.id;

      if (!userEmail) {
        throw new Error("User email is required for checkout. Please ensure you are logged in with a verified account.");
      }

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priceId: priceId || "",
          mode,
          billingPlan,
          planType,
          email: userEmail,
          userId,
          orderId,
          successUrl: `${window.location.origin}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/subscribe?canceled=true`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await this.getStripeInstance();

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }

  async createCheckoutSession(plan: "monthly", countryCode: string) {
    try {
      const authService = AuthService.getInstance();
      const token = authService.getToken();
      let currentUser = authService.getCurrentUser();

      if (!token) {
        throw new Error("User not authenticated");
      }

      // Ensure we have email (e.g. after refresh, cookie may lack it until we fetch)
      if (!currentUser?.email && typeof authService.fetchAndUpdateUserData === "function") {
        const refreshed = await authService.fetchAndUpdateUserData(token);
        currentUser = refreshed ?? currentUser;
      }

      const userEmail = currentUser?.email;
      const userId = currentUser?.id;

      if (!userEmail) {
        throw new Error("User email is required for checkout. Please ensure you are logged in with a verified account.");
      }

      const requestBody = {
        plan,
        countryCode,
        email: userEmail,
        userId: userId,
        successUrl: `${window.location.origin}/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/subscribe?canceled=true`,
      };

      console.log("📧 StripeService - Request body:", requestBody);

      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      const stripe = await this.getStripeInstance();

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw error;
    }
  }

  async createPaymentMethod(cardElement: StripeCardElement) {
    try {
      const stripe = await this.getStripeInstance();

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentMethod;
    } catch (error) {
      console.error("Error creating payment method:", error);
      throw error;
    }
  }

  async confirmCardPayment(clientSecret: string, paymentMethod: PaymentMethod) {
    try {
      const stripe = await this.getStripeInstance();

      if (!stripe) {
        throw new Error("Stripe failed to load");
      }

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: paymentMethod.id,
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error) {
      console.error("Error confirming card payment:", error);
      throw error;
    }
  }
}

export default StripeService;
