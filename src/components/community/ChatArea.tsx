import { SOMALI_UI_TEXT, Post, CampusRoom } from "@/types/community";
import { cn } from "@/lib/utils";

interface ChatAreaProps {
    selectedRoom: CampusRoom | null;
    messages: Post[];
    messageInput: string;
    isMemberListOpen: boolean;
    onSetMessageInput: (value: string) => void;
    onSendMessage: () => void;
    onToggleMemberList: () => void;
    onToggleReaction: (messageId: string, emoji: string) => void;
}

export function ChatArea({
    selectedRoom,
    messages,
    messageInput,
    isMemberListOpen,
    onSetMessageInput,
    onSendMessage,
    onToggleMemberList,
    onToggleReaction
}: ChatAreaProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const formatMessageDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (date.toLocaleDateString() === today.toLocaleDateString()) {
            return SOMALI_UI_TEXT.today;
        } else if (date.toLocaleDateString() === yesterday.toLocaleDateString()) {
            return SOMALI_UI_TEXT.yesterday;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-[#FFFFFF] dark:bg-[#313338] relative min-w-0 h-full overflow-hidden transition-all duration-300">
            {/* Top Bar - Skool Style */}
            <div className="h-14 px-6 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#313338] z-20">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500 min-w-0">
                    <span className="hover:text-primary cursor-pointer transition-colors">Campus</span>
                    <span className="opacity-30">/</span>
                    <span className="text-gray-900 dark:text-white truncate">
                        {selectedRoom?.name_somali || SOMALI_UI_TEXT.posts}
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                        <Input
                            placeholder={SOMALI_UI_TEXT.search}
                            className="h-9 w-48 bg-gray-100 dark:bg-black/20 border-none text-[13px] pl-10 rounded-full font-medium focus-visible:ring-1 focus-visible:ring-primary/30 transition-all"
                        />
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleMemberList}>
                        <Users className={cn("h-5 w-5", isMemberListOpen ? "text-primary" : "text-gray-400")} />
                    </Button>
                </div>
            </div>

            {/* Message Feed */}
            <ScrollArea className="flex-1 bg-[#F8F9FA] dark:bg-[#2B2D31]" ref={scrollRef}>
                <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
                    {messages && messages.length > 0 ? messages.map((msg, index) => {
                        const showDateHeader = index === 0 || formatMessageDate(messages[index - 1].created_at) !== formatMessageDate(msg.created_at);

                        return (
                            <div key={msg.id} className="space-y-4">
                                {showDateHeader && (
                                    <div className="flex items-center gap-4 py-4">
                                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/5" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                                            {formatMessageDate(msg.created_at)}
                                        </span>
                                        <div className="flex-1 h-px bg-gray-200 dark:bg-white/5" />
                                    </div>
                                )}

                                <div className="bg-white dark:bg-[#383A40] rounded-2xl p-4 md:p-5 shadow-sm border border-black/5 dark:border-white/5 group relative hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <AuthenticatedAvatar
                                                src={getMediaUrl(msg.user.profile_picture, 'profile_pics')}
                                                alt={msg.user.first_name}
                                                fallback={msg.user.first_name?.[0] || 'U'}
                                                size="md"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="font-black text-sm dark:text-white hover:underline cursor-pointer">
                                                    {msg.user.first_name} {msg.user.last_name}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-mono">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="text-[14px] leading-relaxed dark:text-[#DBDEE1] font-medium whitespace-pre-wrap">
                                                {msg.content}
                                            </div>

                                            {/* Media Placeholder (matches image cards) */}
                                            {msg.id === messages[0].id && (
                                                <div className="mt-4 rounded-xl overflow-hidden border border-black/5 dark:border-white/5 aspect-video bg-black/5 flex items-center justify-center">
                                                    <Share2 className="h-8 w-8 text-gray-300 opacity-20" />
                                                </div>
                                            )}

                                            {/* Reactions */}
                                            <div className="flex flex-wrap gap-1.5 mt-4">
                                                {msg.reactions && msg.reactions.map((reaction) => (
                                                    <button
                                                        key={reaction.emoji}
                                                        onClick={() => onToggleReaction(msg.id, reaction.emoji)}
                                                        className={cn(
                                                            "flex items-center gap-2 px-2.5 py-1 rounded-full text-[12px] font-black border transition-all",
                                                            reaction.user_has_reacted
                                                                ? "bg-primary/10 border-primary/30 text-primary shadow-sm"
                                                                : "bg-gray-50 dark:bg-[#2B2D31] border-gray-100 dark:border-white/5 text-gray-500 dark:text-[#B5BAC1] hover:border-gray-200 dark:hover:border-white/10"
                                                        )}
                                                    >
                                                        <span>{reaction.emoji}</span>
                                                        <span className="opacity-60">{reaction.count}</span>
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => onToggleReaction(msg.id, "🔥")}
                                                    className="w-8 h-8 rounded-full border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary/30 transition-all"
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-[#313338] shadow-lg border border-black/5 dark:border-white/10 rounded-lg p-0.5">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-yellow-50 dark:hover:bg-yellow-900/20" onClick={() => onToggleReaction(msg.id, "🔥")}>
                                            <TrendingUp className="h-4 w-4 text-yellow-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => onToggleReaction(msg.id, "❤️")}>
                                            <Heart className="h-4 w-4 text-red-500" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                            <Share2 className="h-4 w-4 text-blue-500" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                                <MessageSquare className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-black dark:text-white mb-2">{SOMALI_UI_TEXT.noPosts}</h3>
                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                                {SOMALI_UI_TEXT.firstPost}
                            </p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Input Box */}
            <div className="p-4 md:p-6 bg-white dark:bg-[#313338] border-t border-black/5 dark:border-white/5">
                <div className="max-w-4xl mx-auto bg-[#F2F3F5] dark:bg-[#383A40] rounded-2xl px-4 py-2 flex items-center gap-4 transition-all focus-within:ring-2 focus-within:ring-primary/10">
                    <button className="w-8 h-8 rounded-full bg-gray-400/20 flex items-center justify-center text-gray-500 hover:bg-primary/20 hover:text-primary transition-all border-none flex-shrink-0">
                        <Plus className="h-4 w-4" />
                    </button>
                    <Input
                        value={messageInput}
                        onChange={(e) => onSetMessageInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
                        placeholder={`Ku qor # ${selectedRoom?.name_somali || SOMALI_UI_TEXT.posts}`}
                        className="flex-1 bg-transparent border-none focus-visible:ring-0 px-0 h-10 text-[14px] font-medium dark:text-white"
                    />
                    <div className="flex items-center gap-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                            <TrendingUp className="h-5 w-5" />
                        </Button>
                        <Button
                            onClick={onSendMessage}
                            size="sm"
                            className="h-8 rounded-xl font-black uppercase text-[10px] tracking-widest px-4 shadow-sm"
                        >
                            Dir
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
