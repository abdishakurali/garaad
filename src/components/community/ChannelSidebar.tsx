import { SOMALI_UI_TEXT, Campus, CampusRoom, UserProfile, GroupedRooms } from "@/types/community";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { getMediaUrl, cn } from "@/lib/utils";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

interface ChannelSidebarProps {
    selectedCampus: Campus | null;
    rooms: CampusRoom[];
    groupedRooms: GroupedRooms | null;
    selectedRoomId?: number;
    userProfile: UserProfile | null;
    onSelectRoom: (room: CampusRoom) => void;
}

export function ChannelSidebar({ selectedCampus, rooms, groupedRooms, selectedRoomId, userProfile, onSelectRoom }: ChannelSidebarProps) {
    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

    const toggleCategory = (category: string) => {
        setCollapsedCategories(prev => ({ ...prev, [category]: !prev[category] }));
    };

    const renderRoomButton = (room: CampusRoom) => {
        const unreadCount = Math.floor(Math.random() * 5); // Mocked for UI demo
        return (
            <Button
                key={room.id}
                variant="ghost"
                className={`w-full justify-start h-8 px-2 font-bold text-sm tracking-tight rounded-md border-none transition-all group mb-0.5 relative ${selectedRoomId === room.id
                    ? 'bg-[#D9DADD] dark:bg-[#404249] text-gray-900 dark:text-white'
                    : 'text-gray-500 dark:text-[#949BA4] hover:bg-[#D9DADD] dark:hover:bg-[#35373C] hover:text-gray-900 dark:hover:text-white'
                    }`}
                onClick={() => onSelectRoom(room)}
            >
                <MessageSquare className={`h-4 w-4 mr-1.5 transition-colors ${selectedRoomId === room.id ? 'text-gray-900 dark:text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`} />
                <span className="truncate flex-1 text-left">{room.name_somali}</span>
                {unreadCount > 0 && selectedRoomId !== room.id && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {unreadCount}
                    </span>
                )}
            </Button>
        );
    };

    return (
        <div className="w-60 flex flex-col bg-[#F2F3F5] dark:bg-[#2B2D31] select-none h-full border-r border-[#E3E5E8] dark:border-[#1E1F22]">
            {/* Header */}
            <div className="h-12 px-4 flex items-center shadow-sm border-b border-black/10 font-black dark:text-white dark:hover:bg-[#35373C] cursor-pointer transition-colors relative">
                <span className="truncate pr-4 uppercase tracking-tighter text-sm">
                    {selectedCampus?.name_somali || "Bulshada Garaad"}
                </span>
                <MoreHorizontal className="absolute right-4 h-4 w-4 text-gray-400" />
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {selectedCampus ? (
                        <div className="space-y-4">
                            {groupedRooms ? (
                                Object.entries(groupedRooms).map(([category, categoryRooms]) => (
                                    <div key={category} className="space-y-0.5">
                                        <div
                                            className="px-2 py-1 flex items-center group cursor-pointer hover:text-gray-700 dark:hover:text-gray-200"
                                            onClick={() => toggleCategory(category)}
                                        >
                                            {collapsedCategories[category] ? (
                                                <ChevronRight className="h-3 w-3 mr-1 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="h-3 w-3 mr-1 text-gray-400" />
                                            )}
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate">
                                                {category}
                                            </span>
                                            <Plus className="ml-auto h-3 w-3 text-gray-500 hover:text-gray-900 dark:hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        {!collapsedCategories[category] && categoryRooms.map(renderRoomButton)}
                                    </div>
                                ))
                            ) : (
                                <div className="space-y-0.5">
                                    <div className="px-2 py-1 flex items-center justify-between group cursor-default">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Wadahadalada</span>
                                        <Plus className="h-3 w-3 text-gray-500 hover:text-gray-900 cursor-pointer" />
                                    </div>
                                    {rooms.map(renderRoomButton)}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <Button variant="ghost" className="w-full justify-start font-black text-sm text-gray-600 dark:text-[#949BA4] hover:bg-[#D9DADD] dark:hover:bg-[#35373C] border-none py-4 px-3">
                                <TrendingUp className="h-5 w-5 mr-3 text-primary" />
                                {SOMALI_UI_TEXT.unreads}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start font-black text-sm text-gray-600 dark:text-[#949BA4] hover:bg-[#D9DADD] dark:hover:bg-[#35373C] border-none py-4 px-3">
                                <Trophy className="h-5 w-5 mr-3 text-secondary" />
                                {SOMALI_UI_TEXT.leaderboard}
                            </Button>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* User Bar */}
            <div className="bg-[#EBEDEF] dark:bg-[#232428] px-2 py-2 flex flex-col gap-2 select-none border-t border-black/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 px-1 py-1 hover:bg-black/10 dark:hover:bg-white/5 rounded-md cursor-pointer min-w-0 transition-colors group">
                        <div className="relative">
                            <AuthenticatedAvatar
                                src={getMediaUrl(userProfile?.user.profile_picture, 'profile_pics')}
                                alt="User"
                                size="sm"
                                fallback={userProfile?.user.first_name?.[0] || 'U'}
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#EBEDEF] dark:border-[#232428]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-black truncate leading-tight mb-0.5 dark:text-white">
                                {userProfile?.user.first_name || "Garaad"}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <span className="text-[10px] px-1 bg-primary/20 text-primary font-black rounded uppercase">Lvl {userProfile?.level || 1}</span>
                                <p className="text-[10px] text-gray-500 dark:text-[#949BA4] truncate leading-none font-mono">
                                    #{(userProfile?.user.id || 0).toString().padStart(4, '0')}
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-500 hover:text-gray-700 dark:hover:text-[#DBDEE1] transition-colors border-none">
                        <Settings className="h-4 w-4" />
                    </Button>
                </div>

                {/* XP Progress Bar (Skool style) */}
                {userProfile && (
                    <div className="px-1.5 space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-tighter text-gray-500 dark:text-[#949BA4]">
                            <span>Horumarka</span>
                            <span>{userProfile.level_progress_percentage}%</span>
                        </div>
                        <Progress value={userProfile.level_progress_percentage} className="h-1 bg-black/10 dark:bg-white/10" indicatorClassName="bg-gradient-to-r from-primary to-blue-500" />
                        <p className="text-[8px] italic text-center text-gray-400 dark:text-[#80848E] mt-0.5">
                            {userProfile.xp_to_next_level} XP dhiman heerka {userProfile.level + 1}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
