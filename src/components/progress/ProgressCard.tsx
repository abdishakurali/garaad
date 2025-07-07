import React from "react";
import { UserProgress, UserReward } from "@/services/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Flame, Book, Folder, Layers, FileText } from "lucide-react";

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
    rewards: UserReward[];
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress, rewards }) => {
    const totalPoints = rewards
        .filter((reward) => reward.reward_type === "points")
        .reduce((sum, reward) => sum + reward.value, 0);

    const badges = rewards.filter((reward) => reward.reward_type === "badge");
    const currentStreak = rewards
        .filter((reward) => reward.reward_type === "streak")
        .reduce((max, reward) => Math.max(max, reward.value), 0);

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

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Adigar Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Overall Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center space-y-1">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        <span className="text-2xl font-bold">{totalPoints}</span>
                        <span className="text-sm text-muted-foreground">Points</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <Star className="h-6 w-6 text-blue-500" />
                        <span className="text-2xl font-bold">{badges.length}</span>
                        <span className="text-sm text-muted-foreground">Badges</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                        <Flame className="h-6 w-6 text-orange-500" />
                        <span className="text-2xl font-bold">{currentStreak}</span>
                        <span className="text-sm text-muted-foreground">Day Streak</span>
                    </div>
                </div>

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
                                        {courseData.completedLessons}/{courseData.totalLessons} lessons
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

                {/* Recent Badges */}
                {badges.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Recent Badges</h3>
                        <div className="flex flex-wrap gap-2">
                            {badges.slice(0, 3).map((badge) => (
                                <Badge
                                    key={badge.id}
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    <Star className="h-3 w-3" />
                                    {badge.reward_name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}; 