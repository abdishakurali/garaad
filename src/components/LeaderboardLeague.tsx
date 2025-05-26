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
  onContinue: () => void;
}

// const defaultData: LeaderboardData = {
//   time_period: "weekly",
//   league: "1",
//   standings: [
//     {
//       rank: 1,
//       user: {
//         id: 76,
//         name: "Rooble Cali",
//       },
//       points: 0,
//       streak: 1,
//     },
//     {
//       rank: 2,
//       user: {
//         id: 75,
//         name: "abdullahikawte2019@gmail.com",
//       },
//       points: 0,
//       streak: 1,
//     },
//   ],
//   my_standing: {
//     rank: 1,
//     points: 0,
//     streak: 1,
//   },
// }

export default function LeaderboardLeague({
  data,
  onContinue,
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
      "bg-red-500",
      "bg-purple-500",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 mx-auto">
      <div className="w-full max-w-[1000px]  bg-white rounded-3xl p-8 text-center">
        {/* Badge */}
        <div className="mb-6">
          <Image
            src="/badge.png"
            alt="League Badge"
            width={80}
            height={80}
            className="mx-auto"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {data?.league}
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-sm mb-1">
          waxaad joogtaa #{data?.my_standing?.rank} waxaana haysataa{" "}
          {data?.my_standing.points}
        </p>

        {/* Days left */}
        <p className="text-gray-400 text-sm mb-8">
          {data?.time_period} {data?.standings?.length}
        </p>

        {/* Leaderboard */}
        <div className="space-y-3">
          {data?.standings?.map((standing, index) => {
            const isCurrentUser = standing.user.id === 75; // Assuming this is the current user
            return (
              <div
                key={standing.user.id}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  isCurrentUser ? "bg-green-100" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-green-500 font-medium w-4">
                    {standing.rank}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium gap-2 ${getAvatarColor(
                      index
                    )}`}
                  >
                    {getInitials(standing.user.name)}
                  </div>
                  <span className="text-gray-900 font-medium">
                    {standing.user.name}
                  </span>
                </div>
                <span className="text-gray-500 font-medium ml-4">
                  {standing.points} XP
                </span>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <Button
          className="w-full rounded-md mt-10"
          onClick={() => onContinue()}
        >
          Sii wado
        </Button>
      </div>
    </div>
  );
}
