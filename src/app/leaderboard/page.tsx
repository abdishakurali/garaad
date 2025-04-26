"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface LeaderboardItem {
  id: string;
  username: string;
  points: number;
  time_period: string;
  last_updated: string;
  user_info: {
    email: string;
    first_name: string;
    last_name: string;
    stats: {
      total_points: number;
      completed_lessons: number;
      enrolled_courses: number;
      current_streak: number;
      badges_count: number;
    };
    badges: Array<{
      id: string;
      reward_name: string;
      value: number;
      awarded_at: string;
    }>;
  };
}

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<LeaderboardItem[]>([]);
  const daysLeft = 3;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers([
        {
          id: "1",
          username: "Georgia S",
          points: 225,
          time_period: "weekly",
          last_updated: "2025-04-20T14:32:00Z",
          user_info: {
            email: "georgia@example.com",
            first_name: "Georgia",
            last_name: "S",
            stats: {
              total_points: 1200,
              completed_lessons: 15,
              enrolled_courses: 3,
              current_streak: 5,
              badges_count: 7,
            },
            badges: [
              {
                id: "b1",
                reward_name: "Fast Learner",
                value: 100,
                awarded_at: "2025-04-18T09:15:00Z",
              },
            ],
          },
        },
        {
          id: "2",
          username: "Sam S",
          points: 170,
          time_period: "weekly",
          last_updated: "2025-04-20T14:32:00Z",
          user_info: {
            email: "sam@example.com",
            first_name: "Sam",
            last_name: "S",
            stats: {
              total_points: 950,
              completed_lessons: 12,
              enrolled_courses: 2,
              current_streak: 3,
              badges_count: 5,
            },
            badges: [
              {
                id: "b2",
                reward_name: "Course Master",
                value: 150,
                awarded_at: "2025-04-17T11:40:00Z",
              },
            ],
          },
        },
        {
          id: "3",
          username: "Abdullahi A",
          points: 165,
          time_period: "weekly",
          last_updated: "2025-04-20T14:32:00Z",
          user_info: {
            email: "abdullahi@example.com",
            first_name: "Abdullahi",
            last_name: "A",
            stats: {
              total_points: 920,
              completed_lessons: 11,
              enrolled_courses: 2,
              current_streak: 7,
              badges_count: 4,
            },
            badges: [
              {
                id: "b3",
                reward_name: "Streak Keeper",
                value: 120,
                awarded_at: "2025-04-16T08:05:00Z",
              },
            ],
          },
        },
        {
          id: "4",
          username: "Keilani C",
          points: 160,
          time_period: "weekly",
          last_updated: "2025-04-20T14:32:00Z",
          user_info: {
            email: "keilani@example.com",
            first_name: "Keilani",
            last_name: "C",
            stats: {
              total_points: 880,
              completed_lessons: 10,
              enrolled_courses: 2,
              current_streak: 4,
              badges_count: 3,
            },
            badges: [
              {
                id: "b4",
                reward_name: "Quick Learner",
                value: 100,
                awarded_at: "2025-04-15T10:20:00Z",
              },
            ],
          },
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Helper function to get avatar initial
  const getInitial = (username: string): string => {
    return username.split(" ")[0][0];
  };

  // Helper function to get avatar color
  const getAvatarColor = (id: string): string => {
    const colors = [
      "bg-blue-400",
      "bg-purple-400",
      "bg-blue-500",
      "bg-red-300",
    ];
    return colors[Number.parseInt(id) - 1] || "bg-gray-400";
  };

  // Helper function to determine if user is current user
  const isCurrentUser = (username: string): boolean => {
    return username === "Abdullahi A";
  };

  // Helper function to get rank
  const getRank = (index: number): number => {
    return index + 3; // Starting from rank 3
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto p-6 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-20 w-20 rounded-lg" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="space-y-4 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-md" />
          ))}
        </div>

        <div className="space-y-2 mt-6">
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 mt-20">
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 bg-orange-500 rounded-lg transform rotate-45"></div>
          <div className="absolute inset-1 bg-orange-600 rounded-lg transform rotate-45"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-black rounded-sm transform rotate-45 flex items-center justify-center">
              <div className="w-6 h-3 bg-white rounded-sm transform -rotate-45"></div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-black">Welcome to Leagues!</h1>

        <p className="text-gray-700">
          You just qualified for{" "}
          <span className="font-semibold">Hydrogen League</span>! Keep
          <br />
          earning XP to rise the ranks.
        </p>

        <p className="text-gray-700 font-medium">{daysLeft} days left</p>
      </div>

      <div className="space-y-3 mt-8">
        {users.map((user, index) => (
          <div
            key={user.id}
            className={`flex items-center justify-between p-3 rounded-md ${isCurrentUser(user.username) ? "bg-green-50" : ""
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-8 text-center font-medium text-orange-500">
                {getRank(index)}
              </div>

              <Avatar
                className={`${getAvatarColor(user.id)} text-white h-10 w-10`}
              >
                <div className="flex items-center justify-center h-full w-full text-white font-medium">
                  {getInitial(user.username)}
                </div>
              </Avatar>

              <span className="font-medium">{user.username}</span>
            </div>

            <div className="text-right">
              <span className="text-gray-700">{user.points} XP</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 mt-6">
        <Button
          variant="outline"
          className="w-full rounded-full flex items-center justify-center space-x-2 border-gray-300"
        >
          <span>What are leagues?</span>
        </Button>

        <Button className="w-full rounded-full bg-gray-800 hover:bg-gray-700 text-white">
          Continue
        </Button>
      </div>
    </div>
  );
}
