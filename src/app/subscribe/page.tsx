"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { usePostHog } from "posthog-js/react";
import { PLANS, FAQ, type SubscribePlanKey } from "@/config/subscribePlans";
import { pricingTranslations as t } from "@/config/translations/pricing";
import PaymentModal from "@/components/PaymentModal";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { useAuthStore } from "@/store/useAuthStore";
import Logo from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import AuthService from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface LandingStats {
  students_count?: number;
  courses_count?: number;
}

interface FaqApiResponse {
  success?: boolean;
  faqs?: { id: number; question: string; answer: string }[];
}

function SubscribePageInner() {
  const [selectedPlan, setSelectedPlan] = useState<SubscribePlanKey | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [countdown, setCountdown] = useState<string>("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "login">("signup");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [pendingPlan, setPendingPlan] = useState<SubscribePlanKey | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  const viewCaptured = useRef(false);
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const planFromQuery = searchParams.get("plan") as SubscribePlanKey | null;
  const refParam = searchParams.get("ref") ?? "";

  const { data: stats, error: statsError } = useSWR<LandingStats>(
    `${API_BASE_URL}/api/public/landing-stats/`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 10 * 60 * 1000 }
  );

  const { data: challengeStatus, loading: challengeStatusLoading } = useChallengeStatus();

  const { data: faqApi } = useSWR<FaqApiResponse>(
    `${API_BASE_URL}/api/public/faqs/?placement=subscribe`,
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 120_000 }
  );

  const subscribeFaqs =
    mounted && faqApi?.faqs && faqApi.faqs.length > 0
      ? faqApi.faqs.map((f) => ({ key: `api-${f.id}`, q: f.question, a: f.answer }))
      : FAQ.map((item, i) => ({ key: `fallback-${i}`, ...item }));

  const refundFaq =
    subscribeFaqs.find((f) => /7 maalmood|lacag celin|diiwaangeli|qanacsan/i.test(f.a + f.q)) ??
    subscribeFaqs[2];

  const joinCount =
    mounted && typeof stats?.students_count === "number" && stats.students_count > 0
      ? stats.students_count
      : 500;

  useEffect(() => {
    const user = useAuthStore.getState().user;
    if (user?.is_premium && user?.subscription_type === "challenge") {
      router.replace("/post-verification-choice");
    }
  }, [router]);

  useEffect(() => {
    if (viewCaptured.current || !posthog) return;
    viewCaptured.current = true;
    posthog.capture("subscribe_page_view", { ref: refParam });
  }, [posthog, refParam]);

  useEffect(() => {
    if (planFromQuery !== "challenge") return;
    const el = document.getElementById(`plan-card-${planFromQuery}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [planFromQuery]);

  useEffect(() => {
    if (pathname !== "/subscribe" || typeof window === "undefined") return;
    const scrollToHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash !== "plan-card-challenge") return;
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    scrollToHash();
    const raf = requestAnimationFrame(scrollToHash);
    const t = window.setTimeout(scrollToHash, 200);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, [pathname]);

  // Countdown to webinar offer expiry
  useEffect(() => {
    const expiry = new Date("2026-04-01T00:00:00Z"); // Set to a past date to show "Ended" state

    const update = () => {
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown("Dhamaatay");
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(`${h}s ${m}m ${s}d`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const handlePaymentSuccess = (planKey: SubscribePlanKey) => {
    router.push(`/post-verification-choice?subscribed=${planKey}`);
  };

  const handleCtaClick = (planKey: SubscribePlanKey) => {
    if (user) {
      setSelectedPlan(planKey);
    } else {
      setPendingPlan(planKey);
      setIsAuthModalOpen(true);
    }
    posthog?.capture("plan_cta_clicked", { plan: planKey });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const authService = AuthService.getInstance();
          if (authMode === "signup") {
            await authService.signUp({
              email: authForm.email,
              password: authForm.password,
              username: authForm.email.split("@")[0],
              name: "User",
              age: 25,
              onboarding_data: {
                goal: "career",
                topic: "ai",
                math_level: "beginner",
                minutes_per_day: 30,
                preferred_study_time: "morning",
              },
            });
          } else {
        await authService.signIn({
          email: authForm.email,
          password: authForm.password,
        });
      }
      
      setIsAuthModalOpen(false);
      if (pendingPlan) {
        setSelectedPlan(pendingPlan);
      }
    } catch (err: any) {
      setAuthError(err.message || "Khalad ayaa dhacay. Fadlan isku day markale.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center py-1" aria-label="Garaad home">
            <Logo
              priority
              loading="eager"
              className="h-10 w-auto sm:h-11"
              sizes="(max-width: 640px) 140px, 180px"
            />
          </Link>
          <ThemeToggle />
        </div>
      </header>

       {/* Urgency banner */}
       <div className="max-w-2xl mx-auto mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center">
         <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
           {countdown === "Dhamaatay" 
             ? "⏰ Webinar-ka 'Freelancing in Somalia' waa dhamaaday" 
             : `⏰ Qiimaha webinar-ka wuxuu dhacayaa: ${countdown}`}
         </p>
         <p className="text-xs text-muted-foreground mt-1">
           {countdown === "Dhamaatay" 
             ? "Laakiin wali waad ku biiri kartaa barnaamijka" 
             : "$49/bilood halkii $149 hal mar"}
         </p>
       </div>


      <div className="px-4 py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary via-violet-600 to-primary bg-clip-text text-transparent">
            {t.pricing_title}
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
            {t.pricing_subtitle}
          </p>
        </div>

         <div className="text-center mb-8 sm:mb-10">
           <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-primary via-violet-600 to-primary bg-clip-text text-transparent">
             {t.pricing_title}
           </h1>
           <div className="flex items-center justify-center gap-2 mb-4">
             <div className="flex text-amber-400">
               {"★★★★★".split("").map((star, i) => <span key={i}>{star}</span>)}
             </div>
             <p className="text-sm text-muted-foreground">
               Ku biir 125+ oo horumariyiin ah
             </p>
           </div>
           <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed">
             {t.pricing_subtitle}
           </p>
         </div>


        {mounted && challengeStatus?.is_waitlist_only ? (
          <div className="max-w-xl mx-auto mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-center text-xs sm:text-sm leading-relaxed text-muted-foreground">
            <span className="font-semibold text-foreground">Kooxdan way buuxdaa.</span> Kooxda xigta marka la
            furayo waad ogeysiis heleysaa; qiimuhu waa isku mid.
          </div>
        ) : null}

         {refundFaq ? (
           <div className="max-w-2xl mx-auto mb-10 rounded-2xl border border-violet-500/25 bg-violet-500/5 px-5 py-4 text-left">
             <p className="text-xs font-bold uppercase tracking-wide text-violet-600 dark:text-violet-400 mb-1">
               Su&apos;aasha ugu muhiimsan
             </p>
             <p className="font-semibold text-foreground mb-2">{refundFaq.q}</p>
             <p className="text-sm text-foreground font-medium leading-relaxed">
               Haddii 30 maalmood gudahood aadan macmiil helin — aniga oo kaa caawiya — lacagtaada waan kuu celinnaa. Su&apos;aal la&apos;aan.
             </p>
           </div>
         ) : null}


        <div className="max-w-4xl mx-auto mb-5">
          {!mounted || (!stats && !statsError) ? (
            <div className="h-3 max-w-xs mx-auto rounded-full bg-muted/60" aria-hidden />
          ) : (
            <p className="text-center text-[11px] sm:text-xs text-muted-foreground/90 leading-snug">
              {t.subscribe_social_month.replace("{n}", String(joinCount))}
            </p>
          )}
        </div>

         {/* Challenge Plan Card */}
         <div className="max-w-3xl mx-auto mb-8 md:mb-10">
           <div
             id="plan-card-challenge"

            key="challenge"
            className={cn(
              "relative rounded-3xl border-2 p-8 sm:p-9 flex flex-col h-full",
              "border-violet-500/60 bg-gradient-to-br from-violet-700 via-primary to-purple-900 text-primary-foreground shadow-2xl shadow-violet-500/25",
              planFromQuery === "challenge" && "ring-2 ring-primary ring-offset-2 ring-offset-background"
            )}
          >
            {PLANS.challenge.badge && String(PLANS.challenge.badge).trim() !== "" ? (
              <span
                className="absolute -top-3 left-6 text-xs font-bold px-3 py-1 rounded-full shadow-sm bg-amber-400 text-amber-950"
              >
                ★ {PLANS.challenge.badge}
              </span>
            ) : null}

            <h2 className="text-xl font-bold mb-1 text-primary-foreground">
              {PLANS.challenge.name}
            </h2>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary-foreground/90">
              {t.plan_label_challenge}
            </p>

            <p className="text-sm mb-6 leading-relaxed text-primary-foreground/85">
              {PLANS.challenge.tagline}
            </p>

                <div className="mb-6">
                  <div className="flex items-end gap-1 flex-wrap">
                    <span className="text-5xl sm:text-6xl font-extrabold tabular-nums text-primary-foreground">
                      {PLANS.challenge.priceDisplay}
                    </span>
                    <span className="text-base mb-2 font-semibold text-primary-foreground/80">
                      {PLANS.challenge.per}
                    </span>
                  </div>
                  {PLANS.challenge.priceTotal ? (
                    <p className="mt-1 text-sm text-primary-foreground/75">
                      {PLANS.challenge.priceTotal}
                    </p>
                  ) : null}
                  {PLANS.challenge.installmentNote ? (
                    <p className="mt-2 text-base font-bold text-amber-300">
                      {PLANS.challenge.installmentNote}
                    </p>
                  ) : null}
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-500">
                    <span className="text-xs">✓</span> 100% Guaranteed · 7-Day Money Back
                  </div>
                </div>

            <ul className="space-y-3.5 mb-8 flex-1">
              {PLANS.challenge.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-snug">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold bg-primary-foreground/20 text-primary-foreground"
                  >
                    ✓
                  </span>
                  <span className="text-primary-foreground/90">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

                <button
                  type="button"
                  onClick={() => handleCtaClick("challenge")}
                  className="w-full py-5 rounded-xl font-black text-lg transition-all bg-primary-foreground text-primary shadow-xl hover:bg-primary-foreground/90 active:scale-[0.98]"
                >
                  Hada Bilow & Macmiilkaagii Ugu Horeeyay Hel
                </button>
           </div>
         </div>


        {/* Success Stories */}
        <TestimonialsSection />

        {/* FAQ */}

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-foreground mb-6 text-center">
            {t.faq_title}
          </h3>
           <div className="space-y-3">
             {subscribeFaqs.map((item, i) => (
               <div
                 key={item.key}
                 className="border border-border rounded-xl overflow-hidden bg-card"
               >
                 <button
                   type="button"
                   onClick={() => setOpenFaq(openFaq === i ? null : i)}
                   className="w-full text-left px-5 py-4 sm:py-4 font-medium text-card-foreground flex justify-between items-center gap-4 hover:bg-primary/5 transition-colors"
                 >
                   <span>{item.q}</span>
                   <span className="text-muted-foreground ml-4 shrink-0 tabular-nums w-6 text-center">
                     {openFaq === i ? "−" : "+"}
                   </span>
                 </button>
                 {openFaq === i && (
                   <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed">
                     {item.a}
                   </div>
                 )}
               </div>
             ))}
           </div>
         </div>

         <div className="max-w-md mx-auto mt-12 mb-12 text-center">
           <button
             type="button"
             onClick={() => handleCtaClick("challenge")}
             className="w-full py-4 rounded-xl font-bold text-base transition-all bg-primary-foreground text-primary shadow-lg hover:bg-primary-foreground/90"
           >
             Hadda bilow — $49 bishii →
           </button>
         </div>


         {selectedPlan && (
           <PaymentModal
             plan={PLANS[selectedPlan]}
             onClose={() => setSelectedPlan(null)}
             onSuccess={() => handlePaymentSuccess(selectedPlan)}
           />
         )}

         <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
           <DialogContent className="sm:max-w-md rounded-2xl">
             <DialogHeader>
               <DialogTitle className="text-2xl font-bold text-center">
                 {authMode === "signup" ? "Akoon bilaash ah samee" : "Soo gal akoonkaaga"}
               </DialogTitle>
               <p className="text-center text-muted-foreground mt-1">
                 {authMode === "signup" ? "1 daqiiqo — kadibna lacag-bixinta" : "Ku soo dhowow mar kale"}
               </p>
             </DialogHeader>
             <form onSubmit={handleAuthSubmit} className="space-y-4 py-4">
               <div className="space-y-2">
                 <Label htmlFor="auth-email">Email</Label>
                 <Input
                   id="auth-email"
                   type="email"
                   required
                   value={authForm.email}
                   onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                   placeholder="magaca@email.com"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="auth-password">Password</Label>
                 <Input
                   id="auth-password"
                   type="password"
                   required
                   value={authForm.password}
                   onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                   placeholder="******"
                 />
               </div>
               {authError && (
                 <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                   {authError}
                 </p>
               )}
               <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl" disabled={authLoading}>
                 {authLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                 {authMode === "signup" ? "Sii wad →" : "Soo gal →"}
               </Button>
               <div className="text-center text-sm text-muted-foreground mt-4">
                 {authMode === "signup" ? (
                   <p>
                     Horey u leedahay akoon?{" "}
                     <button
                       type="button"
                       className="text-primary font-bold hover:underline"
                       onClick={() => setAuthMode("login")}
                     >
                       Soo gal
                     </button>
                   </p>
                 ) : (
                   <p>
                     Ma haysid akoon?{" "}
                     <button
                       type="button"
                       className="text-primary font-bold hover:underline"
                       onClick={() => setAuthMode("signup")}
                     >
                       Sameyso mid cusub
                     </button>
                   </p>
                 )}
               </div>
             </form>
           </DialogContent>
         </Dialog>
       </div>
     </div>
   );
 }


function SubscribeFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="h-10 w-10 rounded-full border-2 border-muted border-t-primary animate-spin" />
    </div>
  );
}

export default function SubscribePage() {
  return (
    <Suspense fallback={<SubscribeFallback />}>
      <SubscribePageInner />
    </Suspense>
  );
}
