import { CommunityCategory } from "@/types/community";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { BookOpen, MessageSquare } from "lucide-react";

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
        <ScrollArea className="flex-1">
            <div className="p-3 space-y-1">
                {categories?.filter(c => !!c && !!c.id).map((category) => {
                    const isSelected = selectedCategory?.id === category.id;

                    return (
                        <button
                            key={category.id}
                            onClick={() => onSelectCategory(category)}
                            className={cn(
                                "w-full p-3 rounded-xl text-left transition-all group",
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
                            </div>
                        </button>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
