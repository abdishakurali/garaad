"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { UserProfile } from "@/types/community";

interface MemberListSidebarProps {
    onlineUsersCount: number;
    userProfile: UserProfile | null;
    onlineUsers: string[];
}

export function MemberListSidebar({ onlineUsersCount }: MemberListSidebarProps) {
    return (
        <div className="w-[300px] bg-[#FFFFFF] dark:bg-[#2B2D31] flex flex-col border-l border-black/5 dark:border-white/5 select-none h-full overflow-hidden transition-all duration-300">
            {/* Top Toolbar */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">
                        Online — {onlineUsersCount || 0}
                    </p>
                </div>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                    {/* List area is clean/empty as we only have IDs for now */}
                    {onlineUsersCount === 0 && (
                        <p className="text-sm text-gray-400 text-center italic py-4">No members online</p>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}
