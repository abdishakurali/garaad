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
import { AlertCircle, Sparkles } from "lucide-react";
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
  const { items: categories, status, error } = useSelector(
    (state: RootState) => state.learning.categories || { items: [], status: "idle", error: null }
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const renderCourseCard = (course: Course, categoryId: string) => (
    <Link href={`/courses/${categoryId}/${course.slug}`} key={course.id}>
      <div  >
        <Card className="group relative p-6 hover:shadow-lg transition-all duration-300 rounded-2xl border border-gray-200 cursor-pointer overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative flex flex-col h-full">
            <div className="mb-4 aspect-square w-16 relative">
              <div className="absolute inset-0 rounded-2xl bg-white shadow-sm overflow-hidden">
                {course.thumbnail ? (
                  <div className="w-full h-full relative">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5 group-hover:opacity-0 transition-opacity" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                    <Image
                      src={defaultCourseImage}
                      alt="Course"
                      width={48}
                      height={48}
                      className="opacity-40"
                    />
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {course.title}
            </h3>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {course.description}
            </p>

            {course.progress > 0 && (
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">
                    {course.progress}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-green-500 h-full rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            )}

            {course.is_new && (
              <Badge className="absolute top-4 right-4 flex items-center gap-1 bg-green-500 hover:bg-green-600">
                <Sparkles className="w-3 h-3" />
                <span>NEW</span>
              </Badge>
            )}
          </div>
        </Card>
      </div>
    </Link>
  );

  const renderSkeletonCard = (index: number) => (
    <Card key={index} className="p-6 rounded-2xl border border-gray-200">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 mb-4">
        <Skeleton className="h-full w-full rounded-2xl" />
      </div>
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </Card>
  );

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
                      {[...Array(4)].map((_, index) => renderSkeletonCard(index))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div variants={container} initial="hidden" animate="show">
                {categories.map((category: Category) => (
                  <motion.div key={category.id} className="mb-20" variants={item}>
                    <div className="flex items-start space-x-6 mb-8">
                      <div className="w-20 h-20 flex-shrink-0 relative">
                        <div className="absolute inset-0 rounded-2xl bg-white shadow-sm overflow-hidden">
                          {category.image ? (
                            <div className="w-full h-full relative">
                              <Image
                                src={category.image}
                                alt={category.title}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/5" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
                              <Image
                                src={defaultCategoryImage}
                                alt="Category"
                                width={64}
                                height={64}
                                className="opacity-40"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-grow min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900 truncate">{category.title}</h2>
                          {category.in_progress && (
                            <Badge className="uppercase text-xs font-semibold bg-green-500 hover:bg-green-600 flex-shrink-0">
                              IN PROGRESS
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-lg line-clamp-2">{category.description}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                      <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                      >
                        {category.courses.map((course: Course) => renderCourseCard(course, category.id))}
                      </div>
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