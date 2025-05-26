"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import type React from "react";
import Image from "next/image";
import useSWR from "swr";
import {
  Clock,
  Trophy,
  ChevronRight,
  Award,
  User,
  Flame,
  Star,
  Calendar,
  Target,
  Medal,
  Sparkles,
  BookOpen,
  BarChart3,
  ChevronDown,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import AuthService from "@/services/auth";
import { Header } from "@/components/Header";
import Link from "next/link";
import type { LeaderboardEntry, UserRank } from "@/services/progress";
import { useCategories } from "@/hooks/useApi";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned_at?: string;
}

interface Challenge {
  id: number;
  title: string;
  description: string;
  challenge_date: string;
  points_reward: number;
  completed?: boolean;
}

interface UserLevel {
  level: number;
  experience_points: number;
  experience_to_next_level: number;
}

// SWR fetcher function with authentication
const authFetcher = async <T = any,>(url: string): Promise<T> => {
  const service = AuthService.getInstance();
  return await service.makeAuthenticatedRequest("get", url);
};

// Public fetcher for courses
const publicFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("all_time");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const { categories } = useCategories();
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  // SWR hooks for data fetching with caching
  const { data: courses = [], isLoading: isLoadingCourses } = useSWR<Course[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/`,
    publicFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5 minutes
    }
  );

  const {
    data: leaderboardData,
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
  } = useSWR<LeaderboardEntry[]>(
    `/api/lms/leaderboard/?time_period=${leaderboardPeriod}`,
    authFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const {
    data: userRankData,
    isLoading: isLoadingUserRank,
    error: userRankError,
    mutate: mutateUserRank,
  } = useSWR<UserRank>(
    `/api/lms/leaderboard/my_rank/?time_period=${leaderboardPeriod}`,
    authFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000, // 1 minute
    }
  );

  const { data: achievements = [], isLoading: isLoadingAchievements } = useSWR<
    Achievement[]
  >("/api/lms/achievements/user_achievements/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000, // 10 minutes
  });

  const {
    data: dailyChallenges = [],
    isLoading: isLoadingChallenges,
    mutate: mutateChallenges,
  } = useSWR<Challenge[]>("/api/lms/challenges/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 300000, // 5 minutes
  });

  const { data: userLevel, isLoading: isLoadingUserLevel } = useSWR<UserLevel>(
    "/api/lms/levels/",
    authFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000, // 10 minutes
    }
  );

  // Memoized category lookup function
  const getCategoryIdByName = useCallback(
    (categoryName: string): string | null => {
      const category = (categories ?? []).find((cat) =>
        cat.courses.some(
          (course: { title: string }) => course.title === categoryName
        )
      );
      return category?.id ?? null;
    },
    [categories]
  );

  const storedUser = useMemo(
    () => AuthService.getInstance().getCurrentUser(),
    []
  );
  const minSwipeDistance = 50;

  useEffect(() => {
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) router.push("/");
  }, [router]);

  // Memoized touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX),
    []
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance && currentSlide < courses.length - 1) {
      setCurrentSlide((s) => s + 1);
    }
    if (distance < -minSwipeDistance && currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  }, [touchStart, touchEnd, currentSlide, courses.length]);

  const getInitials = useCallback(
    (username: string) => username.slice(0, 2).toUpperCase(),
    []
  );

  // Optimized challenge completion handler
  const handleCompleteChallenge = useCallback(
    async (challengeId: number) => {
      const service = AuthService.getInstance();
      try {
        await service.makeAuthenticatedRequest(
          "post",
          `/api/lms/challenges/${challengeId}/submit_attempt/`
        );

        // Optimistically update challenges
        const updatedChallenges = dailyChallenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, completed: true }
            : challenge
        );

        // Update cache immediately
        mutateChallenges(updatedChallenges, false);

        // Show notification
        const challenge = dailyChallenges.find((c) => c.id === challengeId);
        setNotificationMessage(
          `Challenge completed! +${challenge?.points_reward} points`
        );
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);

        // Refresh user rank
        mutateUserRank();
      } catch (err) {
        console.error("Error completing challenge:", err);
        // Revert optimistic update on error
        mutateChallenges();
      }
    },
    [dailyChallenges, mutateChallenges, mutateUserRank]
  );

  // Memoized achievement icon function
  const getAchievementIcon = useCallback((iconName: string) => {
    switch (iconName) {
      case "lesson-1":
        return <BookOpen className="h-5 w-5" />;
      case "streak":
        return <Flame className="h-5 w-5" />;
      case "challenge":
        return <Target className="h-5 w-5" />;
      case "level":
        return <BarChart3 className="h-5 w-5" />;
      case "perfect":
        return <Star className="h-5 w-5" />;
      case "early":
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Medal className="h-5 w-5" />;
    }
  }, []);

  const toggleCardExpansion = useCallback((cardId: string) => {
    setExpandedCard((prev) => (prev === cardId ? null : cardId));
  }, []);

  // Memoized streak visualization data
  const streakVisualization = useMemo(() => {
    const currentStreak = userRankData?.user_info?.stats?.current_streak || 0;
    return Array.from({ length: 7 }).map((_, idx) => {
      const isActive = idx < currentStreak % 8;
      return {
        isActive,
        height: isActive ? `${30 + Math.random() * 20}px` : "10px",
      };
    });
  }, [userRankData?.user_info?.stats?.current_streak]);

  return (
    <>
      <Header />

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-lg shadow-md flex items-center gap-2 max-w-xs">
          <Zap className="h-5 w-5" />
          <p>{notificationMessage}</p>
        </div>
      )}

      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* User Level Progress Bar */}
        {!isLoadingUserLevel && userLevel && (
          <Card className="p-4 md:p-6 rounded-lg bg-card shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {userLevel.level}
                </div>
                <div>
                  <h3 className="font-bold text-xl">
                    Level-kaaga {userLevel.level}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-bold">
                    {userRankData?.points || 0} Dhibco
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-md">
                  <Flame className="h-5 w-5" />
                  <span className="font-bold">
                    {userRankData?.user_info?.stats?.current_streak || 0} Maalin
                    isu xigxiga
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Rank & Leaderboard */}
          <div className="space-y-6">
            {/* User Rank Card */}
            {/* <Card className="p-6 rounded-lg bg-card shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">Booskaaga</h3>
                  <Badge variant="outline">
                    Kaalinta #{userRankData?.rank || "?"}
                  </Badge>
                </div>
                <Trophy className="text-primary h-6 w-6" />
              </div>

              {isLoadingUserRank ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : userRankError ? (
                <div className="text-center py-4 text-destructive">
                  {userRankError.message || "Failed to load user rank"}
                </div>
              ) : userRankData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                        {userRankData.rank}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Dhibcahaaga
                        </p>
                        <p className="font-bold text-foreground text-lg">
                          {userRankData.points} Dhibco
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">
                      Arag kulli <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>

                  {(expandedCard === "userRank" || !expandedCard) && (
                    <div>
                      {userRankData.entries_above.length > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              Kaalinta kaa horeysa
                            </p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 p-0"
                              onClick={() => toggleCardExpansion("userRank")}
                            >
                              <ChevronDown
                                className={`h-4 w-4 transition-transform duration-300 ${
                                  expandedCard === "userRank"
                                    ? "rotate-180"
                                    : ""
                                }`}
                              />
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {userRankData.entries_above.map((entry, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-md bg-background border"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 bg-muted text-muted-foreground">
                                    <AvatarFallback>
                                      {getInitials(entry.user__username)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {entry.user__username}
                                  </span>
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
                        <div className="mt-4">
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            Kaalinta kaa hooseysa
                          </p>
                          <div className="space-y-2">
                            {userRankData.entries_below.map((entry, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 rounded-md bg-background border"
                              >
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8 bg-muted text-muted-foreground">
                                    <AvatarFallback>
                                      {getInitials(entry.user__username)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="font-medium">
                                    {entry.user__username}
                                  </span>
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
                  )}
                </div>
              ) : null}
            </Card> */}

            {/* Leaderboard Card */}
            <Card className="p-6 rounded-lg bg-card shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Shaxda Tartanka</h3>
                    <p className="text-sm text-muted-foreground">
                      Kaalmaha sare
                    </p>
                  </div>
                </div>
                <Tabs
                  defaultValue="all_time"
                  className="w-full md:w-auto"
                  onValueChange={setLeaderboardPeriod}
                >
                  <TabsList className="grid grid-cols-3 w-full md:w-[200px]">
                    <TabsTrigger value="all_time">Dhamaan</TabsTrigger>
                    <TabsTrigger value="weekly">Asbuuc</TabsTrigger>
                    <TabsTrigger value="monthly">Bil</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {isLoadingLeaderboard ? (
                <div className="space-y-3">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : leaderboardError ? (
                <div className="text-center py-4 text-destructive">
                  {leaderboardError.message || "Failed to load leaderboard"}
                </div>
              ) : leaderboardData && leaderboardData.length > 0 ? (
                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-3">
                    {leaderboardData.slice(0, 10).map((entry, idx) => {
                      const isCurrent = storedUser?.username === entry.username;
                      return (
                        <div
                          key={entry.id}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-md transition-all",
                            isCurrent
                              ? "bg-primary/10 border"
                              : "bg-background border"
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full font-bold",
                              idx === 0
                                ? "bg-primary/20 text-primary"
                                : idx === 1
                                ? "bg-muted text-muted-foreground"
                                : idx === 2
                                ? "bg-muted text-muted-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {idx + 1}
                          </div>
                          <Avatar
                            className={cn(
                              "w-10 h-10 border-2",
                              isCurrent
                                ? "border-primary bg-primary"
                                : "border-muted bg-muted"
                            )}
                          >
                            <AvatarFallback
                              className={
                                isCurrent
                                  ? "text-primary-foreground"
                                  : "text-muted-foreground"
                              }
                            >
                              {getInitials(entry.username)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "font-medium",
                                isCurrent ? "text-primary" : ""
                              )}
                            >
                              {entry.username}
                              {isCurrent ? " (You)" : ""}
                            </span>
                            {entry.user_info?.stats && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>
                                  {entry.user_info.stats.completed_lessons}{" "}
                                  cashar
                                </span>
                                {typeof entry.user_info?.stats
                                  ?.current_streak === "number" &&
                                  entry.user_info.stats.current_streak > 0 && (
                                    <Badge
                                      variant="outline"
                                      className="flex items-center gap-1 py-0 h-5"
                                    >
                                      <Flame className="h-3 w-3" />
                                      {entry.user_info.stats.current_streak}
                                    </Badge>
                                  )}
                              </div>
                            )}
                          </div>
                          <div className="ml-auto flex items-center">
                            <span
                              className={cn(
                                "font-bold",
                                isCurrent ? "text-primary" : ""
                              )}
                            >
                              {entry.points}
                            </span>
                            <span className="ml-1 text-xs text-muted-foreground">
                              Dhibco
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  wax shax ah lama helin
                </div>
              )}
            </Card>

            {/* Daily Challenges */}
            <Card className="p-6 rounded-lg bg-card shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Tartanka Maalinlaha ah
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Dhamastir sad abaalmarino u hesho
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" /> Maanta
                </Button>
              </div>

              {isLoadingChallenges ? (
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : dailyChallenges && dailyChallenges.length > 0 ? (
                <div className="space-y-3">
                  {dailyChallenges.map((challenge) => (
                    <div
                      key={challenge.id}
                      className={cn(
                        "p-4 rounded-md border transition-all",
                        challenge.completed ? "bg-primary/10" : "bg-background"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <Badge
                          variant="outline"
                          className={cn(
                            "flex items-center gap-1",
                            challenge.completed ? "bg-primary/20" : ""
                          )}
                        >
                          {challenge.completed ? (
                            <>
                              <CheckCircle2 className="h-3 w-3" /> Dhameeyay
                            </>
                          ) : (
                            <>
                              <Star className="h-3 w-3" />{" "}
                              {challenge.points_reward} Dhibco
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {challenge.description}
                      </p>
                      {!challenge.completed && (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleCompleteChallenge(challenge.id)}
                        >
                          Bilow Tartankaan
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 text-muted" />
                  <p>Wax Tartan ah lama helin</p>
                  <p className="text-sm">Ku soo laabo berri!</p>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column: Courses & Achievements */}
          <div className="space-y-6">
            {/* Courses Carousel */}
            <Card className="p-6 rounded-lg bg-card shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">Koorsooyinkaada</h3>
                </div>
                <Link href={"/courses"}>
                  <Button variant="outline" size="sm">
                    Arag kulli <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              <div
                ref={carouselRef}
                className="relative w-full overflow-hidden my-6 rounded-md bg-background p-4 border"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {isLoadingCourses ? (
                  <div className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <div className="flex justify-center gap-2">
                      <Skeleton className="h-2 w-8" />
                      <Skeleton className="h-2 w-8" />
                      <Skeleton className="h-2 w-8" />
                    </div>
                  </div>
                ) : courses.length ? (
                  <div
                    className="flex transition-all duration-300 ease-in-out"
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
                            loading="lazy"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Rj5m4xOLvLKcZTHLl+NU9ADzSdNrBBCJlUAKoUBQOgHQCgD//2Q=="
                          />
                          {course.progress > 75 && (
                            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <CheckCircle2 className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-bold text-center mb-2">
                          {course.title}
                        </h4>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{course.estimatedHours || 0} saac</span>
                          <span className="mx-1">•</span>
                          <span>{course.lesson_count || 0} casharo</span>
                        </div>

                        {course.progress > 0 && (
                          <div className="w-full mt-3">
                            <Progress value={course.progress} className="h-2" />
                            <div className="flex justify-between text-xs mt-1">
                              <span className="text-muted-foreground">
                                Progress
                              </span>
                              <span className="font-medium">
                                {course.progress}%
                              </span>
                            </div>
                          </div>
                        )}

                        <Link
                          href={`/courses/${getCategoryIdByName(
                            course.title
                          )}/${course.slug}`}
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
                    <User className="h-12 w-12 text-muted mb-4" />
                    <p className="text-muted-foreground">
                      Wax Koorsaa lama helin
                    </p>
                    <Button className="mt-4">Baar Koorsooyinka</Button>
                  </div>
                )}
              </div>

              {courses.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {courses.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        currentSlide === idx ? "bg-primary w-8" : "bg-muted"
                      )}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Course Thumbnails */}
            {courses.length > 1 && (
              <div className="flex justify-center w-full gap-2 overflow-x-auto pb-2">
                {courses.map((course, idx) => (
                  <button
                    key={course.id}
                    onClick={() => setCurrentSlide(idx)}
                    className={cn(
                      "p-3 border rounded-md min-w-[70px] transition-all",
                      currentSlide === idx
                        ? "border-primary bg-primary/10"
                        : "border-muted bg-background"
                    )}
                  >
                    <Image
                      src={
                        course.thumbnail ||
                        "/placeholder.svg?height=40&width=40" ||
                        "/placeholder.svg"
                      }
                      width={40}
                      height={40}
                      alt={course.title}
                      className="object-contain mx-auto"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Achievements */}
            <Card className="p-6 rounded-lg bg-card shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Medal className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Abaalmarinadaada</h3>
                    <p className="text-sm text-muted-foreground">
                      koobabka aad ku guulaysatay
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Kulli arag
                </Button>
              </div>

              {isLoadingAchievements ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : achievements && achievements.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <TooltipProvider key={achievement.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex flex-col items-center p-4 rounded-md bg-background border hover:border-primary transition-all cursor-help">
                            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-primary mb-2">
                              {getAchievementIcon(achievement.icon)}
                            </div>
                            <span className="font-medium text-center text-sm">
                              {achievement.name}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-card text-foreground border p-3 max-w-[200px]">
                          <p>{achievement.description}</p>
                          {achievement.earned_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Ku guulaystey{" "}
                              {new Date(
                                achievement.earned_at
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Medal className="h-12 w-12 mx-auto mb-2 text-muted" />
                  <p>No achievements yet</p>
                  <p className="text-sm">Complete courses to earn badges!</p>
                </div>
              )}
            </Card>

            {/* Streak Card */}
            <Card className="p-6 rounded-lg bg-card shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <Flame className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Maalmaha isu xigxiga</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">
                      {userRankData?.user_info?.stats?.current_streak || 0}
                    </span>
                    <span className="text-muted-foreground">maalmood</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ugu fiicnaa:{" "}
                    {userRankData?.user_info?.stats?.current_streak || 0}{" "}
                    maalmood
                  </p>
                </div>
              </div>

              {/* Streak visualization */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">7 berri ugu danbeysay</p>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex justify-between items-end mt-2 h-12">
                  {streakVisualization.map((bar, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "w-8 rounded-t-md",
                        bar.isActive ? "bg-primary" : "bg-muted"
                      )}
                      style={{ height: bar.height }}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center mt-1">
                  {["S", "A", "I", "T", "A", "KH", "J"].map((day, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-muted-foreground w-8 text-center"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
