"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, BookOpen, Lock, Sparkles, ChevronRight, GraduationCap, PlayCircle, Award } from "lucide-react";
import { API_BASE_URL } from "@/lib/constants";
import { Reveal } from "./Reveal";

interface Course {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    is_published: boolean;
    category?: number | string;
}

interface Category {
    id: number;
    courses: Course[];
}

function CoursePreviewCard({
    course,
    categoryId,
}: {
    course: Course;
    categoryId: number | string;
}) {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);

    const isValidUrl = (url: string) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const imageSrc =
        course.thumbnail && isValidUrl(course.thumbnail)
            ? course.thumbnail
            : "/images/placeholder-course.svg";

    return (
        <div
            className="relative group rounded-3xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 cursor-pointer hover:-translate-y-1"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => router.push("/welcome")}
        >
            {/* Thumbnail */}
            <div className="relative w-full h-44 bg-muted flex items-center justify-center overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={course.title}
                    width={120}
                    height={120}
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder-course.svg";
                    }}
                />

                {/* "Free" badge */}
                <span className="absolute top-3 left-3 flex items-center gap-1 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    <Sparkles className="w-3 h-3" />
                    Bilaash
                </span>
            </div>

            {/* Title */}
            <div className="p-4">
                <div className="flex justify-center mb-2">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                </div>
                <h3 className="font-bold text-base text-center text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                </h3>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground font-medium">
                    <PlayCircle className="w-3.5 h-3.5 text-primary/70" />
                    <span>Daawo si bilaash ah</span>
                </div>
            </div>

            {/* Hover overlay — sign-up CTA */}
            <div
                className={`absolute inset-0 flex flex-col items-center justify-center p-4 backdrop-blur-[6px] bg-black/60 transition-all duration-400 rounded-3xl ${hovered ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col items-center gap-3 text-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-white font-bold text-sm leading-snug max-w-[160px]">
                        Ku biir si aad ugu bilaawdo koorsadan
                    </p>
                    <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-black px-5 py-2.5 rounded-full transition-all duration-200 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105">
                        Bilow Hadda
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function CardSkeleton() {
    return (
        <div className="rounded-3xl overflow-hidden border border-border bg-card animate-pulse">
            <div className="w-full h-44 bg-muted" />
            <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded-full w-3/4 mx-auto" />
                <div className="h-3 bg-muted rounded-full w-1/2 mx-auto" />
            </div>
        </div>
    );
}

export function FreePreviewSection() {
    const router = useRouter();
    const [courses, setCourses] = useState<(Course & { categoryId: number | string })[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/lms/categories/`);
                if (!res.ok) return;
                const data = await res.json();
                const categories: Category[] = Array.isArray(data)
                    ? data
                    : data.results || [];

                const allCourses = categories.flatMap((cat) =>
                    (cat.courses || [])
                        .filter((c) => c.is_published)
                        .map((c) => ({ ...c, categoryId: cat.id }))
                );

                // Pick up to 6
                setCourses(allCourses.slice(0, 6));
            } catch {
                // Silently fail — this is a preview, not critical
            } finally {
                setLoading(false);
            }
        }

        fetchCourses();
    }, []);

    // Don't render the section if loading finished but no courses found
    if (!loading && courses.length === 0) return null;

    return (
        <section className="relative py-14 sm:py-20 px-4 bg-muted/30 dark:bg-muted/10 overflow-hidden border-t border-border/50">
            {/* Subtle background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <Reveal>
                    <div className="text-center mb-10 sm:mb-12">
                        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
                            <GraduationCap className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Koorsooyin Tayo leh</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
                            Dhadhan <span className="text-primary">Koorsooyinka</span>
                        </h2>
                        <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-base">
                            Baro si habboon — ka bilow halka aad joogto. Darajo bilaash ah.
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <PlayCircle className="w-4 h-4 text-primary" />
                                Video & lessons
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-primary" />
                                Af-Soomaali
                            </span>
                        </div>
                    </div>
                </Reveal>

                {/* Course Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                        : courses.map((course) => (
                            <CoursePreviewCard
                                key={course.id}
                                course={course}
                                categoryId={course.categoryId}
                            />
                        ))}
                </div>

                {/* Footer link */}
                <Reveal>
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => router.push("/welcome")}
                            className="inline-flex items-center gap-2 text-primary font-bold text-base hover:gap-3 transition-all duration-200 group"
                        >
                            <GraduationCap className="w-5 h-5" />
                            <span>Dhammaan Koorsooyinka</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {courses.length}+ koorsood oo diyaar ah • Baro Af-Soomaali
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
