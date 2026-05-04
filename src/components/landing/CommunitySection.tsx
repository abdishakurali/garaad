"use client";

import { Check } from "lucide-react";

const features = [
  "Dhammaan courses-ka — AI, Full-Stack, SaaS, Tignoolajiyad — hal $49",
  "Community-ga private — ku weydii su'aalo, hel jawaabo, wadaag natiijadaada",
  "Mentorship toos — qof kuu sheegi doona sida uu u galay halka uu jiro",
  "Weekly webinars — AI tools cusub, freelance strategies, dhisidda portfolio",
  "Accountability — kuma joogto keliyaad marka aad dareento inaad daaleen",
];

const manifesto = [
  { text: "9-to-5 waa xabsi aad doortay.", dim: false },
  { text: "Aniga waaan tijaabiyay.", dim: true },
  { text: "AI-ga waa furaha.", dim: false },
  { text: "Garaad waa jidka.", dim: true },
];

export function CommunitySection() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
            Bulshada
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Waxaad ku gashaa <span className="text-violet-600 dark:text-violet-400">brotherhood</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">
            Kuma joogto keliyaad. Waxaa kaa dambeeyay kuwo hore loo tegay dariiqa.
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-zinc-900 rounded-2xl p-6 mb-8">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Waxaad helaysaa marka aad ku biirtid</h3>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mb-5">
            Kuma aha kaliya courses. Waa meel ay dadku is xoojiyaan, is caawiyaan, una dhammaystiraan wixii ay bilaabeen.
          </p>
          <div className="space-y-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm text-slate-600 dark:text-zinc-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-l-2 border-violet-500 pl-5 py-2">
          {manifesto.map((line, i) => (
            <p
              key={i}
              className={`text-lg font-medium mb-1 ${
                line.dim
                  ? "text-slate-400 dark:text-zinc-500 font-normal"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}