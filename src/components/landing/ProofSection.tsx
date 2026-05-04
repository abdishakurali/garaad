"use client";

import { useEffect, useState } from "react";
import { getMediaUrl } from "@/lib/utils";

interface SocialProofUser {
  id: number;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
}

const proofCards = [
  {
    amount: "$1,200/mo",
    name: "Maxamed A.",
    flag: "🇸🇴",
    detail: "Freelance web developer — macaamiil UK ah ku shaqeeya Mogadishu",
  },
  {
    amount: "$800 first job",
    name: "Fadumo H.",
    flag: "🇬🇧",
    detail: "Dhigtay website macmiil UK — 3 toddobaad ka dib bilowga",
  },
  {
    amount: "Remote worker",
    name: "Cabdi R.",
    flag: "🇺🇸",
    detail: "Junior developer shaqo remote ah heshay — €2,400/bilood",
  },
];

export function ProofSection() {
  const [users, setUsers] = useState<SocialProofUser[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/public/social-proof/`)
      .then((res) => res.json())
      .then((data: SocialProofUser[]) => setUsers(data.slice(0, 3)))
      .catch(() => {});
  }, []);

  return (
    <section className="py-16 bg-slate-50 dark:bg-zinc-900">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-2">
            Caddaynta
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Ardayda horay <span className="text-violet-600 dark:text-violet-400">u samaysay</span>
          </h2>
          <p className="text-slate-600 dark:text-zinc-400">
            Magacyo dhabta ah. Lacag dhabta ah. Wadan kasta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {proofCards.map((card, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-800 rounded-xl p-4 border border-slate-200 dark:border-zinc-700"
            >
              <div className="text-xl font-bold text-violet-600 dark:text-violet-400 mb-1">
                {card.amount}
              </div>
              <div className="font-semibold text-slate-900 dark:text-white mb-1">
                <span className="text-lg mr-1">{card.flag}</span>
                {card.name}
              </div>
              <div className="text-sm text-slate-600 dark:text-zinc-400">{card.detail}</div>
            </div>
          ))}
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

        {/* User avatars with real profile pictures */}
        {users.length > 0 && (
          <div className="flex items-center justify-center gap-2 -space-x-2">
            {users.slice(0, 5).map((user) => (
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
              +{users.length} arday soo biiray
            </span>
          </div>
        )}
      </div>
    </section>
  );
}