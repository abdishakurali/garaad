"use client";

import { Check, ArrowRight, Users, Target, Sparkles, Rocket, Trophy } from "lucide-react";

const steps = [
  {
    num: "1",
    icon: Users,
    title: "Ku Biir Bulshada",
    subtitle: "Maalinta 1aad",
    description: "Hel dhammaan koorsooyinka, bulshada aqoonta, iyo latalin gaar ah (Mentorship). Adiga oo bixinaya $49 bishii.",
    userAction: "Waxaad heleysaa: Full access",
  },
  {
    num: "2",
    icon: Target,
    title: "Dooro Waddadaada",
    subtitle: "Toddobaadka 1aad",
    description: "Ma Freelancer, Worker, mise Builder? Waxaan kugu hadi doonnaa dariiqa ku habboon xaaladaada.",
    userAction: "Waxaad barato: Your path",
  },
  {
    num: "3",
    icon: Sparkles,
    title: "Dhis Aaladahaaga AI",
    subtitle: "Toddobaadka 2-3",
    description: "Samee qalab kuu qora iimayllada, kaaliye dhanka koodhka, iyo nidaam kuu raadiya macaamiisha.",
    userAction: "Waxaad samaynaysaa: Your tools",
  },
  {
    num: "4",
    icon: Rocket,
    title: "Hel Macmiilkaaga Koowaad",
    subtitle: "Toddobaadka 4aad",
    description: "Macallimiin khubaro ah ayaa kaa caawin doona sidii aad u heli lahayd lacagtaada koowaad.",
    userAction: "Waxaad heleysaa: $500+ first",
  },
];

export function WorkflowSection() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-950 border-t border-border/50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-primary/70 mb-2">
            Sida ay u shaqeyso
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4">
            Sida aad <span className="text-primary">u guuleysanaysaa</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-lg max-w-xl mx-auto">
            4 toddobaad. 1 natiijo.{" "}
            <span className="font-semibold text-primary">
              Adiga ayaa af-duwan
            </span>
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary rounded-full" />
          
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative pl-20"
              >
                <div className="absolute left-0 top-4 w-16 h-16 rounded-xl bg-primary flex items-center justify-center z-10">
                  <span className="text-white font-bold text-lg">{step.num}</span>
                </div>

                <div className="p-6 rounded-xl border bg-white dark:bg-zinc-900">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white">{step.title}</h3>
                        <span className="text-xs font-medium text-primary">{step.subtitle}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-zinc-400 mb-4 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-zinc-700">
                    <span className="text-xs font-semibold text-slate-500 dark:text-zinc-500">
                      {step.userAction}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-primary p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-xl">Guul: Lacagtaada gacantaada ku jirta</p>
                  <p className="text-white/80 text-sm">Waa xilligii aad ka bixi lahayd shaqada caadiga ah (9-to-5)</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-white/60 text-xs">Waqti</p>
                  <p className="text-white font-bold text-lg">4 Toddobaad</p>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="text-center">
                  <p className="text-white/60 text-xs">Natiijo</p>
                  <p className="text-white font-bold text-lg">$500+</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}