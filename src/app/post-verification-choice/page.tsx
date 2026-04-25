"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import AuthService from "@/services/auth";

export default function PostVerificationChoicePage() {
  const [waitlist, setWaitlist] = useState(false);
  const posthog = usePostHog();
  const [postSignupDest, setPostSignupDest] = useState("/subscribe");

  useEffect(() => {
    posthog?.capture("post_verification_choice_page_viewed");

    const fetchUser = async () => {
      const auth = AuthService.getInstance();
      const user = auth.getCurrentUser();
      if (user?.email) {
        try {
          const res = await fetch(`${API_BASE_URL}/api/auth/me/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
            },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.is_premium) {
              setPostSignupDest("/courses");
            }
          }
        } catch {
          // Use default
        }
      }
    };
    fetchUser();
  }, [posthog]);

  return (
    <main className="flex flex-1 flex-col justify-center pb-8">
      <Card className="w-full overflow-hidden rounded-3xl border border-border/80 bg-card/90 shadow-xl shadow-violet-500/[0.07] ring-1 ring-black/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-slate-900/75 dark:shadow-black/40 dark:ring-white/10">
        <CardContent className="space-y-4 p-4 text-center sm:space-y-5 sm:p-6 md:text-left">
          <div className="mx-auto flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 md:mx-0">
            <Sparkles className="size-5" aria-hidden />
          </div>
          {waitlist && (
            <p className="text-sm text-muted-foreground">
              Cohort-ka hadda waa buuxaa — markii kan xiga uu furmo adiga ayaa noqon doona qofka ugu horreeya ee lala soo xiriiro.
            </p>
          )}

          <div className="rounded-xl border border-violet-200/50 bg-violet-50/40 p-3 dark:border-violet-500/20 dark:bg-violet-500/10 sm:rounded-2xl sm:p-4">
            <h3 className="text-sm font-semibold text-foreground sm:text-base">
              Tallaabadaada xigta: Dooro sida aad rabto inaad ku bilaubto
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Waxaad leedahay laba waddo: in mentor uu tallaabo-tallaabo kuu haggo, ama inaad koorsooyinka ku bilaubto lacag la&apos;aan.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            <div className="relative rounded-xl border-2 border-violet-500/60 bg-violet-50/50 p-3 dark:bg-violet-500/10 sm:rounded-2xl sm:p-4">
              <span className="absolute -top-2.5 left-3 rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                Lagu taliyay
              </span>
              <h4 className="mt-1 text-sm font-semibold text-foreground sm:text-sm">
                1) Qabso Ballan — Mentor 1:1
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                Ha kuu hanuuniyo mentor qorshaha kugu habboon — si bilaash ah.
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-300 sm:text-xs">
                Maxaad helaysaa
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground sm:text-sm">
                <li>✓ Qiimeyn 1:1 ah si loo ogaado heerkaaga</li>
                <li>✓ Qorshe adiga kuu gaar ah oo ku salaysan hadafkaaga</li>
                <li>✓ Tallaabo koowaad oo cad oo aad ku bilaubto</li>
              </ul>
              <Button
                asChild
                className="mt-3 h-10 w-full rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-purple-500 sm:mt-4 sm:h-11"
              >
                <Link
                  href="https://cal.com/garaad/assessment"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Qabso Ballan →
                </Link>
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-background/80 p-3 sm:rounded-2xl sm:p-4">
              <h4 className="text-sm font-semibold text-foreground">
                2) Bilow Koorsooyin Bilaash ah
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground sm:text-sm">
                Way fiican tahay haddii aad rabto inaad hadda bilowdo adigoon sugin.
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:text-violet-200 sm:text-xs">
                Maxaad helaysaa
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground sm:text-sm">
                <li>✓ Koorsooyin bilaash ah oo diyaarsan isla hadda</li>
                <li>✓ Waddada cad oo aad ku dhisato aasaaskaaga</li>
                <li>✓ Waxaad qabsan kartaa qiimeyn waqti kasta</li>
              </ul>
              <Button
                asChild
                variant="outline"
                className="mt-3 h-10 w-full rounded-xl border-violet-200 bg-violet-50/70 text-sm font-semibold text-violet-700 hover:bg-violet-100 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-200 dark:hover:bg-violet-500/20 sm:mt-4 sm:h-11"
              >
                <Link
                  href={postSignupDest}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("post_signup_redirect", postSignupDest);
                    }
                  }}
                >
                  Bilow Koorsooyinka →
                </Link>
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </main>
  );
}