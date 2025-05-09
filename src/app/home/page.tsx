"use client";
import { useEffect, useState } from "react";
import type React from "react";

import Image from "next/image";
import { Clock, Trophy, ChevronRight, Award, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AuthService from "@/services/auth";
import { Header } from "@/components/Header";
import Link from "next/link";
import { LeaderboardEntry, UserRank } from "@/services/progress";
import { useCategories } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail?: string;
  progress: number;
  is_published: boolean;
  lesson_count?: number;
  estimatedHours?: number;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<
    LeaderboardEntry[] | null
  >(null);
  const [userRankData, setUserRankData] = useState<UserRank | null>(null);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(true);
  const [isLoadingUserRank, setIsLoadingUserRank] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
  const [userRankError, setUserRankError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const { categories } = useCategories();
  const router = useRouter();

  // fetch the categoryid of a course by its name
  const getCategoryIdByName = (categoryName: string): string | null => {
    const category = (categories ?? []).find((cat) =>
      cat.courses.some((course) => course.title === categoryName)
    );
    return category?.id ?? null;
  };

  const storedUser = AuthService.getInstance().getCurrentUser();
  const minSwipeDistance = 50;

  // Fetch protected leaderboard and user rank
  useEffect(() => {
    const service = AuthService.getInstance();

    const fetchLeaderboard = async () => {
      try {
        const response = await service.makeAuthenticatedRequest(
          "get",
          "/api/lms/leaderboard/"
        );
        console.log("Raw Axios response:", response);
        // → { data: [ … ], status: 200, headers: { … }, … }
        setLeaderboardData(response as LeaderboardEntry[]);
        console.log("Leaderboard data fetched:", response);
      } catch (err: any) {
        console.error("Error fetching leaderboard:", err);
        setLeaderboardError(err.message || "Failed to fetch leaderboard");
      } finally {
        setIsLoadingLeaderboard(false);
      }
    };

    // Fetch user rank
    const fetchUserRank = async () => {
      try {
        const response = await service.makeAuthenticatedRequest(
          "get",
          `/api/lms/leaderboard/my_rank/`
        );
        setUserRankData(response as UserRank);
        console.log("User rank data fetched:", response);
      } catch (err: any) {
        console.error("Error fetching user rank:", err);
        setUserRankError(err.message || "Failed to fetch user rank");
      } finally {
        setIsLoadingUserRank(false);
      }
    };
    fetchLeaderboard();
    fetchUserRank();
  }, []);

  useEffect(() => {
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) router.push("/");
  }, [router]);

  console.log("Leaderboard data:", leaderboardData);
  console.log("Rank data", userRankData);

  // Fetch public courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/`
        );
        const data: Course[] = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  // Carousel touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && currentSlide < courses.length - 1) {
      setCurrentSlide((s) => s + 1);
    }
    if (distance < -minSwipeDistance && currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const getInitials = (username: string) => username.slice(0, 2).toUpperCase();

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row gap-6 p-4 max-w-7xl mx-auto">
        {/* Left Column: Rank & Leaderboard */}
        <div className="w-full md:w-1/2 space-y-6">
          {/* User Rank Card */}
          <Card className="p-6 rounded-xl bg-card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-blue-800">Booskaaga</h3>
              <Trophy className="text-yellow-500 h-6 w-6" />
            </div>

            {isLoadingUserRank ? (
              <Skeleton className="h-48 w-full" />
            ) : userRankError ? (
              <div className="text-center py-4 text-red-500">
                {userRankError}
              </div>
            ) : userRankData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {userRankData.rank}
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Dhibcahaaga</p>
                      <p className="font-bold text-primary">
                        {userRankData.points} Dhibco
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-border text-black"
                  >
                    Arag kulli <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>

                {userRankData.entries_above.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Kaalinta kaa horeysa
                    </p>
                    <div className="space-y-2">
                      {userRankData.entries_above.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                              {getInitials(entry.user__username)}
                            </div>
                            <span>{entry.user__username}</span>
                          </div>
                          <span className="font-medium">
                            {entry.points} Dhibco
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userRankData.entries_below.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      Kaalinta kaa hooseysa
                    </p>
                    <div className="space-y-2">
                      {userRankData.entries_below.map((entry, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700">
                              {getInitials(entry.user__username)}
                            </div>
                            <span>{entry.user__username}</span>
                          </div>
                          <span className="font-medium">
                            {entry.points} Dhibco
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </Card>

          {/* Leaderboard Card */}
          <Card className="p-6 rounded-xl shadow-sm border-border">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Shaxda Tartanka</h3>
                  <p className="text-sm text-muted-foreground">Kaalmaha sare</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-gray-700"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {isLoadingLeaderboard ? (
              <Skeleton className="h-64 w-full" />
            ) : leaderboardError ? (
              <div className="text-center py-4 text-red-500">
                {leaderboardError}
              </div>
            ) : leaderboardData && leaderboardData.length > 0 ? (
              <div className="space-y-3">
                {leaderboardData.slice(0, 5).map((entry, idx) => {
                  const isCurrent = storedUser?.username === entry.username;
                  return (
                    <div
                      key={entry.id}
                      className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                        isCurrent
                          ? "bg-primary/50 text-primary-foreground border-border"
                          : idx % 2 === 0
                          ? "bg-secondary/10"
                          : "bg-secondary/10"
                      }`}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          idx === 0
                            ? "bg-yellow-100 text-yellow-700"
                            : idx === 1
                            ? "bg-gray-100 text-gray-700"
                            : idx === 2
                            ? "bg-amber-100 text-amber-700"
                            : "bg-blue-50 text-blue-700"
                        } font-bold`}
                      >
                        {idx + 1}
                      </div>
                      <div
                        className={`w-10 h-10 rounded-full hidden  md:flex items-center justify-center text-white font-medium ${
                          isCurrent ? "bg-blue-600" : "bg-indigo-500"
                        }`}
                      >
                        {getInitials(entry.username)}
                      </div>
                      <div className="flex flex-col">
                        <span
                          className={`font-medium ${
                            isCurrent ? "text-blue-800" : ""
                          }`}
                        >
                          {entry.username}
                          {isCurrent ? " (You)" : ""}
                        </span>
                        {entry.user_info.stats && (
                          <span className="text-xs text-gray-500">
                            {entry.user_info.stats.completed_lessons} cashar
                            dhameeyay
                          </span>
                        )}
                      </div>
                      <div className="ml-auto flex items-center">
                        <span
                          className={`font-bold ${
                            isCurrent ? "text-blue-700" : "text-gray-700"
                          }`}
                        >
                          {entry.points}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">
                          Dhibco
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No leaderboard data
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Courses Carousel */}
        <div className="w-full md:w-1/2">
          <Card className="p-6 rounded-xl shadow-sm border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Koorsooyinkaada</h3>
              <Button variant="outline" size="sm" className="text-gray-700">
                Arag kulli <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div
              className="relative w-full overflow-hidden my-6 rounded-xl bg-gray-50 p-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {isLoadingCourses ? (
                <Skeleton className="h-48 w-full" />
              ) : courses.length ? (
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {courses.map((course) => (
                    <div
                      key={course.id}
                      className="min-w-full flex flex-col items-center"
                    >
                      <div className="relative w-48 h-48 mb-4">
                        <Image
                          src={
                            course.thumbnail ||
                            "/placeholder.svg?height=192&width=192" ||
                            "/placeholder.svg"
                          }
                          width={192}
                          height={192}
                          alt={course.title}
                          className="object-contain"
                          priority
                        />
                      </div>
                      <h4 className="font-bold text-center mb-2">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{course.estimatedHours || 0} saac</span>
                        <span className="mx-1">•</span>
                        <span>{course.lesson_count || 0} casharo</span>
                      </div>

                      {course.progress > 0 && (
                        <div className="w-full mt-3">
                          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="font-medium">
                              {course.progress}%
                            </span>
                          </div>
                        </div>
                      )}

                      <Link
                        href={`/courses/${getCategoryIdByName(course.title)}/${
                          course.slug
                        }`}
                      >
                        <Button className="mt-4">
                          {course.progress > 0
                            ? "sii wado koorsada"
                            : "gal koorsada"}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <User className="h-12 w-12 text-gray-300 mb-4" />
                  <p className="text-gray-500">No courses available</p>
                  <Button className="mt-4">Browse Courses</Button>
                </div>
              )}
            </div>

            {courses.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {courses.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === idx ? "bg-primary w-4" : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </Card>
          <>
            {courses.length > 1 && (
              <div className="flex justify-center w-full mt-6 gap-2 overflow-x-auto pb-2">
                {courses.map((course, idx) => (
                  <button
                    key={course.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={`p-2 border rounded-lg min-w-[50px] transition-all ${
                      currentSlide === idx
                        ? "border-primary bg-primary/20 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src={
                        course.thumbnail ||
                        "/placeholder.svg?height=32&width=32" ||
                        "/placeholder.svg"
                      }
                      width={24}
                      height={24}
                      alt={course.title}
                      className="object-contain mx-auto"
                    />
                    {/* <p className="text-xs mt-1 truncate max-w-[40px] text-center">
                      {course.title}
                    </p> */}
                  </button>
                ))}
              </div>
            )}
          </>
        </div>
      </div>
    </>
  );
}
