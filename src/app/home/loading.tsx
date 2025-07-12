import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function HomeLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header Skeleton */}
                <div className="mb-8">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <Skeleton className="h-4 w-96" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Stats and League */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Card key={i} className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-16" />
                                            <Skeleton className="h-6 w-12" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* League Status */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <Skeleton className="h-3 w-full" />
                                <div className="flex justify-between text-sm">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        </Card>

                        {/* Leaderboard */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-24" />
                            </div>

                            <div className="space-y-3">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="flex-1 space-y-1">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                        </div>
                                        <Skeleton className="h-6 w-12" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right Column - Courses */}
                    <div className="space-y-6">
                        {/* Current Course */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-20" />
                            </div>

                            <div className="space-y-4">
                                <Skeleton className="h-32 w-full rounded-lg" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-full" />
                                    <div className="flex justify-between text-sm">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-12" />
                                    </div>
                                </div>
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </Card>

                        {/* Course Thumbnails */}
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-16 w-16 rounded-md" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 