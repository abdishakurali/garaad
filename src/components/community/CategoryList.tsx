import { CommunityCategory } from "@/types/community";
import { useEffect } from "react";
import { loadPinnedCategoriesFromStorage } from "@/store/features/communitySlice";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BookOpen, MessageSquare, Pin, PinOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { togglePinCategory, togglePinCategoryOptimistic } from "@/store/features/communitySlice";
import { toast } from "sonner";
import { SOMALI_UI_TEXT } from "@/types/community";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CategoryListProps {
    categories: CommunityCategory[];
    selectedCategory: CommunityCategory | null;
    onSelectCategory: (category: CommunityCategory) => void;
    loading?: boolean;
}

export function CategoryList({
    categories,
    selectedCategory,
    onSelectCategory,
    loading,
}: CategoryListProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { pinnedCategoryIds } = useSelector((state: RootState) => state.community);

    // Load persisted pinned categories on mount
    useEffect(() => {
        dispatch(loadPinnedCategoriesFromStorage());
    }, [dispatch]);

    // Persist pinned categories to localStorage whenever they change
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem("pinnedCategoryIds", JSON.stringify(pinnedCategoryIds));
        }
    }, [pinnedCategoryIds]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Ma jiraan qaybo
                </p>
            </div>
        );
    }


    return (
        <TooltipProvider>
            <ScrollArea className="flex-1">
                <div className="p-3 space-y-1">
                    {categories?.filter(c => !!c && !!c.id).map((category) => {
                        const isSelected = selectedCategory?.id === category.id;
                        const isPinned = pinnedCategoryIds.includes(category.id);

                        const handlePinClick = (e: React.MouseEvent) => {
                            e.stopPropagation();

                            if (!isPinned && pinnedCategoryIds.length >= 3) {
                                toast.error("Ma biin garayn kartid in ka badan 3 qaybood.");
                                return;
                            }

                            // Optimistic update
                            dispatch(togglePinCategoryOptimistic(category.id));

                            // Backend sync
                            dispatch(togglePinCategory(category.id));
                        };

                        return (
                            <div
                                key={category.id}
                                onClick={() => onSelectCategory(category)}
                                className={cn(
                                    "w-full p-3 rounded-xl text-left transition-all group cursor-pointer",
                                    isSelected
                                        ? "bg-primary/10 dark:bg-primary/20"
                                        : "hover:bg-gray-100 dark:hover:bg-[#35373C]"
                                )}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Category Icon/Image */}
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                        isSelected
                                            ? "bg-primary text-white"
                                            : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                    )}>
                                        {category.image ? (
                                            <img
                                                src={category.image}
                                                alt={category.title}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <BookOpen className="h-5 w-5" />
                                        )}
                                    </div>

                                    {/* Category Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                            "font-bold text-sm mb-0.5 truncate",
                                            isSelected
                                                ? "text-primary dark:text-primary"
                                                : "text-gray-900 dark:text-white"
                                        )}>
                                            {category.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-1">
                                            {category.community_description || category.description}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                            <MessageSquare className="h-3 w-3" />
                                            <span>{category.posts_count || 0} qoraal</span>
                                        </div>
                                    </div>

                                    {/* Pin Button */}
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={handlePinClick}
                                                className={cn(
                                                    "p-1.5 rounded-lg transition-all",
                                                    isPinned
                                                        ? "opacity-100 text-primary bg-primary/10"
                                                        : "opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/5"
                                                )}
                                            >
                                                {isPinned ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            {isPinned ? SOMALI_UI_TEXT.unpinCategory : SOMALI_UI_TEXT.pinCategory}
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </TooltipProvider>
    );
}
