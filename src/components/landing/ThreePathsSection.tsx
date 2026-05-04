"use client";

import { ArrowRight, Code, Users, Lightbulb } from "lucide-react";
import Link from "next/link";

const paths = [
  {
    icon: Code,
    title: "Freelancer",
    description: "Ku shaqee macaamiisha dunida oo dhan adiga oo isticmaalaya AI tools.",
    pills: ["Upwork", "Fiverr", "Direct"],
    highlight: true,
  },
  {
    icon: Users,
    title: "Worker",
    description: "Hel shaqo tech-ka ku saabsan dunida oo dhan — remote, $2k+/bilood.",
    pills: ["Remote", "LinkedIn", "Portfolio"],
    highlight: false,
  },
  {
    icon: Lightbulb,
    title: "Builder",
    description: "Dhis alaabadaada ama agency-gaaga. Ku guri wax iibso adiga oo leh AI.",
    pills: ["SaaS", "Agency", "Products"],
    highlight: false,
  },
];

export function ThreePathsSection() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
            Sababta aad u imaaneyso
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            3 dariiqa aad lacag ku{" "}
            <span className="text-violet-600 dark:text-violet-400">sameyso maanta</span>{" "}
            — oo dhan AI
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 max-w-lg mx-auto">
            Ma aha wax ku saabsan barashada. Waa wax ku saabsan beddelashada noloshaada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          {paths.map((path) => (
            <div
              key={path.title}
              className={`p-4 rounded-xl border transition-all ${
                path.highlight
                  ? "border-violet-500 bg-white dark:bg-zinc-800 shadow-lg shadow-violet-500/10"
                  : "border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${
                path.highlight ? "bg-violet-100 dark:bg-violet-900/30" : "bg-slate-100 dark:bg-zinc-700"
              }`}>
                <path.icon className={`w-4 h-4 ${path.highlight ? "text-violet-600" : "text-slate-600 dark:text-zinc-300"}`} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{path.title}</h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 mb-3">{path.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {path.pills.map((pill) => (
                  <span
                    key={pill}
                    className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300"
                  >
                    {pill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl bg-violet-50 dark:bg-violet-900/20 p-4 text-center">
          <p className="text-sm text-violet-800 dark:text-violet-300">
            <span className="font-semibold">Sababta AI ay muhiim u tahay:</span>{" "}
            Qofka isticmaala AI wuxuu samayn karaa shaqada 5 qof. Ku jir. Ama dib u dhac.
          </p>
        </div>
      </div>
    </section>
  );
}