"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { UserProfile } from "@/types/community";
import { getMediaUrl } from "@/lib/utils";

interface MemberListSidebarProps {
    onlineUsersCount: number;
    userProfile: UserProfile | null;
    onlineUsers: string[]; // List of user IDs or names
}

import { SOMALI_UI_TEXT, UserProfile } from "@/types/community";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, RefreshCw, Maximize2, HelpCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MemberListSidebarProps {
    onlineUsersCount: number;
    userProfile: UserProfile | null;
    onlineUsers: string[];
}

export function MemberListSidebar({ onlineUsersCount, userProfile, onlineUsers }: MemberListSidebarProps) {
    return (
        <div className="w-[300px] bg-[#FFFFFF] dark:bg-[#2B2D31] flex flex-col border-l border-black/5 dark:border-white/5 select-none h-full overflow-hidden transition-all duration-300">
            {/* Top Toolbar */}
            <div className="h-14 px-4 flex items-center justify-between border-b border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                        A
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-black dark:text-white truncate">Garaad STEM</p>
                        <p className="text-[10px] text-green-500 font-bold">{onlineUsersCount || 1} jooga</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                        <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
                        <Maximize2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="unreads" className="flex-1 flex flex-col">
                <div className="px-4 py-3">
                    <TabsList className="w-full bg-gray-100 dark:bg-black/20 p-1 h-9 rounded-lg">
                        <TabsTrigger
                            value="unreads"
                            className="flex-1 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-[#383A40] data-[state=active]:shadow-sm rounded-md"
                        >
                            {SOMALI_UI_TEXT.unreads}
                        </TabsTrigger>
                        <TabsTrigger
                            value="history"
                            className="flex-1 text-[11px] font-black uppercase tracking-widest data-[state=active]:bg-white dark:data-[state=active]:bg-[#383A40] data-[state=active]:shadow-sm rounded-md"
                        >
                            {SOMALI_UI_TEXT.history}
                        </TabsTrigger>
                    </TabsList>
                </div>

                <ScrollArea className="flex-1">
                    <TabsContent value="unreads" className="m-0 p-4 space-y-4">
                        {/* Info Card */}
                        <div className="bg-gray-50 dark:bg-[#383A40] rounded-2xl p-4 border border-black/5 dark:border-white/5 space-y-3">
                            <div className="flex items-center gap-2 text-primary">
                                <Info className="h-4 w-4" />
                                <span className="text-[11px] font-black uppercase tracking-widest">Warbixin</span>
                            </div>
                            <h4 className="text-sm font-black dark:text-white leading-tight">
                                Casharka Maanta: STEM-ka iyo mustaqbalka.
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                Fahamka aasaasiga ah ee sayniska iyo tiknoolajiyadda casriga ah.
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono italic">
                                <span>8th April 2025</span>
                            </div>
                        </div>

                        {/* Video Card Placeholder */}
                        <div className="bg-gray-50 dark:bg-[#383A40] rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 group cursor-pointer hover:shadow-md transition-all">
                            <div className="aspect-video bg-black/5 relative flex items-center justify-center">
                                <HelpCircle className="h-8 w-8 text-gray-300 opacity-20" />
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-3">
                                <h5 className="text-[11px] font-black dark:text-white truncate">Muuqaalka Maanta</h5>
                                <p className="text-[10px] text-gray-400 mt-1">Xisaabta Sare - Lvl 4</p>
                            </div>
                        </div>

                        {/* Search Bar in Sidebar */}
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <Input
                                placeholder={SOMALI_UI_TEXT.search}
                                className="h-9 bg-transparent border-black/10 dark:border-white/10 text-xs pl-10 rounded-xl"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="m-0 p-4">
                        <div className="text-center py-12">
                            <RefreshCw className="h-8 w-8 text-gray-200 mx-auto mb-3 animate-spin-slow" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-gray-400">Mar dhow...</p>
                        </div>
                    </TabsContent>
                </ScrollArea>
            </Tabs>

            {/* Bottom Footer */}
            <div className="p-4 border-t border-black/5 dark:border-white/5 bg-gray-50 dark:bg-[#232428]">
                <div className="flex items-center justify-between text-gray-400">
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Garaad v2.0</span>
                    <HelpCircle className="h-4 w-4 cursor-pointer hover:text-primary transition-colors" />
                </div>
            </div>
        </div>
    );
}
