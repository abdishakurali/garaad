// src/app/courses/page.tsx
"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "@/store/features/learningSlice";
import type { RootState } from "@/store/store";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Header } from "@/components/Header";
import type { Course, Category } from "@/types/learning";
import { useRouter } from "next/navigation";
import AuthService from "@/services/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const defaultCategoryImage = "/images/placeholder-category.svg";
const defaultCourseImage = "/images/placeholder-course.svg";

// Optimize image loading
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
        priority={true}
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
        priority={false}
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
  const dispatch = useAppDispatch();
  const { items, status, error } = useAppSelector((state: RootState) => state.learning.categories);

  useEffect(() => {
    // Check if user is authenticated
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) {
      router.push("/");
      return;
    }

    // Only fetch categories if authenticated
    dispatch(fetchCategories());
  }, [dispatch, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-7xl mx-auto p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden max-w-7xl mx-auto md:block">
        <Header />
      </div>

      <main className="max-w-7xl mx-auto">
        <div className="p-4 sm:p-6 md:p-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-8">
              <h1 className="text-[32px] font-bold text-[#1A1D1E] mb-2">Wadooyinka Waxbarashad</h1>
              <p className="text-[18px] text-[#6B7280]">Wadooyin isku xiga oo loo maro hanashada</p>
            </div>

            {status === "loading" ? (
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
                      {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} className="h-[220px] rounded-2xl" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-16">
                {items.map((category: Category) => (
                  <div key={category.id}>
                    <div className="flex items-start gap-6 mb-8">
                      <CategoryImage src={category.image} alt={category.title} />
                      <div>
                        <h2 className="text-2xl font-bold text-[#1A1D1E] mb-1">{category.title}</h2>
                        <p className="text-[#6B7280] text-lg">{category.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {category.courses?.map((course: Course) => (
                        <Link key={course.id} href={`/courses/${category.id}/${course.slug}`}>
                          <Card className="group overflow-hidden bg-white rounded-2xl hover:shadow-lg transition-all duration-300 border border-[#E5E7EB]">
                            <div className="relative">
                              <CourseImage src={course.thumbnail} alt={course.title} />
                              {course.is_new && (
                                <span className="absolute top-3 right-3 bg-[#22C55E] text-white text-xs font-medium px-2 py-1 rounded">NEW</span>
                              )}
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium text-base text-center text-[#1A1D1E] group-hover:text-[#2563EB] transition-colors">{course.title}</h3>
                            </div>
                          </Card>
                        </Link>
                      ))}
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