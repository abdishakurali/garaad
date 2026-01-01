import Image from "next/image";
import { Metadata } from "next";
import {
    Code2,
    Rocket,
    Users,
    Brain,
    Zap,
    Globe,
    ChevronRight,
    Search,
    Github,
    Twitter,
    Linkedin,
    Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { playfair } from "@/lib/fonts";

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
    const { name } = await params;
    const displayName = name.replace(/-/g, " ");
    return {
        title: `${displayName} - Founder, Inventor & Mentor`,
        description: `Profile of ${displayName}, Founder and CEO of Garaad. A visionary inventor and self-taught developer dedicated to empowering the next generation.`,
        openGraph: {
            images: ["/images/garaad.jpg"],
        }
    };
}

export default async function AboutProfilePage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    // Decoding name for display
    const displayName = name.replace(/-/g, " ");

    // Bio sections based on user request
    const journeyHighlights = [
        {
            icon: <Code2 className="w-5 h-5" />,
            title: "Early Start",
            description: "Abdishakur started his programming career at just 15, quickly demonstrating a prodigious talent for technology.",
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            icon: <Rocket className="w-5 h-5" />,
            title: "First Venture",
            description: "By 17, he had already founded his first technology company, establishing a foundation for future leadership.",
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: "The Rise of Garaad",
            description: "Today, he is the Founder and CEO of Garaad, leading the company's mission to innovate and solve complex problems.",
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            icon: <Globe className="w-5 h-5" />,
            title: "Industry Impact",
            description: "Successfully built and launched several Software-as-a-Service (SaaS) products across the industry.",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] selection:bg-primary/30">
            {/* Header / Navigation Support */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-white italic">G</div>
                        <span className="font-bold text-lg tracking-tight dark:text-white">Garaad</span>
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-30 dark:opacity-20 pointer-events-none">
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/40 blur-[120px] rounded-full" />
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/30 blur-[120px] rounded-full" />
                    </div>

                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left Content */}
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                                    <Zap className="w-3.5 h-3.5" />
                                    Founder & Visionary
                                </div>

                                <h1 className={cn(playfair.className, "text-5xl lg:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight")}>
                                    {displayName}
                                </h1>

                                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-xl">
                                    Founder, Inventor, and Mentor. A Somali-born visionary dedicated to solving global advancement through technology.
                                </p>

                                <div className="flex flex-wrap gap-4 pt-4">
                                    <button className="px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/25 hover:scale-105 transition-all active:scale-95">
                                        Contact Me
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {[Twitter, Linkedin, Github].map((Icon, i) => (
                                            <button key={i} className="p-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors dark:text-white">
                                                <Icon className="w-5 h-5" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Image Container */}
                            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none lg:w-full">
                                <div className="absolute inset-4 rounded-[40px] bg-gradient-to-tr from-primary to-purple-600 blur-2xl opacity-20 animate-pulse" />
                                <div className="relative h-full w-full rounded-[40px] overflow-hidden border-4 border-white dark:border-[#1E293B] shadow-2xl">
                                    <Image
                                        src="/images/garaad.jpg"
                                        alt={displayName}
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
                            <p className="text-lg text-gray-500 dark:text-gray-400">From a teenage developer to a visionary industry leader.</p>
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

                {/* Extended Bio / Vision Section */}
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
                                        "As a full self-taught developer, I am passionate about fostering essential skills and guiding students toward successful careers in development."
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-2 p-6 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
                                        <div className="p-2 w-fit rounded-xl bg-blue-500/10 text-blue-500 mb-2">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div className="text-sm font-bold opacity-60">Mentorship</div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-black">2K+ Students</p>
                                    </div>
                                    <div className="space-y-2 p-6 rounded-[32px] bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 shadow-sm">
                                        <div className="p-2 w-fit rounded-xl bg-emerald-500/10 text-emerald-500 mb-2">
                                            <Brain className="w-5 h-5" />
                                        </div>
                                        <div className="text-sm font-bold opacity-60">Research</div>
                                        <p className="text-xs text-gray-400 uppercase tracking-widest font-black">Physics & AI</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 lg:p-16 bg-white dark:bg-[#1E293B] rounded-[48px] shadow-2xl border border-gray-100 dark:border-white/5 space-y-8 relative">
                                <div className="absolute top-0 right-0 p-8 text-primary/10 select-none">
                                    <Search className="w-32 h-32" />
                                </div>

                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                                    Abdishakur is a **bold, dedicated, and courageous independent thinker** driven by a deep curiosity. His interests span building, physics, and nature, all of which fuel his commitment to innovation.
                                </p>
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                                    His ultimate goal is to apply his technical acumen to **solving the world's most complex issues** and contribute meaningfully to global advancement.
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

                {/* CTA / Footer Transition */}
                <section className="py-32">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <div className="p-12 lg:p-20 bg-primary/5 dark:bg-primary/10 rounded-[64px] border border-primary/20 space-y-8 backdrop-blur-sm">
                            <h2 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight">Let's build the future together.</h2>
                            <p className="text-xl text-gray-600 dark:text-gray-400">Available for collaborations and strategic partnerships.</p>
                            <div className="flex justify-center">
                                <button className="px-10 py-5 bg-primary text-white font-bold rounded-3xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all active:scale-95 flex items-center gap-3">
                                    Work with Abdishakur
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
