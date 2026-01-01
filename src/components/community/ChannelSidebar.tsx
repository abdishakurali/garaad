import { SOMALI_UI_TEXT, Campus, CampusRoom, UserProfile, GroupedRooms } from "@/types/community";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { getMediaUrl, cn } from "@/lib/utils";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
    MessageSquare,
    MoreHorizontal,
    TrendingUp,
    Trophy,
    Settings,
    Lock,
    Home,
    Pin,
    PinOff,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { togglePinRoom } from "@/store/features/communitySlice";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LockedRoomDialog } from "./LockedRoomDialog";

export function ChannelSidebar({
    campuses,
    selectedCampus,
    rooms,
    selectedRoomId,
    userProfile,
    onSelectRoom,
    onSelectCampus,
    onClearCampus
}: {
    campuses: Campus[];
    selectedCampus: Campus | null;
    rooms: CampusRoom[];
    selectedRoomId?: number;
    userProfile: UserProfile | null;
    onSelectRoom: (room: CampusRoom) => void;
    onSelectCampus: (campus: Campus) => void;
    onClearCampus: () => void;
}) {
    const dispatch = useDispatch<AppDispatch>();
    const { pinnedRoomIds } = useSelector((state: RootState) => state.community);
    const [lockedRoomTarget, setLockedRoomTarget] = useState<CampusRoom | null>(null);

    const handleRoomClick = (room: CampusRoom) => {
        if (room.is_locked) {
            setLockedRoomTarget(room);
        } else {
            onSelectRoom(room);
        }
    };

    const handlePinClick = (e: React.MouseEvent, roomId: number) => {
        e.stopPropagation();
        dispatch(togglePinRoom(roomId));
    };

    const pinnedRooms = rooms.filter(r => pinnedRoomIds.includes(r.id));
    const unpinnedRooms = rooms.filter(r => !pinnedRoomIds.includes(r.id));

    const renderRoomButton = (room: CampusRoom) => {
        const isLocked = room.is_locked;
        const isSelected = selectedRoomId === room.id;
        const isPinned = pinnedRoomIds.includes(room.id);

        return (
            <div key={room.id} className="group/btn relative">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start h-8 px-2 font-bold text-sm tracking-tight rounded-md border-none transition-all mb-0.5",
                        isSelected
                            ? 'bg-[#D9DADD] dark:bg-[#404249] text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-[#949BA4] hover:bg-[#D9DADD] dark:hover:bg-[#35373C] hover:text-gray-900 dark:hover:text-white',
                        isLocked && "opacity-75 hover:opacity-100"
                    )}
                    onClick={() => handleRoomClick(room)}
                >
                    {isLocked ? (
                        <Lock className="h-4 w-4 mr-1.5 text-red-400" />
                    ) : (
                        <MessageSquare className={cn(
                            "h-4 w-4 mr-1.5 transition-colors",
                            isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-400 group-hover/btn:text-gray-600 dark:group-hover/btn:text-gray-300'
                        )} />
                    )}
                    <span className="truncate flex-1 text-left">{room.name_somali}</span>
                </Button>

                <button
                    onClick={(e) => handlePinClick(e, room.id)}
                    className={cn(
                        "absolute right-2 top-1.5 p-1 rounded-sm transition-all opacity-0 group-hover/btn:opacity-100",
                        isPinned ? "opacity-100 text-primary" : "text-gray-400 hover:text-gray-600 dark:hover:text-white"
                    )}
                >
                    {isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                </button>
            </div>
        );
    };

    return (
        <div className="w-60 flex flex-col bg-[#F2F3F5] dark:bg-[#2B2D31] select-none h-full border-r border-[#E3E5E8] dark:border-[#1E1F22]">
            {/* Header */}
            <div
                className="h-12 px-4 flex items-center shadow-sm border-b border-black/10 dark:text-white hover:bg-black/5 dark:hover:bg-[#35373C] cursor-pointer transition-colors relative"
                onClick={onClearCampus}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <img src="/logo.png" alt="G" className="w-5 h-5 opacity-40 grayscale" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="truncate font-black text-sm tracking-tight leading-none uppercase">
                            {selectedCampus?.name_somali || SOMALI_UI_TEXT.community}
                        </span>
                        <span className="text-[10px] font-bold text-primary tracking-widest leading-none mt-0.5 uppercase">
                            PLATFORM
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
                <div className="p-2">
                    {/* If no campus is selected, show list of campuses */}
                    {!selectedCampus ? (
                        <div className="space-y-1">
                            <div className="px-2 py-1 flex items-center justify-between group cursor-default">
                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Campusyada</span>
                            </div>
                            {campuses.map(campus => (
                                <Button
                                    key={campus.id}
                                    variant="ghost"
                                    className="w-full justify-start h-10 px-2 font-bold text-sm tracking-tight rounded-md border-none transition-all group mb-1"
                                    onClick={() => onSelectCampus(campus)}
                                >
                                    <div className={`w-6 h-6 rounded-full mr-2 flex items-center justify-center text-[10px] bg-white dark:bg-black/20`}>
                                        {campus.name_somali.substring(0, 2).toUpperCase()}
                                    </div>
                                    <span className="truncate flex-1 text-left">{campus.name_somali}</span>
                                </Button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Pinned Rooms */}
                            {pinnedRooms.length > 0 && (
                                <div className="space-y-0.5">
                                    <div className="px-2 py-1 flex items-center justify-between group cursor-default">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                                            <Pin className="h-2.5 w-2.5" />
                                            {SOMALI_UI_TEXT.pinned}
                                        </span>
                                    </div>
                                    {pinnedRooms.map(renderRoomButton)}
                                </div>
                            )}

                            {/* All Rooms */}
                            <div className="space-y-0.5">
                                <div className="px-2 py-1 flex items-center justify-between group cursor-default">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                        {SOMALI_UI_TEXT.allRooms}
                                    </span>
                                </div>
                                {unpinnedRooms.map(renderRoomButton)}
                            </div>
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
                            <span>{userProfile.level_progress_percentage || 0}%</span>
                        </div>
                        <Progress value={userProfile.level_progress_percentage || 0} className="h-1 bg-black/10 dark:bg-white/10" />
                        <p className="text-[8px] italic text-center text-gray-400 dark:text-[#80848E] mt-0.5">
                            {userProfile.xp_to_next_level || 0} XP dhiman heerka {(userProfile.level || 1) + 1}
                        </p>
                    </div>
                )}
            </div>

            <LockedRoomDialog
                isOpen={!!lockedRoomTarget}
                onClose={() => setLockedRoomTarget(null)}
                room={lockedRoomTarget}
                userProfile={userProfile}
            />
        </div>
    );
}
