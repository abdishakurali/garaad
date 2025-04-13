// src/components/learning/LessonCard.tsx
"use client";

import { Lesson } from "@/types/course";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";

interface LessonCardProps {
    lesson: Lesson;
    onClick?: () => void;
}

export function LessonCard({ lesson, onClick }: LessonCardProps) {
    return (
        <Card
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={onClick}
        >
            <div className="flex items-start gap-3">
                {lesson.progress === 100 ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : (
                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
                <div className="flex-grow">
                    <h4 className="font-medium mb-1">{lesson.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                    {lesson.progress > 0 && lesson.progress < 100 && (
                        <Progress value={lesson.progress} className="h-1" />
                    )}
                </div>
            </div>
        </Card>
    );
}