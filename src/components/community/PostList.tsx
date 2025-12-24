import { CommunityPost, UserProfile, SOMALI_UI_TEXT } from "@/types/community";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostCard } from "./PostCard";
import { AlertCircle } from "lucide-react";

interface PostListProps {
    posts: CommunityPost[];
    loading?: boolean;
    error?: string | null;
    userProfile: UserProfile | null;
}

export function PostList({ posts, loading, error, userProfile }: PostListProps) {
    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                    <p className="text-sm text-gray-500">{SOMALI_UI_TEXT.loading}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <p className="text-lg font-bold mb-2 dark:text-white">{SOMALI_UI_TEXT.noPosts}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{SOMALI_UI_TEXT.firstPost}</p>
                </div>
            </div>
        );
    }

    return (
        <ScrollArea className="flex-1">
            <div className="max-w-3xl mx-auto p-4 space-y-4">
                {posts.map((post) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        userProfile={userProfile}
                    />
                ))}
            </div>
        </ScrollArea>
    );
}
