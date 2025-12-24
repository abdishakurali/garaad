"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  SquareFunction,
  Grid3X3,
  LineChart,
  Pyramid,
  MoveRight,
  Compass,
  ChevronRight,
  TrendingUp,
  Activity,
  Sparkles
} from "lucide-react";

const subjects = [
  { id: "math", label: "Xisaabta", active: true },
  { id: "cs", label: "Cilmiga Kombiyuutarka", active: false },
  { id: "data", label: "Xogta iyo AI", active: false },
  { id: "science", label: "Mantiqiyadda", active: false },
];

const mathCourses = [
  {
    title: "Xalinta Isla'egyada",
    description: "Xalinta isla'egyada fudud iyo kuwa adag",
    icon: SquareFunction,
  },
  {
    title: "Nidaamyada Isla'egyada",
    description: "Nidaamyada isla'egyada toosan",
    icon: Grid3X3,
  },
  {
    title: "Xisaabta Dhabta ah",
    description: "Aljebra-da adduunka dhabta ah",
    icon: Activity,
  },
  {
    title: "Fahamka Jaantuska",
    description: "Sidee loo akhriyaa jaantusyada",
    icon: LineChart,
  },
  {
    title: "Joomitri I",
    description: "Barashada qaababka iyo fahamka Joomitri",
    icon: Pyramid,
  },
  {
    title: "Vectors",
    description: "Cilmiga Vectors-ka iyo jihada",
    icon: MoveRight,
  },
  {
    title: "Calculus",
    description: "Hordhaca Calculus iyo isbeddelka xisaabta",
    icon: TrendingUp,
  },
];

export function GuidedPathsSection() {
  const [activeTab, setActiveTab] = useState("math");
  const [angle, setAngle] = useState(300);

  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[20%] left-[-10%] w-[40%] h-[40%] bg-[#d18ffd]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-[#f0ff00]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20 space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="px-6 py-2.5 rounded-full bg-[#f0ff00]/10 border border-[#f0ff00]/30 text-[#abc400] text-sm font-black uppercase tracking-[0.2em] shadow-sm">
              Hagid Shakhsi ah
            </div>
          </div>

          <div>
            <h2 className="text-5xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
              Waddooyinka <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d18ffd] to-[#a855f7]">lagugu</span> hagayo.
            </h2>
            <p className="mt-8 text-muted-foreground font-medium text-xl max-w-2xl mx-auto leading-relaxed">
              Xulo maadooyinka aad xiiseyneyso oo ku bilow safarkaaga STEM-ka ee afkaaga hooyo.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div role="tablist" className="flex justify-center mb-20 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex p-2 bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] gap-2 border border-slate-100 dark:border-slate-800 shadow-inner">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                role="tab"
                aria-selected={activeTab === subject.id}
                onClick={() => subject.active && setActiveTab(subject.id)}
                className={cn(
                  "px-8 sm:px-10 py-4 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap relative overflow-hidden group",
                  subject.active
                    ? activeTab === subject.id
                      ? "bg-white dark:bg-slate-800 text-[#d18ffd] shadow-xl shadow-[#d18ffd]/10"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                    : "text-slate-300 dark:text-slate-700 cursor-not-allowed opacity-50"
                )}
                disabled={!subject.active}
              >
                <span className="relative z-10">{subject.label}</span>
                {subject.active && activeTab !== subject.id && (
                  <div className="absolute inset-0 bg-[#d18ffd]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Course List */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#d18ffd]/10 text-[#d18ffd]">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-black text-xl text-foreground">Xisaabta Aasaasiga ah</h3>
              </div>
              <div className="grid gap-4">
                {mathCourses.map((course, index) => (
                  <div
                    key={course.title}
                    className="flex justify-between items-center p-5 group bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 rounded-[2rem] hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl hover:shadow-[#d18ffd]/5 transition-all cursor-pointer hover:border-[#d18ffd]/20"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 shrink-0 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-[#d18ffd] shadow-sm group-hover:rotate-3 transition-all duration-300">
                        <course.icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 leading-tight group-hover:text-[#d18ffd] transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1 font-medium italic">
                          {course.description}
                        </p>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#d18ffd]/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <ChevronRight size={18} className="text-[#d18ffd]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Visualization */}
            <div className="relative aspect-square glassmorphism rounded-[4rem] p-12 sm:p-16 border border-[#d18ffd]/10 flex flex-col items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#d18ffd]/5 to-transparent rounded-[4rem] pointer-events-none" />

              <div className="relative w-full h-full flex flex-col items-center max-w-[340px] z-10">
                <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="circGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#d18ffd" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#d18ffd" stopOpacity="0.05" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  <circle
                    cx="200"
                    cy="200"
                    r="150"
                    fill="url(#circGrad)"
                    stroke="#d18ffd"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    className="opacity-30"
                  />

                  {/* Guide lines for common angles */}
                  {[0, 90, 180, 270].map((a) => (
                    <line
                      key={a}
                      x1={200 + 140 * Math.cos((a * Math.PI) / 180)}
                      y1={200 + 140 * Math.sin((a * Math.PI) / 180)}
                      x2={200 + 160 * Math.cos((a * Math.PI) / 180)}
                      y2={200 + 160 * Math.sin((a * Math.PI) / 180)}
                      stroke="#d18ffd"
                      strokeWidth="2"
                      className="opacity-40"
                    />
                  ))}

                  {/* Angle Line */}
                  <line
                    x1="200"
                    y1="200"
                    x2={200 + 150 * Math.cos((angle * Math.PI) / 180)}
                    y2={200 + 150 * Math.sin((angle * Math.PI) / 180)}
                    stroke="#d18ffd"
                    strokeWidth="8"
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />

                  <circle cx="200" cy="200" r="14" fill="#d18ffd" className="shadow-lg" />
                  <circle cx="200" cy="200" r="6" fill="white" />

                  <text
                    x="200"
                    y="200"
                    dy="-45"
                    className="text-6xl font-black fill-[#d18ffd]"
                    textAnchor="middle"
                    style={{ textShadow: "0 10px 20px rgba(209,143,253,0.3)" }}
                  >
                    {angle}°
                  </text>
                </svg>

                <div className="mt-12 w-full space-y-6">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-[#d18ffd] relative z-10"
                    />
                    <div
                      className="absolute top-0 left-0 h-3 bg-[#d18ffd] rounded-full pointer-events-none transition-all duration-100"
                      style={{ width: `${(angle / 360) * 100}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-[#d18ffd]">
                    <div className="flex items-center gap-2 group/compass">
                      <Compass size={14} className="group-hover/compass:rotate-45 transition-transform duration-500" />
                      <span>Xagasha Hada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} />
                      <span>360° Gaaf</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
