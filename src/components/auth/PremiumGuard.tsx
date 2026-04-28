"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumGuardProps {
  children: React.ReactNode;
}

export function PremiumGuard({ children }: PremiumGuardProps) {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    // Only show modal if user is not premium and not loading
    if (user && !user.is_premium) {
      // Logic to check view count in localStorage
      const viewCountKey = `premium_guard_views_${pathname}`;
      const views = parseInt(localStorage.getItem(viewCountKey) || "0", 10);
      
      localStorage.setItem(viewCountKey, (views + 1).toString());
      
      if (views >= 3) {
        setIsUrgent(true);
      }
      
      setShowModal(true);
    }
  }, [user, pathname]);

  if (user?.is_premium) {
    return <>{children}</>;
  }

  // We render children but we'll overlay them with a blur and the modal
  return (
    <div className="relative min-h-screen">
      <div className={cn(
        "transition-all duration-500",
        showModal ? "blur-md pointer-events-none select-none grayscale-[0.5]" : ""
      )}>
        {children}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 flex flex-col items-center text-center">
              {/* Dynamic Title based on path */}
              <h2 className="text-2xl font-black text-foreground mb-2">
                {pathname.includes("/community") ? "Bulshadda" : 
                 pathname.includes("/mentorship") ? "Mentorship" : 
                 pathname.includes("/cohorts") ? "Cohorts" : "Premium Content"}
              </h2>
              
              <p className="text-muted-foreground text-sm mb-6">
                Ku biir Challenge-ka si aad u hesho fursadahan:
              </p>

              {/* Membership Benefits */}
              <ul className="text-left space-y-3 mb-8 w-full max-w-xs">
                {[
                  "Mentorship 1-on-1 ah oo joogto ah",
                  "Helitaanka bulshada khabiirada ah",
                  "Mashaariic dhab ah oo aad portfolio u isticmaasho"
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      ✓
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>

              {/* Pricing */}
              <div className="mb-8">
                <span className="text-4xl font-black text-primary tabular-nums">
                  $49
                </span>
                <span className="text-muted-foreground ml-2 font-medium">maanta</span>
              </div>

              {/* Urgency Message */}
              {isUrgent && (
                <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold animate-pulse">
                  ⚠️ Boosaska 1-on-1 waa xaddidan yihiin
                </div>
              )}

              {/* CTAs */}
              <div className="w-full space-y-3">
                <Link 
                  href="/subscribe"
                  className="block w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-center transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
                >
                  Upgrade hadda →
                </Link>
                <button 
                  onClick={() => setShowModal(false)}
                  className="block w-full py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Xoog dambe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
