"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { API_BASE_URL } from "@/lib/constants";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import {
  Search,
  RefreshCw,
  CheckCircle,
  Clock,
  BookOpen,
  BarChart3,
  Award,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { UserProgress } from "@/services/progress";

interface ProgressStats {
  completed: number;
  inProgress: number;
  totalItems: number;
  averageScore: number;
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "all" | "completed" | "in_progress"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const apiUrl = `${API_BASE_URL}/api/lms/user-progress/`;

  const fetchProgress = useCallback(async () => {
    setError(null);
    if (refreshCount > 0) setIsRefreshing(true);

    try {
      const token = Cookies.get("accessToken");
      if (!token) throw new Error("Not authenticated");

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        validateStatus: (status) => status >= 200 && status < 300,
      });

      setProgress(response.data || []);


    } catch (error: unknown) {
      // Handle 401 Unauthorized error
      if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 401) {
        console.log("401 Unauthorized - clearing session and redirecting to home");

        // Clear all cookies
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");

        // Clear localStorage
        if (typeof window !== 'undefined') {
          localStorage.clear();
        }

        // Redirect to home page
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }

        return;
      }

      if (error instanceof Error) {
        setError(error.message || "Error fetching progress");
      } else {
        setError("Error fetching progress");
      }

    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [apiUrl, refreshCount]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Calculate progress statistics
  const stats: ProgressStats = useMemo(() => {
    const totalItems = progress.length;
    const completed = progress.filter(
      (item) => item.status === "completed"
    ).length;
    const inProgress = progress.filter(
      (item) => item.status === "in_progress"
    ).length;

    // Treat null scores as 0 for progress bars, but exclude from average if null
    const totalScores = progress.reduce(
      (sum, item) => sum + (item.score ?? 0),
      0
    );
    const scoredCount = progress.filter((item) => item.score != null).length;
    const averageScore =
      scoredCount > 0 ? Math.round(totalScores / scoredCount) : 0;

    return { completed, inProgress, totalItems, averageScore };
  }, [progress]);

  // Filter and search items
  const filteredItems = useMemo(() => {
    return progress.filter((item) => {
      const statusMatch =
        activeTab === "all" ||
        (activeTab === "completed" && item.status === "completed") ||
        (activeTab === "in_progress" && item.status === "in_progress");
      const searchMatch =
        !searchQuery ||
        item.lesson_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.module_title.toLowerCase().includes(searchQuery.toLowerCase());
      return statusMatch && searchMatch;
    });
  }, [progress, activeTab, searchQuery]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
        </div>

        <Skeleton className="h-12 w-full" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 animate-in fade-in duration-500">
      {/* Header and Refresh */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Horumarka Waxbarashada</h1>
          <p className="text-muted-foreground mt-1">
            La soco dhammaysashada koorsooyinkaaga iyo waxqabadkaaga
          </p>
        </div>
        <Button
          onClick={() => setRefreshCount((prev) => prev + 1)}
          variant="outline"
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={cn("h-4 w-4", isRefreshing && "animate-spin")}
          />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completion Rate
                </p>
                <p className="text-2xl font-bold">
                  {stats.totalItems
                    ? Math.round((stats.completed / stats.totalItems) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
            <Progress
              value={
                stats.totalItems
                  ? (stats.completed / stats.totalItems) * 100
                  : 0
              }
              className="h-2 mt-4"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Average Score
                </p>
                <p className="text-2xl font-bold">{stats.averageScore}%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Progress
              value={stats.averageScore}
              className="h-2 mt-4 bg-blue-100"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completed
                </p>
                <p className="text-2xl font-bold">
                  {stats.completed}{" "}
                  <span className="text-sm text-muted-foreground">
                    / {stats.totalItems}
                  </span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Waa la socodaa
                </p>
                <p className="text-2xl font-bold">
                  {stats.inProgress}{" "}
                  <span className="text-sm text-muted-foreground">
                    / {stats.totalItems}
                  </span>
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Raadi casharada..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) =>
            setActiveTab(v as "all" | "completed" | "in_progress")
          }
          className="w-full md:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Dhammaan</span>
              <Badge variant="outline" className="ml-1">
                {stats.totalItems}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Dhammaystiran</span>
              <Badge variant="outline" className="ml-1">
                {stats.completed}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="in_progress"
              className="flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Waa la socodaa</span>
              <Badge variant="outline" className="ml-1">
                {stats.inProgress}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => setRefreshCount((prev) => prev + 1)}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-100"
            >
              Isku day mar kale
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lessons List */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Casharro lama helin</h3>
          <p className="text-muted-foreground mt-1">
            {searchQuery
              ? "Isku day erayo kale oo raadis ah"
              : "Wali ma hayso casharro ku saabsan qaybtan"}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item, index) => (
            <Card
              key={item.id}
              className={cn(
                "hover:shadow-md transition-all duration-300 overflow-hidden group",
                item.status === "completed"
                  ? "border-green-200"
                  : "border-blue-200"
              )}
              style={{
                animationDelay: `${index * 50}ms`,
                opacity: 0,
                animation: "fadeIn 0.5s ease forwards",
              }}
            >
              <div
                className={cn(
                  "h-1.5",
                  item.status === "completed" ? "bg-green-500" : "bg-blue-500"
                )}
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {item.lesson_title}
                  </CardTitle>
                  <Badge
                    variant={
                      item.status === "completed" ? "outline" : "secondary"
                    }
                    className={cn(
                      "ml-2 capitalize",
                      item.status === "completed"
                        ? "border-green-200 text-green-700 bg-green-50"
                        : "border-blue-200 text-blue-700 bg-blue-50"
                    )}
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {item.module_title}
                </p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Horumar</span>
                    <span className="text-sm text-muted-foreground">
                      {item.score ?? 0}%
                    </span>
                  </div>
                  <Progress
                    value={item.score ?? 0}
                    className={cn(
                      "h-2",
                      item.status === "completed"
                        ? "bg-green-100"
                        : "bg-blue-100",
                      item.status === "completed"
                        ? "indicator-green-600"
                        : "indicator-blue-600"
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground border-t pt-4 flex flex-col items-start gap-1">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    Booqasho ugu dambaysay:{" "}
                    {format(new Date(item.last_visited_at), "MMM d, yyyy")}
                  </span>
                </div>
                {item.completed_at && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    <span>
                      La dhammaystay:{" "}
                      {format(new Date(item.completed_at), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
