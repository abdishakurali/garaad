import Image from "next/image";
import { Button } from "@/components/ui/button";

interface User {
  id: number;
  name: string;
}

interface Standing {
  rank: number;
  user: User;
  points: number;
  streak: number;
}

interface LeaderboardData {
  time_period: string;
  league: string;
  standings: Standing[];
  my_standing: {
    rank: number;
    points: number;
    streak: number;
  };
}

interface LeaderboardLeagueProps {
  data?: LeaderboardData;
  xp?: number;
  onContinue: () => void;
}

export default function LeaderboardLeague({
  data,
  onContinue,
  xp,
}: LeaderboardLeagueProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index: number) => {
    const colors = [
      "bg-pink-400",
      "bg-blue-500",
      "bg-red-500",
      "bg-orange-500",
      "bg-purple-500",
    ];
    return colors[index % colors.length];
  };

  // Derive current user ID from my_standing if available
  const currentUserId = data?.my_standing
    ? data.standings?.find(
        (s) =>
          s.points === data.my_standing.points &&
          s.streak === data.my_standing.streak
      )?.user.id
    : undefined;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 mx-auto">
      <div className="w-full max-w-[1000px] bg-white rounded-3xl p-8 text-center">
        {/* Badge */}
        <div className="mb-6">
          <Image
            src="/favicon.ico"
            alt="League Badge"
            width={80}
            height={80}
            className="mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Liigaha {data?.league ?? "League"}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mb-1">
          waxaad joogtaa liigaha #{data?.my_standing?.rank ?? "?"} waxaana
          haysataa {xp ?? "?"} Dhibcood
        </p>

        {/* Time period */}
        <p className="text-gray-400 text-sm mb-8">
          {data?.time_period ?? "Time period"} - {data?.standings?.length ?? 0}{" "}
          isticmaale
        </p>

        {/* Leaderboard */}
        <div className="space-y-3">
          {data?.standings?.map((standing, index) => {
            const isCurrentUser = standing.user.id === currentUserId;
            return (
              <div
                key={standing.user.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  isCurrentUser ? "bg-green-100" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-500 font-medium w-4">
                    {standing.rank}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(
                      index
                    )}`}
                  >
                    {getInitials(standing.user.name)}
                  </div>
                  <span className="text-gray-900 font-medium truncate max-w-[150px]">
                    {standing.user.name}
                  </span>
                </div>
                <span className="text-gray-500 font-medium ml-4">
                  {standing.points} Dhibco
                </span>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <Button className="w-full rounded-md mt-10" onClick={onContinue}>
          Sii wado
        </Button>
      </div>
    </div>
  );
}
