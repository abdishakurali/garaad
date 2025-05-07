"use client";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { Course } from "@/types/lms";

interface CourseCardProps {
  course: Course;
  categoryId: string | number;
  isActive: boolean;
  onClick: () => void;
}

const defaultCourseImage = "/images/placeholder-course.svg";

export function CourseCard({
  course,
  categoryId,
  isActive,
  onClick,
}: CourseCardProps) {
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
      : defaultCourseImage;

  if (!course.is_published) {
    return (
      <Card className="group overflow-hidden bg-white rounded-3xl border border-[#E5E7EB] opacity-60">
        <div className="relative">
          <div className="relative w-full h-40 bg-[#F8F9FB] flex items-center justify-center">
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={course.title}
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
          <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded-md">
            Dhowaan
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-medium text-base text-center text-[#1A1D1E]">
            {course.title}
          </h3>
        </div>
      </Card>
    );
  }

  return (
    <div
      className={`transition-all duration-300 ${
        isActive ? "scale-105 ring-2 ring-primary ring-offset-2" : ""
      }`}
      onClick={onClick}
    >
      <Link href={`/courses/${categoryId}/${course.slug}`}>
        <Card className="group overflow-hidden bg-white rounded-3xl hover:shadow-lg transition-all duration-300 border border-[#E5E7EB]">
          <div className="relative">
            <div className="relative w-full h-40 bg-[#F8F9FB] flex items-center justify-center">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={course.title}
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
            {course.is_new && (
              <span className="absolute top-3 right-3 bg-[#22C55E] text-white text-xs font-medium px-2 py-1 rounded-md">
                NEW
              </span>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-medium text-base text-center text-[#1A1D1E] group-hover:text-[#2563EB] transition-colors">
              {course.title}
            </h3>
          </div>
        </Card>
      </Link>
    </div>
  );
}
