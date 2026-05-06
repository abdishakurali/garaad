"use client";

import { useState, useRef, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
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
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { cn } from "@/lib/utils";
import { Lock, Loader2 } from "lucide-react";
import { EXPLORER_IS_FREE } from "@/config/featureFlags";
import { API_BASE_URL } from "@/lib/constants";

interface Props {
  plan: SubscribePlan;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ plan, onClose, onSuccess }: Props) {
  const posthog = usePostHog();
  const [method, setMethod] = useState<"waafi" | "stripe">("waafi");
  const [paymentPlan, setPaymentPlan] = useState<"installment" | "full">("installment");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: challengeStatus } = useChallengeStatus();
  const isWaitlistOnly = challengeStatus?.is_waitlist_only;
  const [showEmailVerify, setShowEmailVerify] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("payment_verify_pending") === "true";
  });
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("payment_verified") === "true";
  });
  const [codeDigits, setCodeDigits] = useState<string[]>(() => {
    if (typeof window === "undefined") return Array(6).fill("");
    const saved = sessionStorage.getItem("payment_code_digits");
    return saved ? JSON.parse(saved) : Array(6).fill("");
  });
  const [isEmailVerified, setIsEmailVerified] = useState<boolean | null>(null);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Refresh user data on mount to get latest verification status
  useEffect(() => {
    const auth = AuthService.getInstance();
    auth.fetchAndUpdateUserData().then((updatedUser) => {
      if (updatedUser?.is_email_verified) {
        sessionStorage.setItem("payment_verified", "true");
        setVerifySuccess(true);
        setIsEmailVerified(true);
      } else {
        setIsEmailVerified(false);
      }
    }).catch(() => {
      setIsEmailVerified(false);
    });
  }, []);

  const auth = AuthService.getInstance();
  const sessionUser = useAuthStore((s) => s.user);
  const currentUser = sessionUser || auth.getCurrentUser();

  const handleVerifyCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = value;
    setCodeDigits(newCodeDigits);
    sessionStorage.setItem("payment_code_digits", JSON.stringify(newCodeDigits));
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleVerifyPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").slice(0, 6).replace(/\D/g, "");
    if (paste.length !== 6) {
      setVerifyError("Fadlan凝胶6-xarafka full");
      return;
    }
    const newCodeDigits = paste.split("");
    setCodeDigits(newCodeDigits);
    sessionStorage.setItem("payment_code_digits", JSON.stringify(newCodeDigits));
    setVerifyError("");
    inputsRef.current[5]?.focus();
  };

  const handleResendCode = async () => {
    if (!currentUser?.email) return;
    setVerifyError("");
    setVerifyLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/resend-verification/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser.email }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.error === "Email is already verified") {
          auth.updateEmailVerificationStatus(true);
          setVerifySuccess(true);
          return;
        }
        throw new Error(data.error || data.detail || "Failed to resend code");
      }
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!currentUser?.email) return;
    const verificationCode = codeDigits.join("");
    if (verificationCode.length !== 6) {
      setVerifyError("Fadlan geli koodka 6-xarafka ah");
      return;
    }

    setVerifyError("");
    setVerifyLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/verify-email/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: currentUser.email, code: verificationCode }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        if (data.error === "Email is already verified") {
          auth.updateEmailVerificationStatus(true);
          sessionStorage.setItem("payment_verified", "true");
          setVerifySuccess(true);
          return;
        }
        throw new Error(data.error || "Verification failed");
      }

      await auth.fetchAndUpdateUserData();
      setVerifySuccess(true);
      setShowEmailVerify(false);
      sessionStorage.setItem("payment_verified", "true");
      sessionStorage.removeItem("payment_verify_pending");
      sessionStorage.removeItem("payment_code_digits");
      setCodeDigits(Array(6).fill(""));
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handlePay = async () => {
    if (isWaitlistOnly) return;
    if (isEmailVerified === false && !verifySuccess) {
      setError(
        "Fadlan xaqiiji email-kaaga ka hor intaadan lacag bixin."
      );
      sessionStorage.setItem("payment_verify_pending", "true");
      setShowEmailVerify(true);
      return;
    }

    const token = await auth.ensureValidToken();

    if (!token) {
      setError(t.error_login_required);
      return;
    }

    // Refresh user data to ensure email verification status is current
    await auth.fetchAndUpdateUserData(token);
    const updatedUser = auth.getCurrentUser();
    if (!updatedUser?.is_email_verified) {
      sessionStorage.setItem("payment_verify_pending", "true");
      setShowEmailVerify(true);
      setError("Fadlan xaqiiji email-kaaga ka hor intaadan lacag bixin.");
      return;
    }

    if (!updatedUser?.email) {
      setError("Maqan tahay email-ka. Fadlan isku day markale.");
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

    posthog?.capture("checkout_started", {
      payment_method: method,
      plan: plan.key,
      payment_plan: paymentPlan,
    });

    try {
      const orderService = OrderService.getInstance();
      const planKey = plan.key;
      const userEmail = auth.getCurrentUser()?.email;

      if (!userEmail) {
        setError("Maqan tahay email-ka. Fadlan isku day markale.");
        return;
      }

      if (method === "waafi") {
        const phoneDigits = phone.replace(/\D/g, "").trim();
        const result = await orderService.createSubscriptionOrder({
          payment_method: "waafi",
          currency: "USD",
          phone: phoneDigits,
          email: userEmail,
          plan: planKey,
          ...(planKey === "explorer"
            ? { subscription_type: "monthly" as const }
            : {}),
        });
        if (result.payment_success) {
          posthog?.capture("checkout_completed", {
            payment_method: "waafi",
            plan: plan.key,
            payment_plan: paymentPlan,
          });
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
        email: currentUser?.email,
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
    `flex-1 min-h-[3rem] px-3 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${active
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
          {/* If email is unverified, show verification first instead of payment */}
          {isEmailVerified === false && !verifySuccess ? (
            <div className="text-center py-8">
              <h2
                id="payment-modal-title"
                className="text-xl font-bold tracking-tight text-foreground mb-2"
              >
                Xaqiiji Email-kaaga
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Diray email xaqiijsiina uu ku tagay {currentUser?.email}
              </p>
              
              <div className="flex justify-center gap-1.5 mb-4">
                {codeDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputsRef.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleVerifyCodeChange(index, e.target.value)}
                    onPaste={handleVerifyPaste}
                    className="w-10 h-12 text-center text-lg font-semibold bg-background border border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ))}
              </div>

              {verifyError && (
                <p className="text-xs text-red-500 mb-4">{verifyError}</p>
              )}

              <button
                type="button"
                onClick={handleVerifyEmail}
                disabled={verifyLoading || codeDigits.join("").length !== 6}
                className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-bold mb-3"
              >
                {verifyLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Xaqiiji
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={verifyLoading}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {verifyLoading ? "Diraya..." : "Dib u dir koodka"}
              </button>
            </div>
          ) : (
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
              className="mb-3 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-xs text-destructive text-center"
              role="alert"
            >
              {error}
            </p>
          )}

          {showEmailVerify && currentUser?.email && !verifySuccess && (
            <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-950/50 p-3 space-y-3">
              <p className="text-xs text-amber-200 text-center">
                Diray email xaqiijsiina uu ku tagay <strong>{currentUser.email}</strong>
              </p>
              
              <div className="flex justify-center gap-1.5">
                {codeDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputsRef.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleVerifyCodeChange(index, e.target.value)}
                    onPaste={handleVerifyPaste}
                    className="w-9 h-10 text-center text-sm font-semibold bg-background border border-input rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ))}
              </div>

              {verifyError && (
                <p className="text-xs text-red-400 text-center">{verifyError}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmailVerify(false)}
                  disabled={verifyLoading}
                  className="flex-1 h-9 rounded-lg border border-border bg-background text-xs font-medium hover:bg-muted disabled:opacity-50"
                >
                  Dib
                </button>
                <button
                  type="button"
                  onClick={handleVerifyEmail}
                  disabled={verifyLoading || codeDigits.join("").length !== 6}
                  className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center disabled:opacity-50"
                >
                  {verifyLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Xaqiiji"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={verifyLoading}
                className="w-full text-xs text-amber-300 hover:underline disabled:opacity-50"
              >
                {verifyLoading ? "Diraya..." : "Dib u dir koodka"}
              </button>
            </div>
          )}

          {verifySuccess && (
            <p className="mb-4 rounded-lg border border-green-500/30 bg-green-950/50 px-3 py-2 text-xs text-green-400 text-center">
              Email-kaaga waa la xaqiijiyay! ✅
            </p>
          )}

          <button
            type="button"
            onClick={handlePay}
            disabled={loading || isWaitlistOnly || (isEmailVerified === false && !verifySuccess)}
            className={cn(
              "flex h-11 w-full items-center justify-center rounded-lg text-sm font-bold transition-all shadow-lg",
              loading || isWaitlistOnly || (isEmailVerified === false && !verifySuccess)
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {loading ? t.modal_processing : (
              isWaitlistOnly
                ? "Cohort-ka waa buuxsamay"
                : (isEmailVerified === false && !verifySuccess)
                  ? "Xaqiiji emailka"
                  : (plan.key === "challenge"
                      ? (paymentPlan === "installment" ? "Bixi $49 maanta →" : "Bixi $149 →")
                      : plan.payButton)
            )}
          </button>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Lacag-celinta: 5 maalmood haddii aadan ku faraxsanayn.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
