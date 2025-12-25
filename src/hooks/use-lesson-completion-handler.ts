import { useCallback, useState } from "react";

import AuthService from "@/services/auth";
import { LeaderboardEntry, UserRank, UserReward } from "@/services/progress";
import { LessonContentBlock } from "@/types/learning";
import { API_BASE_URL } from "@/lib/constants";

interface LessonCompletionHandlerProps {
  currentLesson?: {
    id: string;
    content_blocks: LessonContentBlock[];
  };
  currentBlockIndex: number;
  isCorrect: boolean;
  courseId: string;
  playSound: (sound: "correct" | "incorrect" | "continue") => void;
  setShowFeedback: (show: boolean) => void;
  setIsLessonCompleted: (completed: boolean) => void;
  setRewards: (rewards: UserReward[]) => void;
  setLeaderboard: (leaderboard: LeaderboardEntry[]) => void;
  setUserRank: (rank: Partial<UserRank>) => void;
  setCurrentBlockIndex: (index: number) => void;
}

export const useLessonCompletionHandler = ({
  currentLesson,
  currentBlockIndex,
  isCorrect,
  courseId,
  playSound,
  setShowFeedback,
  setIsLessonCompleted,
  setRewards,
  setLeaderboard,
  setUserRank,
  setCurrentBlockIndex,
}: LessonCompletionHandlerProps) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleContinue = useCallback(async () => {
    if (isCompleting) return;

    const contentBlocks = currentLesson?.content_blocks || [];

    if (contentBlocks.length > 0) {
      playSound("continue");
      window.scrollTo({ top: 0, behavior: "smooth" });

      const isLastBlock = currentBlockIndex === contentBlocks.length - 1;

      setShowFeedback(false);
      // toast.dismiss("correct-answer-toast");
      // toast.dismiss("reward-toast");

      if (isLastBlock) {
        setIsCompleting(true);
        setIsLessonCompleted(true);

        try {
          // Store in local storage as fallback
          try {
            const completedLessons = JSON.parse(
              localStorage.getItem("completedLessons") || "[]"
            );
            if (!completedLessons.includes(currentLesson?.id)) {
              completedLessons.push(currentLesson?.id);
              localStorage.setItem(
                "completedLessons",
                JSON.stringify(completedLessons)
              );
            }
          } catch (storageError) {
            console.error("Local storage error:", storageError);
          }

          if (currentLesson?.id) {
            // 1. Mark lesson as completed
            const completionResult =
              await AuthService.getInstance().makeAuthenticatedRequest<{
                reward?: { value: number };
              }>(
                "post",
                `${API_BASE_URL}/api/lms/lessons/${currentLesson.id}/complete/`,
                {
                  score: isCorrect ? 100 : 0,
                }
              );

            // 2. Get updated course progress
            const courseProgress =
              await AuthService.getInstance().makeAuthenticatedRequest<{
                progress: number;
                user_progress: {
                  progress_percent: number;
                };
              }>(
                "get",
                `${API_BASE_URL}/api/lms/courses/${courseId}/`
              );

            // // 3. Show reward if any
            // if (completionResult.reward) {
            //   toast.success(
            //     <>
            //     <div className="space-y-2">
            //       <p className="font-medium">Hambalyo!</p>
            //       <p>Waxaad ku guulaysatay {completionResult.reward.value} XP</p>
            //       <p>Horumarkaaga: {courseProgress.user_progress.progress_percent}%</p>
            //     </div>,
            //     { duration: 5000, id: 'reward-toast' }
            //     </>
            //   );
            // }

            // 4. Fetch updated data in parallel
            const [rewardsData, leaderboardData, userRankData] =
              await Promise.all([
                AuthService.getInstance().makeAuthenticatedRequest<
                  UserReward[]
                >("get", `${API_BASE_URL}/api/lms/rewards/`),
                AuthService.getInstance().makeAuthenticatedRequest<
                  LeaderboardEntry[]
                >(
                  "get",
                  `${API_BASE_URL}/api/lms/leaderboard/?time_period=all_time&limit=10`
                ),
                AuthService.getInstance().makeAuthenticatedRequest<
                  Partial<UserRank>
                >(
                  "get",
                  `${API_BASE_URL}/api/lms/leaderboard/my_rank/`
                ),
              ]);

            setRewards(rewardsData);
            setLeaderboard(leaderboardData);
            setUserRank(userRankData);
          }
        } catch (error) {
          console.error("Completion error:", error);
          // toast.error(
          //   <div className="space-y-2">
          //     <p className="font-medium">Xalad ayaa dhacday</p>
          //     <p>Waxaa jira khalad markii la diiwaangelinayay horumarkaaga. Fadlan isku day mar kale.</p>
          //   </div>,
          //   { duration: 5000, id: 'error-toast' }
          // );
        } finally {
          setIsCompleting(false);
        }
      } else {
        setCurrentBlockIndex(
          Math.min(currentBlockIndex + 1, contentBlocks.length - 1)
        );
      }
    }
  }, [
    currentLesson,
    currentBlockIndex,
    isCorrect,
    courseId,
    playSound,
    isCompleting,
  ]);

  return {
    handleContinue,
    isCompleting,
  };
};
