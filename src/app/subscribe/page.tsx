"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check, Lock, Loader2 } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useAuthStore } from "@/store/useAuthStore";
import { PLANS, type SubscribePlanKey, isValidSubscribeStripePriceId, SUBSCRIBE_STRIPE_PRICE_IDS } from "@/config/subscribePlans";
import { pricingTranslations as t } from "@/config/translations/pricing";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { WaitlistForm } from "@/components/WaitlistForm";
import AuthService from "@/services/auth";
import OrderService from "@/services/orders";
import StripeService from "@/services/stripe";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SUBSCRIBE_FAQS = [
  {
    q: "Runtii ma jirtaa dammaanad lacag-celin ah?",
    a: "Haa. Haddii aad raacdo qorshaha oo aad lacag kasban waydo muddo 5 casho ah, si shakhsi ah ayaan kula shaqaynayaa ilaa aad ka guulaysato. Haddii intaas ka dib aad wali ku qanci waydo, lacagtaada ayaan kuu soo celinayaa.",
  },
  {
    q: "Waa maxay farqiga u dhexeeya Explorer iyo Mentorship?",
    a: "Explorer wuxuu ku siinayaa fursad aad casharrada oo dhan ku baran karto xawaarahaaga gaarka ah. Mentorship waa barnaamij habaysan oo 60 casho ah, xidhiidh toos ah oo Shakuur, iyo dammaanad dakhli.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="text-base font-medium text-foreground">{q}</span>
        <ChevronDown className={`shrink-0 w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-5 text-sm text-muted-foreground leading-relaxed pr-8">{a}</p>}
    </div>
  );
}

function SubscribePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const { user } = useAuthStore();
  const viewCaptured = useRef(false);
  const paymentRef = useRef<HTMLDivElement>(null);

  const [selectedPlan, setSelectedPlan] = useState<SubscribePlanKey | null>(() => {
    if (typeof window === "undefined") return null;
    return (sessionStorage.getItem("pending_plan") as SubscribePlanKey) || null;
  });

  // Payment form state
  const [method, setMethod] = useState<"waafi" | "stripe">("waafi");
  const [paymentPlan, setPaymentPlan] = useState<"installment" | "full">("installment");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auth modal (for unauthenticated users clicking CTA)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [pendingPlan, setPendingPlan] = useState<SubscribePlanKey | null>(null);

  const { data: challengeStatus } = useChallengeStatus();
  const auth = AuthService.getInstance();

  useEffect(() => {
    if (viewCaptured.current || !posthog) return;
    viewCaptured.current = true;
    posthog.capture("subscribe_page_view", { ref: searchParams.get("ref") ?? "" });
  }, [posthog, searchParams]);

  // Scroll to payment form when plan is selected
  useEffect(() => {
    if (selectedPlan && paymentRef.current) {
      setTimeout(() => paymentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [selectedPlan]);

  const handleCtaClick = (planKey: SubscribePlanKey) => {
    posthog?.capture("plan_cta_clicked", { plan: planKey });
    if (planKey === "explorer") {
      router.push(user ? "/courses" : "/signup");
      return;
    }
    if (challengeStatus?.is_waitlist_only) return;
    if (user) {
      sessionStorage.setItem("pending_plan", planKey);
      setSelectedPlan(planKey);
    } else {
      sessionStorage.setItem("pending_plan", planKey);
      setPendingPlan(planKey);
      setIsAuthModalOpen(true);
    }
  };

  const handlePaymentSuccess = () => {
    sessionStorage.removeItem("pending_plan");
    router.push("/courses?welcome=1");
  };

  const handlePay = async () => {
    if (!selectedPlan || challengeStatus?.is_waitlist_only) return;

    const plan = PLANS[selectedPlan];
    const token = await auth.ensureValidToken();
    if (!token) {
      setError(t.error_login_required);
      return;
    }

    const currentUser = auth.getCurrentUser();
    if (!currentUser?.email) {
      setError("Maqan tahay email-ka. Fadlan isku day markale.");
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
      const userEmail = currentUser.email;

      if (method === "waafi") {
        const phoneDigits = phone.replace(/\D/g, "").trim();
        const result = await orderService.createSubscriptionOrder({
          payment_method: "waafi",
          currency: "USD",
          phone: phoneDigits,
          email: userEmail,
          plan: planKey,
          ...(planKey === "explorer" ? { subscription_type: "monthly" as const } : {}),
        });
        if (result.payment_success) {
          posthog?.capture("checkout_completed", { payment_method: "waafi", plan: planKey, payment_plan: paymentPlan });
          handlePaymentSuccess();
          return;
        }
        const msg = (result.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("active") || msg.includes("premium")) {
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
        email: userEmail,
        ...(planKey === "explorer" ? { subscription_type: "monthly" as const } : {}),
      });
      const orderId = created.data?.id;
      if (!orderId) {
        setError(t.error_payment_failed);
        return;
      }

      const envPriceId = planKey === "explorer" ? SUBSCRIBE_STRIPE_PRICE_IDS.explorer : SUBSCRIBE_STRIPE_PRICE_IDS.challenge;
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
      if (err.status === 409 || msg.includes("already") || msg.includes("active subscription")) {
        setError(t.already_subscribed);
      } else {
        setError(err.message || t.error_payment_failed);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const authInstance = AuthService.getInstance();
      if (authMode === "signup") {
        await authInstance.signUp({
          email: authForm.email,
          password: authForm.password,
          username: authForm.email.split("@")[0],
          name: "User",
        });
      } else {
        await authInstance.signIn({ email: authForm.email, password: authForm.password });
      }
      setIsAuthModalOpen(false);
      if (pendingPlan) setSelectedPlan(pendingPlan);
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const payButtonLabel = selectedPlan === "challenge"
    ? (paymentPlan === "installment" ? "Bixi $49 maanta →" : "Bixi $149 →")
    : (selectedPlan ? PLANS[selectedPlan].payButton : "");

  return (
    <div className="min-h-screen bg-background text-foreground pt-14">
      {/* Header */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          Gaadiidleyda & iyo taageerada
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
          Ma diyaar baa in <span className="text-gold">la bilaabo?</span>
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
          Barnaamijkan waxaan u dhisay sababtoo ah waxaan soo maray isla caqabadihii aad hadda wajahayso.
          Haddii aad shaqada qabato, waxaan kuu ballanqaadayaa inaad guul gaadhi doonto.
        </p>
      </section>

      {/* Plan card */}
      <section className="max-w-md mx-auto px-4 sm:px-6 pb-8">
        {challengeStatus?.is_waitlist_only ? (
          <div className="p-6 rounded-2xl border border-border bg-card text-center">
            <p className="text-lg font-semibold text-foreground mb-2">Kooxda way buuxdaa</p>
            <p className="text-sm text-muted-foreground mb-4">Geli liiska si aad u hesho kooxda xigta.</p>
            <WaitlistForm />
          </div>
        ) : (
          <div className="relative p-8 rounded-2xl border-2 border-gold bg-card shadow-xl shadow-gold/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold uppercase tracking-wide bg-gold text-black rounded-full">
              Waaban
            </div>

            <div className="text-center mb-6">
              <p className="text-sm font-medium text-gold mb-2">Mentorship (Gacan-qabasho)</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-foreground">$149</span>
                <span className="text-muted-foreground text-sm">mar kaliya</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">ama $49/bishii × 3</p>
            </div>

            <ul className="space-y-3 mb-6">
              {[
                "Barnaamij dhammaystiran 60 casho",
                "Xidhiidh toos ah oo Shakuur",
                "Dammaanad: lacag 5 casho",
                "Macmiil 60 casho — ama bilaash",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-gold shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => handleCtaClick("challenge")}
              className="btn-gold w-full py-4 text-base"
            >
              {selectedPlan ? "Bedel qaabka bixinta ↓" : "Ku soo biir Mentorship-ka →"}
            </button>
          </div>
        )}

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Hal mar bixin. 5-maalmood dammaanad lacag-celin.
        </p>

        {/* Social proof */}
        <div className="mt-8 p-4 rounded-xl bg-card border border-gold/20">
          <p className="text-xs font-medium text-gold mb-3 text-center">Ardayda Guuleystay</p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black text-xs font-bold">M</div>
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black text-xs font-bold">F</div>
            <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-black text-xs font-bold">C</div>
            <span className="text-xs text-muted-foreground">+150+ arday</span>
          </div>
        </div>
      </section>

      {/* Inline payment form — shown when plan is selected */}
      {selectedPlan && !challengeStatus?.is_waitlist_only && (
        <section ref={paymentRef} className="max-w-md mx-auto px-4 sm:px-6 pb-16">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-5 shadow-lg">
            <h2 className="text-lg font-bold text-foreground text-center">Dooro habka bixinta</h2>

            {/* Payment plan toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentPlan("installment")}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all",
                  paymentPlan === "installment"
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                <p className="text-sm font-bold text-foreground">$49/bilood</p>
                <p className="text-xs text-muted-foreground">3 bishood</p>
              </button>
              <button
                type="button"
                onClick={() => setPaymentPlan("full")}
                className={cn(
                  "p-3 rounded-xl border text-center transition-all",
                  paymentPlan === "full"
                    ? "border-primary bg-primary/10 ring-1 ring-primary"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                <p className="text-sm font-bold text-foreground">$149 hal mar</p>
                <p className="text-xs text-muted-foreground">Bixi hal mar</p>
              </button>
            </div>

            {/* Price summary */}
            <div className="px-3 py-2 rounded-lg bg-muted/50 border border-border text-xs text-muted-foreground space-y-1">
              {paymentPlan === "installment" ? (
                <>
                  <div className="flex justify-between"><span>Maanta:</span><span className="font-bold text-foreground">$49</span></div>
                  <div className="flex justify-between"><span>Wadarta (3 bilood):</span><span className="font-bold text-foreground">$147</span></div>
                </>
              ) : (
                <div className="flex justify-between"><span>Hal-mar:</span><span className="font-bold text-foreground">$149</span></div>
              )}
            </div>

            {/* Method toggle */}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
                {t.modal_pay_with}
              </p>
              <div className="flex p-1 bg-muted rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setMethod("waafi")}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    method === "waafi" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.modal_waafi_label}
                </button>
                <button
                  type="button"
                  onClick={() => setMethod("stripe")}
                  className={cn(
                    "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                    method === "stripe" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.modal_card_label}
                </button>
              </div>
            </div>

            {/* Waafi phone input */}
            {method === "waafi" && (
              <div className="space-y-1.5">
                <Label htmlFor="waafi-phone" className="text-sm font-medium">
                  {t.modal_phone_placeholder}
                </Label>
                <Input
                  id="waafi-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.modal_phone_placeholder}
                  className="h-11"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive text-center">
                {error}
              </p>
            )}

            {/* Pay button */}
            <Button
              type="button"
              onClick={handlePay}
              disabled={loading}
              className="w-full h-12 text-base font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.modal_processing}
                </>
              ) : (
                payButtonLabel
              )}
            </Button>

            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Lacag-celinta: 5 maalmood haddii aadan ku faraxsanayn.</span>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        <h2 className="text-lg font-bold text-center mb-6">Su&apos;aalaha Inta Badan La Iska Weydiiyo</h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-6">
          {SUBSCRIBE_FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* Auth modal (unauthenticated users) */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[16px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {authMode === "signup" ? "Sameyso koonto bilaash ah" : "Soo gal si aad wadarto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="sub-email">Email-ka</Label>
              <Input
                id="sub-email"
                type="email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sub-password">Ereyga sirta ah</Label>
              <Input
                id="sub-password"
                type="password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            {authError && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-[10px]">{authError}</p>
            )}
            <Button type="submit" className="w-full h-12 font-bold rounded-[10px]" disabled={authLoading}>
              {authLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {authMode === "signup" ? "Sii wad →" : "Soo gal →"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {authMode === "signup" ? (
                <>Ma leedahay koonto hore?{" "}
                  <button type="button" className="text-gold font-semibold hover:underline" onClick={() => setAuthMode("login")}>
                    Log in
                  </button>
                </>
              ) : (
                <>Ma jirto koonto?{" "}
                  <button type="button" className="text-gold font-semibold hover:underline" onClick={() => setAuthMode("signup")}>
                    Sameyso bilaash
                  </button>
                </>
              )}
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-2 border-muted border-t-foreground rounded-full animate-spin" /></div>}>
      <SubscribePageInner />
    </Suspense>
  );
}
