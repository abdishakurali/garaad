"use client";

import Image from "next/image";
import { useCategories } from "@/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import PremiumContent from "@/components/PremiumContent";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import AuthService from "@/services/auth";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useRouter } from "next/navigation";

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

const CourseImage = ({ src, alt }: { src?: string; alt: string }) => (
  <div className="relative w-full h-40 bg-[#F8F9FB] flex items-center justify-center">
    <Image
      src={src && isValidUrl(src) ? src : defaultCourseImage}
      alt={alt}
      width={100}
      height={100}
      className="object-contain"
    />
  </div>
);

interface Course {
  id: string;
  is_published: boolean;
  thumbnail?: string;
  title: string;
  is_new: boolean;
  slug: string;
}

interface EnrollmentProgress {
  id: number;
  user: number;
  course: number;
  course_title: string;
  progress_percent: number;
  enrolled_at: string;
}

const authFetcher = async <T,>(url: string): Promise<T> => {
  const service = AuthService.getInstance();
  return await service.makeAuthenticatedRequest<T>("get", url);
};

export default function CoursesPage() {
  const router = useRouter();
  const { categories, isLoading, isError } = useCategories();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [pendingCourseUrl, setPendingCourseUrl] = useState<string | null>(null);

  const { data: enrollments } = useSWR<EnrollmentProgress[]>("/api/lms/enrollments/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

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

  const handleCourseClick = (courseUrl: string) => {
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) {
      setPendingCourseUrl(courseUrl);
      return;
    }

    const isEnrolled = enrollments?.some(e => e.course === Number(courseUrl.split('/').pop()));
    router.push(isEnrolled ? courseUrl : '/subscribe');
  };

  useEffect(() => {
    // After successful authentication, redirect to subscribe page
    const authService = AuthService.getInstance();
    if (pendingCourseUrl && authService.isAuthenticated()) {
      router.push('/subscribe');
      setPendingCourseUrl(null);
    }
  }, [pendingCourseUrl, router]);

  if (isError) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {pendingCourseUrl && <AuthDialog />}
      <PremiumContent>
        <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          {showSuccessMessage && (
            <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Payment Successful!</AlertTitle>
              <AlertDescription>
                Waad ku mahadsantahay isdiiwaangelinta! Hadda waxaad heli kartaa dhammaan adeegyada Premium-ka.
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
                          const courseCard = (
                            <Card
                              key={course?.id ?? index}
                              className={`group overflow-hidden bg-white rounded-3xl border border-[#E5E7EB] hover:shadow-lg ${!course?.is_published ? "pointer-events-none opacity-50" : ""
                                }`}
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
                                {!isLoading && course?.is_new && (
                                  <span className="absolute top-3 right-3 bg-[#22C55E] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                                    NEW
                                  </span>
                                )}
                                {!isLoading && course?.is_published === false && (
                                  <span className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm z-20">
                                    Dhowaan
                                  </span>
                                )}
                              </div>
                              <div className="p-4 text-center">
                                {isLoading ? (
                                  <Skeleton className="h-4 w-32 mx-auto" />
                                ) : (
                                  <h3 className="font-medium text-base group-hover:text-[#2563EB] transition-colors">
                                    {course?.title}
                                  </h3>
                                )}
                              </div>
                            </Card>
                          );

                          if (isLoading || !course?.is_published) {
                            return courseCard;
                          }

                          const courseUrl = `/courses/${category.id}/${course.slug}`;

                          return (
                            <div
                              key={course.id}
                              onClick={() => handleCourseClick(courseUrl)}
                              className="cursor-pointer"
                            >
                              {courseCard}
                            </div>
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
      </PremiumContent>
    </div>
  );
}
