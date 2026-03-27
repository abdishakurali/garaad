"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthReady } from "@/hooks/useAuthReady";
import { Header } from "@/components/Header";
import { CommunityPrivatePreview } from "@/components/community/CommunityPrivatePreview";
import { useChallengeStatus } from "@/hooks/useChallengeStatus";
import { pricingTranslations as pt } from "@/config/translations/pricing";

export default function CommunityPreviewPage() {
  const router = useRouter();
  const authReady = useAuthReady();
  const { user, isAuthenticated } = useAuthStore();
  const { data: challengeGate, loading: challengeGateLoading } = useChallengeStatus();
  const challengeJoinHref =
    challengeGate?.is_waitlist_only ? "/subscribe?plan=challenge" : "/challenge";

  const hasCommunityAccess = useMemo(() => {
    if (!user) return false;
    if (user.is_staff || user.is_superuser) return true;
    return (user.subscription_type ?? "").toLowerCase() === "challenge";
  }, [user]);

  useEffect(() => {
    if (!authReady) return;
    if (isAuthenticated && hasCommunityAccess) {
      router.replace("/community");
    }
  }, [authReady, isAuthenticated, hasCommunityAccess, router]);

  if (!authReady) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  if (isAuthenticated && hasCommunityAccess) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </div>
    );
  }

  const loggedInNoAccess = isAuthenticated && !hasCommunityAccess;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <CommunityPrivatePreview
          title="Bulshadu waa gaar ah"
          description={
            loggedInNoAccess
              ? "Goobtan waxaa isticmaali kara ardayda Challenge-ka oo keliya. Hoos waxaad aragtaa qaabka bulshadu u egtahay — furitaanka wuxuu u baahan yahay Challenge."
              : "Bulshada Garaad waa goobda ardayda Challenge-ka. Soo gal si aad u bilowdo, ama eeg qaabka ay u egtahay hoos — wax walba waa xiran ilaa aad diiwaan gasho."
          }
          primary={{
            href: loggedInNoAccess
              ? challengeGateLoading
                ? "/challenge"
                : challengeJoinHref
              : "/login?redirect=/community",
            label: loggedInNoAccess
              ? challengeGateLoading
                ? "Challenge"
                : `${pt.challenge_cta_compact} →`
              : "Soo gal →",
          }}
          secondary={
            loggedInNoAccess
              ? undefined
              : {
                  href: "/welcome",
                  label: "Samee akoon bilaash",
                }
          }
          footnote={
            loggedInNoAccess
              ? "Heerka Bilaash: sii wad /courses — waxbarashada aasaasiga ah waa furan."
              : "Ka dib diiwaangelinta, Challenge-ka ayaa kuu furaya gelitaanka bulshada dhabta ah ee Garaad."
          }
        />
      </main>
    </div>
  );
}
