import React from "react";
import { UserProgress } from "@/services/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Book, Folder, Layers, FileText } from "lucide-react";

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
        if (!acc[p.course_title]) {
            acc[p.course_title] = {
                categories: {},
                totalLessons: 0,
                completedLessons: 0,
            };
        }

        if (!acc[p.course_title].categories[p.category_title]) {
            acc[p.course_title].categories[p.category_title] = {
                modules: {},
                totalLessons: 0,
                completedLessons: 0,
            };
        }

        if (!acc[p.course_title].categories[p.category_title].modules[p.module_title]) {
            acc[p.course_title].categories[p.category_title].modules[p.module_title] = {
                lessons: [],
                totalLessons: 0,
                completedLessons: 0,
            };
        }

        acc[p.course_title].categories[p.category_title].modules[p.module_title].lessons.push({
            id: p.id,
            title: p.lesson_title,
            status: p.status,
            score: p.score,
        });

        // Update completion counts
        if (p.status === "completed") {
            acc[p.course_title].completedLessons++;
            acc[p.course_title].categories[p.category_title].completedLessons++;
            acc[p.course_title].categories[p.category_title].modules[p.module_title].completedLessons++;
        }

        acc[p.course_title].totalLessons++;
        acc[p.course_title].categories[p.category_title].totalLessons++;
        acc[p.course_title].categories[p.category_title].modules[p.module_title].totalLessons++;

        return acc;
    }, {});

    if (progress.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Horumarka Af-Garad</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                        Weli ma jiro horumar la diiwaangeliyey.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Horumarka Af-Garad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Hierarchical Progress */}
                <div className="space-y-6">
                    {Object.entries(progressHierarchy).map(([courseName, courseData]) => (
                        <div key={courseName} className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Book className="h-5 w-5 text-primary" />
                                        <span className="font-semibold text-lg">{courseName}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">
                                        {courseData.completedLessons}/{courseData.totalLessons} casharood
                                    </span>
                                </div>
                                <Progress
                                    value={(courseData.completedLessons / courseData.totalLessons) * 100}
                                    className="h-2"
                                />
                            </div>

                            <div className="pl-6 space-y-4">
                                {Object.entries(courseData.categories).map(([categoryName, categoryData]) => (
                                    <div key={categoryName} className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Folder className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{categoryName}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {categoryData.completedLessons}/{categoryData.totalLessons}
                                            </span>
                                        </div>

                                        <div className="pl-6 space-y-2">
                                            {Object.entries(categoryData.modules).map(([moduleName, moduleData]: [string, ModuleData]) => (
                                                <div key={moduleName} className="space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Layers className="h-4 w-4 text-muted-foreground" />
                                                            <span className="text-sm">{moduleName}</span>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {moduleData.completedLessons}/{moduleData.totalLessons}
                                                        </span>
                                                    </div>
                                                    <div className="pl-4">
                                                        {moduleData.lessons.map((lesson) => (
                                                            <div
                                                                key={lesson.id}
                                                                className={`flex items-center gap-2 text-sm py-1 ${lesson.status === "completed"
                                                                    ? "text-green-600"
                                                                    : lesson.status === "in_progress"
                                                                        ? "text-blue-600"
                                                                        : "text-muted-foreground"
                                                                    }`}
                                                            >
                                                                <FileText className="h-4 w-4" />
                                                                {lesson.title}
                                                                {lesson.score !== null && (
                                                                    <span className="ml-2 text-muted-foreground">
                                                                        ({lesson.score}%)
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
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
