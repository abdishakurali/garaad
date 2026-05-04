"use client";

import { Check } from "lucide-react";

const features = [
  "Dhammaan courses-ka — AI, Full-Stack, SaaS, Tignoolajiyad — hal $49",
  "Community-ga private — ku weydii su'aalo, hel jawaabo, wadaag natiijadaada",
  "Mentorship toos — qof kuu sheegi doona sida uu u galay halka uu jiro",
  "Weekly webinars — AI tools cusub, freelance strategies, dhisidda portfolio",
  "Accountability — kuma joogto keliyaad marka aad dareento inaad daaleen",
];

export function CommunitySection() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-950 border-t border-border/50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-primary/70 mb-2">
            Bulshada
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Waxaad ku gashaa <span className="text-primary">brotherhood</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">
            Kuma joogto keliyaad. Waxaa kaa dambeeyay kuwo hore loo tegay dariiqa.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-900 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
            Waxaad helaysaa marka aad ku biirtid
          </h3>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mb-5">
            Kuma aha kaliya courses. Waa meel ay dadku is xoojiyaan, is caawiyaan, una dhammaystiraan wixii ay bilaabeen.
          </p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-primary" />
                </div>
                <span className="text-sm text-slate-600 dark:text-zinc-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        
      </div>
    </section>
  );
}