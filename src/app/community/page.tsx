"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store/store';
import {
    fetchCampuses,
    fetchUserProfile,
    fetchNotifications,
    fetchTrendingTags,
    fetchLeaderboard,
    fetchCampusRooms,
    fetchRoomMessages,
    sendRoomMessage,
    setSelectedCampus,
    setSelectedRoom,
    handleNewMessage,
    addOnlineUser,
    removeOnlineUser,
    updateOnlineUsers,
    clearSelectedCampus
} from '@/store/features/communitySlice';
import { CommunityWebSocket } from '@/services/community';
import { CommunitySidebar } from '@/components/community/CommunitySidebar';
import { ChannelSidebar } from '@/components/community/ChannelSidebar';
import { ChatArea } from '@/components/community/ChatArea';
import { MemberListSidebar } from '@/components/community/MemberListSidebar';
import { AlertCircle, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SOMALI_UI_TEXT } from '@/types/community';
import { toggleRoomMessageReaction } from '@/store/features/communitySlice';

export default function CommunityPage() {
    const dispatch = useDispatch<AppDispatch>();
    const {
        campuses,
        rooms,
        groupedRooms,
        messages,
        selectedCampus,
        selectedRoom,
        userProfile,
        loading,
        onlineUsers
    } = useSelector((state: RootState) => state.community);

    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    // Local state
    const [wsConnection, setWsConnection] = useState<CommunityWebSocket | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [isMemberListOpen, setIsMemberListOpen] = useState(true);

    // Initialize data and WebSocket connection
    useEffect(() => {
        if (!isAuthenticated) return;

        const initializeData = async () => {
            dispatch(fetchCampuses({}));
            dispatch(fetchUserProfile());
            dispatch(fetchNotifications({ reset: true }));
            dispatch(fetchTrendingTags("week"));
            dispatch(fetchLeaderboard());

            const ws = new CommunityWebSocket();
            ws.connect((data: any) => {
                if (data.type === 'new_message') {
                    dispatch(handleNewMessage(data.message));
                } else if (data.type === 'user_status') {
                    if (data.status === 'online') {
                        dispatch(addOnlineUser(data.user_id));
                    } else {
                        dispatch(removeOnlineUser(data.user_id));
                    }
                } else if (data.type === 'initial_presence') {
                    dispatch(updateOnlineUsers(data.users));
                }
            });
            setWsConnection(ws);
        };

        initializeData();

        return () => {
            if (wsConnection) wsConnection.disconnect();
        };
    }, [dispatch, isAuthenticated]);

    // Fetch rooms when campus changes
    useEffect(() => {
        if (selectedCampus?.slug) {
            dispatch(fetchCampusRooms(selectedCampus.slug));
        }
    }, [dispatch, selectedCampus]);

    // Fetch messages when room changes
    useEffect(() => {
        if (selectedRoom?.uuid) {
            dispatch(fetchRoomMessages(selectedRoom.uuid));
        }
    }, [dispatch, selectedRoom]);

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !selectedRoom) return;

        try {
            await dispatch(sendRoomMessage({
                room: selectedRoom.uuid, // ✅ Fixed: Using UUID instead of ID
                content: messageInput
            })).unwrap();
            setMessageInput('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isChannelOpen, setIsChannelOpen] = useState(true);

    // ... (existing useEffects)

    if (loading.campuses || loading.profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white dark:bg-[#1E1F22]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-xs font-black uppercase tracking-widest text-gray-500">{SOMALI_UI_TEXT.loading}</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center p-4">
                <div className="text-center max-w-sm bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black mb-4 dark:text-white">Ma leha galid</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium italic">{SOMALI_UI_TEXT.authError}</p>
                    <Button onClick={() => window.location.href = '/login'} className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20">Tag bogga galidda</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white dark:bg-[#313338] overflow-hidden select-none relative">
            {/* 1. Global Campus Rail - Hidden on very small screens, shown as drawer */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <CommunitySidebar
                    campuses={campuses}
                    selectedCampusId={selectedCampus?.id}
                    onSelectCampus={(campus) => {
                        dispatch(setSelectedCampus(campus));
                        setIsSidebarOpen(false);
                    }}
                    onClearCampus={() => dispatch(clearSelectedCampus())}
                />
            </div>

            {/* 2. Room Sidebar - Collapsible on tablet, hidden on mobile */}
            <div className={cn(
                "fixed inset-y-0 left-16 z-40 transform transition-transform duration-300 md:relative md:translate-x-0 md:left-0",
                isChannelOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            )}>
                <ChannelSidebar
                    selectedCampus={selectedCampus}
                    rooms={rooms}
                    groupedRooms={groupedRooms}
                    selectedRoomId={selectedRoom?.id}
                    userProfile={userProfile}
                    onSelectRoom={(room) => {
                        dispatch(setSelectedRoom(room));
                        if (window.innerWidth < 768) setIsChannelOpen(false);
                    }}
                />
            </div>

            {/* Mobile Overlay */}
            {(isSidebarOpen || (isChannelOpen && window.innerWidth < 768)) && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => {
                        setIsSidebarOpen(false);
                        setIsChannelOpen(false);
                    }}
                />
            )}

            {/* 3. Main Chat Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header Toggle */}
                <div className="h-14 border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#313338] flex items-center px-4 md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="ml-3 font-black text-sm dark:text-white truncate">
                        {selectedRoom?.name_somali || "Garaad"}
                    </span>
                </div>

                <ChatArea
                    selectedRoom={selectedRoom}
                    messages={messages}
                    messageInput={messageInput}
                    isMemberListOpen={isMemberListOpen}
                    onSetMessageInput={setMessageInput}
                    onSendMessage={handleSendMessage}
                    onToggleMemberList={() => setIsMemberListOpen(!isMemberListOpen)}
                    onToggleReaction={(messageId, emoji) => dispatch(toggleRoomMessageReaction({ messageId, emoji }))}
                />
            </div>

            {/* 4. Member List Sidebar - Hidden on smaller screens */}
            <div className={cn(
                "hidden xl:block transition-all duration-300",
                isMemberListOpen ? "w-[300px]" : "w-0 overflow-hidden"
            )}>
                <MemberListSidebar
                    onlineUsersCount={onlineUsers.length}
                    userProfile={userProfile}
                    onlineUsers={onlineUsers}
                />
            </div>
        </div>
    );
}