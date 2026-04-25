"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  Suspense,
  useCallback,
} from "react";
import type { FormEvent } from "react";
import { usePostHog } from "posthog-js/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import AuthService from "@/services/auth";
import type { SignUpData } from "@/services/auth";
import { validateEmail } from "@/lib/email-validation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { isAllowedRedirect } from "@/lib/auth-redirect";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { identifyUser } from "@/providers/PostHogProvider";

const WELCOME_STORAGE_KEY = "welcome_onboarding_v2";
const SIGNUP_DEFAULT_AGE = 18;

type Phase = "signup" | "verify_email";

function buildOnboardingPayload() {
  return {
    goal: "get_hired",
    topic: "fullstack",
    math_level: "beginner",
    minutes_per_day: 15,
    preferred_study_time: "flexible",
    learning_approach: "Waxbarasho shaqsiyeed",
    learning_goal: "15_min",
    project_idea: "portfolio",
    project_description: null,
    experience: "first_time",
    barrier: null,
    wizard_progress: {},
  };
}

function clearWelcomeStorage() {
  if (typeof window === "undefined") return;
  [
    WELCOME_STORAGE_KEY,
    "welcome_user_data",
    "welcome_selections",
    "welcome_current_step",
    "welcome_topic_levels",
    "welcome_selected_topic",
    "user",
  ].forEach((k) => localStorage.removeItem(k));
}

function WelcomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postAuthRedirect = useMemo(() => {
    const r = searchParams.get("redirect");
    return isAllowedRedirect(r) ? r : null;
  }, [searchParams]);

  const [phase, setPhase] = useState<Phase>("signup");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    promoCode: "",
  });
  const [actualError, setActualError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [redirecting, setRedirecting] = useState(false);
  const [postSignupDest, setPostSignupDest] = useState("/courses");
  const [verifyCode, setVerifyCode] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([
    null, null, null, null, null, null,
  ]);

  const posthog = usePostHog();
  const emailSentRef = useRef(false);
  const {
    error: authStoreError,
    setError: setAuthStoreError,
    setUser: setAuthStoreUser,
  } = useAuthStore();

  // Redirect authenticated users to /courses
  useEffect(() => {
    const auth = AuthService.getInstance();
    if (!auth.isAuthenticated()) return;
    setRedirecting(true);
    router.replace("/courses");
  }, [router]);

  useEffect(() => {
    if (authStoreError) setAuthStoreError(null);
  }, [authStoreError, setAuthStoreError]);

  // Track phase transitions so we can see signup_form_viewed vs verify_email_viewed
  useEffect(() => {
    const stepNumber = phase === "signup" ? 1 : 2;
    posthog?.capture(
      phase === "signup" ? "welcome_signup_form_viewed" : "welcome_verify_email_viewed"
    );
    posthog?.capture("welcome_step_viewed", { step: stepNumber, step_name: phase });
  }, [phase, posthog]);

  useEffect(() => {
    if (!isLoading) {
      setLoadingPhase(0);
      return;
    }
    setLoadingPhase(1);
    const t2 = window.setTimeout(() => setLoadingPhase(2), 1500);
    const t3 = window.setTimeout(() => setLoadingPhase(3), 3000);
    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isLoading]);

  const validateForm = (): string | null => {
    if (!userData.name.trim()) return "Meeshan waa qasab in la buuxiyo.";
    if (!userData.email.trim()) return "Meeshan waa qasab in la buuxiyo.";
    if (!userData.password.trim()) return "Meeshan waa qasab in la buuxiyo.";
    const ev = validateEmail(userData.email);
    if (!ev.isValid) return "Fadlan geli email sax ah.";
    if (userData.password.length < 8)
      return "Password-ku waa inuu ka koobnaadaa ugu yaraan 8 xaraf.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setActualError("");
    const v = validateForm();
    if (v) {
      setActualError(v);
      return;
    }
    posthog?.capture("signup_submitted", { method: "email" });
    setIsLoading(true);
    setAuthStoreError(null);
    try {
      const onboarding_data = buildOnboardingPayload();
      const signUpData: SignUpData = {
        email: userData.email.trim(),
        password: userData.password.trim(),
        name: userData.name.trim(),
        username: userData.email.trim(),
        age: SIGNUP_DEFAULT_AGE,
        onboarding_data,
        ...(userData.promoCode ? { promo_code: userData.promoCode.trim() } : {}),
      };
      const result = await AuthService.getInstance().signUp(signUpData);
      if (result?.user) {
        setAuthStoreUser({ ...result.user, is_premium: result.user.is_premium || false });
        identifyUser({ id: result.user.id, email: result.user.email, name: result.user.name });
      }
      if (result) {
        const finalDest =
          (postAuthRedirect?.startsWith("/") ? postAuthRedirect : null) ||
          (result.redirect_url?.startsWith("/") ? result.redirect_url : null) ||
          "/courses";
        setPostSignupDest(finalDest);
        posthog?.capture("onboarding_completed");
        clearWelcomeStorage();

        if (emailSentRef.current) {
          setPhase("verify_email");
          return;
        }
        emailSentRef.current = true;

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userData.email.trim() }),
          }
        );

        setPhase("verify_email");
      }
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "";
      const emailTaken =
        errMsg.includes("Email-kan waa la isticmaalay") ||
        errMsg.includes("email:") ||
        errMsg.toLowerCase().includes("already") ||
        errMsg.includes("already exists");
      if (emailTaken) {
        posthog?.capture("signup_failed", { reason: "email_taken" });
        setActualError(
          "Email-kan account ayaa horay loogu sameeyay. Ma doonaysaa inaad gasho (sign in)?"
        );
        return;
      }
      posthog?.capture("signup_failed", { reason: errMsg.slice(0, 120) });
      setActualError(
        error instanceof Error
          ? error.message
          : "Waxbaa khaldamay. Fadlan mar kale isku day."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setActualError("");
      setIsLoading(true);
      setAuthStoreError(null);
      try {
        const onboarding_data = buildOnboardingPayload();
        const result = await AuthService.getInstance().signInWithGoogle({
          credential,
          onboarding_data,
          ...(userData.promoCode.trim()
            ? { promo_code: userData.promoCode.trim() }
            : {}),
        });
        if (result?.user) {
          setAuthStoreUser({
            ...result.user,
            is_premium: result.user.is_premium || false,
          });
          identifyUser({ id: result.user.id, email: result.user.email, name: result.user.name });
        }
        const finalDest =
          (postAuthRedirect?.startsWith("/") ? postAuthRedirect : null) ||
          (result?.redirect_url?.startsWith("/") ? result.redirect_url : null) ||
          "/courses";
        clearWelcomeStorage();
        posthog?.capture("onboarding_completed", { source: "google_gis" });
        router.replace(finalDest);
      } catch (error: unknown) {
        setActualError(
          error instanceof Error
            ? error.message || "Google ma guulaysan. Fadlan isku day email/password."
            : "Waxbaa khaldamay. Fadlan mar kale isku day."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [userData.promoCode, postAuthRedirect, posthog, setAuthStoreUser, router, setAuthStoreError]
  );

  // ── Loading / redirect spinner ────────────────────────────────────────────
  if (redirecting) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
          aria-hidden
        />
        <Loader2 className="relative z-10 size-10 animate-spin text-violet-600 dark:text-violet-400" />
      </div>
    );
  }

  // ── Email OTP verification ────────────────────────────────────────────────
  if (phase === "verify_email") {
    const verifyEmail =
      userData.email ||
      AuthService.getInstance().getCurrentUser()?.email ||
      "";
    const otpDigits = Array.from({ length: 6 }, (_, i) => verifyCode[i] ?? "");

    const submitCode = async (code: string) => {
      if (code.trim().length < 6) return;
      setActualError("");
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: verifyEmail, code: code.trim() }),
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        await AuthService.getInstance().fetchAndUpdateUserData();
        const updated = AuthService.getInstance().getCurrentUser();
        if (updated)
          setAuthStoreUser({ ...updated, is_premium: updated.is_premium || false });
        posthog?.capture("email_verified");
        router.replace(postSignupDest);
      } catch (e) {
        posthog?.capture("email_verification_failed", {
          error: e instanceof Error ? e.message : "unknown",
        });
        setActualError(
          e instanceof Error ? e.message : "Waxbaa khaldamay. Mar kale isku day."
        );
        setVerifyCode("");
        otpInputRefs.current[0]?.focus();
      } finally {
        setIsLoading(false);
      }
    };

    const handleOtpChange = (index: number, value: string) => {
      const digit = value.replace(/\D/g, "").slice(-1);
      const arr = Array.from({ length: 6 }, (_, i) => verifyCode[i] ?? "");
      arr[index] = digit;
      const next = arr.join("");
      setVerifyCode(next);
      if (digit && index < 5) otpInputRefs.current[index + 1]?.focus();
      if (digit && index === 5 && arr.every((d) => d !== ""))
        void submitCode(next);
    };

    const handleOtpKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Backspace") {
        const arr = Array.from({ length: 6 }, (_, i) => verifyCode[i] ?? "");
        if (arr[index]) {
          arr[index] = "";
          setVerifyCode(arr.join(""));
        } else if (index > 0) {
          arr[index - 1] = "";
          setVerifyCode(arr.join(""));
          otpInputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    };

    const handleOtpPaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (!pasted) return;
      setVerifyCode(pasted.padEnd(6, "").slice(0, 6));
      otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
      if (pasted.length === 6) void submitCode(pasted);
    };

    const handleResend = async () => {
      posthog?.capture("email_verification_resend_clicked");
      setActualError("");
      setIsLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: verifyEmail }),
          }
        );
        if (!res.ok) throw new Error("Failed");
        setVerifyCode("");
        otpInputRefs.current[0]?.focus();
      } catch {
        setActualError("Waxbaa khaldamay. Mar kale isku day.");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-foreground dark:bg-slate-950">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-5 py-8">
          <Link href="/" className="mb-8">
            <Logo priority loading="eager" className="h-8" />
          </Link>
          <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
            <Mail className="size-10 text-white" strokeWidth={1.5} />
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold tracking-tight text-foreground">
            Xaqiiji Email-kaaga
          </h2>
          <p className="mb-1 text-center text-sm text-muted-foreground">
            Koodhka 6-lambareed waxaa loo diray:
          </p>
          <p className="mb-8 text-center text-sm font-semibold text-violet-600 dark:text-violet-400">
            {verifyEmail}
          </p>
          <div className="mb-6 flex gap-2.5" onPaste={handleOtpPaste}>
            {otpDigits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => {
                  otpInputRefs.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit === " " ? "" : digit}
                disabled={isLoading}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onFocus={(e) => e.target.select()}
                className={cn(
                  "h-14 w-11 rounded-xl border-2 bg-card text-center text-xl font-bold text-foreground shadow-sm outline-none transition-all dark:bg-slate-900",
                  digit && digit !== " "
                    ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300"
                    : "border-border focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                )}
              />
            ))}
          </div>
          {actualError && (
            <Alert variant="destructive" className="mb-4 rounded-xl">
              <AlertDescription>{actualError}</AlertDescription>
            </Alert>
          )}
          <Button
            onClick={() => void submitCode(verifyCode)}
            disabled={isLoading || verifyCode.replace(/\s/g, "").length < 6}
            className="mb-4 h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Xaqiiji & Sii wad →"
            )}
          </Button>
          <button
            type="button"
            onClick={() => void handleResend()}
            disabled={isLoading}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
          >
            Koodhka ma heshay?{" "}
            <span className="font-semibold text-violet-600 dark:text-violet-400">
              Dir mar kale
            </span>
          </button>
        </div>
      </div>
    );
  }

  // ── Signup form ───────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 text-foreground dark:bg-slate-950">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.22),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.35),transparent)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-32 right-0 h-[28rem] w-[28rem] rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-24 h-[24rem] w-[24rem] rounded-full bg-purple-400/20 blur-3xl dark:bg-fuchsia-600/15"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-lg flex-col px-4 py-8 sm:py-12">
        <header className="mb-8 flex flex-col items-center gap-4">
          <Link
            href="/"
            className="rounded-2xl outline-offset-4 transition-opacity hover:opacity-90"
          >
            <Logo priority loading="eager" className="h-10" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 shrink-0" aria-hidden />
            Dib u laabo 
          </Link>
        </header>

        <Card className="w-full overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl shadow-violet-500/[0.07] ring-1 ring-black/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/75 dark:shadow-black/40 dark:ring-white/10">
          <CardContent className="p-6 sm:p-8">
            <h2 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
              Sameyso Account
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              Bilow safarkaaga maanta.
            </p>

            {/* Google sign-in — always at the top */}
            <GoogleSignInButton
              disabled={isLoading}
              onCredential={(c) => void handleGoogleCredential(c)}
            />

            {/* Divider */}
            <div className="relative my-5 text-center text-xs font-medium text-muted-foreground">
              <span className="relative z-10 bg-card px-3">ama isticmaal email</span>
              <span
                className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-border"
                aria-hidden
              />
            </div>

            {actualError && (
              <Alert
                variant="destructive"
                className="mb-5 rounded-2xl border-red-200/80 bg-red-50/90 dark:border-red-900/50 dark:bg-red-950/40"
              >
                <AlertTitle className="font-semibold">Khalad</AlertTitle>
                <AlertDescription className="text-pretty">
                  {actualError}
                  {actualError.includes("sign in") && (
                    <div className="mt-2">
                      <Link
                        href="/login"
                        className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
                      >
                        Soo gal
                      </Link>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <Label
                  htmlFor="name"
                  className="text-sm font-semibold text-foreground"
                >
                  Magacaaga oo buuxa
                </Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) =>
                    setUserData((u) => ({ ...u, name: e.target.value }))
                  }
                  disabled={isLoading}
                  className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-foreground"
                >
                  Email-kaaga
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData((u) => ({ ...u, email: e.target.value }))
                  }
                  disabled={isLoading}
                  className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-foreground"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData((u) => ({ ...u, password: e.target.value }))
                  }
                  disabled={isLoading}
                  className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="promoCode"
                  className="text-sm font-medium text-muted-foreground"
                >
                  Koodka Dalacsiinta (Ikhtiyaari)
                </Label>
                <Input
                  id="promoCode"
                  value={userData.promoCode}
                  onChange={(e) =>
                    setUserData((u) => ({ ...u, promoCode: e.target.value }))
                  }
                  disabled={isLoading}
                  className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-shadow focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 dark:bg-slate-800/60"
                />
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 p-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked
                  readOnly
                  className="mt-1 h-4 w-4 cursor-default rounded border-border"
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-relaxed text-muted-foreground"
                >
                  Wan aqbalay{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
                  >
                    shuruudaha Garaad
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {loadingPhase <= 1
                      ? "Account-kaaga..."
                      : loadingPhase === 2
                        ? "Waddadaada..."
                        : "Waxyar ayaa ka haray..."}
                  </span>
                ) : (
                  "Sameyso account-kayga →"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Horey ma uu kuu jiraan akoon?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-violet-600 hover:underline dark:text-violet-400"
                >
                  Soo gal
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function WelcomePageWrapper() {
  return (
    <Suspense>
      <WelcomePage />
    </Suspense>
  );
}
