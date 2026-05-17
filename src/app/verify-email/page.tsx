"use client";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/constants";
import type React from "react";
import { usePostHog } from "posthog-js/react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isAllowedRedirect } from "@/lib/auth-redirect";

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");
  const posthog = usePostHog();
  const emailSentRef = useRef(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const REDIRECT_AFTER_VERIFY = "/courses/freelancing";

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam && emailParam.trim()) {
      setEmail(emailParam);
    } else {
      // Try localStorage first
      const storedEmail = localStorage.getItem("user");
      if (storedEmail) {
        try {
          const parsedEmail = JSON.parse(storedEmail);
          if (parsedEmail.email) {
            setEmail(parsedEmail.email);
            return;
          }
        } catch (e) {
          console.error("Failed to parse stored email", e);
        }
      }

      // Try to get email from AuthService as last resort
      const checkAuthService = async () => {
        const { default: AuthService } = await import('@/services/auth');
        const authService = AuthService.getInstance();
        const currentUser = authService.getCurrentUser();

        if (currentUser?.email) {
          setEmail(currentUser.email);
        } else {
          // No email found (e.g. returning user landed here directly). Send to login, not signup.
          console.log("No email found, redirecting to login");
          router.push('/login');
        }
      };

      checkAuthService();
    }
  }, [searchParams, router]);

  // Auto-send verification email when page loads and email is available
  useEffect(() => {
    if (!email || emailSentRef.current) return;
    emailSentRef.current = true;

    const sendInitialVerificationEmail = async () => {

      try {
        console.log("Sending initial verification email to:", email);

        const response = await fetch(
          `${API_BASE_URL}/api/auth/resend-verification/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        const data = await response.json();
        if (!response.ok) {
          // Check if the error is "Email is already verified"
          if (data.error === "Email is already verified" || data.detail === "Email is already verified") {
            console.log("Emailkaaga horey ayaa la xaqiijiyay");

            // Clear localStorage data
            if (typeof window !== 'undefined') {
              localStorage.removeItem('welcome_user_data');
              localStorage.removeItem('welcome_selections');
              localStorage.removeItem('welcome_current_step');
              localStorage.removeItem('welcome_topic_levels');
              localStorage.removeItem('welcome_selected_topic');
              localStorage.removeItem('user');
            }

            // Update user verification status and check premium status since email is already verified
            try {
              const { default: AuthService } = await import('@/services/auth');
              const authService = AuthService.getInstance();

              const updatedUserData = await authService.fetchAndUpdateUserData();

              if (updatedUserData) {
                // Check if user is premium
                if (updatedUserData.is_premium) {
                  window.location.href = REDIRECT_AFTER_VERIFY;
                } else {
                  // Free users can access lesson 1 + community; send them to courses
                  window.location.href = REDIRECT_AFTER_VERIFY;
                }
              } else {
                authService.updateEmailVerificationStatus(true);
                window.location.href = REDIRECT_AFTER_VERIFY;
              }
            } catch (userError) {
              console.error("Error fetching user data:", userError);
              const { default: AuthService } = await import('@/services/auth');
              const authService = AuthService.getInstance();
              authService.updateEmailVerificationStatus(true);
              window.location.href = REDIRECT_AFTER_VERIFY;
            }
            return;
          }
          console.error("Failed to send initial verification email:", data.error || data.detail);
          return;
        }

        setEmailSent(true);
      } catch (err) {
        console.error("Error sending initial verification email:", err);
      }
    };

    // Send email after a short delay to ensure email is set
    const timer = setTimeout(() => {
      sendInitialVerificationEmail();
    }, 500);

    return () => clearTimeout(timer);
  }, [email, router]);

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCodeDigits = [...codeDigits];
    newCodeDigits[index] = value;
    setCodeDigits(newCodeDigits);

    // Auto-focus next input
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").slice(0, 6);
    const pasteArray = pasteData.split("");
    const newCodeDigits = [...codeDigits];

    pasteArray.forEach((char, i) => {
      if (i < 6 && /^\d$/.test(char)) {
        newCodeDigits[i] = char;
      }
    });

    setCodeDigits(newCodeDigits);
    const nextEmpty = newCodeDigits.findIndex((d) => d === "");
    if (nextEmpty !== -1) {
      inputsRef.current[nextEmpty]?.focus();
    } else {
      inputsRef.current[5]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codeDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const verificationCode = codeDigits.join("");

    if (verificationCode.length !== 6) {
      setError("Fadlan geli koodka 6-xarafka ah");
      return;
    }

    if (!email) {
      setError(
        "Email address waa maqan tahay. Fadlan isku day inaad mar kale isdiiwaangeliso."
      );
      return;
    }

    try {
      setIsVerifying(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/verify-email/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: verificationCode }),
        }
      );

      const data = await response.json();

      // Check if email is already verified - treat this as success
      if (!response.ok && (data.error === "Email-kan mar hore ayaa la xaqiijiyay." || data.error === "Email is already verified")) {
        console.log("Emailkaaga horey ayaa la xaqiijiyay - redirecting...");

        // Clear localStorage data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('welcome_user_data');
          localStorage.removeItem('welcome_selections');
          localStorage.removeItem('welcome_current_step');
          localStorage.removeItem('welcome_topic_levels');
          localStorage.removeItem('welcome_selected_topic');
          localStorage.removeItem('user');
        }

        // Fetch user data and redirect
        try {
          const { default: AuthService } = await import('@/services/auth');
          const authService = AuthService.getInstance();
          await authService.fetchAndUpdateUserData();
        } catch (e) {
          console.error("Failed to fetch user:", e);
        }

        window.location.href = REDIRECT_AFTER_VERIFY;
        return;
      }

      if (!response.ok) throw new Error(data.error || "Verification failed");

      // Success state - update user's email verification status
      console.log("Emailkaaga waa la xaqiijiyay!");

      // Clear localStorage data after successful verification
      if (typeof window !== 'undefined') {
        localStorage.removeItem('welcome_user_data');
        localStorage.removeItem('welcome_selections');
        localStorage.removeItem('welcome_current_step');
        localStorage.removeItem('welcome_topic_levels');
        localStorage.removeItem('welcome_selected_topic');
        localStorage.removeItem('user');
      }

      // Update email verification status
      const { default: AuthService } = await import('@/services/auth');
      const authService = AuthService.getInstance();
      try {
        await authService.fetchAndUpdateUserData();
      } catch (e) {
        console.error("Failed to fetch user data:", e);
      }

      posthog?.capture("email_verified", { email });

      window.location.href = REDIRECT_AFTER_VERIFY;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";

      posthog?.capture("email_verification_failed", { error: errorMessage.slice(0, 120), email });
      setError(errorMessage);

    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    posthog?.capture("email_verification_resend_clicked", { email });
    setError(null);

    if (!email) {
      setError(
        "Email address waa maqan tahay. Fadlan isku day inaad mar kale isdiiwaangeliso."
      );
      return;
    }

    try {
      setIsResending(true);

      const response = await fetch(
        `${API_BASE_URL}/api/auth/resend-verification/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        // Check if the error is "Email is already verified"
        if (data.error === "Email is already verified" || data.detail === "Email is already verified") {
          console.log("Emailkaaga horey ayaa la xaqiijiyay");

          // Clear localStorage data
          if (typeof window !== 'undefined') {
            localStorage.removeItem('welcome_user_data');
            localStorage.removeItem('welcome_selections');
            localStorage.removeItem('welcome_current_step');
            localStorage.removeItem('welcome_topic_levels');
            localStorage.removeItem('welcome_selected_topic');
            localStorage.removeItem('user');
          }

          // Update user verification status and check premium status since email is already verified
          try {
            const { default: AuthService } = await import('@/services/auth');
            const authService = AuthService.getInstance();

            const updatedUserData = await authService.fetchAndUpdateUserData();

            if (updatedUserData) {
              window.location.href = REDIRECT_AFTER_VERIFY;
            } else {
              authService.updateEmailVerificationStatus(true);
              window.location.href = REDIRECT_AFTER_VERIFY;
            }
          } catch (userError) {
            console.error("Error fetching user data:", userError);
            const { default: AuthService } = await import('@/services/auth');
            const authService = AuthService.getInstance();
            authService.updateEmailVerificationStatus(true);
            window.location.href = REDIRECT_AFTER_VERIFY;
          }
          return;
        }
        throw new Error(data.error || data.detail || "Failed to resend code");
      }

      setCodeDigits(Array(6).fill(""));
      setEmailSent(true);
      setError(null);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send verification code";

      setError(errorMessage);

    } finally {
      setIsResending(false);
    }
  };

  const handleGoBackToRegistration = () => {
    const r = searchParams.get("redirect");
    if (r && isAllowedRedirect(r)) {
      router.push(`/welcome?redirect=${encodeURIComponent(r)}`);
      return;
    }
    router.push("/welcome");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-primary/10 p-3 rounded-full">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Xaqiiji Email-kaaga</CardTitle>
          <CardDescription>
            Geli koodka 6-xarafka ah ee ku soo dirnay {email || "email-kaaga"}
          </CardDescription>
          <p className="text-sm text-gray-600 mt-2">
            Koodka wuxuu ku soo dirnay emailkaaga markii aad isdiiwaangelisay. Haddii aadan helin, fadlan riix &quot;Dib u dir koodka&quot;.
          </p>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6 animate-in fade-in">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="verificationCode" className="sr-only">
                Koodka Xaqiijinta
              </Label>
              <div className="flex gap-2 justify-center">
                {codeDigits.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputsRef.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    disabled={isVerifying || isResending}
                    className="w-12 h-14 text-center text-xl font-semibold border-2 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 font-medium"
              disabled={isVerifying || codeDigits.join("").length !== 6}
            >
              {isVerifying ? "Xaqiijinayo... " : "Xaqiiji Email"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          {emailSent && (
            <div className="flex items-start gap-2 w-full rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-800">
              <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-green-600" />
              <span>Koodka waa la diray <strong>{email}</strong>. Fadlan hubi inbox-kaaga.</span>
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full h-10"
            onClick={handleResendCode}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Diraya koodka markale...
              </>
            ) : (
              "Dib u dir koodka"
            )}
          </Button>

          <div className="text-center">
            <button
              onClick={handleGoBackToRegistration}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Dib ugu noqo diiwaangelinta
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
