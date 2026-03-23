"use client";

import { useState } from "react";
import { pricingTranslations as t } from "@/config/translations/pricing";
import {
  type SubscribePlan,
  isValidSubscribeStripePriceId,
  SUBSCRIBE_STRIPE_PRICE_IDS,
} from "@/config/subscribePlans";
import AuthService from "@/services/auth";
import OrderService from "@/services/orders";
import StripeService from "@/services/stripe";
import { useAuthStore } from "@/store/useAuthStore";
import { EXPLORER_IS_FREE } from "@/config/featureFlags";

interface Props {
  plan: SubscribePlan;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ plan, onClose, onSuccess }: Props) {
  const [method, setMethod] = useState<"waafi" | "stripe">("waafi");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    const auth = AuthService.getInstance();
    const token = await auth.ensureValidToken();
    if (!token) {
      setError(t.error_login_required);
      return;
    }

    const sessionUser = useAuthStore.getState().user;
    const u = sessionUser || auth.getCurrentUser();
    if (u?.is_email_verified === false) {
      setError(
        "Fadlan xaqiiji email-kaaga ka hor intaadan lacag bixin. Hubi sanduuqaaga emaylka."
      );
      return;
    }

    if (plan.key === "explorer" && EXPLORER_IS_FREE) {
      setError(
        "Bilaash — Weligeed: soo gal akoonkaaga si aad u hesho dhammaan casharrada."
      );
      return;
    }

    if (method === "waafi") {
      const phoneDigits = phone.replace(/\D/g, "").trim();
      if (!phoneDigits) {
        setError(t.error_phone_required);
        return;
      }
    }

    setLoading(true);
    setError("");

    try {
      const orderService = OrderService.getInstance();
      const planKey = plan.key;

      if (method === "waafi") {
        const phoneDigits = phone.replace(/\D/g, "").trim();
        const result = await orderService.createSubscriptionOrder({
          payment_method: "waafi",
          currency: "USD",
          phone: phoneDigits,
          plan: planKey,
          ...(planKey === "explorer"
            ? { subscription_type: "monthly" as const }
            : {}),
        });
        if (result.payment_success) {
          onSuccess();
          return;
        }
        const msg = (result.message || "").toLowerCase();
        if (
          msg.includes("already") ||
          msg.includes("active") ||
          msg.includes("premium")
        ) {
          setError(t.already_subscribed);
          return;
        }
        setError(result.message || t.error_payment_failed);
        return;
      }

      const created = await orderService.createSubscriptionOrder({
        payment_method: "stripe",
        currency: "USD",
        plan: planKey,
        ...(planKey === "explorer"
          ? { subscription_type: "monthly" as const }
          : {}),
      });
      const orderId = created.data?.id;
      if (!orderId) {
        setError(t.error_payment_failed);
        return;
      }

      const envPriceId =
        planKey === "explorer"
          ? SUBSCRIBE_STRIPE_PRICE_IDS.explorer
          : SUBSCRIBE_STRIPE_PRICE_IDS.challenge;
      const usePriceId = isValidSubscribeStripePriceId(envPriceId);

      const stripeService = StripeService.getInstance();
      await stripeService.createCheckoutSessionWithPrice(
        usePriceId ? envPriceId : "",
        "subscription",
        orderId,
        planKey
      );
    } catch (e) {
      const err = e as Error & { status?: number };
      const msg = (err.message || "").toLowerCase();
      if (
        err.status === 409 ||
        msg.includes("already") ||
        msg.includes("active subscription")
      ) {
        setError(t.already_subscribed);
      } else {
        setError(err.message || t.error_payment_failed);
      }
    } finally {
      setLoading(false);
    }
  };

  const methodBtn = (active: boolean) =>
    `flex-1 min-h-[3rem] px-3 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
      active
        ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/25"
        : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="relative w-full max-w-[440px] rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl shadow-primary/10">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <span className="text-lg leading-none" aria-hidden>
            ✕
          </span>
        </button>

        <div className="px-6 pb-6 pt-12 sm:px-8 sm:pb-8 sm:pt-14">
          <h2
            id="payment-modal-title"
            className="pr-10 text-xl font-bold tracking-tight text-foreground"
          >
            {t.modal_title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {plan.name} · {plan.priceDisplay}
            {plan.per}
          </p>

          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4 dark:bg-muted/25">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t.modal_plan_label}
                </p>
                <p className="mt-0.5 text-base font-semibold text-foreground">
                  {plan.name}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {t.modal_price_label}
                </p>
                <p className="mt-0.5 text-base font-semibold text-primary">
                  {plan.priceDisplay}
                  <span className="text-sm font-normal text-muted-foreground">
                    {plan.per}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t.modal_pay_with}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setMethod("waafi")}
                className={methodBtn(method === "waafi")}
              >
                {t.modal_waafi_label}
              </button>
              <button
                type="button"
                onClick={() => setMethod("stripe")}
                className={methodBtn(method === "stripe")}
              >
                {t.modal_card_label}
              </button>
            </div>
          </div>

          {method === "waafi" && (
            <div className="mt-6 space-y-2">
              <label
                htmlFor="waafi-phone"
                className="text-sm font-medium text-foreground"
              >
                {t.modal_phone_label}
              </label>
              <input
                id="waafi-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.modal_phone_placeholder}
                className="mt-1.5 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground transition-shadow focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>
          )}

          {error && (
            <p
              className="mt-5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handlePay}
            disabled={loading}
            className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? t.modal_processing : plan.payButton}
          </button>
        </div>
      </div>
    </div>
  );
}
