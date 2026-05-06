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
      {/* Header - improved UI */}
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

      {/* Plan card - improved UI */}
      <section className="max-w-md mx-auto px-4 sm:px-6 pb-16">
        {challengeStatus?.is_waitlist_only ? (
          <div className="p-6 rounded-2xl border border-border bg-card text-center">
            <p className="text-lg font-semibold text-foreground mb-2">Kooxda way buuxdaa</p>
            <p className="text-sm text-muted-foreground mb-4">Geli liiska si aad u hesho kooxda xigta.</p>
            <button type="button" className="btn-ghost w-full">Geli Liiska →</button>
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
              Ku soo biir Mentorship-ka →
            </button>
          </div>
        )}

        {/* Trust line */}
        <p className="text-center mt-6 text-sm text-muted-foreground">
          Hal mar bixin. 30-maalmood dammaanad lacag-celin.
        </p>
      </section>

      {/* FAQ */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">
        <h2 className="text-lg font-bold text-center mb-6">Su'aalaha Inta Badan La Iska Weydiiyo</h2>
        <div className="space-y-4">
          <FaqItem q="Runtii ma jirtaa dammaanad lacag-celin ah?" a="Haa. Haddii aad raacdo qorshaha oo aad lacag kasban waydo muddo 30 casho ah, si shakhsi ah ayaan kula shaqaynayaa ilaa aad ka guulaysato. Haddii intaas ka dib aad wali ku qanci waydo, lacagtaada ayaan kuu soo celinayaa." />
          <FaqItem q="Waa maxay farqiga u dhexeeya Explorer iyo Mentorship?" a="Explorer wuxuu ku siinayaa fursad aad casharrada oo dhan ku baran karto xawaarahaaga gaarka ah. Mentorship waa barnaamij habaysan oo 60 casho ah, xidhiidh toos ah oo Shakuur, iyo dammaanad dakhli." />
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
