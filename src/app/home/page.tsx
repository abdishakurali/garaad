"use client";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import type React from "react";
import Image from "next/image";
import useSWR from "swr";
import {
  Clock,
  Trophy,
  ChevronRight,
  User,
  Flame,
  Star,
  Target,
  Medal,
  Sparkles,
  BookOpen,
  BarChart3,
  CheckCircle2,
  Zap,
  Crown,
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



interface DailyActivity {
  date: string;
  day: string;
  status: "complete" | "none";
  problems_solved: number;
  lesson_ids: number[];
  isToday: boolean;
}

interface StreakData {
  userId: string;
  username: string;
  current_streak: number;
  max_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  energy: {
    current: number;
    max: number;
    next_update: string;
  };
  dailyActivity: DailyActivity[];
  xp: number;
  daily_xp: number;
}

// League API interfaces
interface LeagueInfo {
  id: string;
  name: string;
  min_xp: number;
}

interface LeagueStatus {
  current_league: LeagueInfo;
  current_points: number;
  weekly_rank: number;
  streak: {
    current_streak: number;
    max_streak: number;
    streak_charges: number;
    last_activity_date: string;
  };
  next_league?: {
    id: string;
    name: string;
    min_xp: number;
    points_needed: number;
  };
}

interface LeagueStanding {
  rank: number;
  user: {
    id: string;
    name: string;
  };
  points: number;
  streak: number;
}

interface LeagueLeaderboard {
  time_period: string;
  league: string;
  standings: LeagueStanding[];
  my_standing: {
    rank: number;
    points: number;
    streak: number;
  };
}

interface GamificationStatus {
  xp: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  streak: {
    current: number;
    max: number;
    energy: number;
    problems_to_next: number;
  };
  league: {
    current: {
      id: number;
      name: string;
      somali_name: string;
      description: string;
      min_xp: number;
      order: number;
      icon: string | null;
    };
    next: {
      id: number;
      name: string;
      somali_name: string;
      min_xp: number;
      points_needed: number;
    };
  };
  rank: {
    weekly: number;
  };
}

const minSwipeDistance = 50;

const authFetcher = async <T = unknown>(url: string): Promise<T> => {
  const service = AuthService.getInstance();
  return await service.makeAuthenticatedRequest("get", url);
};

const publicFetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
};

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("weekly");

  const { categories } = useCategories();
  const router = useRouter();
  const carouselRef = useRef<HTMLDivElement>(null);

  const {
    data: courses = [],
    isLoading: isLoadingCourses,
    error: coursesError,
  } = useSWR<Course[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/lms/courses/`,
    publicFetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000,
    }
  );

  // League Status API
  const {
    data: leagueStatus,
  } = useSWR<LeagueStatus>("/api/league/leagues/status/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  // League Leaderboard API
  const {
    data: leagueLeaderboard,
    isLoading: isLoadingLeaderboard,
    error: leaderboardError,
    mutate: mutateLeaderboard,
  } = useSWR<LeagueLeaderboard>(
    leagueStatus?.current_league?.id
      ? `/api/league/leagues/leaderboard/?time_period=${leaderboardPeriod}&league=${leagueStatus.current_league.id}`
      : null,
    authFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const {
    data: achievements = [],
    isLoading: isLoadingAchievements,
    error: achievementsError,
  } = useSWR<Achievement[]>(
    "/api/lms/achievements/user_achievements/",
    authFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 600000,
    }
  );

  // const {
  //   data: dailyChallenges = [],
  //   isLoading: isLoadingChallenges,
  //   mutate: mutateChallenges,
  //   error: challengesError,
  // } = useSWR<Challenge[]>("/api/lms/challenges/", authFetcher, {
  //   revalidateOnFocus: false,
  //   dedupingInterval: 300000,
  // });

  // const {
  //   data: userLevel,
  //   isLoading: isLoadingUserLevel,
  //   error: userLevelError,
  // } = useSWR<UserLevel>("/api/lms/levels/", authFetcher, {
  //   revalidateOnFocus: false,
  //   dedupingInterval: 600000,
  // });

  const {
    data: streak,
    mutate,
  } = useSWR<StreakData>("/api/streaks/", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

  const {
    data: gamificationStatus,
    isLoading: isLoadingGamification,
  } = useSWR<GamificationStatus>("/api/gamification/status", authFetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

  const getCategoryIdByName = useCallback(
    (courseTitle: string): string | null => {
      if (!categories) return null;

      for (const category of categories) {
        const foundCourse = category.courses.find(
          (course: { title: string }) => course.title === courseTitle
        );
        if (foundCourse) return category.id;
      }
      return null;
    },
    [categories]
  );

  const storedUser = useMemo(
    () => AuthService.getInstance().getCurrentUser(),
    []
  );

  useEffect(() => {
    const authService = AuthService.getInstance();
    if (!authService.isAuthenticated()) router.push("/");
  }, [router]);

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

  // const handleCompleteChallenge = useCallback(
  //   async (challengeId: number) => {
  //     const service = AuthService.getInstance();
  //     try {
  //       await service.makeAuthenticatedRequest(
  //         "post",
  //         `/api/lms/challenges/${challengeId}/submit_attempt/`
  //       );

  //       const updatedChallenges = dailyChallenges.map((challenge) =>
  //         challenge.id === challengeId
  //           ? { ...challenge, completed: true }
  //           : challenge
  //       );

  //       mutateChallenges(updatedChallenges, false);

  //       const challenge = dailyChallenges.find((c) => c.id === challengeId);
  //       setNotificationMessage(
  //         `Challenge completed! +${challenge?.points_reward} points`
  //       );
  //       setShowNotification(true);
  //       setTimeout(() => setShowNotification(false), 3000);

  //       mutateLeagueStatus();
  //       mutateLeaderboard();
  //     } catch (err) {
  //       console.error("Error completing challenge:", err);
  //       mutateChallenges();
  //     }
  //   },
  //   [dailyChallenges, mutateChallenges, mutateLeagueStatus, mutateLeaderboard]
  // );

  // Find current user's rank in the leaderboard standings
  const myRank = useMemo(() => {
    return gamificationStatus?.rank?.weekly || null;
  }, [gamificationStatus?.rank?.weekly]);

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



  const streakVisualization = useMemo(() => {
    return (
      <div className="flex justify-between px-4 w-full mt-4">
        {streak?.dailyActivity
          .slice(0, 7)
          .reverse()
          .map((activity, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center ${activity.status === "complete"
                  ? "bg-yellow-400"
                  : "bg-gray-100"
                  }`}
              >
                <Zap
                  className={`w-4 h-4 ${activity.status === "complete"
                    ? "text-black"
                    : "text-gray-400"
                    }`}
                />
              </div>
              <span className="text-xs text-gray-500 mt-1">{activity.day}</span>
            </div>
          ))}
      </div>
    );
  }, [streak]);



  return (
    <>
      <Header />





      <div className="flex flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* League Status & User Level Progress Bar */}
        {!isLoadingGamification && gamificationStatus && (
          <Card className="p-4 md:p-6 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 shadow-sm border-primary/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Crown className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-xl flex items-center gap-2">
                    {gamificationStatus.league.current.name}
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Trophy className="h-3 w-3" />#
                      {gamificationStatus.rank.weekly}
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {gamificationStatus.league.current.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-bold">
                    {gamificationStatus.xp.total} Dhibco
                  </span>
                </div>

                <div className="flex items-center gap-2 bg-muted text-muted-foreground px-4 py-2 rounded-md">
                  <Flame className="h-5 w-5" />
                  <span className="font-bold">
                    {gamificationStatus.streak.current} Maalin isu xigxiga
                  </span>
                </div>
              </div>
            </div>

            {/* Next League Progress */}
            {gamificationStatus.league.next && (
              <div className="mt-4 p-4 bg-background/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    inta kaaga dhimman liiga{" "}
                    {gamificationStatus.league.next.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {gamificationStatus.league.next.points_needed} dhibco baa
                    loo baahan yahay
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    Math.round(
                      ((gamificationStatus.xp.total -
                        gamificationStatus.league.current.min_xp) /
                        (gamificationStatus.league.next.min_xp -
                          gamificationStatus.league.current.min_xp)) *
                      100
                    )
                  )}
                  className="h-3"
                />
              </div>
            )}
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: League Leaderboard */}
          <div className="space-y-6">
            {/* League Leaderboard Card */}
            <Card className="p-6 rounded-lg bg-card shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {leagueStatus?.current_league?.name || "League"} Shaxda
                      tartanka
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Meeshaad liigaga hadda ka joogtid
                    </p>
                  </div>
                </div>
                <Tabs
                  defaultValue="weekly"
                  className="w-full md:w-auto"
                  onValueChange={setLeaderboardPeriod}
                >
                  <TabsList className="grid grid-cols-2 w-full md:w-[160px]">
                    <TabsTrigger value="weekly">asbuucle</TabsTrigger>
                    <TabsTrigger value="monthly">bille</TabsTrigger>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => mutateLeaderboard()}
                    className="ml-2"
                  >
                    ku celi
                  </Button>
                </div>
              ) : leagueLeaderboard?.standings &&
                leagueLeaderboard.standings.length > 0 ? (
                <ScrollArea className="h-[320px] pr-4">
                  <div className="space-y-3">
                    {leagueLeaderboard.standings.map((standing) => {
                      const isCurrent =
                        storedUser?.username === standing.user.name;
                      return (
                        <div
                          key={standing.user.id}
                          className={cn(
                            "flex items-center gap-4 p-4 rounded-md transition-all",
                            isCurrent
                              ? "bg-primary/10 border border-primary/20"
                              : "bg-background border"
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full font-bold",
                              standing.rank === 1
                                ? "bg-yellow-500/20 text-yellow-700"
                                : standing.rank === 2
                                  ? "bg-gray-400/20 text-gray-700"
                                  : standing.rank === 3
                                    ? "bg-orange-500/20 text-orange-700"
                                    : "bg-muted text-muted-foreground"
                            )}
                          >
                            {standing.rank}
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
                              {getInitials(standing.user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span
                              className={cn(
                                "font-medium",
                                isCurrent ? "text-primary" : ""
                              )}
                            >
                              {standing.user.name}
                              {isCurrent ? " (You)" : ""}
                            </span>
                            {standing.streak > 0 && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1 py-0 h-5"
                                >
                                  <Flame className="h-3 w-3 text-yellow-400 fill-amber-500" />
                                  {standing.streak}
                                </Badge>
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
                              {standing.points}
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
                  wax liiga ah kuma jirtid
                </div>
              )}

              {/* My Standing */}
              {leagueLeaderboard?.my_standing && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">kaalintaada</Badge>
                      <span className="font-medium">#{myRank}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{streak?.xp} Dhibco</span>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        <Flame className="h-3 w-3" />
                        {leagueLeaderboard.my_standing.streak}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Streak visualization */}
            <Card className="p-6 rounded-lg bg-card shadow-sm">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                  <Flame className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Maalmaha isu xigxiga</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold">
                      {gamificationStatus?.streak?.current || 0}
                    </span>
                    <span className="text-muted-foreground">maalmood</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ugu fiicnaa: {gamificationStatus?.streak?.max || 0} maalmood
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2 justify-end ml-auto mb-auto">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">
                    Tamarta: {gamificationStatus?.streak?.energy || 0}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">
                      {gamificationStatus?.xp?.daily || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dhibcaha Maanta
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">
                      {gamificationStatus?.xp?.weekly || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dhibcaha asbuucaan
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">
                      {gamificationStatus?.xp?.monthly || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Dhibcaha bishaan
                    </div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-lg font-bold">
                      #{gamificationStatus?.rank?.weekly || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Booskaada asbuucaan
                    </div>
                  </div>
                </div>
              </div>

              {streak?.dailyActivity && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">7 berri ugu danbeysay</p>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    {streakVisualization}
                  </div>
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
                role="region"
                aria-label="Courses carousel"
                aria-roledescription="carousel"
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
                ) : coursesError ? (
                  <div className="text-center py-4 text-destructive">
                    {coursesError.message || "Failed to load courses"}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => mutate()}
                      className="ml-2"
                    >
                      Retry
                    </Button>
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
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`Course: ${course.title}`}
                      >
                        <div className="relative w-48 h-48 mb-4">
                          <Image
                            src={
                              course.thumbnail ||
                              "/placeholder.svg?height=192&width=192" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            width={192}
                            height={192}
                            alt={course.title}
                            className="object-contain"
                            loading="lazy"
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
                      aria-current={currentSlide === idx}
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
                    aria-label={`View ${course.title}`}
                  >
                    <Image
                      src={
                        course.thumbnail ||
                        "/placeholder.svg?height=40&width=40" ||
                        "/placeholder.svg" ||
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
              ) : achievementsError ? (
                <div className="text-center py-4 text-destructive">
                  {achievementsError.message || "Failed to load achievements"}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => mutate()}
                    className="ml-2"
                  >
                    Retry
                  </Button>
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
                  <p>Wax abaal marin ah maadan helin</p>
                  <p className="text-sm">
                    Dhamee koorso si aad u hesho abaal marino!
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
