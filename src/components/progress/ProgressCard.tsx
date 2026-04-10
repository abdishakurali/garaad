"use client";

import React from "react";
import { UserProgress } from "@/services/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, Folder, Layers,  CheckCircle2, Circle, Clock } from "lucide-react";

interface LessonProgress {
    id: number;
    title: string;
    status: "not_started" | "in_progress" | "completed";
    score: number | null;
}

interface ModuleData {
    lessons: LessonProgress[];
    totalLessons: number;
    completedLessons: number;
}

interface CategoryData {
    modules: Record<string, ModuleData>;
    totalLessons: number;
    completedLessons: number;
}

interface CourseData {
    categories: Record<string, CategoryData>;
    totalLessons: number;
    completedLessons: number;
}

interface ProgressHierarchy {
    [courseName: string]: CourseData;
}

interface ProgressCardProps {
    progress: UserProgress[];
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
    // Group progress hierarchically
    const progressHierarchy = progress.reduce<ProgressHierarchy>((acc, p) => {
        const courseTitle = p.course_title || "Koorsada kale";
        const categoryTitle = p.category_title || "Nooca kale";
        const moduleTitle = p.module_title || "Cutubka kale";

        if (!acc[courseTitle]) {
            acc[courseTitle] = {
                categories: {},
                totalLessons: 0,
                completedLessons: 0,
            };
        }

        if (!acc[courseTitle].categories[categoryTitle]) {
            acc[courseTitle].categories[categoryTitle] = {
                modules: {},
                totalLessons: 0,
                completedLessons: 0,
            };
        }

        if (!acc[courseTitle].categories[categoryTitle].modules[moduleTitle]) {
            acc[courseTitle].categories[categoryTitle].modules[moduleTitle] = {
                lessons: [],
                totalLessons: 0,
                completedLessons: 0,
            };
        }

        acc[courseTitle].categories[categoryTitle].modules[moduleTitle].lessons.push({
            id: p.id,
            title: p.lesson_title || "Cashar aan magac lahayn",
            status: p.status,
            score: p.score,
        });

        // Update completion counts
        if (p.status === "completed") {
            acc[courseTitle].completedLessons++;
            acc[courseTitle].categories[categoryTitle].completedLessons++;
            acc[courseTitle].categories[categoryTitle].modules[moduleTitle].completedLessons++;
        }

        acc[courseTitle].totalLessons++;
        acc[courseTitle].categories[categoryTitle].totalLessons++;
        acc[courseTitle].categories[categoryTitle].modules[moduleTitle].totalLessons++;

        return acc;
    }, {});

    if (progress.length === 0) {
        return (
            <Card className="w-full border-none shadow-xl bg-slate-50 dark:bg-slate-900/50">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Book className="w-8 h-8 text-slate-400" />
                    </div>
                    <CardTitle className="mb-2">Weli ma jiro horumar</CardTitle>
                    <p className="text-muted-foreground max-w-xs">
                        Bilow koorsadaada ugu horeysay si aad halkan uga aragto horumarkaaga.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {Object.entries(progressHierarchy).map(([courseName, courseData]) => (
                <Card key={courseName} className="w-full border-none shadow-lg overflow-hidden transition-all hover:shadow-xl group">
                    <CardHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Book className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-none mb-1">{courseName}</h3>
                                    <p className="text-xs text-muted-foreground">Koorso Dhammaystiran</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-sm font-bold">{Math.round((courseData.completedLessons / courseData.totalLessons) * 100)}%</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Dhammaystiran</p>
                                </div>
                                <div className="text-right border-l pl-4 border-slate-200 dark:border-slate-700">
                                    <p className="text-sm font-bold">{courseData.completedLessons}/{courseData.totalLessons}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Casharood</p>
                                </div>
                            </div>
                        </div>
                        <Progress
                            value={(courseData.completedLessons / courseData.totalLessons) * 100}
                            className="h-1.5 mt-4"
                        />
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="space-y-6">
                            {Object.entries(courseData.categories).map(([categoryName, categoryData]) => (
                                <div key={categoryName} className="space-y-4">
                                    <div className="flex items-center justify-between group/cat">
                                        <div className="flex items-center gap-2">
                                            <Folder className="h-4 w-4 text-primary/60 group-hover/cat:text-primary transition-colors" />
                                            <span className="font-semibold text-sm">{categoryName}</span>
                                        </div>
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                            {categoryData.completedLessons}/{categoryData.totalLessons}
                                        </span>
                                    </div>

                                    <div className="pl-6 space-y-4 border-l-2 border-slate-100 dark:border-slate-800 ml-2">
                                        {Object.entries(categoryData.modules).map(([moduleName, moduleData]: [string, ModuleData]) => (
                                            <div key={moduleName} className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Layers className="h-4 w-4 text-slate-400" />
                                                        <span className="text-sm font-medium">{moduleName}</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                    {moduleData.lessons.map((lesson) => (
                                                        <div
                                                            key={lesson.id}
                                                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${lesson.status === "completed"
                                                                    ? "bg-green-50/50 border-green-100 dark:bg-green-900/10 dark:border-green-900/20"
                                                                    : lesson.status === "in_progress"
                                                                        ? "bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/20 shadow-sm"
                                                                        : "bg-white border-slate-100 dark:bg-slate-950 dark:border-slate-800"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                {lesson.status === "completed" ? (
                                                                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                                ) : lesson.status === "in_progress" ? (
                                                                    <Clock className="h-4 w-4 text-blue-500 flex-shrink-0 animate-pulse" />
                                                                ) : (
                                                                    <Circle className="h-4 w-4 text-slate-300 flex-shrink-0" />
                                                                )}
                                                                <span className={`text-xs font-medium truncate ${lesson.status === "completed"
                                                                        ? "text-green-700 dark:text-green-400"
                                                                        : lesson.status === "in_progress"
                                                                            ? "text-blue-700 dark:text-blue-400"
                                                                            : "text-slate-600 dark:text-slate-400"
                                                                    }`}>
                                                                    {lesson.title}
                                                                </span>
                                                            </div>
                                                            {lesson.score !== null && (
                                                                <span className="text-[10px] font-black bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shadow-sm">
                                                                    {lesson.score}%
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
