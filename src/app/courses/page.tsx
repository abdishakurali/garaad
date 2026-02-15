"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useApi";
import { Category, Course } from "@/types/lms";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";
import { API_BASE_URL } from "@/lib/constants";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

const defaultCategoryImage = "/images/placeholder-category.svg";
const defaultCourseImage = "/images/placeholder-course.svg";

const getAbsoluteImageUrl = (url: string | null | undefined, defaultImage: string) => {
  if (!url) return defaultImage;
  if (url.startsWith("http") || url.startsWith("/images/")) return url;

  // Ensure exactly one slash between base URL and path
  const cleanUrl = url.startsWith("/") ? url.substring(1) : url;
  return `${API_BASE_URL}/${cleanUrl}`;
};

const CategoryImage = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="relative w-20 h-20">
    <Image
      src={optimizeCloudinaryUrl(getAbsoluteImageUrl(src, defaultCategoryImage))}
      alt={alt}
      fill
      className="object-contain"
    />
  </div>
);

const CourseImage = ({ src, alt, priority = false }: { src?: string; alt: string; priority?: boolean }) => {
  const imageSrc = getAbsoluteImageUrl(src, defaultCourseImage);

  return (
    <div className="relative w-full h-40 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <Image
        src={optimizeCloudinaryUrl(imageSrc)}
        alt={alt}
        fill
        priority={priority}
        className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
    </div>
  );
};


export default function CoursesPage() {
  const { categories, isLoading: isSWRLoading, isError } = useCategories();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const isLoading = !hasMounted || isSWRLoading;

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

  if (hasMounted && isError) {
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

  const safeCategories = Array.isArray(categories) ? categories : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black transition-colors duration-500">
      {/* Course Schema */}
      {hasMounted && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              "itemListElement": safeCategories.flatMap(cat => cat?.courses || []).map((course, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Course",
                  "name": course?.title,
                  "description": course?.description,
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
      )}
      <Header />

      {/* Hero Section */}
      <div className="relative pt-20 pb-12 md:pt-40 md:pb-32 overflow-hidden">
        {/* Simplified & Clean Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute -bottom-24 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] animate-float opacity-50" />
        </div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.01] dark:opacity-[0.03] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_100%)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {showSuccessMessage && (
            <Alert className="mb-12 bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400 rounded-3xl backdrop-blur-md animate-fade-in-up max-w-2xl mx-auto md:mx-0">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <AlertTitle className="font-black">Bixinta waa guuleysatay!</AlertTitle>
              <AlertDescription className="font-bold">
                Mahadsanid! Hadda waad geli kartaa dhammaan casharrada premium-ka ah.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
            {/* Left Content: Text */}
            <div className="flex-1 text-center md:text-left space-y-6 md:space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Safar Aqooneed Hufan
                </span>
              </div>

              <h1 className="text-[clamp(2.5rem,8vw,5rem)] md:text-[clamp(3.5rem,6vw,6rem)] font-black leading-[1.1] tracking-tight">
                Waddooyinka{" "}
                <span className="relative inline-block">
                  <span className="absolute -inset-2 blur-2xl bg-primary/10 opacity-40" />
                  <span className="relative bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                    Waxbarashada
                  </span>
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                Waddooyin isku xiga oo loo maro hanashada STEM-ka iyo Tiknoolajiyadda casriga ah—oo Af-Soomaali ah.
              </p>
            </div>

          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="space-y-32">
          {(isLoading ? Array(3).fill(null) : safeCategories
            .filter(cat => cat?.courses && cat.courses.length > 0)
            .sort((a, b) => {
              const seqA = (a?.sequence !== undefined && a.sequence !== null) ? a.sequence : Number.MAX_SAFE_INTEGER;
              const seqB = (b?.sequence !== undefined && b.sequence !== null) ? b.sequence : Number.MAX_SAFE_INTEGER;
              return seqA - seqB;
            })
          ).map(
            (category: Category | null, idx) => {
              const sortedCourses = isLoading
                ? Array(4).fill(null)
                : [...(category?.courses || [])].sort((a, b) => {
                  // Primary sort: sequence ascending
                  const seqA = (a?.sequence !== undefined && a.sequence !== null) ? a.sequence : Number.MAX_SAFE_INTEGER;
                  const seqB = (b?.sequence !== undefined && b.sequence !== null) ? b.sequence : Number.MAX_SAFE_INTEGER;

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
                    <div className="flex items-center gap-10 group/header w-full">
                      {isLoading ? (
                        <div className="flex items-center gap-10 w-full">
                          <Skeleton className="w-24 h-24 rounded-[2.5rem]" />
                          <div className="space-y-4 flex-1">
                            <Skeleton className="w-64 h-12 rounded-2xl" />
                            <Skeleton className="w-96 h-6 rounded-xl" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative p-5 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md transition-all duration-500 group-hover/header:scale-110 group-hover/header:rotate-3 group-hover/header:shadow-primary/30">
                            <CategoryImage src={category?.image} alt={category?.title || 'Category'} />
                            <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-[3rem] opacity-0 group-hover/header:opacity-100 blur-xl transition-opacity duration-500" />
                          </div>
                          <div>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-3 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent group-hover/header:translate-x-2 transition-transform duration-300">
                              {category?.title}
                            </h2>
                            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-500 font-medium tracking-wide max-w-xl group-hover/header:translate-x-3 transition-transform duration-500">
                              {category?.description}
                            </p>
                          </div>
                        </>
                      )}
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
                                <div className="space-y-6">
                                  <Skeleton className="h-40 w-full rounded-[2.5rem]" />
                                  <div className="p-6 space-y-4">
                                    <Skeleton className="h-8 w-3/4 rounded-xl" />
                                    <Skeleton className="h-16 w-full rounded-xl" />
                                    <div className="flex justify-between items-center pt-4">
                                      <Skeleton className="h-6 w-1/3 rounded-lg" />
                                      <Skeleton className="w-10 h-10 rounded-2xl" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-0 flex-1 flex flex-col">
                                  <div className="relative h-40 bg-slate-50 dark:bg-slate-950/50 overflow-hidden flex items-center justify-center rounded-t-[2.5rem] opacity-40 grayscale-[0.5]">
                                    <CourseImage
                                      src={course?.thumbnail}
                                      alt={course?.title ?? ""}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                                  </div>
                                  <div className="p-6 flex-1 flex flex-col">
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
                                  </div>
                                </div>
                              )}
                            </Card>
                          );
                        }

                        return (
                          <Link
                            key={course.id}
                            href={`/courses/${category?.id}/${course.slug}`}
                            className="group h-full"
                          >
                            <Card
                              className="relative h-full flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem]"
                            >
                              {/* Deep Glow Effect */}
                              <div className="absolute -inset-2 bg-gradient-to-br from-primary/30 via-blue-500/30 to-purple-500/30 rounded-[3.5rem] opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700" />

                              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

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
                                      {isAuthenticated ? "BILOW BARASHADA" : "KU SOO BIIR"}
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
      </main >
    </div >
  );
}
