"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Flame,
    Star,
    Trophy,
    Activity,
    Zap,
    Info
} from "lucide-react";
import { GamificationStatus } from "@/types/gamification";
import { cn } from "@/lib/utils";

interface StatusScreenProps {
    status?: GamificationStatus;
    loading?: boolean;
}

export function StatusScreen({ status, loading }: StatusScreenProps) {
    if (loading || !status) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="h-32 animate-pulse bg-gray-100 dark:bg-gray-800" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Momentum / Streak Status */}
                <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-slate-50 dark:bg-[#2B2D31]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600">
                            <Flame className="w-6 h-6" />
                        </div>
                        <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-sm bg-orange-500">
                            Active
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-3xl font-black dark:text-white">{status.streak.count}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            Maalmood oo xiriir ah
                        </div>
                    </div>
                </Card>

                {/* Energy Status */}
                <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-slate-50 dark:bg-[#2B2D31]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {status.energy?.current ?? 0}/{status.energy?.max ?? 0} Energy
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="text-3xl font-black dark:text-white">Awoodda</div>
                        <Progress
                            value={status.energy?.max ? (status.energy.current / status.energy.max) * 100 : 0}
                            className="h-2"
                        />
                    </div>
                </Card>

                {/* Level / Identity Status */}
                <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-slate-50 dark:bg-[#2B2D31]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">
                            Heerka {status.level}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-black dark:text-white capitalize">{status.identity}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            Aqoonsigaaga hadda
                        </div>
                    </div>
                </Card>

                {/* XP / Progress Meaning */}
                <Card className="p-6 rounded-[2rem] border-none shadow-sm bg-slate-50 dark:bg-[#2B2D31]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
                            <Star className="w-6 h-6" />
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-yellow-600 uppercase tracking-widest">
                            <Activity className="w-3 h-3" />
                            Active
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-2xl font-black dark:text-white">{status.xp} XP</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                            Wadarta guushaada
                        </div>
                    </div>
                </Card>
            </div>

            <div className="bg-primary/5 border border-primary/10 p-4 rounded-3xl flex items-start gap-3">
                <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-sm font-black dark:text-white uppercase tracking-tight mb-0.5">Fariinta Garaad</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sii wad barashada si aad u kordhiso dhibcahaaga!</p>
                </div>
            </div>
        </div>
    );
}
