// src/components/learning/CourseProgress.tsx
"use client";

import { Course } from "@/types/course";
import { Progress } from "@/components/ui/progress";

interface CourseProgressProps {
    course: Course;
}

export function CourseProgress({ course }: CourseProgressProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Course Progress</h3>
                    <p className="text-sm text-gray-600">
                        {course.module_count} modules in total
                    </p>
                </div>
                <div className="text-2xl font-bold text-green-600">
                    {course.progress}%
                </div>
            </div>
            <Progress
                value={course.progress || 0}
                className="h-2"
            />
        </div>
    );
}