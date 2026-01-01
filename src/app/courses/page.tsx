"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ChevronRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
}

export default function CoursesPage() {
  const { categories, isLoading, isError } = useCategories();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

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
      <ProtectedRoute requirePremium={true}>
        <div className="min-h-screen bg-white dark:bg-slate-950">
          <Header />
          <div className="max-w-7xl mx-auto p-8">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to load categories.</AlertDescription>
            </Alert>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requirePremium={true}>
      <div className="min-h-screen bg-white dark:bg-slate-950">
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
        <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 relative">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#d18ffd]/5 rounded-full blur-[100px] pointer-events-none" />

          {showSuccessMessage && (
            <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
              <AlertTitle>Bixinta waa guuleysatay!</AlertTitle>
              <AlertDescription>
                Mahadsanid! Bixintaada waa la aqbalay. Hadda waad geli kartaa dhammaan casharrada premium-ka ah.
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-12">
            <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              Waddooyinka <span className="text-primary">Waxbarashada</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Waddooyin isku xiga oo loo maro hanashada STEM-ka iyo Tiknoolajiyadda.
            </p>
          </div>

          <div className="space-y-20">
            {(isLoading ? Array(3).fill(null) : categories ?? []).map(
              (category, idx) => {
                // Sort courses: published first, then unpublished
                const sortedCourses = isLoading
                  ? Array(4).fill(null)
                  : [...category.courses].sort((a, b) => {
                    if (a?.is_published === b?.is_published) return 0;
                    return a?.is_published ? -1 : 1;
                  });

                return (
                  <div key={category?.id ?? idx} className="relative">
                    <div className="flex items-center gap-6 mb-10 pb-4 border-b border-slate-100 dark:border-slate-800">
                      {isLoading ? (
                        <Skeleton className="w-16 h-16 rounded-2xl" />
                      ) : (
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl shadow-sm">
                          <CategoryImage src={category.image} alt={category.title} />
                        </div>
                      )}
                      <div>
                        <h2 className="text-2xl md:text-3xl font-black">
                          {isLoading ? (
                            <Skeleton className="w-48 h-8" />
                          ) : (
                            category.title
                          )}
                        </h2>
                        <div className="text-muted-foreground font-medium text-lg mt-1">
                          {isLoading ? (
                            <Skeleton className="w-64 h-5" />
                          ) : (
                            category.description
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                      {sortedCourses.map(
                        (course: Course | null, index: number) => {
                          if (isLoading || !course?.is_published) {
                            return (
                              <Card
                                key={course?.id ?? index}
                                className={cn(
                                  "group overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm",
                                  !course?.is_published && !isLoading ? "opacity-60 grayscale cursor-not-allowed" : ""
                                )}
                              >
                                <div className="relative">
                                  {isLoading ? (
                                    <Skeleton className="h-40 w-full" />
                                  ) : (
                                    <CourseImage
                                      src={course?.thumbnail}
                                      alt={course?.title ?? "Course image"}
                                    />
                                  )}
                                  {!isLoading && course?.is_published === false && (
                                    <span className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full z-20">
                                      Dhowaan
                                    </span>
                                  )}
                                </div>
                                <div className="p-8">
                                  {isLoading ? (
                                    <div className="space-y-3">
                                      <Skeleton className="h-6 w-3/4" />
                                      <Skeleton className="h-4 w-full" />
                                      <Skeleton className="h-10 w-full" />
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      <h3 className="font-black text-xl mb-2 line-clamp-2 leading-tight">
                                        {course?.title}
                                      </h3>

                                      {(course?.lesson_count && course.lesson_count > 0) || (course?.estimatedHours && course.estimatedHours > 0) ? (
                                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
                                          {course?.lesson_count && course.lesson_count > 0 && (
                                            <span className="flex items-center gap-1">
                                              {course.lesson_count} cashar
                                            </span>
                                          )}
                                          {course?.estimatedHours && course.estimatedHours > 0 && (
                                            <span className="flex items-center gap-1">
                                              {course.estimatedHours} saac
                                            </span>
                                          )}
                                        </div>
                                      ) : null}
                                    </div>
                                  )}
                                </div>
                              </Card>
                            );
                          }

                          return (
                            <Link
                              key={course.id}
                              href={`/courses/${category.id}/${course.slug}`}
                              className="group"
                            >
                              <Card
                                className="group h-full overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm group-hover:shadow-2xl group-hover:shadow-[#d18ffd]/10 group-hover:border-[#d18ffd]/20 transition-all duration-500"
                              >
                                <div className="relative overflow-hidden">
                                  <CourseImage
                                    src={course?.thumbnail}
                                    alt={course?.title ?? "Course image"}
                                    priority={idx === 0 && index < 4}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="p-8 flex flex-col h-[calc(100%-10rem)]">
                                  <h3 className="font-black text-xl mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {course?.title}
                                  </h3>

                                  <div className="mt-auto">
                                    {(course?.lesson_count && course.lesson_count > 0) || (course?.estimatedHours && course.estimatedHours > 0) ? (
                                      <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                        {course?.lesson_count && course.lesson_count > 0 && (
                                          <span>{course.lesson_count} cashar</span>
                                        )}
                                        {course?.estimatedHours && course.estimatedHours > 0 && (
                                          <span>{course.estimatedHours} saac</span>
                                        )}
                                      </div>
                                    ) : null}

                                    <div className="mt-6 flex items-center text-primary text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
                                      Barashada Bilow <ChevronRight size={14} className="ml-1" />
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
    </ProtectedRoute>
  );
}
