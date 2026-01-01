"use client";

import { Calculator, BarChart3, Binary, Brain, Wrench, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const courses = [
  {
    title: "Xisaab",
    description: "Xisaabta aasaasiga ah, Algebra, iyo Geometry oo lagu baranayo qaab casri ah.",
    icon: Calculator,
    color: "from-[#d18ffd]/10 to-[#d18ffd]/20",
    iconColor: "text-[#d18ffd]",
    glow: "shadow-[#d18ffd]/20",
    isPrimary: true,
  },
  {
    title: "Falanqeyn Xogeed",
    description: "Baro falanqaynta xogta (Data Analysis) iyo sida looga soo saaro macluumaad muhiim ah.",
    icon: BarChart3,
    color: "from-[#f0ff00]/5 to-[#f0ff00]/10",
    iconColor: "text-[#d4e000]",
    glow: "shadow-[#f0ff00]/20",
    isPrimary: false,
  },
  {
    title: "Cilmiga Kombiyuutarka",
    description: "Sayniska Kombuyutarka, Algorithm-yada, iyo aasaaska software-ka.",
    icon: Binary,
    color: "from-[#d18ffd]/10 to-[#d18ffd]/20",
    iconColor: "text-[#d18ffd]",
    glow: "shadow-[#d18ffd]/20",
    isPrimary: true,
  },
  {
    title: "Sirdoonka Macmalka ah",
    description: "Barnaamij Sameynta & AI - Mustaqbalka tiknoolajiyadda oo Af-Soomaali ah.",
    icon: Brain,
    color: "from-[#f0ff00]/5 to-[#f0ff00]/10",
    iconColor: "text-[#d4e000]",
    glow: "shadow-[#f0ff00]/20",
    isPrimary: false,
  },
  {
    title: "Injineeriyadda",
    description: "Sayniska & Injineernimada, Fiisikiska, iyo qaababka wax loo dhiso.",
    icon: Wrench,
    color: "from-[#d18ffd]/10 to-[#d18ffd]/20",
    iconColor: "text-[#d18ffd]",
    glow: "shadow-[#d18ffd]/20",
    isPrimary: true,
  },
];

export function CourseGrid() {
  return (
    <section className="py-12 sm:py-32 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-[#d18ffd]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#f0ff00]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 mb-20 space-y-6 text-center lg:text-left">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d18ffd]/10 border border-[#d18ffd]/20 text-[#d18ffd] text-xs font-black uppercase tracking-widest mb-4"
          >
            <Sparkles size={12} className="animate-pulse" />
            <span>Koorsooyinka Tayada Leh</span>
          </div>

          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.05]">
              Koorsooyinkayaga <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d18ffd] to-[#a855f7]">Sare</span>
            </h2>
            <div className="h-2 w-32 bg-gradient-to-r from-[#d18ffd] to-[#f0ff00] mt-8 rounded-full mx-auto lg:mx-0 shadow-lg shadow-[#d18ffd]/20" />
            <p className="mt-8 text-xl text-muted-foreground font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Baro xirfadihii ugu dambeeyay ee adduunka ka jira, annagoo kuu soo diyaarinay tusaalooyin dhab ah iyo akhris fudud.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {courses.map((course, index) => (
            <div
              key={index}
              className={cn(
                "group relative p-6 sm:p-10 rounded-3xl sm:rounded-[3rem] border transition-all duration-500",
                "bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800",
                "hover:border-[#d18ffd]/30 hover:shadow-[0_20px_50px_rgba(209,143,253,0.12)]",
                "perspective-1000"
              )}
            >
              <div className="absolute inset-0 rounded-3xl sm:rounded-[3rem] bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative space-y-8 h-full flex flex-col">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg",
                  "bg-gradient-to-br",
                  course.color,
                  course.glow,
                  "group-hover:scale-110 group-hover:rotate-6"
                )}>
                  <course.icon size={30} className={course.iconColor} />
                </div>

                <div className="space-y-4 flex-grow">
                  <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-[#d18ffd] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-base text-muted-foreground font-medium leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-slate-50 dark:border-slate-800/50 group-hover:border-[#d18ffd]/10 transition-colors">
                  <div className="flex items-center gap-2 text-[#d18ffd] font-black text-xs uppercase tracking-widest transition-all duration-300">
                    <span className="group-hover:mr-2">Eeg Koorsooyinka</span>
                    <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </div>

                  {index === 0 && (
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tighter border border-primary/20">
                      Ugu caansan
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Call to action card */}
          <div
            className="group relative p-8 sm:p-10 rounded-3xl sm:rounded-[3rem] border border-dashed border-[#d18ffd]/30 bg-[#d18ffd]/5 flex flex-col items-center justify-center text-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-[#d18ffd] shadow-md group-hover:scale-110 transition-transform">
              <Sparkles size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-foreground">Ma haysaa su'aal?</h3>
              <p className="text-sm text-muted-foreground font-medium px-4">
                Nagala soo xiriir haddii aad u baahan tahay caawimaad ku saabsan xulashada koorsada saxda ah.
              </p>
            </div>
            <button className="px-8 py-3 rounded-full bg-[#d18ffd] text-white text-sm font-black uppercase tracking-widest hover:bg-[#b870f0] transition-colors shadow-lg shadow-[#d18ffd]/20 active:scale-95 transform">
              Nala hadal
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
