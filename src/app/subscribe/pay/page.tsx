"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { cn } from "@/lib/utils";
import { pricingTranslations as t } from "@/config/translations/pricing";
import {
  isValidSubscribeStripePriceId,
  SUBSCRIBE_STRIPE_PRICE_IDS,
} from "@/config/subscribePlans";
import AuthService from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore";
import OrderService from "@/services/orders";
import StripeService from "@/services/stripe";
import Logo from "@/components/ui/Logo";

type Method = "waafi" | "stripe";
type Plan = "installment" | "full";

function PayPageInner() {
  const router = useRouter();
  const posthog = usePostHog();
  const storeUser = useAuthStore((s) => s.user);

  const [plan, setPlan] = useState<Plan>("installment");
  const [method, setMethod] = useState<Method>("waafi");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // On mount: ensure auth, load email from any available source
  useEffect(() => {
    const auth = AuthService.getInstance();

    if (!auth.isAuthenticated()) {
      router.replace("/welcome?redirect=/subscribe/pay");
      return;
    }

    const resolveEmail = async () => {
      // 1. Try AuthService in-memory user
      let user = auth.getCurrentUser();

      // 2. Try Zustand store
      if (!user?.email && storeUser?.email) {
        user = storeUser as typeof user;
      }

      // 3. Fetch from API if still missing
      if (!user?.email) {
        const fresh = await auth.fetchAndUpdateUserData();
        user = fresh;
      }

      if (!user?.email) {
        router.replace("/login");
        return;
      }

      if (user.is_email_verified === false) {
        router.replace(`/verify-email?email=${encodeURIComponent(user.email)}`);
        return;
      }

      setUserEmail(user.email);
    };

    resolveEmail();
  }, [router, storeUser]);

  const price = plan === "installment" ? "$49" : "$149";
  const priceNote = plan === "installment" ? "× 3 bilood ($147 wadarta)" : "hal-mar";

  const handlePay = async () => {
    const email = userEmail ?? storeUser?.email ?? AuthService.getInstance().getCurrentUser()?.email;
    if (!email) {
      setError("Email lama helin. Fadlan dib u gal.");
      return;
    }

    const auth = AuthService.getInstance();
    const isAuthed = await auth.ensureValidToken();
    if (!isAuthed) {
      setError(t.error_login_required);
      return;
    }

    if (method === "waafi") {
      const digits = phone.replace(/\D/g, "").trim();
      if (!digits) {
        setError(t.error_phone_required);
        return;
      }
    }

    setLoading(true);
    setError("");
    posthog?.capture("checkout_started", { payment_method: method, plan: "challenge", payment_plan: plan });

    try {
      const orderService = OrderService.getInstance();

      if (method === "waafi") {
        const digits = phone.replace(/\D/g, "").trim();
        const result = await orderService.createSubscriptionOrder({
          payment_method: "waafi",
          currency: "USD",
          phone: digits,
          email,
          plan: "challenge",
        });

        if (result.payment_success) {
          posthog?.capture("checkout_completed", { payment_method: "waafi", plan: "challenge" });
          router.push("/courses/freelancing?payment=done");
          return;
        }

        const msg = (result.message ?? "").toLowerCase();
        if (msg.includes("already") || msg.includes("active") || msg.includes("premium")) {
          setError(t.already_subscribed);
        } else {
          setError(result.message || t.error_payment_failed);
        }
        return;
      }

      // Stripe
      const created = await orderService.createSubscriptionOrder({
        payment_method: "stripe",
        currency: "USD",
        plan: "challenge",
        email,
      });

      const orderId = created.data?.id;
      if (!orderId) {
        setError(t.error_payment_failed);
        return;
      }

      const envPriceId = SUBSCRIBE_STRIPE_PRICE_IDS.challenge;
      const usePriceId = isValidSubscribeStripePriceId(envPriceId);
      await StripeService.getInstance().createCheckoutSessionWithPrice(
        usePriceId ? envPriceId : "",
        "subscription",
        orderId,
        "challenge",
        plan,
        email
      );
    } catch (e) {
      const err = e as Error & { status?: number };
      const msg = (err.message ?? "").toLowerCase();
      if (err.status === 409 || msg.includes("already") || msg.includes("active subscription")) {
        setError(t.already_subscribed);
      } else {
        setError(err.message || t.error_payment_failed);
      }
    } finally {
      setLoading(false);
    }
  };

  // Show spinner while resolving user email
  if (!userEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-8">
        <Link href="/subscribe" className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Dib u laabo
        </Link>
        <Logo className="h-8" />
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="h-3.5 w-3.5" />
          <span>Ammaan</span>
        </div>
      </header>

      {/* Checkout body */}
      <main className="mx-auto w-full max-w-md flex-1 px-4 py-10 sm:py-14">
        {/* What you're buying */}
        <div className="mb-8 rounded-2xl border border-gold/30 bg-gold/5 p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold">
            Waxaad helaysaa
          </p>
          <p className="text-base font-bold text-foreground">Mentorship — 60 casho</p>
          <ul className="mt-3 space-y-1.5">
            {[
              "Barnaamij habaysan 60 casho",
              "Xidhiidh toos ah oo Shakuur",
              "Dammaanad: 5-casho lacag-celin",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-3.5 w-3.5 shrink-0 text-gold" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment plan */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-foreground">Dooro qaabka bixinta</p>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { key: "installment", label: "$49 / bilood", sub: "3 bilood · $147" },
                { key: "full", label: "$149 hal-mar", sub: "Keydi $0" },
              ] as const
            ).map(({ key, label, sub }) => (
              <button
                key={key}
                type="button"
                onClick={() => setPlan(key)}
                className={cn(
                  "rounded-xl border-2 p-4 text-left transition-all",
                  plan === key
                    ? "border-gold bg-gold/10 ring-1 ring-gold/40"
                    : "border-border bg-card hover:border-gold/40"
                )}
              >
                <p className="text-sm font-bold text-foreground">{label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-semibold text-foreground">Habka lacag-bixinta</p>
          <div className="flex rounded-xl border border-border bg-muted p-1 gap-1">
            {(
              [
                { key: "waafi", label: "Waafi (Mobilekaaga)" },
                { key: "stripe", label: "Kaarka Bangiga" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMethod(key)}
                className={cn(
                  "flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all",
                  method === key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Waafi phone */}
        {method === "waafi" && (
          <div className="mb-6">
            <label htmlFor="pay-phone" className="mb-2 block text-sm font-semibold text-foreground">
              Lambarka telefoonka
            </label>
            <input
              id="pay-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="252615000000"
              className="h-12 w-full rounded-xl border border-input bg-card px-4 text-base text-foreground placeholder:text-muted-foreground/60 transition-shadow focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Pay button */}
        <button
          type="button"
          onClick={handlePay}
          disabled={loading}
          className={cn(
            "flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-bold transition-all",
            loading
              ? "cursor-not-allowed bg-muted text-muted-foreground"
              : "btn-gold shadow-lg shadow-gold/20 hover:shadow-xl hover:shadow-gold/30"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Waa la diraarayaa...
            </>
          ) : (
            <>Bixi {price} maanta →</>
          )}
        </button>

        <p className="mt-2 text-center text-xs text-muted-foreground">{priceNote}</p>

        {/* Trust row */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
            Ammaan
          </span>
          <span className="flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            Lacag-celinta 5 maalmood
          </span>
        </div>
      </main>
    </div>
  );
}

export default function PayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <PayPageInner />
    </Suspense>
  );
}
