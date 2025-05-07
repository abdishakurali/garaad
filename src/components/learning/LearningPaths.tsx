"use client";

import { Category } from "@/types/course";
import Image from "next/image";
import Link from "next/link";

interface LearningPathsProps {
  categories: Category[];
}

export function LearningPaths({ categories }: LearningPathsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-12 h-12 relative">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {category.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.courses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        {course.thumbnail && (
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        )}
                        {course.is_new && (
                          <div className="absolute top-2 right-2 bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                            New
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <h3 className="text-sm font-medium text-gray-900 group-hover:text-primary">
                          {course.title}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          {course.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
