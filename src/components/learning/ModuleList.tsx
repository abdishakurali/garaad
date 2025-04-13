// src/components/learning/ModuleList.tsx
"use client";

import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Module {
    id: string;
    title: string;
    isCompleted: boolean;
    isLocked: boolean;
    description?: string;
    type: "lesson" | "practice";
    lessons?: Array<{ id: number }>;
}

interface ModuleListProps {
    modules: Module[];
    categoryId: string;
    courseSlug: string;
}

export function ModuleList({ modules, categoryId, courseSlug }: ModuleListProps) {
    return (
        <div className="relative max-w-4xl mx-auto py-12 px-4">
            {/* Background zigzag line */}
            <svg
                className="absolute top-0 left-1/2 h-full w-[2px] -translate-x-1/2"
                viewBox="0 0 2 100"
                preserveAspectRatio="none"
            >
                <path
                    d="M1 0v100"
                    className="stroke-blue-200"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                />
            </svg>

            <div className="relative space-y-24">
                {modules.map((module, index) => (
                    <div
                        key={module.id}
                        className={cn(
                            "relative flex gap-8 items-center",
                            index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                        )}
                    >
                        {/* Module Card */}
                        <div className="w-1/2">
                            <Link
                                href={
                                    module.isLocked
                                        ? "#"
                                        : module.lessons && module.lessons.length > 0
                                            ? `/courses/${categoryId}/${courseSlug}/modules/${module.id}/lessons/${module.lessons[0].id}`
                                            : `/courses/${categoryId}/${courseSlug}/modules/${module.id}`
                                }
                                className={cn(
                                    "block p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow",
                                    "border-2",
                                    module.isLocked
                                        ? "border-gray-200 opacity-75"
                                        : module.isCompleted
                                            ? "border-green-500"
                                            : "border-blue-500"
                                )}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={cn(
                                            "p-3 rounded-xl",
                                            module.isLocked
                                                ? "bg-gray-100"
                                                : module.isCompleted
                                                    ? "bg-green-50"
                                                    : "bg-blue-50"
                                        )}
                                    >
                                        {module.isLocked ? (
                                            <Lock
                                                className="w-6 h-6 text-gray-400"
                                                aria-hidden="true"
                                            />
                                        ) : module.isCompleted ? (
                                            <CheckCircle
                                                className="w-6 h-6 text-green-500"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <PlayCircle
                                                className="w-6 h-6 text-blue-500"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h3
                                            className={cn(
                                                "text-lg font-semibold mb-1",
                                                module.isLocked ? "text-gray-400" : "text-gray-900"
                                            )}
                                        >
                                            {module.title}
                                        </h3>
                                        {module.description && (
                                            <p
                                                className={cn(
                                                    "text-sm",
                                                    module.isLocked ? "text-gray-400" : "text-gray-600"
                                                )}
                                            >
                                                {module.description}
                                            </p>
                                        )}
                                        <div
                                            className={cn(
                                                "mt-2 text-xs font-medium px-2 py-1 rounded-full inline-block",
                                                module.type === "practice"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-blue-100 text-blue-700"
                                            )}
                                        >
                                            {module.type === "practice" ? "Practice" : "Lesson"}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Connection Node */}
                        <div
                            className={cn(
                                "absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4",
                                "flex items-center justify-center",
                                module.isLocked
                                    ? "bg-gray-100 border-gray-200"
                                    : module.isCompleted
                                        ? "bg-green-50 border-green-500"
                                        : "bg-blue-50 border-blue-500"
                            )}
                        >
                            <span className="font-bold text-sm">
                                {(index + 1).toString().padStart(2, "0")}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}