import Image from "next/image";
import { Metadata } from "next";
import {
  Rocket,
  Users,
  Brain,
  Zap,
  Globe,
  ChevronRight,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowRight,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { playfair } from "@/lib/fonts";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Abdishakur Ali - Founder, Serial Entrepreneur & Polymath",
  description: "Learn about Abdishakur Ali, the founder of Garaad and a serial entrepreneur. Driven by physics and nature, he is dedicated to advancing Somali technology through innovation and startups.",
  openGraph: {
    images: ["/images/garaad.jpg"],
  }
};

const journeyHighlights = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Serial Entrepreneur",
    description: "Abdishakur has founded and scaled multiple successful startups, demonstrating a consistent track record of innovation.",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    icon: <Rocket className="w-5 h-5" />,
    title: "Multi-Startup Founder",
    description: "From SaaS platforms to educational tech, he has built several companies from the ground up, solving real-world problems.",
    color: "text-purple-500",
    bg: "bg-purple-500/10"
  },
  {
    icon: <Brain className="w-5 h-5" />,
    title: "Nature & Physics",
    description: "Deeply passionate about the laws of nature and physics, these interests drive his unique approach to technology and life.",
    color: "text-blue-500",
    bg: "bg-blue-500/10"
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Global Vision",
    description: "Combining technical acumen with entrepreneurial spirit to contribute meaningfully to global advancement.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] selection:bg-primary/30">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30 dark:opacity-20 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/40 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/30 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  Founder & Visionary
                </div>

                <h1 className={cn(playfair.className, "text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight")}>
                  Abdishakur Ali
                </h1>

                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                  Serial Entrepreneur, Founder, and Visionary. A self-taught innovator dedicated to advancing Somali technology through multiple successful startups.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="mailto:Info@garaad.org">
                    <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 transition-all active:scale-95">
                      Contact Me
                    </button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <a href="https://x.com/ShakuurAlly" target="_blank" rel="noopener noreferrer" className="p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors dark:text-white">
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a href="https://www.linkedin.com/in/rooblecali/" target="_blank" rel="noopener noreferrer" className="p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors dark:text-white">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://github.com/Roobleali" target="_blank" rel="noopener noreferrer" className="p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors dark:text-white">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="relative aspect-square max-w-md mx-auto lg:max-w-none lg:w-full">
                <div className="absolute inset-4 rounded-[40px] bg-gradient-to-tr from-primary to-purple-600 blur-2xl opacity-20 animate-pulse" />
                <div className="relative h-full w-full rounded-[40px] overflow-hidden border-4 border-white dark:border-[#1E293B] shadow-2xl">
                  <Image
                    src="/images/garaad.jpg"
                    alt="Abdishakur Ali"
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 p-6 bg-white dark:bg-[#1E293B] rounded-[32px] shadow-2xl border border-gray-100 dark:border-white/5 space-y-1">
                  <div className="text-2xl font-black text-primary">2,000+</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Students Mentored</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Journey Section */}
        <section className="py-32 bg-white dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
              <h2 className="text-xs font-black text-primary uppercase tracking-[0.2em]">The Journey</h2>
              <h3 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tight">Timeline of Innovation</h3>
              <p className="text-lg text-gray-500 dark:text-gray-400">A serial entrepreneur's path from self-taught developer to founder of multiple startups.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {journeyHighlights.map((item, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-[#F8FAFC] dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2">
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3", item.bg, item.color)}>
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-3 dark:text-white">{item.title}</h4>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision & Philosophy */}
        <section className="py-32 bg-[#F8FAFC] dark:bg-[#0F172A] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-primary">
                    <div className="w-10 h-[2px] bg-primary rounded-full" />
                    <span className="text-xs font-black uppercase tracking-widest">Vision & Philosophy</span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                    Empowering the Next Generation of Somali Technologists
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 italic font-medium leading-relaxed">
                    "As a serial entrepreneur and self-taught developer, I am driven by a deep love for nature and physics, using these inspirations to build multiple startups that innovate and empower."
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4">
                  <div className="space-y-2 p-6 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm transform hover:-translate-y-1 transition-transform">
                    <div className="p-2 w-fit rounded-xl bg-blue-500/10 text-blue-500 mb-2">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold opacity-60">Serial Entrepreneur</div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-black">Multiple Startups</p>
                  </div>
                  <div className="space-y-2 p-6 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm transform hover:-translate-y-1 transition-transform">
                    <div className="p-2 w-fit rounded-xl bg-emerald-500/10 text-emerald-500 mb-2">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold opacity-60">Nature & Physics</div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-black">Innovation Driver</p>
                  </div>
                  <div className="space-y-2 p-6 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm transform hover:-translate-y-1 transition-transform">
                    <div className="p-2 w-fit rounded-xl bg-purple-500/10 text-purple-500 mb-2">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold opacity-60">Mentorship</div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-black">2K+ Students</p>
                  </div>
                </div>
              </div>

              <div className="p-10 lg:p-16 bg-white dark:bg-[#1E293B] rounded-[48px] shadow-2xl border border-gray-100 dark:border-white/5 space-y-8 relative">
                <div className="absolute top-0 right-0 p-8 text-primary/10 select-none">
                  <Search className="w-32 h-32" />
                </div>

                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                  Abdishakur is a serial entrepreneur and an independent thinker driven by deep curiosity. His interests span the intricacies of building companies, the elegance of physics, and the serenity of nature—all of which fuel his commitment to innovation.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                  Having founded multiple startups, his ultimate goal is to apply his technical and entrepreneurial acumen to solving complex issues and contributing meaningfully to global advancement.
                </p>

                <div className="pt-6 border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-black italic">A</div>
                    <div>
                      <div className="font-bold dark:text-white">Abdishakur Ali</div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Founder, Garaad</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-32 bg-white dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Qiimahayaga
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                Qiimahayaga aasaasiga ah
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Cilmi-baaris",
                  icon: "🔍",
                  description: "Waxaan si joogto ah u su'aalnaa, u sahaminnaa, oo aan hal-abuur ku sameynaa si aan u helno hababka ugu wanaagsan.",
                },
                {
                  title: "Xawaare",
                  icon: "⚡",
                  description: "Waxaan si degdeg ah u dhisnaa, u tijaabinnaa, oo aan u hagaajinnaa, annagoo si joogto ah u horumarineyna.",
                },
                {
                  title: "Mas'uuliyad",
                  icon: "🤝",
                  description: "Waxaan si qoto dheer ugu xiranahay guusha Garaad iyo mustaqbalka ardaydeena.",
                },
                {
                  title: "Tayo",
                  icon: "✨",
                  description: "Waxaan ku dadaalnaa heer sare wax kasta oo aan qabanno.",
                },
                {
                  title: "Isgaarsiin",
                  icon: "💬",
                  description: "Waxaan si firfircoon u dhegeysannaa jawaabaha ardaydeena, macallimiinteena, iyo bulshadeena.",
                },
                {
                  title: "Hal-abuur",
                  icon: "💡",
                  description: "Waxaan ku dadaalnaa inaan soo bandhigno xalal cusub oo wax ku ool ah.",
                },
              ].map((value, index) => (
                <Card key={index} className="h-full border-none shadow-md hover:shadow-lg transition-all duration-300 bg-white dark:bg-white/5 backdrop-blur-sm rounded-[32px]">
                  <CardHeader>
                    <div className="text-3xl mb-2">{value.icon}</div>
                    <CardTitle className="text-xl text-primary font-bold">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Special Section */}
        <section className="py-32 bg-[#F8FAFC] dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
                Sifooyinkayaga
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">
                Maxaa Garaad ka dhigaya mid gaar ah?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Si gaar ah loogu talagalay ardayda Soomaaliyeed",
                  description: "Waxaan fahamsanahay xaaladda dhaqanka iyo kala duwanaanta luqadda ee dadka aan beegsaneyno.",
                  color: "bg-emerald-500/5",
                  borderColor: "border-l-emerald-500",
                },
                {
                  title: "Diiradda saaraya xallinta dhibaatooyinka",
                  description: "Koorsooyinkayagu waxay xoogga saaraan waxbarashada ku saleysan ficilka iyo fikirka qoto dheer.",
                  color: "bg-sky-500/5",
                  borderColor: "border-l-sky-500",
                },
                {
                  title: "Isticmaal xog yar",
                  description: "Waxaan jebineynaa caqabadaha helitaanka anagoo naqshadeynayna barxad isticmaalka xogta yaraysa.",
                  color: "bg-amber-500/5",
                  borderColor: "border-l-amber-500",
                },
                {
                  title: "Dhismaha bulsho",
                  description: "Waxaan dhiseynaa nidaam taageero oo ardayda Soomaaliyeed ay ku xiriiri karaan.",
                  color: "bg-rose-500/5",
                  borderColor: "border-l-rose-500",
                },
              ].map((feature, index) => (
                <div key={index} className={cn("rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 p-8 border-l-4 bg-white dark:bg-white/5", feature.borderColor)}>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vision and Mission */}
        <section className="py-32 bg-white dark:bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-6 text-center mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-primary/10 text-primary">
              Yoolkayaga
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
              Himilada & Aragtida
            </h2>
          </div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 px-6">
            <Card className="h-full border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-2xl text-primary font-bold">Himilada</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Awoodsiinta ardayda Soomaaliyeed waxbarasho la heli karo oo isdhexgal ah oo dhista fikirka qoto dheer iyo xirfadaha STEM si ay ugu guuleystaan adduun tignoolajiyaddu hoggaamiso.
                </p>
              </CardContent>
            </Card>

            <Card className="h-full border-none shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 rounded-[32px]">
              <CardHeader>
                <CardTitle className="text-2xl text-primary font-bold">Aragtida</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 text-lg">
                  Kacdoonka nidaamka dhijitaalka ah iyadoo la bixinayo waxbarasho tayo leh oo awood u siinaysa ardayda Soomaaliyeed inay ku kobcaan caalamka.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-32 bg-[#F8FAFC] dark:bg-[#0F172A]">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <div className="p-12 lg:p-20 bg-primary/5 dark:bg-primary/10 rounded-[64px] border border-primary/20 space-y-8 backdrop-blur-sm">
              <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight">Let's build the future together.</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">Available for collaborations and strategic partnerships.</p>
              <div className="flex justify-center">
                <Link href="mailto:Info@garaad.org">
                  <button className="px-10 py-5 bg-primary text-white font-bold rounded-3xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                    Work with Abdishakur
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
