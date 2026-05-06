"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useAuthStore } from "@/store/useAuthStore";
import PaymentModal from "@/components/PaymentModal";
import { PLANS, type SubscribePlanKey } from "@/config/subscribePlans";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { WaitlistForm } from "@/components/WaitlistForm";
import AuthService from "@/services/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SUBSCRIBE_FAQS = [
  {
    q: "Is there really a money-back guarantee?",
    a: "Yes. If you follow the plan and don't earn money in 30 days, I work with you personally until you do — at no extra charge. If after that you're still not satisfied, I refund you.",
  },
  {
    q: "What's the difference between Explorer and the Challenge?",
    a: "Explorer gives you self-paced access to all course content. The Challenge is the full 60-day structured program with daily lessons, personal access to Shakuur, and the income guarantee.",
  },
  {
    q: "Do I need a credit card for the free trial?",
    a: "No. Explorer access is free — just sign up and start. No card required.",
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

  const [selectedPlan, setSelectedPlan] = useState<SubscribePlanKey | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [pendingPlan, setPendingPlan] = useState<SubscribePlanKey | null>(null);

  const { data: challengeStatus } = useChallengeStatus();

  useEffect(() => {
    if (viewCaptured.current || !posthog) return;
    viewCaptured.current = true;
    posthog.capture("subscribe_page_view", { ref: searchParams.get("ref") ?? "" });
  }, [posthog, searchParams]);

  const handleCtaClick = (planKey: SubscribePlanKey) => {
    posthog?.capture("plan_cta_clicked", { plan: planKey });
    if (planKey === "explorer") {
      router.push(user ? "/courses" : "/signup");
      return;
    }
    if (challengeStatus?.is_waitlist_only) return;
    if (user) {
      setSelectedPlan(planKey);
    } else {
      setPendingPlan(planKey);
      setIsAuthModalOpen(true);
    }
  };

  const handlePaymentSuccess = () => {
    router.push("/courses?welcome=1");
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const auth = AuthService.getInstance();
      if (authMode === "signup") {
        await auth.signUp({
          email: authForm.email,
          password: authForm.password,
          username: authForm.email.split("@")[0],
          name: "User",
        });
      } else {
        await auth.signIn({ email: authForm.email, password: authForm.password });
      }
      setIsAuthModalOpen(false);
      if (pendingPlan) setSelectedPlan(pendingPlan);
    } catch (err: any) {
      setAuthError(err.message || "Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-14">

      {/* Header */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <h1 className="text-display-md sm:text-display-lg font-serif mb-6">
          Ready to start?
        </h1>
        <p className="text-muted-foreground text-base leading-relaxed max-w-lg mx-auto">
          I built this program because I went through the same thing you're going through.
          No one to show me. No resources in my language.
          If you do the work, I promise you'll get there.
          That's not marketing. That's a guarantee.
        </p>
      </section>

      {/* Plan cards */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
        {challengeStatus?.is_waitlist_only && (
          <div className="mb-8 p-4 rounded-[10px] border border-border bg-card text-center text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">This cohort is full.</span>{" "}
            Join the waitlist — you'll be notified when the next one opens. Same price.
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">

          {/* Explorer — free */}
          <div className="p-6 sm:p-8 rounded-[16px] border border-border bg-card flex flex-col">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">
              Self-Paced
            </p>
            <p className="text-3xl font-bold text-foreground mb-1">$49</p>
            <p className="text-sm text-muted-foreground mb-6">/ month</p>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Access to all course content",
                "Follow the plan at your own pace",
                "Community access (when active)",
                "No personal guarantee",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleCtaClick("explorer")}
              className="btn-ghost w-full"
            >
              Start free trial →
            </button>
          </div>

          {/* Challenge — recommended */}
          <div className="relative p-6 sm:p-8 rounded-[16px] border border-gold/40 bg-card flex flex-col">
            <span className="absolute -top-3 left-6 px-3 py-1 text-[10px] font-bold uppercase tracking-wide bg-gold text-black rounded-full">
              Recommended
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold mb-4">
              The Challenge
            </p>
            <p className="text-3xl font-bold text-foreground mb-1">$149</p>
            <p className="text-sm text-muted-foreground mb-1">one-time payment</p>
            <p className="text-sm font-medium text-gold mb-6">or 3 × $49/month</p>
            <ul className="space-y-3 mb-8 flex-1">
              {[
                "Full 60-day structured program",
                "Personal access to Shakuur",
                "Guarantee: first money in 30 days",
                "First client in 60 days — or I work with you free",
              ].map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                  <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => handleCtaClick("challenge")}
              disabled={challengeStatus?.is_waitlist_only}
              className={cn(
                "btn-gold w-full",
                challengeStatus?.is_waitlist_only && "opacity-50 cursor-not-allowed"
              )}
            >
              {challengeStatus?.is_waitlist_only ? "Buuxsamay" : "Ku soo biir Mentorship-ka →"}
            </button>
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          No hidden fees. No subscription trap. Pay once for the Challenge.
          Money-back if you do the work and it doesn't work.
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        <div className="divide-y divide-border border-t border-border">
          {SUBSCRIBE_FAQS.map((faq) => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </section>

      {/* Payment modal */}
      {selectedPlan && (
        challengeStatus?.is_waitlist_only ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <WaitlistForm />
          </div>
        ) : (
          <PaymentModal
            plan={PLANS[selectedPlan]}
            onClose={() => setSelectedPlan(null)}
            onSuccess={handlePaymentSuccess}
          />
        )
      )}

      {/* Auth modal */}
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent className="sm:max-w-md rounded-[16px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {authMode === "signup" ? "Create a free account" : "Log in to continue"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAuthSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="sub-email">Email</Label>
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
              <Label htmlFor="sub-password">Password</Label>
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
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-[10px]">
                {authError}
              </p>
            )}
            <Button type="submit" className="w-full h-12 font-bold rounded-[10px]" disabled={authLoading}>
              {authLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {authMode === "signup" ? "Continue →" : "Log in →"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {authMode === "signup" ? (
                <>Already have an account?{" "}
                  <button type="button" className="text-gold font-semibold hover:underline" onClick={() => setAuthMode("login")}>
                    Log in
                  </button>
                </>
              ) : (
                <>No account?{" "}
                  <button type="button" className="text-gold font-semibold hover:underline" onClick={() => setAuthMode("signup")}>
                    Sign up free
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
