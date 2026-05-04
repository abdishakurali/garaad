"use client";

import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/utils";

interface SocialProofUser {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

export function ProofSection() {
  const [users, setUsers] = useState<SocialProofUser[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/social-proof/`)
      .then((res) => res.json())
      .then((data: SocialProofUser[]) => {
        // Prioritize users with profile pictures
        const sorted = [...data].sort((a, b) => {
          if (a.profile_picture && !b.profile_picture) return -1;
          if (!a.profile_picture && b.profile_picture) return 1;
          return 0;
        });
        setUsers(sorted.slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
            150+ arday • 20+ wadan
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Ardayda <span className="text-violet-600 dark:text-violet-400">Guuleystay</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">
            Magacyo dhabta ah. Lacag dhabta ah. Wadan kasta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {users.length > 0 ? (
            users.map((user, i) => {
              const amounts = ["$1,200/mo", "$800 first job", "Remote worker"];
              const details = [
                "Freelance web developer — macaamiil UK ah ku shaqeeya Mogadishu",
                "Dhigtay website macmiil UK — 3 toddobaad ka dib bilowga",
                "Junior developer shaqo remote ah heshay — €2,400/bilood"
              ];
              const flags = ["🇸🇴", "🇬🇧", "🇺🇸"];
              
              return (
                <div
                  key={user.id}
                  className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-slate-200 dark:border-zinc-700"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {user.profile_picture ? (
                      <img
                        src={getMediaUrl(user.profile_picture, "profile_pics")}
                        alt={user.first_name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold">
                        {user.first_name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div>
                      <div className="text-xl font-bold text-violet-600 dark:text-violet-400">
                        {amounts[i]}
                      </div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        <span className="mr-1">{flags[i]}</span>
                        {user.first_name} {user.last_name?.[0] || ""}.
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-zinc-400">{details[i]}</div>
                </div>
              );
            })
          ) : (
            <>
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-slate-200 dark:border-zinc-700">
                <div className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-1">$1,200/mo</div>
                <div className="font-semibold text-slate-900 dark:text-white mb-1">🇸🇴 Maxamed A.</div>
                <div className="text-sm text-slate-600 dark:text-zinc-400">Freelance web developer — macaamiil UK ah</div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-slate-200 dark:border-zinc-700">
                <div className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-1">$800 first job</div>
                <div className="font-semibold text-slate-900 dark:text-white mb-1">🇬🇧 Fadumo H.</div>
                <div className="text-sm text-slate-600 dark:text-zinc-400">Dhigtay website macmiil UK — 3 toddobaad</div>
              </div>
              <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-slate-200 dark:border-zinc-700">
                <div className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-1">€2,400/first</div>
                <div className="font-semibold text-slate-900 dark:text-white mb-1">🇸🇪 Cali M.</div>
                <div className="text-sm text-slate-600 dark:text-zinc-400">Freelance — macaamiil Yurub 2 bilood</div>
              </div>
            </>
          )}
          <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
            <div className="text-sm font-medium text-violet-800 dark:text-violet-300 mb-2">
              Adiga xiga?
            </div>
            <div className="text-sm text-violet-700 dark:text-violet-400 mb-3">
              Ku biir maanta. 30 maalmood ka dib noo sheeg natiijadaada.
            </div>
            <a
              href="/welcome"
              className="block w-full text-center text-xs font-semibold bg-violet-600 text-white py-2 rounded-md"
            >
              Bilow hadda →
            </a>
          </div>
        </div>

        {/* More user avatars */}
        {users.length > 3 && (
          <div className="flex items-center justify-center gap-2 -space-x-2">
            {users.slice(3, 8).map((user) => (
              user.profile_picture ? (
                <img
                  key={user.id}
                  src={getMediaUrl(user.profile_picture, "profile_pics")}
                  alt={user.first_name}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 object-cover"
                />
              ) : (
                <div
                  key={user.id}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-800 bg-violet-600 flex items-center justify-center text-white text-xs font-bold"
                >
                  {user.first_name?.[0]?.toUpperCase() || "?"}
                </div>
              )
            ))}
            <span className="text-sm text-slate-500 dark:text-zinc-400 ml-3">
              +{users.length - 3} arday soo biiray
            </span>
          </div>
        )}
      </div>
    </section>
  );
}