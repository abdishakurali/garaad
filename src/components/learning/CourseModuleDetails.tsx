"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const FollowChart = dynamic(() => import("./FollowChart").then(mod => mod.FollowChart), {
    loading: () => <Skeleton className="w-[300px] h-[300px] rounded-full" />,
    ssr: false
});
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

interface CourseModuleDetailsProps {
    moduleTitle: string;
    moduleDescription: string;
    progress: number;
    totalLessons: number;
    completedLessons: number;
    estimatedTime: string;
    difficulty: "beginner" | "intermediate" | "advanced";
}

export function CourseModuleDetails({
    moduleTitle,
    moduleDescription,
    progress,
    totalLessons,
    completedLessons,
    estimatedTime,
    difficulty,
}: CourseModuleDetailsProps) {
    const [activeTab, setActiveTab] = useState("overview");
    const [chartState, setChartState] = useState("initial");

    const handleStateChange = (state: string) => {
        setChartState(state);
        console.log("Chart state changed to:", state);
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return "bg-green-100 text-green-800";
            case "intermediate":
                return "bg-yellow-100 text-yellow-800";
            case "advanced":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return "Bilowga";
            case "intermediate":
                return "Dhexdhexaad";
            case "advanced":
                return "Sare";
            default:
                return difficulty;
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left column - Module info */}
                <div className="md:col-span-2">
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">{moduleTitle}</CardTitle>
                                    <CardDescription className="mt-2">{moduleDescription}</CardDescription>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                                    {getDifficultyText(difficulty)}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Horumarinta</span>
                                    <span className="text-sm text-gray-500">{progress}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500">Darsyada</div>
                                        <div className="text-xl font-semibold">{completedLessons}/{totalLessons}</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500">Waqtiga la filayo</div>
                                        <div className="text-xl font-semibold">{estimatedTime}</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full">Bilow Darsiga</Button>
                        </CardFooter>
                    </Card>

                    <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="overview">Faahfaahin</TabsTrigger>
                            <TabsTrigger value="lessons">Darsyada</TabsTrigger>
                            <TabsTrigger value="resources">Xiriiraha</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Faahfaahin</CardTitle>
                                    <CardDescription>
                                        Faahfaahin dheeraad ah oo ku saabsan mowduuca
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4">
                                        Mowduucan wuxuu kuu barayaa aasaaska {moduleTitle.toLowerCase()}.
                                        Waxaad baran doontaa sida loo isticmaalo {moduleTitle.toLowerCase()}
                                        si loo xaliyo dhibaatooyin kala duwan.
                                    </p>
                                    <p>
                                        Waxaad baran doontaa qaybaha muhiimka ah ee {moduleTitle.toLowerCase()},
                                        iyo sida loo isticmaalo si loo horumariyo xirfadahaada.
                                    </p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="lessons" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Darsyada</CardTitle>
                                    <CardDescription>
                                        Dhammaan darsyada mowduuca
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {Array.from({ length: totalLessons }).map((_, index) => (
                                            <div
                                                key={index}
                                                className={`p-4 rounded-lg border ${index < completedLessons
                                                    ? "border-green-200 bg-green-50"
                                                    : "border-gray-200"
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-medium">Darsiga {index + 1}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {index < completedLessons ? "Waa la dhammaystirtay" : "Wali lama dhammayn"}
                                                        </p>
                                                    </div>
                                                    <Button variant={index < completedLessons ? "outline" : "default"}>
                                                        {index < completedLessons ? "Dib u eeg" : "Bilow"}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="resources" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Xiriiraha</CardTitle>
                                    <CardDescription>
                                        Xiriiraha mowduuca
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg border border-gray-200">
                                            <h3 className="font-medium">Buugga</h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                Buugga mowduuca ee {moduleTitle}
                                            </p>
                                            <Button variant="outline" size="sm">Soo dejiso</Button>
                                        </div>
                                        <div className="p-4 rounded-lg border border-gray-200">
                                            <h3 className="font-medium">Fiidiyowga</h3>
                                            <p className="text-sm text-gray-500 mb-2">
                                                Fiidiyowga mowduuca ee {moduleTitle}
                                            </p>
                                            <Button variant="outline" size="sm">Daawo</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right column - Follow chart */}
                <div className="md:col-span-1">
                    <Card className="sticky top-4">
                        <CardHeader>
                            <CardTitle>Jadwalka</CardTitle>
                            <CardDescription>
                                Raac jadwalka si aad u hesho horumarintaada
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FollowChart
                                width={300}
                                height={300}
                                onStateChange={handleStateChange}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <div className="text-sm text-gray-500">
                                {chartState === "initial" && "Bilow jadwalkaaga"}
                                {chartState === "progress" && "Waxaad horumarisay"}
                                {chartState === "complete" && "Waxaad dhammaystirtay"}
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
} 