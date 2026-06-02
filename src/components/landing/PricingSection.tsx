"use client";

import { Check } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
            Access
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Ma jiro payment. <span className="text-violet-600 dark:text-violet-400">Codsi kaliya.</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">
            Email u dir info@garaad.org, kadib waa lagu approve-gareynayaa.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl border-2 border-violet-500 p-6 shadow-xl shadow-violet-500/10">
          <div className="text-center mb-6">
            <span className="inline-block text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-3 py-1 rounded-full mb-4">
              REQUEST ONLY
            </span>
            <div className="flex items-center justify-center text-5xl font-bold text-slate-900 dark:text-white">
              Request
            </div>
            <p className="text-sm text-slate-500 mt-1">No signin. No payment. No form.</p>
          </div>

          <div className="border-t border-slate-200 dark:border-zinc-700 py-4 space-y-3">
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Freelancer, Builder, iyo Worker modules</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Modules nadiif ah oo jid walba u gaar ah</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Access kadib approval</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-600 dark:text-zinc-300">
              <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              <span>Email: info@garaad.org</span>
            </div>
            
          </div>

          <Link
            href="mailto:info@garaad.org?subject=Codsi%20Garaad%20Access"
            className="block w-full bg-violet-600 hover:bg-violet-500 text-white font-semibold py-3 rounded-lg text-center transition-colors"
          >
            Request access
          </Link>
          
          <p className="text-center text-xs text-slate-500 mt-3">
            Codso, kadib waa lagu approve-gareynayaa.
          </p>
        </div>
      </div>
    </section>
  );
}
