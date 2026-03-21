"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import AuthService from "@/services/auth";
import { API_BASE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const SESSION_DISMISS_KEY = "garaad_email_verify_banner_dismissed";

export function EmailVerificationBanner() {
  const storeUser = useAuthStore((s) => s.user);
  const [dismissed, setDismissed] = useState(true);
  const [sending, setSending] = useState(false);

  const authUser =
    typeof window !== "undefined"
      ? AuthService.getInstance().getCurrentUser()
      : null;
  const user = storeUser || authUser;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(sessionStorage.getItem(SESSION_DISMISS_KEY) === "1");
  }, []);

  if (!user?.email || user.is_email_verified !== false || dismissed) return null;

  const email = user.email;

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_DISMISS_KEY, "1");
    setDismissed(true);
  };

  const handleResend = async () => {
    setSending(true);
    try {
      await fetch(`${API_BASE_URL}/api/auth/resend-verification/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={cn(
        "relative sticky top-0 z-[60] border-b border-amber-500/35 bg-amber-950/90 backdrop-blur-md",
        "text-amber-50 shadow-sm"
      )}
      role="status"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-start gap-3">
        <button
          type="button"
          onClick={handleDismiss}
          className="shrink-0 p-1 rounded-lg text-amber-300/80 hover:text-white hover:bg-white/10 mt-0.5"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-sm leading-snug flex-1 min-w-0 pt-0.5">
          <span className="font-medium text-amber-100">
            Xaqiiji email-kaaga si aad u badbaadiso horumarka
          </span>
          <span className="text-amber-200/90"> — Check your inbox</span>
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="h-9 rounded-lg bg-amber-100 text-amber-950 hover:bg-amber-50 border-0"
            disabled={sending}
            onClick={handleResend}
          >
            {sending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Diraya…
              </>
            ) : (
              "Resend email"
            )}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-9 text-amber-200 hover:text-white hover:bg-white/10"
            asChild
          >
            <Link href={`/verify-email?email=${encodeURIComponent(email)}`}>
              Xaqiiji
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
