"use client";

// Deprecated — recommendations moved to admin panel only. Kept for reference; do not use in user-facing UI.

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ChevronRight, CheckCircle2 } from "lucide-react";
import { Course } from "@/types/lms";
import { getCourseThumbnailUrl } from "@/lib/utils";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary";

const defaultCourseImage = "/images/placeholder-category.svg";

function courseImageSrc(src: string | null | undefined): string {
  const resolved = getCourseThumbnailUrl(src, defaultCourseImage);
  return optimizeCloudinaryUrl(resolved) || defaultCourseImage;
}

export interface SpotlightCourse {
  course: Course;
  categoryId: string;
}

interface RecommendedCoursesSectionProps {
  title: string;
  courses: SpotlightCourse[];
  getCourseProgress?: (courseId: number) => number | undefined;
  isAuthenticated?: boolean;
  showViewAll?: boolean;
  viewAllHref?: string;
}

export function RecommendedCoursesSection({
  title,
  courses,
  getCourseProgress,
  isAuthenticated = false,
  showViewAll = false,
  viewAllHref = "/courses",
}: RecommendedCoursesSectionProps) {
  if (courses.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">
          {title}
        </h2>
        {showViewAll && (
          <Link
            href={viewAllHref}
            className="text-sm font-bold text-primary hover:underline uppercase tracking-wider"
          >
            View all courses →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {courses.map(({ course, categoryId }) => {
          const courseProgress = getCourseProgress?.(course.id);
          const hasStarted = courseProgress !== undefined && courseProgress > 0;
          const isComplete = courseProgress === 100;
          return (
            <Link
              key={course.id}
              href={`/courses/${categoryId}/${course.slug}`}
              className="group h-full"
            >
              <Card className="relative h-full flex flex-col overflow-hidden bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-lg hover:shadow-xl hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                {isComplete && (
                  <div className="absolute top-3 right-3 z-20 rounded-xl bg-emerald-500/90 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Dhameystirmay
                  </div>
                )}
                <div className="relative h-36 bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center rounded-t-2xl">
                  <Image
                    src={courseImageSrc(course.thumbnail)}
                    alt={course.title ?? ""}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    unoptimized
                  />
                  {course.is_new && !isComplete && (
                    <div className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-xl z-20">
                      CUSUB
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1 leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  {course.description && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                      {course.description}
                    </p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {!hasStarted && (isAuthenticated ? "Bilow" : "Ku soo biir")}
                      {hasStarted && !isComplete && "Sii wad"}
                      {isComplete && "Muraajacee"}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-black flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all group-hover:rotate-12">
                      <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
