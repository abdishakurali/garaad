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
      if (err.status === 409 || msg.includes("already") || msg.includes("active subscription")) {
        setError(t.already_subscribed);
      } else {
        setError(err.message || t.error_payment_failed);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-8 relative border border-gray-200 dark:border-zinc-700">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {t.modal_title}
        </h2>

        <div className="flex justify-between gap-2 text-sm text-gray-500 dark:text-zinc-400 mb-6 pb-4 border-b border-gray-200 dark:border-zinc-700">
          <span>
            {t.modal_plan_label}:{" "}
            <strong className="text-gray-900 dark:text-white">{plan.name}</strong>
          </span>
          <span className="text-right shrink-0">
            {t.modal_price_label}:{" "}
            <strong className="text-gray-900 dark:text-white">
              ${plan.price}
              {plan.per}
            </strong>
          </span>
        </div>

        <p className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">
          {t.modal_pay_with}
        </p>
        <div className="flex gap-3 mb-6">
          <button
            type="button"
            onClick={() => setMethod("waafi")}
            className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              method === "waafi"
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-gray-200 text-gray-700 hover:border-gray-400 dark:border-zinc-600 dark:text-zinc-300"
            }`}
          >
            {t.modal_waafi_label}
          </button>
          <button
            type="button"
            onClick={() => setMethod("stripe")}
            className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
              method === "stripe"
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-gray-200 text-gray-700 hover:border-gray-400 dark:border-zinc-600 dark:text-zinc-300"
            }`}
          >
            {t.modal_card_label}
          </button>
        </div>

        {method === "waafi" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-1">
              {t.modal_phone_label}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t.modal_phone_placeholder}
              className="w-full border border-gray-200 dark:border-zinc-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-zinc-950 text-gray-900 dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold text-base hover:bg-gray-900 dark:hover:bg-zinc-200 disabled:opacity-50 transition-all"
        >
          {loading ? t.modal_processing : plan.payButton}
        </button>
      </div>
    </div>
  );
}
