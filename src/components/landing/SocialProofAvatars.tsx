"use client";

import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/utils";

interface SocialProofUser {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export function SocialProofAvatars() {
  const [users, setUsers] = useState<SocialProofUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/social-proof/`)
      .then((res) => res.json())
      .then((data: SocialProofUser[]) => {
        setUsers(data.slice(0, 12)); // Show first 12 users with profile pictures
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-3">
        {users.slice(0, 5).map((user, index) => (
          <div
            key={user.id}
            className="relative group"
            style={{ zIndex: 5 - index }}
          >
            {user.profile_picture ? (
              <img
                src={getMediaUrl(user.profile_picture, "profile_pics")}
                alt={user.first_name}
                className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm"
              />
            ) : (
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-sm font-medium text-white">
                  {user.first_name?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
            )}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {user.first_name}
            </div>
          </div>
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        <span className="font-semibold text-gray-900 dark:text-gray-200">
          {users.length}+
        </span>{" "}
        arday soo biiray
      </span>
    </div>
  );
}