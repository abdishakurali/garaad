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

  const imageSrc = src && isValidUrl(src) ? src : defaultCategoryImage;

  return (
    <div className="relative w-20 h-20">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-contain"
        priority
        loading="eager"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = defaultCategoryImage;
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

  const imageSrc = src && isValidUrl(src) ? src : defaultCourseImage;

  return (
    <div className="relative w-full h-40 bg-[#F8F9FB] flex items-center justify-center">
      <Image
        src={imageSrc}
        alt={alt}
        width={100}
        height={100}
        className="object-contain"
        loading="lazy"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = defaultCourseImage;
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    const courseId = searchParams.get("courseId");

    if (categoryId && courseId) {
      setActiveCourse({ categoryId, courseId });
    } else if (!isLoading && categories) {
      const cat = categories.find((c) =>
        c.courses?.some((co) => co.is_published)
      );
      if (cat) {
        const firstCourse = cat.courses?.find((co) => co.is_published);
        if (firstCourse) {
          setActiveCourse({ categoryId: cat.id, courseId: firstCourse.id });
        }
      }
    }
  }, [isLoading, categories, searchParams]);

  useEffect(() => {
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) router.push("/");
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const id = entry.target.id;
            if (entry.isIntersecting) {
              const [, categoryId, courseId] = id.split("-");
              const url = new URL(window.location.href);
              url.searchParams.set("categoryId", categoryId);
              url.searchParams.set("courseId", courseId);
              window.history.replaceState({}, "", url.toString());
            }
          });
        },
        { threshold: 0.5 }
      );

      return () => observerRef.current?.disconnect();
    }
  }, []);

  const registerCourseRef = (id: string, el: HTMLDivElement | null) => {
    if (el) {
      courseRefs.current.set(id, el);
      observerRef.current?.observe(el);
    }
  };

  useEffect(() => {
    if (activeCourse) {
      const id = `course-${activeCourse.categoryId}-${activeCourse.courseId}`;
      const el = courseRefs.current.get(id);
      if (el)
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

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;
    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    // Mouse handlers
    const onMouseDown = (e: MouseEvent) => {
      isDown = true;
      slider.classList.add("cursor-grabbing");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const onMouseLeave = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const onMouseUp = () => {
      isDown = false;
      slider.classList.remove("cursor-grabbing");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;
      slider.scrollLeft = scrollLeft - walk;
    };

    // Touch handlers
    const onTouchStart = (e: TouchEvent) => {
      isDown = true;
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDown) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 1;
      slider.scrollLeft = scrollLeft - walk;
      e.preventDefault();
    };

    const onTouchEnd = () => {
      isDown = false;
    };

    // Event listeners
    slider.addEventListener("mousedown", onMouseDown);
    slider.addEventListener("mouseleave", onMouseLeave);
    slider.addEventListener("mouseup", onMouseUp);
    slider.addEventListener("mousemove", onMouseMove);

    slider.addEventListener("touchstart", onTouchStart, { passive: false });
    slider.addEventListener("touchmove", onTouchMove, { passive: false });
    slider.addEventListener("touchend", onTouchEnd);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      slider.removeEventListener("mouseleave", onMouseLeave);
      slider.removeEventListener("mouseup", onMouseUp);
      slider.removeEventListener("mousemove", onMouseMove);

      slider.removeEventListener("touchstart", onTouchStart);
      slider.removeEventListener("touchmove", onTouchMove);
      slider.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

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
      <div className="max-w-7xl mx-auto">
        <Header />
      </div>
      <main className="max-w-7xl mx-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-8">
              <h1 className="text-xl md:text-3xl font-bold mb-2">
                Wadooyinka Waxbarashada
              </h1>
              <p className="text-[16px] text-[#6B7280]">
                Wadooyin isku xiga oo loo maro hanashada
              </p>
            </div>

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
                      <CategoryImage
                        src={category.image}
                        alt={category.title}
                      />
                      <div>
                        <h2 className="md:text-2xl font-bold mb-1">
                          {category.title}
                        </h2>
                        <p className="text-[#6B7280] text-lg">
                          {category.description}
                        </p>
                      </div>
                    </div>
                    <div
                      ref={scrollRef}
                      className="grid grid-flow-col auto-cols-[minmax(280px,1fr)] sm:grid-flow-row sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto p-4 rounded-lg bg-accent scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent cursor-grab touch-pan-x"
                    >
                      {category.courses?.map((course: Course) => {
                        const courseId = `course-${category.id}-${course.id}`;
                        const isActive =
                          activeCourse?.categoryId === category.id &&
                          activeCourse?.courseId === course.id;

                        return (
                          <div
                            key={course.id}
                            id={courseId}
                            ref={(el) => registerCourseRef(courseId, el)}
                            className={`${
                              isActive
                                ? "scale-105 ring-2 ring-primary ring-offset-2"
                                : ""
                            } transition-all duration-300`}
                            onClick={() =>
                              course.is_published &&
                              handleCourseSelect(category.id, course.id)
                            }
                          >
                            {course.is_published ? (
                              <Link
                                href={`/courses/${category.id}/${course.slug}`}
                              >
                                <Card className="group overflow-hidden bg-white rounded-3xl hover:shadow-lg transition-all duration-300 border border-[#E5E7EB]">
                                  <CourseImage
                                    src={course.thumbnail || undefined}
                                    alt={course.title}
                                  />
                                  {course.is_new && (
                                    <span className="absolute top-3 right-3 bg-[#22C55E] text-white text-xs font-medium px-2 py-1 rounded-md">
                                      NEW
                                    </span>
                                  )}
                                  <div className="p-4 text-center">
                                    <h3 className="font-medium text-base group-hover:text-[#2563EB] transition-colors">
                                      {course.title}
                                    </h3>
                                  </div>
                                </Card>
                              </Link>
                            ) : (
                              <Card className="group overflow-hidden bg-white rounded-3xl border border-[#E5E7EB] opacity-60">
                                <CourseImage
                                  src={course.thumbnail || undefined}
                                  alt={course.title}
                                />
                                <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded-md">
                                  Dhowaan
                                </span>
                                <div className="p-4 text-center">
                                  <h3 className="font-medium text-base">
                                    {course.title}
                                  </h3>
                                </div>
                              </Card>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
