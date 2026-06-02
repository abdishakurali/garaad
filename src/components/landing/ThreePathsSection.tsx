"use client";

import { Code, Users, Lightbulb, CheckCircle2 } from "lucide-react";

const paths = [
  {
    id: "freelancer",
    icon: Code,
    title: "Freelancer",
    description: "Baro sida loo helo client, loo dhiso portfolio, loona diro proposal nadiif ah.",
    pills: ["Client", "Portfolio", "Proposal"],
    benefits: ["Shaqo macmiil", "Natiijo la cabbiri karo"],
    highlight: true,
  },
  {
    id: "builder",
    icon: Lightbulb,
    title: "Builder",
    description: "Dhis product yar oo shaqeeya: idea, MVP, demo, iyo launch cad.",
    pills: ["Idea", "MVP", "Launch"],
    benefits: ["Product dhab ah", "Demo la tusi karo"],
    highlight: false,
  },
  {
    id: "worker",
    icon: Users,
    title: "Worker",
    description: "Diyaari xirfadda shaqo: CV, LinkedIn, interview, iyo project proof.",
    pills: ["CV", "LinkedIn", "Interview"],
    benefits: ["Shaqo diyaar", "Hab joogto ah"],
    highlight: false,
  },
];

export function ThreePathsSection() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-primary/70 mb-2">
            Dooro dariiqaada
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Saddex jid oo <span className="text-primary">nadiif ah</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-lg max-w-2xl mx-auto">
            Freelancer, Builder, ama Worker. Qofna isma diiwaangelinayo, lacag ma bixinayo, mana soo galayo. Access waa codsi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {paths.map((path) => (
            <div
              key={path.id}
              className={`relative p-6 rounded-xl border-2 transition-colors cursor-pointer ${
                path.highlight
                  ? "border-primary bg-white dark:bg-zinc-800"
                  : "border-transparent bg-white dark:bg-zinc-800 border"
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                <path.icon className="w-5 h-5 text-white" />
              </div>

              <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2">
                {path.title}
              </h3>
              
              <p className="text-sm text-slate-600 dark:text-zinc-400 mb-4 leading-relaxed">
                {path.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {path.pills.map((pill) => (
                  <span
                    key={pill}
                    className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-medium"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-zinc-700">
                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-500 mb-2">Waxa aad heleyso:</p>
                <ul className="space-y-1.5">
                  {path.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-slate-700 dark:text-zinc-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {path.highlight && (
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-bold">
                  Popular
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-primary p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-white font-bold text-lg">?</span>
              </div>
              <div>
                <p className="text-white font-bold text-lg">Access waa codsi kaliya</p>
                <p className="text-white/80 text-sm">Email u dir info@garaad.org, kadib waa lagu approve-gareynayaa.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm">Ma jiro payment ama signin:</span>
              <span className="px-4 py-2 rounded-lg bg-white text-primary font-semibold text-sm">
                Request access
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
