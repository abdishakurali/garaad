"use client";

import { Check } from "lucide-react";

const steps = [
  {
    num: "1",
    title: "Ku biir bulshada — maalin koowaad",
    description: "Hel access-ka dhammaan courses-ka, community-ga, iyo mentorship-ka. $49 oo keliya.",
  },
  {
    num: "2",
    title: "Dooro dariiqa — usbuuc 1",
    description: "Freelancer, Worker, mise Builder? Waxaan kaa gaajin doonnaa dariiqa saxda ah ee ku habboon xaaladaada.",
  },
  {
    num: "3",
    title: "Dhis AI tools-kaaga — usbuuc 2–3",
    description: "Samee email writer, code helper, client finder — oo dhan AI la xukumo. Vibe code adiga oo aan waxba garanin.",
  },
  {
    num: "4",
    title: "Hel macmiilkaaga koowaad — usbuuc 4",
    description: "Mentor ayaa kaa caawinaya in aad hesho lacagtaada koowaad. Ma'ahan waxbarasho — waa la jaan qaadeynaayo.",
  },
  {
    num: "✓",
    title: "Xor tahay — lacagtaada gacantaada ku jirta",
    description: "Waa xilligaas aad ka bixi karto 9-to-5. Ama aad ku darto xoogga.",
    highlight: true,
  },
];

export function WorkflowSection() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
            Sida ay u shaqeyso
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Workflow-ka cad <span className="text-violet-600 dark:text-violet-400">A ilaa Z</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">
            Hal bil. Natiijo dhabta ah. Lacag gacanta ku jirta.
          </p>
        </div>

        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4 relative">
              {i < steps.length - 1 && (
                <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-slate-200 dark:bg-zinc-700" />
              )}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shrink-0 mt-1 ${
                  step.highlight
                    ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600 border-2 border-violet-500"
                    : "bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500"
                }`}
              >
                {step.num}
              </div>
              <div className={`pb-8 ${i === steps.length - 1 ? "pb-0" : ""}`}>
                <h3
                  className={`font-semibold mb-1 ${
                    step.highlight ? "text-violet-600 dark:text-violet-400" : "text-slate-900 dark:text-white"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-zinc-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}