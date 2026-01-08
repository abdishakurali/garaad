"use client";

import React, { useState, useEffect } from "react";
import { ProgressCard } from "@/components/progress/ProgressCard";
import { PracticeSet } from "@/components/practice/PracticeSet";
import { progressService } from "@/services/progress";
import { practiceService } from "@/services/practice";
import type {
  UserProgress,
} from "@/services/progress";
import type { PracticeSet as PracticeSetType } from "@/services/practice";

export default function DashboardPage() {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [practiceSets, setPracticeSets] = useState<PracticeSetType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [
          progressData,
          practiceSetsData,
        ] = await Promise.all([
          progressService.getUserProgress(),
          practiceService.getPracticeSets(),
        ]);

        setProgress(progressData);
        setPracticeSets(practiceSetsData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Boorka Shaqada</h1>

      <div className="grid gap-8">
        <ProgressCard progress={progress} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {practiceSets.map((practiceSet) => (
            <PracticeSet
              key={practiceSet.id}
              practiceSet={practiceSet}
              onSubmit={(problemId, answer) => {
                // Handle answer submission
                console.log("Answer submitted:", { problemId, answer });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
