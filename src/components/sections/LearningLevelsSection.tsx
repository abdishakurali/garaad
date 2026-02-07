"use client";

import { Brain, Gamepad2, Layers, Cpu, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "@/store/useAuthStore";

const courseLevels = [
  {
    level: "Heerka 2",
    title: "Hordhaca Algorithms",
    description: "Baro qaababka xalinta dhibaatooyinka",
    icon: Brain,
    color: "bg-primary",
  },
  {
    level: "Heerka 3",
    title: "Horumarinta Ciyaaraha",
    description: "Samee ciyaaraha computer-ka",
    icon: Gamepad2,
    color: "bg-secondary",
  },
  {
    level: "Heerka 4",
    title: "Qaababka Xogta",
    description: "Baro qaababka xogta loo habeeyey",
    icon: Layers,
    color: "bg-primary text-primary-foreground",
  },
  {
    level: "Heerka 5",
    title: "Barashada Mashiinka",
    description: "Baro cilmiga barashada mashiinka",
    icon: Cpu,
    color: "bg-secondary text-secondary-foreground",
  },
];

export function LearningLevelsSection() {
  const { user } = useAuthStore();
  const isAuthenticated = !!user;

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          {/* Text Content */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-5xl lg:text-7xl font-black text-foreground leading-[1] tracking-tight">
                Baro heer <br />
                <span className="text-primary italic">kasta oo aad</span> <br />
                joogto.
              </h2>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-xl">
                Laga bilaabo aasaaska ilaa heerarka sare. Loogu talagalay ardayda jecel ogaanshaha iyo aqoonta mustaqbalka.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-2 w-32 bg-primary rounded-full shadow-glow-primary" />
              <div className="h-2 w-8 bg-secondary rounded-full" />
            </div>
          </div>

          {/* Course Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courseLevels.map((course, index) => (
              <div
                key={index}
                className="group relative bg-[#F9FBFF] p-10 rounded-[3rem] border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className={clsx(
                      "w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110",
                      course.color
                    )}>
                      <course.icon size={32} />
                    </div>
                    <span className="text-[12px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-2 rounded-full">
                      {course.level}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground leading-tight group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-base text-muted-foreground font-medium mt-3 leading-relaxed">{course.description}</p>
                  </div>

                  <div className="flex items-center text-primary font-black text-sm uppercase tracking-widest transition-all duration-300">
                    <span className="mr-1">{isAuthenticated ? "Bilow Hadda" : "KU SOO BIIR"}</span>
                    <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
