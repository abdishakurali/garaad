"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategories } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

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

const CourseImage = ({ src, alt }: { src?: string; alt: string }) => {
  // Handle both relative and absolute URLs
  let imageSrc = src || defaultCourseImage;
  if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('/images/')) {
    imageSrc = `${process.env.NEXT_PUBLIC_API_URL}${imageSrc}`;
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', {
      src: imageSrc,
      alt,
      error: e
    });
  };

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', {
      src: imageSrc,
      alt
    });
  };

  // Temporarily use plain img for testing
  return (
    <div className="relative w-full h-40 bg-[#F8F9FB] flex items-center justify-center">
      <img
        src={imageSrc}
        alt={alt}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
        onError={handleImageError}
        onLoad={handleImageLoad}
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
        <div className="min-h-screen bg-white">
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
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          {showSuccessMessage && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <AlertTitle>Bixinta waa guuleysatay!</AlertTitle>
              <AlertDescription>
                Mahadsanid! Bixintaada waa la aqbalay. Hadda waad geli kartaa dhammaan casharrada premium-ka ah.
              </AlertDescription>
            </Alert>
          )}

          <h1 className="text-xl md:text-3xl font-bold mb-2">
            Wadooyinka Waxbarashada
          </h1>
          <p className="text-[16px] text-[#6B7280] mb-8">
            Wadooyin isku xiga oo loo maro hanashada
          </p>

          <div className="space-y-16">
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
                  <div key={category?.id ?? idx}>
                    <div className="flex items-start gap-6 mb-8">
                      {isLoading ? (
                        <Skeleton className="w-20 h-20 rounded-full" />
                      ) : (
                        <CategoryImage src={category.image} alt={category.title} />
                      )}
                      <div>
                        <h2 className="md:text-2xl font-bold mb-1">
                          {isLoading ? (
                            <Skeleton className="w-48 h-6" />
                          ) : (
                            category.title
                          )}
                        </h2>
                        <div className="text-[#6B7280] text-lg">
                          {isLoading ? (
                            <Skeleton className="w-64 h-4" />
                          ) : (
                            category.description
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 rounded-lg bg-accent">
                      {sortedCourses.map(
                        (course: Course | null, index: number) => {
                          if (isLoading || !course?.is_published) {
                            return (
                              <Card
                                key={course?.id ?? index}
                                className={`group overflow-hidden bg-white rounded-3xl border border-[#E5E7EB] hover:shadow-lg ${!course?.is_published ? "pointer-events-none opacity-50" : ""}`}
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
                                    <span className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm z-20">
                                      Dhowaan
                                    </span>
                                  )}
                                </div>
                                <div className="p-6">
                                  {isLoading ? (
                                    <>
                                      <Skeleton className="h-6 w-3/4 mb-2" />
                                      <Skeleton className="h-4 w-full mb-4" />
                                      <Skeleton className="h-10 w-full" />
                                    </>
                                  ) : (
                                    <>
                                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                        {course?.title}
                                      </h3>

                                      {(course?.lesson_count && course.lesson_count > 0) || (course?.estimatedHours && course.estimatedHours > 0) ? (
                                        <div className="flex items-center justify-between">
                                          {course?.lesson_count && course.lesson_count > 0 && (
                                            <span className="text-sm text-gray-500">
                                              {course.lesson_count} cashar
                                            </span>
                                          )}
                                          {course?.estimatedHours && course.estimatedHours > 0 && (
                                            <span className="text-sm text-gray-500">
                                              {course.estimatedHours} saac
                                            </span>
                                          )}
                                        </div>
                                      ) : null}
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
                              className="group"
                            >
                              <Card
                                key={course?.id ?? index}
                                className={`group overflow-hidden bg-white rounded-3xl border border-[#E5E7EB] hover:shadow-lg ${!course?.is_published ? "pointer-events-none opacity-50" : ""}`}
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
                                </div>
                                <div className="p-6">
                                  {isLoading ? (
                                    <>
                                      <Skeleton className="h-6 w-3/4 mb-2" />
                                      <Skeleton className="h-4 w-full mb-4" />
                                      <Skeleton className="h-10 w-full" />
                                    </>
                                  ) : (
                                    <>
                                      <h3 className="font-semibold text-md mb-2 line-clamp-2">
                                        {course?.title}
                                      </h3>

                                      {(course?.lesson_count && course.lesson_count > 0) || (course?.estimatedHours && course.estimatedHours > 0) ? (
                                        <div className="flex items-center justify-between">
                                          {course?.lesson_count && course.lesson_count > 0 && (
                                            <span className="text-sm text-gray-500">
                                              {course.lesson_count} cashar
                                            </span>
                                          )}
                                          {course?.estimatedHours && course.estimatedHours > 0 && (
                                            <span className="text-sm text-gray-500">
                                              {course.estimatedHours} saac
                                            </span>
                                          )}
                                        </div>
                                      ) : null}
                                    </>
                                  )}
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
