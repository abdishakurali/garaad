"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LandingStats {
  students_count: number;
}

export function PricingSection() {
  const [stats, setStats] = useState<LandingStats | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/landing-stats/`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
            Qiimaha
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Hal qiime. <span className="text-violet-600 dark:text-violet-400">Wax kasta.</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">
            Ma aha subscription aad ilbiqaneyso. Waa maalgashi.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl border-2 border-violet-500 p-6 shadow-xl shadow-violet-500/10">
          <div className="text-center mb-6">
            <span className="inline-block text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full mb-4">
              MOST POPULAR · BILOOD KASTA
            </span>
            <div className="flex items-center justify-center text-5xl font-bold text-slate-900 dark:text-white">
              <span className="text-2xl mt-2 mr-1">$</span>49
              <span className="text-lg font-normal text-slate-500 ml-2">/bilood</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">jooji goor kasta</p>
          </div>

          <div className="border-t border-slate-200 dark:border-zinc-700 py-4 space-y-3">
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Dhammaan campuses-ka — AI, Full-Stack, SaaS, Tignoolajiyad</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Community brotherhood + accountability partners</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Mentorship 1-on-1 (bilood kasta)</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Weekly webinars + replay-ada</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Kaarka Bangiga (Stripe) ama Waafi lacagta gacanta</span>
            </div>
          </div>

          <Link
            href="/welcome"
            className="block w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-lg text-center transition-colors"
          >
            Ku biir maanta — $49/bilood
          </Link>
          
          <p className="text-center text-xs text-slate-500 mt-3">
            Lacag-celinta 30 maalmood — haddaadan sameynin lacag, waan ku celinnaa
          </p>
        </div>
      </div>
    </section>
  );
}