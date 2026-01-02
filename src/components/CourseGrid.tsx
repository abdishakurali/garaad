"use client";

import { ChevronRight, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const courses = [
  {
    title: "Xisaab",
    description: "Xisaabta aasaasiga ah iyo Algebra.",
    color: "from-[#d18ffd]/10 to-[#d18ffd]/20",
    iconColor: "text-[#d18ffd]",
    glow: "shadow-[#d18ffd]/20",
    isPrimary: true,
    href: "/courses",
  },
  {
    title: "Falanqeyn Xogeed",
    description: "Baro falanqaynta xogta (Data Analysis).",
    color: "from-[#f0ff00]/5 to-[#f0ff00]/10",
    iconColor: "text-[#d4e000]",
    glow: "shadow-[#f0ff00]/20",
    isPrimary: false,
    href: "/courses",
  },
  {
    title: "Cilmiga Kombiyuutarka",
    description: "Algorithm-yada iyo aasaaska software-ka.",
    color: "from-[#d18ffd]/10 to-[#d18ffd]/20",
    iconColor: "text-[#d18ffd]",
    glow: "shadow-[#d18ffd]/20",
    isPrimary: true,
    href: "/courses",
  },
  {
    title: "Sirdoonka Macmalka ah",
    description: "Barnaamij Sameynta iyo AI.",
    color: "from-[#f0ff00]/5 to-[#f0ff00]/10",
    iconColor: "text-[#d4e000]",
    glow: "shadow-[#f0ff00]/20",
    isPrimary: false,
    href: "/courses",
  },
  {
    title: "Injineeriyadda",
    description: "Fiisikiska iyo qaababka wax loo dhiso.",
    color: "from-[#d18ffd]/10 to-[#d18ffd]/20",
    iconColor: "text-[#d18ffd]",
    glow: "shadow-[#d18ffd]/20",
    isPrimary: true,
    href: "/courses",
  },
];

export function CourseGrid() {
  return (
    <section className="py-12 sm:py-32 bg-background overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 dark:bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#f0ff00]/10 dark:bg-[#f0ff00]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 mb-24 space-y-6 text-center lg:text-left">
          <div className="max-w-3xl">
            <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black text-foreground tracking-tight leading-[1.05]">
              Koorsooyinkayaga <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary">Sare</span>
            </h2>
            <div className="h-2 w-40 bg-gradient-to-r from-primary to-secondary mt-10 rounded-full mx-auto lg:mx-0 shadow-lg shadow-primary/20" />
            <p className="mt-10 text-xl sm:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Baro xirfadihii ugu dambeeyay ee adduunka ka jira, annagoo kuu soo diyaarinay tusaalooyin dhab ah oo maskaxdaada kobcinaya.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
          {courses.map((course, index) => (
            <Link
              key={index}
              href={course.href}
              className={cn(
                "group relative p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] border transition-all duration-700",
                "bg-card/50 backdrop-blur-sm border-border/50",
                "hover:border-primary/40 hover:shadow-[0_40px_80px_-15px_rgba(209,143,253,0.2)]",
                "hover:-translate-y-3 hover:rotate-1 active:scale-95"
              )}
            >
              <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[3.5rem] bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-[2.5rem] sm:rounded-[3.5rem] bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

              <div className="relative space-y-8 h-full flex flex-col">

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
                    <div className="px-3 py-1 rounded-full bg-[#f0ff00]/10 text-[#d4e000] text-[10px] font-black uppercase tracking-tighter border border-[#f0ff00]/20">
                      Ugu caansan
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}
