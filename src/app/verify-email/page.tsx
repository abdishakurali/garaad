"use client";
import { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "@/lib/constants";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowLeft,
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

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [email, setEmail] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    } else {
      const storedEmail = localStorage.getItem("user");
      if (storedEmail) {
        try {
          const parsedEmail = JSON.parse(storedEmail);
          setEmail(parsedEmail.email);
        } catch (e) {
          console.error("Failed to parse stored email", e);
        }
      }
    }
  }, [searchParams]);

  // Auto-send verification email when page loads and email is available
  useEffect(() => {
    const sendInitialVerificationEmail = async () => {
      if (!email) return;

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

              const accessToken = localStorage.getItem('accessToken') || '';
              const updatedUserData = await authService.fetchAndUpdateUserData(accessToken);

              if (updatedUserData) {
                // Check if user is premium
                if (updatedUserData.is_premium) {
                  // User is premium, redirect to courses
                  router.push("/courses");
                } else {
                  // User is not premium, redirect to subscribe
                  router.push("/subscribe");
                }
              } else {
                // Fallback: manually update email verification and redirect to subscribe
                authService.updateEmailVerificationStatus(true);
                router.push("/subscribe");
              }
            } catch (userError) {
              console.error("Error fetching user data:", userError);
              // Fallback: manually update email verification and redirect to subscribe
              const { default: AuthService } = await import('@/services/auth');
              const authService = AuthService.getInstance();
              authService.updateEmailVerificationStatus(true);
              router.push("/subscribe");
            }
            return;
          }
          console.error("Failed to send initial verification email:", data.error || data.detail);
          return;
        }

        console.log("Number sireed ayaa loo diray. Fadlan hubi email-kaaga koodka xaqiijinta");
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
      if (!response.ok) throw new Error(data.error || "Verification failed");

      // Success state - update user's email verification status and check premium status
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

      // Import AuthService and update user data
      const { default: AuthService } = await import('@/services/auth');
      const authService = AuthService.getInstance();

      // Fetch and update user data from backend
      try {
        const updatedUserData = await authService.fetchAndUpdateUserData(data.access || data.token);

        if (updatedUserData) {
          // Check if user is premium
          if (updatedUserData.is_premium) {
            // User is premium, redirect to courses
            router.push("/courses");
          } else {
            // User is not premium, redirect to subscribe
            router.push("/subscribe");
          }
        } else {
          // Fallback: manually update email verification and redirect to subscribe
          authService.updateEmailVerificationStatus(true);
          router.push("/subscribe");
        }
      } catch (userError) {
        console.error("Error fetching user data:", userError);
        // Fallback: manually update email verification and redirect to subscribe
        authService.updateEmailVerificationStatus(true);
        router.push("/subscribe");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";

      setError(errorMessage);

    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
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
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-verification/`,
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

            const accessToken = localStorage.getItem('accessToken') || '';
            const updatedUserData = await authService.fetchAndUpdateUserData(accessToken);

            if (updatedUserData) {
              // Check if user is premium
              if (updatedUserData.is_premium) {
                // User is premium, redirect to courses
                router.push("/courses");
              } else {
                // User is not premium, redirect to subscribe
                router.push("/subscribe");
              }
            } else {
              // Fallback: manually update email verification and redirect to subscribe
              authService.updateEmailVerificationStatus(true);
              router.push("/subscribe");
            }
          } catch (userError) {
            console.error("Error fetching user data:", userError);
            // Fallback: manually update email verification and redirect to subscribe
            const { default: AuthService } = await import('@/services/auth');
            const authService = AuthService.getInstance();
            authService.updateEmailVerificationStatus(true);
            router.push("/subscribe");
          }
          return;
        }
        throw new Error(data.error || data.detail || "Failed to resend code");
      }

      console.log("Number sireed cusub ayaa loo diray");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send verification code";

      setError(errorMessage);

    } finally {
      setIsResending(false);
    }
  };

  const handleGoBackToRegistration = () => {
    // Navigate back to welcome page - the form data will be automatically restored
    // from localStorage when the welcome page loads
    router.push('/welcome');
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
          <div className="text-center text-sm text-muted-foreground">
            Ma heshin koodka?{" "}
            <button
              type="button"
              onClick={handleResendCode}
              className="text-primary font-medium hover:underline disabled:opacity-50 transition-colors"
              disabled={isResending}
            >
              {isResending ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Diraya koodka markale...
                </span>
              ) : (
                "Dib u dir koodka"
              )}
            </button>
          </div>

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
