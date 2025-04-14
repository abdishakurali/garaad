// src/app/courses/page.tsx
"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fetchCategories } from "@/store/features/learningSlice";
import { AppDispatch, RootState } from "@/store";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import type { Course, Category } from "@/types/learning";

const defaultCategoryImage = "/images/placeholder-category.svg";
const defaultCourseImage = "/images/placeholder-course.svg";

// Optimize image loading
const CategoryImage = ({ src, alt }: { src?: string; alt: string }) => (
  <Image
    src={src || defaultCategoryImage}
    alt={alt}
    width={80}
    height={80}
    className="object-cover rounded-2xl"
    priority={true}
    loading="eager"
  />
);

const CourseImage = ({ src, alt }: { src?: string; alt: string }) => (
  <Image
    src={src || defaultCourseImage}
    alt={alt}
    width={300}
    height={200}
    className="object-cover rounded-t-xl"
    priority={false}
    loading="lazy"
  />
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function CoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.learning);
  const { items, status, error } = categories;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

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
        <div className="p-4 sm:p-6 md:p-8 max-w-[1400px] mx-auto">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-900">Learning Paths</h1>
            <p className="text-lg text-gray-600 mt-2 mb-12">Step-by-step paths to mastery</p>

            {status === "loading" ? (
              <motion.div variants={container} initial="hidden" animate="show">
                {[1, 2].map((i) => (
                  <div key={i} className="mb-16">
                    <div className="flex items-center space-x-6 mb-8">
                      <Skeleton className="h-20 w-20 rounded-2xl" />
                      <div>
                        <Skeleton className="h-8 w-64 mb-3" />
                        <Skeleton className="h-5 w-96" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {[...Array(4)].map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                          <Skeleton className="h-48 w-full" />
                          <div className="p-4">
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-4" />
                            <div className="flex justify-between">
                              <Skeleton className="h-6 w-20" />
                              <Skeleton className="h-6 w-16" />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show">
                {items.map((category: Category) => (
                  <motion.div key={category.id} className="mb-20" variants={item}>
                    <div className="flex items-start space-x-6 mb-8">
                      <div className="w-20 h-20 flex-shrink-0 relative">
                        <CategoryImage src={category.image} alt={category.title} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">{category.title}</h2>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {category.courses?.map((course: Course) => (
                        <Link key={course.id} href={`/courses/${category.id}/${course.slug}`}>
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="relative h-48">
                              <CourseImage src={course.thumbnail} alt={course.title} />
                            </div>
                            <div className="p-4">
                              <h3 className="font-semibold mb-2">{course.title}</h3>
                              <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary">{course.skillLevel}</Badge>
                                <span className="text-sm text-gray-500">{course.estimatedHours}h</span>
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}