"use client";

import React, { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, PartyPopper } from "lucide-react";
import { Header } from "@/components/Header";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    // If user is not premium, redirect to /subscribe
    if (user && !user.is_premium) {
      router.replace("/subscribe");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user.is_premium) {
    return null; // Redirecting...
  }

  const firstName = user.first_name || "Arday";
  const subscriptionType = searchParams.get("subscription_type") || user.subscription_type || "Challenge";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
              <PartyPopper className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2">
              Ku soo dhowow Challenge-ka, {firstName}! 🎉
            </h1>
            <p className="text-blue-100 text-lg">
              Waad ku guulaysatay bixinta {subscriptionType === "lifetime" ? "Lifetime" : subscriptionType === "yearly" ? "Sannadly" : "Bishii"}.
            </p>
          </div>

          <div className="p-8 md:p-12">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                3 tallaabooyinka ku xiga
              </h2>
              <div className="space-y-4">
                <Step
                  step="1"
                  text="Dhamee profile-kaaga"
                  href="/profile"
                  icon={<CheckCircle2 className="h-5 w-5" />}
                />
                <Step
                  step="2"
                  text="Is-bar bulshadda"
                  href="/community"
                  icon={<CheckCircle2 className="h-5 w-5" />}
                />
                <Step
                  step="3"
                  text="Book 1-on-1 kaaga bilaasha"
                  href="https://cal.com/garaad/assessment"
                  icon={<CheckCircle2 className="h-5 w-5" />}
                  external
                />
              </div>
            </div>

            <div className="text-center">
              <Link href="/courses" className="inline-block w-full">
                <Button className="w-full h-14 text-lg font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 text-white transition-all group">
                  Bilow hadda 
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Step({ step, text, href, icon, external = false }: { 
  step: string; 
  text: string; 
  href: string; 
  icon: React.ReactNode;
  external?: boolean;
}) {
  const content = (
    <div className="flex items-center p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
        {step}
      </div>
      <div className="ml-4 flex-grow">
        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {text}
        </p>
      </div>
      <Link 
        href={href} 
        target={external ? "_blank" : "_self"} 
        rel={external ? "noopener noreferrer" : undefined}
        className="p-2 text-gray-400 group-hover:text-blue-600 transition-colors"
      >
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );

  return content;
}
