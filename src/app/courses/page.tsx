"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { useRouter, useSearchParams } from "next/navigation";
import AuthService from "@/services/auth";
import { useCategories } from "@/hooks/useApi";
import type { Course } from "@/types/lms";

const defaultCategoryImage = "/images/placeholder-category.svg";
const defaultCourseImage = "/images/placeholder-course.svg";

const CategoryImage = ({ src, alt }: { src?: string; alt: string }) => {
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  return (
    <div className="relative w-20 h-20">
      <Image
        src={src && isValidUrl(src) ? src : defaultCategoryImage}
        alt={alt}
        fill
        className="object-contain"
        priority
        loading="eager"
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultCategoryImage;
        }}
      />
    </div>
  );
};

const CourseImage = ({ src, alt }: { src?: string; alt: string }) => {
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  return (
    <div className="relative w-full h-40 bg-[#F8F9FB] flex items-center justify-center">
      <Image
        src={src && isValidUrl(src) ? src : defaultCourseImage}
        alt={alt}
        width={100}
        height={100}
        className="object-contain"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = defaultCourseImage;
        }}
      />
    </div>
  );
};

export default function CoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, isLoading, isError } = useCategories();
  const [activeCourse, setActiveCourse] = useState<{
    categoryId: string | number;
    courseId: string | number;
  } | null>(null);

  const courseRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize activeCourse from URL or default to first published
  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    const courseId = searchParams.get("courseId");
    if (categoryId && courseId) {
      setActiveCourse({ categoryId, courseId });
    } else if (!isLoading && categories) {
      const firstCat = categories.find((c) =>
        c.courses?.some((co) => co.is_published)
      );
      const firstCourse = firstCat?.courses?.find((co) => co.is_published);
      if (firstCat && firstCourse) {
        setActiveCourse({ categoryId: firstCat.id, courseId: firstCourse.id });
      }
    }
  }, [isLoading, categories, searchParams]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!AuthService.getInstance().isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  // IntersectionObserver to sync scroll → URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const [, categoryId, courseId] = entry.target.id.split("-");
            const url = new URL(window.location.href);
            url.searchParams.set("categoryId", categoryId);
            url.searchParams.set("courseId", courseId);
            window.history.replaceState({}, "", url.toString());
          }
        });
      },
      { threshold: 0.5 }
    );
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const registerCourseRef = (id: string, el: HTMLDivElement | null) => {
    if (el) {
      courseRefs.current.set(id, el);
      observerRef.current?.observe(el);
    }
  };

  // Scroll active course into view
  useEffect(() => {
    if (!activeCourse) return;
    const id = `course-${activeCourse.categoryId}-${activeCourse.courseId}`;
    const el = courseRefs.current.get(id);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }, [activeCourse]);

  const handleCourseSelect = (
    categoryId: string | number,
    courseId: string | number
  ) => {
    setActiveCourse({ categoryId, courseId });
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{isError.message}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
        <h1 className="text-xl md:text-3xl font-bold mb-2">
          Wadooyinka Waxbarashada
        </h1>
        <p className="text-[16px] text-[#6B7280] mb-8">
          Wadooyin isku xiga oo loo maro hanashada
        </p>

        {isLoading ? (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i}>
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-20 w-20" />
                  <div>
                    <Skeleton className="h-8 w-64 mb-2" />
                    <Skeleton className="h-5 w-96" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, idx) => (
                    <Skeleton key={idx} className="h-[220px] rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {categories?.map((category) => (
              <div key={category.id}>
                <div className="flex items-start gap-6 mb-8">
                  <CategoryImage src={category.image} alt={category.title} />
                  <div>
                    <h2 className="md:text-2xl font-bold mb-1">
                      {category.title}
                    </h2>
                    <p className="text-[#6B7280] text-lg">
                      {category.description}
                    </p>
                  </div>
                </div>

                {/* Updated grid: vertical on mobile, multi-col on larger */}
                <div
                  className="
                    grid grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    gap-6
                    p-4 rounded-lg bg-accent
                  "
                >
                  {category.courses?.map((course) => {
                    console.log('Course:', course.title, 'is_published:', course.is_published, 'type:', typeof course.is_published);
                    const courseKey = `course-${category.id}-${course.id}`;
                    const isActive =
                      activeCourse?.categoryId === category.id &&
                      activeCourse?.courseId === course.id;
                    const href = `/courses/${category.id}/${course.slug}`;

                    return (
                      <Link
                        key={course.id}
                        href={course.is_published ? href : '#'}
                        onClick={(e) => {
                          if (!course.is_published) {
                            e.preventDefault();
                            window.location.reload();
                            return;
                          }
                          handleCourseSelect(category.id, course.id);
                        }}
                        className={`block ${!course.is_published ? 'cursor-not-allowed opacity-60' : ''}`}
                      >
                        <div
                          id={courseKey}
                          ref={(el) => registerCourseRef(courseKey, el)}
                          className={`transition-all duration-300 ${isActive
                            ? "scale-105 ring-2 ring-primary ring-offset-2"
                            : ""
                            }`}
                        >
                          <Card className={`group overflow-hidden bg-white rounded-3xl hover:shadow-lg border border-[#E5E7EB] ${!course.is_published ? 'hover:shadow-none' : ''}`}>
                            <div className="relative">
                              <CourseImage
                                src={course.thumbnail || undefined}
                                alt={course.title}
                              />
                              {course.is_new && (
                                <span className="absolute top-3 right-3 bg-[#22C55E] text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
                                  NEW
                                </span>
                              )}
                              {course.is_published === false && (
                                <span className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm z-20">
                                  Dhowaan
                                </span>
                              )}
                            </div>
                            <div className="p-4 text-center">
                              <h3 className={`font-medium text-base ${course.is_published ? 'group-hover:text-[#2563EB]' : 'text-gray-500'} transition-colors`}>
                                {course.title}
                              </h3>
                            </div>
                          </Card>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
