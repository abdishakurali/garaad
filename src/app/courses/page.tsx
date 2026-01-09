"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";

const defaultCategoryImage = "/images/placeholder-category.svg";
const defaultCourseImage = "/images/placeholder-course.svg";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const CategoryImage = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="relative w-20 h-20">
    <Image
      src={src && isValidUrl(src) ? src : defaultCategoryImage}
      alt={alt}
      fill
      className="object-contain"
    />
  </div>
);

const CourseImage = ({ src, alt, priority = false }: { src?: string; alt: string; priority?: boolean }) => {
  // Handle both relative and absolute URLs
  let imageSrc = src || defaultCourseImage;
  if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('/images/')) {
    imageSrc = `${API_BASE_URL}${imageSrc}`;
  }

  return (
    <div className="relative w-full h-40 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        priority={priority}
        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 25vw"
      />
    </div>
  );
};

interface Course {
  id: string;
  is_published: boolean;
  thumbnail?: string;
  title: string;
  is_new: boolean;
  slug: string;
  description?: string;
  lesson_count?: number;
  estimatedHours?: number;
  sequence?: number;
  created_at?: string;
  updated_at?: string;
}

export default function CoursesPage() {
  const { categories, isLoading, isError } = useCategories();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "payment_completed") {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black">
        <Header />
        <div className="max-w-7xl mx-auto p-8">
          <Alert variant="destructive" className="rounded-3xl border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="font-black">Khalad ayaa dhacay</AlertTitle>
            <AlertDescription className="font-bold">
              Waan ka xunnahay, waxaa ku guuldareysatay soo dejinta koorsooyinka.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500">
      {/* Course Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": categories?.flatMap(cat => cat.courses || []).map((course, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "Course",
                "name": course.title,
                "description": course.description,
                "provider": {
                  "@type": "EducationalOrganization",
                  "name": "Garaad STEM",
                  "sameAs": "https://garaad.so"
                }
              }
            })) || []
          })
        }}
      />
      <Header />

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[120px] animate-float" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          {showSuccessMessage && (
            <Alert className="mb-12 bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400 rounded-3xl backdrop-blur-md animate-fade-in-up">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="font-black">Bixinta waa guuleysatay!</AlertTitle>
              <AlertDescription className="font-bold">
                Mahadsanid! Bixintaada waa la aqbalay. Hadda waad geli kartaa dhammaan casharrada premium-ka ah.
              </AlertDescription>
            </Alert>
          )}

          <div className="max-w-3xl">
            <h1 className="text-4xl flex gap-2 sm:text-5xl md:text-7xl font-black mb-8 tracking-tighter animate-fade-in-up">
              Waddooyinka <span className="bg-gradient-to-r ml-2 from-primary via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Waxbarashada
              </span>
            </h1>
            <p className="text-xl flex md:text-2xl text-slate-500 dark:text-slate-400 font-bold mb-10 leading-relaxed max-w-2xl animate-fade-in-up delay-200">
              Waddooyin isku xiga oo loo maro hanashada STEM-ka iyo Tiknoolajiyadda casriga ah.
            </p>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="space-y-32">
          {(isLoading ? Array(3).fill(null) : (categories ?? [])
            .filter(cat => cat.courses && cat.courses.length > 0)
            .sort((a, b) => {
              const seqA = (a?.sequence && a.sequence > 0) ? a.sequence : Infinity;
              const seqB = (b?.sequence && b.sequence > 0) ? b.sequence : Infinity;
              return seqA - seqB;
            })
          ).map(
            (category, idx) => {
              const sortedCourses = isLoading
                ? Array(4).fill(null)
                : [...category.courses].sort((a, b) => {
                  // Primary sort: sequence ascending (treat 0 as Infinity to put at end)
                  const seqA = (a?.sequence && a.sequence > 0) ? a.sequence : Infinity;
                  const seqB = (b?.sequence && b.sequence > 0) ? b.sequence : Infinity;
                  if (seqA !== seqB) return seqA - seqB;

                  // Secondary sort: created_at ascending (oldest first)
                  const dateA = a?.created_at ? new Date(a.created_at).getTime() : 0;
                  const dateB = b?.created_at ? new Date(b.created_at).getTime() : 0;
                  return dateA - dateB;
                });

              return (
                <div key={category?.id ?? idx} className="animate-fade-in-up">
                  {/* Category Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 pb-8 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-8">
                      {isLoading ? (
                        <Skeleton className="w-20 h-20 rounded-3xl" />
                      ) : (
                        <div className="group relative p-4 bg-white dark:bg-slate-900/50 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-primary/20">
                          <CategoryImage src={category.image} alt={category.title} />
                          <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-500 rounded-[2rem] opacity-0 group-hover:opacity-20 blur transition-opacity" />
                        </div>
                      )}
                      <div>
                        <div className="text-2xl md:text-3xl font-black tracking-tight mb-1">
                          {isLoading ? (
                            <Skeleton className="w-56 h-8" />
                          ) : (
                            category.title
                          )}
                        </div>
                        <div className="text-lg text-slate-500 dark:text-slate-400 font-bold tracking-wide">
                          {isLoading ? (
                            <Skeleton className="w-72 h-6" />
                          ) : (
                            category.description
                          )}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Courses Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                    {sortedCourses.map(
                      (course: Course | null, index: number) => {
                        const isLocked = !isLoading && !course?.is_published;

                        if (isLoading || isLocked) {
                          return (
                            <Card
                              key={course?.id ?? index}
                              className={cn(
                                "group relative h-full flex flex-col overflow-hidden bg-white dark:bg-slate-950 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800/50 shadow-sm transition-all duration-500",
                                isLocked ? "opacity-50 pointer-events-none" : ""
                              )}
                            >
                              {isLoading ? (
                                <Skeleton className="h-40 w-full" />
                              ) : (
                                <div className="relative h-40 bg-slate-100 dark:bg-slate-900 flex items-center justify-center grayscale">
                                  <CourseImage src={course?.thumbnail} alt={course?.title ?? ""} />
                                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl z-20 border border-white/20">
                                    Dhowaan
                                  </div>
                                </div>
                              )}
                              <div className="p-6 flex-1 flex flex-col">
                                {isLoading ? (
                                  <div className="space-y-4">
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-10 w-full" />
                                  </div>
                                ) : (
                                  <>
                                    <h3 className="font-black text-xl mb-3 line-clamp-1 leading-tight text-slate-400 dark:text-slate-600">
                                      {course?.title}
                                    </h3>
                                    {course?.description && (
                                      <p className="text-sm text-slate-400 dark:text-slate-700 line-clamp-2 mb-4 font-medium">
                                        {course.description}
                                      </p>
                                    )}
                                    <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-900">
                                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span>Lama helayo (Soon)</span>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </Card>
                          );
                        }

                        return (
                          <Link
                            key={course.id}
                            href={`/courses/${category.id}/${course.slug}`}
                            className="group h-full"
                          >
                            <Card
                              className="relative h-full flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem]"
                            >
                              {/* Glow Effect */}
                              <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 via-blue-500/20 to-purple-500/20 rounded-[3rem] opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />

                              <div className="relative h-40 bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center rounded-t-[2.5rem]">
                                <CourseImage
                                  src={course?.thumbnail}
                                  alt={course?.title ?? ""}
                                  priority={idx === 0 && index < 3}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {course.is_new && (
                                  <div className="absolute top-4 right-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-2xl z-20 shadow-lg animate-pulse-slow">
                                    CUSUB
                                  </div>
                                )}
                              </div>

                              <div className="relative p-6 flex-1 flex flex-col bg-white dark:bg-slate-900">
                                <h3 className="font-black text-xl mb-3 line-clamp-1 leading-tight group-hover:text-primary transition-colors duration-300">
                                  {course?.title}
                                </h3>

                                {course?.description && (
                                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">
                                    {course.description}
                                  </p>
                                )}

                                <div className="mt-auto flex flex-col gap-5">
                                  {(course?.lesson_count && course.lesson_count > 0) || (course?.estimatedHours && course.estimatedHours > 0) ? (
                                    <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                                      {course?.lesson_count && course.lesson_count > 0 && (
                                        <span className="flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                          {course.lesson_count} CASHAR
                                        </span>
                                      )}
                                      {course?.estimatedHours && course.estimatedHours > 0 && (
                                        <span className="flex items-center gap-2">
                                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                          {course.estimatedHours} SAAC
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="h-4" />
                                  )}

                                  <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-slate-800 mt-1">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                                      BILOW BARASHADA
                                    </span>
                                    <div className="w-9 h-9 rounded-2xl bg-slate-50 dark:bg-black flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:rotate-12">
                                      <ChevronRight size={16} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          </Link>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </main>
    </div>
  );
}
