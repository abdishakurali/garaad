"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Header } from "@/components/Header";

interface Reward {
  id: string;
  reward_type: string;
  reward_name: string;
  value: number;
  awarded_at: string;
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lms/rewards/`
        );
        const data = await response.json();
        setRewards(data.results);
      } catch (error) {
        console.error("Error fetching rewards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, []);

  const groupedRewards = rewards.reduce((acc, reward) => {
    if (!acc[reward.reward_type]) acc[reward.reward_type] = [];
    acc[reward.reward_type].push(reward);
    return acc;
  }, {} as Record<string, Reward[]>);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-12 text-gray-800">
          🎉 Your Achievements
        </h1>

        {loading ? (
          <div className="space-y-10">
            {[1].map((_, i) => (
              <Card
                key={i}
                className="border border-gray-200 shadow rounded-2xl p-6 bg-white"
              >
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((_, j) => (
                    <div
                      key={j}
                      className="rounded-xl border p-4 space-y-3 shadow-sm"
                    >
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(groupedRewards).map(([type, rewards]) => (
              <Card
                key={type}
                className="bg-gradient-to-r from-white via-gray-50 to-white border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl"
              >
                <CardHeader className="pb-0">
                  <CardTitle className="text-2xl font-semibold capitalize text-gray-700">
                    {type.replace("_", " ")}
                  </CardTitle>
                </CardHeader>

                <CardContent className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map((reward) => (
                      <div
                        key={reward.id}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-lg text-gray-800">
                            {reward.reward_name}
                          </h3>
                          <Badge className="bg-blue-100 text-blue-600">
                            {reward.value} pts
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Awarded on{" "}
                          {format(new Date(reward.awarded_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
