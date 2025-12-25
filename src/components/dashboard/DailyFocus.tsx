"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, PlayCircle } from "lucide-react";
import { NextAction } from "@/types/auth";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DailyFocusProps {
    nextAction?: NextAction;
}

export function DailyFocus({ nextAction }: DailyFocusProps) {
    if (!nextAction) {
        return (
            <Card className="p-8 border-dashed border-2 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <PlayCircle className="w-8 h-8 text-gray-300" />
                </div>
                <div className="space-y-1">
                    <h3 className="font-bold text-gray-400">Ma jiraan waxqabad la qorsheeyay</h3>
                    <p className="text-xs text-gray-400">Si aad u bilawdo, dooro koorso aad xiisaynayso.</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-8 bg-gradient-to-br from-primary/5 via-white to-purple-600/5 dark:from-primary/10 dark:via-[#1E1F22] dark:to-purple-600/10 border-primary/20 shadow-xl overflow-hidden relative group rounded-[2.5rem]">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Waxbarashada Maanta</span>
                    </div>
                    <h2 className="text-3xl font-black dark:text-white leading-tight tracking-tight">{nextAction.title}</h2>
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded",
                            nextAction.priority === 'high' ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        )}>
                            {nextAction.priority} priority
                        </span>
                    </div>
                </div>

                <Link href={nextAction.action_type === 'solve' ? '/practice' : '/courses'} className="w-full md:w-auto">
                    <Button size="lg" className="w-full h-16 px-10 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1 active:scale-95">
                        <PlayCircle className="w-6 h-6 mr-3" />
                        Hadda Bilaw
                        <ChevronRight className="w-6 h-6 ml-1" />
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
