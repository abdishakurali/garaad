"use client";

import { useState, useEffect, useCallback } from "react";
import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { StartupCard } from "@/components/launchpad/StartupCard";
import { StartupCardSkeleton } from "@/components/launchpad/StartupCardSkeleton";
import { launchpadService } from "@/services/launchpad";
import type { StartupListItem, StartupCategory, StartupFilter } from "@/types/launchpad";
import { ChevronDown, Rocket, TrendingUp, Clock, Award, Briefcase, Plus, Terminal, Code2, Database, Cpu } from "lucide-react";
import Link from "next/link";
import { TechIcon } from "@/components/launchpad/TechIcon";


const FILTER_OPTIONS: { value: StartupFilter; label: string; icon: React.ReactNode }[] = [
    { value: "trending", label: "Trending", icon: <TrendingUp className="w-4 h-4" /> },
    { value: "new", label: "Cusub", icon: <Clock className="w-4 h-4" /> },
    { value: "top", label: "Ugu Sarreeya", icon: <Award className="w-4 h-4" /> },
];

export function LaunchpadListClient() {
    const [startups, setStartups] = useState<StartupListItem[]>([]);
    const [categories, setCategories] = useState<StartupCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentFilter, setCurrentFilter] = useState<StartupFilter>("trending");

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStartups = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await launchpadService.getStartups({
                filter: currentFilter,
                category: selectedCategory || undefined,
                page_size: 100,
            });

            setStartups(response.results || []);
        } catch (err) {
            setError("Wax qalad ah ayaa dhacay");
            console.error("Failed to fetch startups:", err);
        } finally {
            setIsLoading(false);
        }
    }, [currentFilter, selectedCategory]);


    const fetchCategories = async () => {
        try {
            const data = await launchpadService.getCategories();
            setCategories(data || []);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchStartups();
    }, [fetchStartups]);

    const handleVote = async (startupId: string) => {
        try {
            const response = await launchpadService.toggleVote(startupId);
            setStartups((prev) =>
                prev.map((s) =>
                    s.id === startupId
                        ? { ...s, vote_count: response.vote_count, user_has_voted: response.voted }
                        : s
                )
            );
        } catch (err) {
            console.error("Vote failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SiteHeader />

            {/* Full Width Hero Section - Challenge Style */}
            <section className="relative w-full overflow-hidden bg-[#0A0F1C] border-b border-white/5 py-12 sm:py-16">
                {/* Background tech icons & decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Animated Background Blobs */}
                    <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-slow" />
                    <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-float opacity-50" />

                    {/* Grid Pattern with Radial Mask */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />

                    {/* Floating Tech Icons - Subtle Background Layer */}
                    <div className="absolute top-12 left-[10%] opacity-[0.05] animate-pulse">
                        <TechIcon name="React" className="w-16 h-16 grayscale" />
                    </div>
                    <div className="absolute bottom-16 left-[18%] opacity-[0.03]">
                        <TechIcon name="Node.js" className="w-20 h-20 grayscale" />
                    </div>
                    <div className="absolute top-24 right-[15%] opacity-[0.06] rotate-12">
                        <TechIcon name="Python" className="w-12 h-12 grayscale" />
                    </div>
                    <div className="absolute bottom-12 right-[25%] opacity-[0.04] -rotate-12">
                        <TechIcon name="TypeScript" className="w-14 h-14 grayscale" />
                    </div>

                    {/* Conceptual Engineering Icons */}
                    <div className="absolute top-1/2 left-[5%] opacity-[0.02] -translate-y-1/2 rotate-12">
                        <Code2 className="w-48 h-48" />
                    </div>
                    <div className="absolute top-1/2 right-[5%] opacity-[0.02] -translate-y-1/2 -rotate-12">
                        <Terminal className="w-48 h-48" />
                    </div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/15 rounded-full text-primary text-xs font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Rocket className="w-4 h-4 fill-primary" />
                        Garaad Launchpad
                    </div>

                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        Startup-yada <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent italic">Soomaaliyeed</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                        Hel startup-yada cusub ee lagu dhisay tech-ka casriga ah. Codee kuwaaga jeceshahay, ama soo bandhig mashruucaaga maanta.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                        <Link
                            href="/launchpad/submit"
                            className="group relative inline-flex items-center gap-2.5 px-8 py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                            <Plus className="w-6 h-6 stroke-[3px]" />
                            Soo Dir Startup
                        </Link>

                        <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" /> Live mashaariic</span>
                            <span className="opacity-20">|</span>
                            <span>🚀 New daily</span>
                        </div>
                    </div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Content Layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Categories */}
                    <aside className="w-full lg:w-64 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="sticky top-24 space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Khadka (Industries)</h3>
                                <nav className="flex flex-col space-y-1">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${!selectedCategory
                                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${!selectedCategory ? 'bg-white/20' : 'bg-white/5'}`}>
                                            🏠
                                        </div>
                                        <span>Dhammaan</span>
                                    </button>

                                    {categories
                                        .filter(cat => startups.some(s => s.category?.id === cat.id))
                                        .map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${selectedCategory === cat.id
                                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base ${selectedCategory === cat.id ? 'bg-white/20' : 'bg-white/5'}`}>
                                                    {cat.icon}
                                                </div>
                                                <span>{cat.name_somali || cat.name}</span>
                                            </button>
                                        ))}

                                </nav>
                            </div>

                            {/* Stats or extra info could go here */}
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hidden lg:block">
                                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Bulshada</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Ku dhufo "Codee" si aad u taageerto startup-yada aad jeceshahay.
                                </p>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Filters Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-2 rounded-2xl bg-white/5 border border-white/10 lg:bg-transparent lg:border-none lg:p-0">
                            {/* Mobile Category Select - only visible on mobile if sidebar is too long or hidden */}
                            <div className="lg:hidden w-full mb-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block px-2">Nooca</label>
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                                    value={selectedCategory || ""}
                                    onChange={(e) => setSelectedCategory(e.target.value || null)}
                                >
                                    <option value="">Dhammaan</option>
                                    {categories
                                        .filter(cat => startups.some(s => s.category?.id === cat.id))
                                        .map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name_somali || cat.name}</option>
                                        ))}

                                </select>
                            </div>

                            {/* Result Count / Status */}
                            <div className="text-sm text-muted-foreground px-2">
                                <span className="font-bold text-foreground">{startups.length}</span> mashruuc ayaa la helay
                            </div>

                            <div className="flex items-center gap-3 ml-auto">

                                {/* Sort Filter */}
                                <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                                    {FILTER_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setCurrentFilter(option.value)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${currentFilter === option.value
                                                ? "bg-primary text-white shadow-sm"
                                                : "text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            {option.icon}
                                            <span className="hidden sm:inline">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Startups Grid */}
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <StartupCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : error ? (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                                <p className="text-red-400 mb-4">{error}</p>
                                <button
                                    onClick={fetchStartups}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                                >
                                    Isku day markale
                                </button>
                            </div>
                        ) : startups.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                                <Rocket className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Ma jiraan Startups weli</h3>
                                <p className="text-muted-foreground mb-6">
                                    Noqo qofka ugu horreeya ee soo dirta Startup!
                                </p>
                                <Link
                                    href="/launchpad/submit"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90"
                                >
                                    <Plus className="w-5 h-5" />
                                    Soo Dir Startup
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {startups.map((startup, index) => (
                                    <StartupCard
                                        key={startup.id}
                                        startup={startup}
                                        rank={currentFilter === "trending" || currentFilter === "top" ? index + 1 : undefined}
                                        onVote={() => handleVote(startup.id)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>

            <FooterSection />
        </div>
    );
}
