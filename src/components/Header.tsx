"use client";

import Link from "next/link";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/features/authSlice";
import { ProfileDropdown } from "./layout/ProfileDropdown";
import { usePathname } from "next/navigation";
import { FolderDot, Home } from "lucide-react";
import clsx from "clsx";
import StreakDisplay from "./StreakDisplay";
import { useUserStreak } from "@/hooks/useApi";
import { useEffect, useState } from "react";
import AuthService from "@/services/auth";
import axios from "axios";

interface Energy {
  current: number;
  max: number;
  next_update: string;
}

interface DailyActivity {
  date: string;
  day: string;
  status: "none" | "partial" | "complete";
  problems_solved: number;
  lesson_ids: string[];
  isToday: boolean;
}

interface StreakData {
  userId: string;
  username: string;
  current_streak: number;
  max_streak: number;
  lessons_completed: number;
  problems_to_next_streak: number;
  energy: Energy;
  daily_activity: DailyActivity[];
}

export function Header() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useSelector(selectCurrentUser);
  const pathname = usePathname();

  // const { streak, isLoading, isError } = useUserStreak();

  // console.log("user:", user);
  console.log("streak:", streakData);

  const fetchStreakData = async () => {
    setLoading(true);
    setError(null);

    try {
      const authService = AuthService.getInstance();
      const token = authService.getToken();

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/streaks/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStreakData(response.data);
      setLoading(false);
      console.log(response.data);
      console.log(response.data.username);
    } catch (err) {
      console.error("Error fetching streak data:", err);
      setError("Failed to load streak data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStreakData();
  }, []);

  const navLinks = user
    ? [
        { name: "Guriga", href: "/home", icon: Home },
        { name: "Koorsooyinka", href: "/courses", icon: FolderDot },
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="items-center gap-6 flex">
          <Link
            href="/"
            className="text-2xl font-semibold tracking-tight text-black font-[fkGrotesk,Fallback] md:text-3xl md:flex"
          >
            Garaad
          </Link>

          <nav className="flex items-center gap-6">
            {navLinks.map(({ name, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "text-gray-600 hover:text-black transition-all font-medium flex items-center gap-2 py-1",
                  (pathname === href || pathname.startsWith(`${href}/`)) &&
                    "text-primary border-b-2 border-primary"
                )}
              >
                {/* icon */}
                <span className="w-4 h-4">
                  {Icon && <Icon className="w-4 h-4" />}
                </span>
                {name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <StreakDisplay
              loading={loading}
              error={error}
              streakData={streakData}
            />
          )}

          {user ? <ProfileDropdown /> : <AuthDialog />}
        </div>
      </div>
    </header>
  );
}
