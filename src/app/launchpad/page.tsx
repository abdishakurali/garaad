"use client";

import { useState, useEffect, useCallback } from "react";
import { Header as SiteHeader } from "@/components/Header";
import { FooterSection } from "@/components/sections/FooterSection";
import { StartupCard } from "@/components/launchpad/StartupCard";
import { launchpadService } from "@/services/launchpad";
import type { StartupListItem, StartupCategory, StartupFilter } from "@/types/launchpad";
import { ChevronDown, Rocket, TrendingUp, Clock, Award, Briefcase, Plus } from "lucide-react";
import Link from "next/link";

const FILTER_OPTIONS: { value: StartupFilter; label: string; icon: React.ReactNode }[] = [
    { value: "trending", label: "Trending", icon: <TrendingUp className="w-4 h-4" /> },
    { value: "new", label: "Cusub", icon: <Clock className="w-4 h-4" /> },
    { value: "top", label: "Ugu Sarreeya", icon: <Award className="w-4 h-4" /> },
];

export default function LaunchpadPage() {
    const [startups, setStartups] = useState<StartupListItem[]>([]);
    const [categories, setCategories] = useState<StartupCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [currentFilter, setCurrentFilter] = useState<StartupFilter>("trending");
    const [showHiringOnly, setShowHiringOnly] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStartups = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await launchpadService.getStartups({
                filter: currentFilter,
                category: selectedCategory || undefined,
                is_hiring: showHiringOnly || undefined,
            });
            setStartups(response.results || []);
        } catch (err) {
            setError("Wax qalad ah ayaa dhacay");
            console.error("Failed to fetch startups:", err);
        } finally {
            setIsLoading(false);
        }
    }, [currentFilter, selectedCategory, showHiringOnly]);

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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary mb-4">
                        <Rocket className="w-5 h-5" />
                        <span className="font-medium">Launchpad</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black mb-4">
                        Startup-yada <span className="text-primary">Soomaaliyeed</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Hel startup-yada cusub ee lagu dhisay tech-ka casriga ah. Codee kuwaaga jeceshahay, ku biir shaqaalaynta, ama soo dir startup-kaaga.
                    </p>
                </div>

                {/* Submit CTA */}
                <div className="flex justify-center mb-10">
                    <Link
                        href="/launchpad/submit"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                    >
                        <Plus className="w-5 h-5" />
                        Soo Dir Startup-kaaga
                    </Link>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    {/* Category Filter */}
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory
                                    ? "bg-primary text-white"
                                    : "bg-white/10 hover:bg-white/20 border border-white/10"
                                }`}
                        >
                            Dhammaan
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.id
                                        ? "bg-primary text-white"
                                        : "bg-white/10 hover:bg-white/20 border border-white/10"
                                    }`}
                            >
                                {cat.icon} {cat.name_somali || cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Sort Filter + Hiring Toggle */}
                    <div className="flex items-center gap-3">
                        {/* Hiring Toggle */}
                        <button
                            onClick={() => setShowHiringOnly(!showHiringOnly)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${showHiringOnly
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-white/10 hover:bg-white/20 border border-white/10"
                                }`}
                        >
                            <Briefcase className="w-4 h-4" />
                            Shaqaalaynaya
                        </button>

                        {/* Sort Filter */}
                        <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                            {FILTER_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setCurrentFilter(option.value)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${currentFilter === option.value
                                            ? "bg-primary text-white"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {option.icon}
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Startups Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={i}
                                className="h-64 rounded-2xl bg-white/5 animate-pulse border border-white/10"
                            />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={fetchStartups}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                        >
                            Isku day markale
                        </button>
                    </div>
                ) : startups.length === 0 ? (
                    <div className="text-center py-20">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </main>

            <FooterSection />
        </div>
    );
}
