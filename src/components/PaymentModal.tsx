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
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface Props {
  plan: SubscribePlan;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ plan, onClose, onSuccess }: Props) {
  const [method, setMethod] = useState<"waafi" | "stripe">("waafi");
  const [paymentPlan, setPaymentPlan] = useState<"installment" | "full">("installment");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    const auth = AuthService.getInstance();
    const token = await auth.ensureValidToken();
    
    if (!token) {
      if (method === "waafi" && !phone.replace(/\D/g, "").trim()) {
        setError(t.error_login_required);
        return;
      }
      // For other cases, we still need a token to create an order in the backend.
      // But based on Fix 2, we should avoid showing this error if phone is entered for Waafi.
      if (method !== "waafi") {
        setError(t.error_login_required);
        return;
      }
    }

    const sessionUser = useAuthStore.getState().user;
    const u = sessionUser || auth.getCurrentUser();
    if (u?.is_email_verified === false) {
      setError(
        "Fadlan xaqiiji email-kaaga ka hor intaadan lacag bixin. Email-kaaga iska eeg."
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
        planKey,
        paymentPlan
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
    >
      <div className="relative w-full max-w-[400px] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground z-10"
          aria-label="Close"
        >
          <span className="text-lg leading-none">✕</span>
        </button>

        <div className="px-6 pb-6 pt-8 sm:px-8 sm:pb-8">
          <div className="text-center mb-6">
            <h2
              id="payment-modal-title"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {t.modal_title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {plan.name} · {plan.priceDisplay}{plan.per}
            </p>
          </div>

          <div className="mb-6 rounded-xl border border-border bg-muted/30 p-3 text-center">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">
              {t.modal_plan_label}
            </p>
            <p className="text-lg font-bold text-foreground">
              {plan.name} <span className="text-primary ml-1">{plan.priceDisplay}{plan.per}</span>
            </p>
          </div>

          {plan.key === "challenge" && (
            <div className="mb-6 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center">
                Dooro habka bixinta
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentPlan("installment")}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all",
                    paymentPlan === "installment" 
                      ? "border-primary bg-primary/10 ring-1 ring-primary" 
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <p className="text-xs font-bold text-foreground">$49/bilood</p>
                  <p className="text-[10px] text-muted-foreground">3 bishood</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentPlan("full")}
                  className={cn(
                    "p-2 rounded-lg border text-center transition-all",
                    paymentPlan === "full" 
                      ? "border-primary bg-primary/10 ring-1 ring-primary" 
                      : "border-border bg-background hover:border-primary/40"
                  )}
                >
                  <p className="text-xs font-bold text-foreground">$149 hal mar</p>
                  <p className="text-[10px] text-muted-foreground">Bixi hal mar</p>
                </button>
              </div>

              <div className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-[11px] text-muted-foreground space-y-1">
                {paymentPlan === "installment" ? (
                  <>
                    <div className="flex justify-between"><span>Maanta:</span> <span className="font-bold text-foreground">$49</span></div>
                    <div className="flex justify-between"><span>Wadarta (3 bilood):</span> <span className="font-bold text-foreground">$147</span></div>
                  </>
                ) : (
                  <div className="flex justify-between"><span>Hal-mar:</span> <span className="font-bold text-foreground">$149</span></div>
                )}
              </div>
            </div>
          )}

          <div className="mb-6">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-center">
              {t.modal_pay_with}
            </p>
            <div className="flex p-1 bg-muted rounded-xl gap-1">
              <button
                type="button"
                onClick={() => setMethod("waafi")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                  method === "waafi" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.modal_waafi_label}
              </button>
              <button
                type="button"
                onClick={() => setMethod("stripe")}
                className={cn(
                  "flex-1 py-2 rounded-lg text-xs font-semibold transition-all",
                  method === "stripe" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.modal_card_label}
              </button>
            </div>
          </div>

          {method === "waafi" && (
            <div className="mb-6">
              <input
                id="waafi-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.modal_phone_placeholder}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground transition-shadow focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              />
            </div>
          )}

          {error && (
            <p
              className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive text-center"
              role="alert"
            >
              {error}
            </p>
          )}

           <button
              type="button"
              onClick={handlePay}
              disabled={loading}
              className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? t.modal_processing : (
                plan.key === "challenge" 
                ? (paymentPlan === "installment" ? "Bixi $49 maanta →" : "Bixi $149 →")
                : plan.payButton
              )}
            </button>
            <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Lacag-celinta: 30 maalmood haddii aadan ku faraxsanayn.</span>
            </div>
        </div>
      </div>
    </div>
  );
}
