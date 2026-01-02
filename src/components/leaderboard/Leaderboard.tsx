"use client";
import type React from "react";
import type { LeaderboardEntry, UserRank } from "@/services/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface LeaderboardProps {
  /** Full list of leaderboard entries */
  leaderboard: LeaderboardEntry[];
  /** Current user's rank (1-based) */
  userRank: Partial<UserRank>;
  /** Handler to go to next lesson */
  onContinue?: () => void;
  /** How many top entries to show */
  displayCount?: number;
  /** League name the user qualified for */
  leagueName?: string;
  /** Days left in current league period */
  daysLeft?: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboard,
  userRank,
  onContinue,
  displayCount = 5,
  leagueName = "Hydrogen League",
  daysLeft = 4,
}) => {
  // Only show top N entries
  const topEntries = leaderboard.slice(0, displayCount);

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border-0 mt-10">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          {/* League Badge */}
          <div className="w-20 h-20 bg-orange-500 rounded-lg p-2 relative">
            <div className="absolute inset-1 bg-orange-700 rounded-md flex items-center justify-center">
              <div className="w-10 h-6 bg-white rounded-sm" />
            </div>
          </div>

          {/* Welcome Header */}
          <h2 className="text-2xl font-bold mt-2">Kusoo Dhawaw Shaxdaan!!</h2>

          {/* League Info */}
          <p className="text-center text-gray-700">
            Waxaad u gudubty <span className="font-semibold">{leagueName}</span>
            ! Dadaal
            <br />
            Kasbo Dhibco badan saad kaalmaha koowaad u gasho
          </p>

          {/* Days Left */}
          <p className="text-gray-500 font-medium">
            {daysLeft} MAALIN ayaa haray
          </p>

          {/* Leaderboard Entries */}
          <div className="w-full space-y-3 mt-4">
            {topEntries.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser =
                entry.username === userRank.user_info?.email;

              return (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-3 rounded-lg relative overflow-x-auto ${isCurrentUser ? "bg-green-50" : ""
                    }`}
                >
                  <div className="flex items-center gap-1 md:gap-3">
                    {/* Rank Number */}
                    <span className="text-gray-500 w-6">{rank}</span>

                    {/* Avatar */}
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${entry.username}`}
                      />
                      <AvatarFallback className="bg-purple-500 text-white">
                        {entry.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name */}
                    <span className="font-medium relative overflow-hidden">
                      {entry.username}
                    </span>
                  </div>

                  {/* Points */}
                  <span className="text-gray-500">
                    {entry.user_info.stats.total_points} Dhibic
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3 mt-4">
            <Button
              className="w-full rounded-full bg-gray-900 hover:bg-gray-800"
              onClick={onContinue}
            >
              Sii wado Casharkaada
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
