import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { createPost, addOptimisticPost } from '@/store/features/communitySlice';
import { UserProfile, CreatePostData, PostType, CommunityPost, SOMALI_UI_TEXT } from '@/types/community';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AuthenticatedAvatar from '@/components/ui/authenticated-avatar';
import { getMediaUrl } from '@/lib/utils';
import { Image as ImageIcon, X, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface CreatePostInputProps {
    categoryId: string;
    onPostCreated?: () => void;
}

export function CreatePostInput({ categoryId, onPostCreated }: CreatePostInputProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { userProfile } = useSelector((state: RootState) => state.community);

    // State
    const [isExpanded, setIsExpanded] = useState(false);
    const [content, setContent] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleExpand = () => setIsExpanded(true);

    const handleCancel = () => {
        setIsExpanded(false);
        setContent("");
        removeImage();
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Fadlan dooro sawir ka yar 5MB");
                return;
            }
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
                // Expand if image is added
                setIsExpanded(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async () => {
        if (!content.trim() && !image) return;
        if (!userProfile) return;

        setIsSubmitting(true);

        // Prepare data
        const tempId = `temp-${Date.now()}`;
        const optimisticPost: CommunityPost = {
            id: tempId as any, // Temporary ID
            author: userProfile.user, // The crash fix ensures this structure is fine now if backend is fixed
            content: content,
            category: parseInt(categoryId),
            category_name: "", // Not critical for display
            post_type: image ? 'media' : 'text',
            images: imagePreview ? [imagePreview] : [],
            reactions_count: { like: 0, fire: 0, insight: 0 },
            user_reactions: [],
            replies_count: 0,
            views_count: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_activity: new Date().toISOString(),
            is_pinned: false,
            is_featured: false,
            is_edited: false,
            replies: []
        };

        // 1. Optimistic Update
        dispatch(addOptimisticPost(optimisticPost));

        // Reset UI immediately for "Instant" feel
        setContent("");
        removeImage();
        setIsExpanded(false);

        try {
            // 2. Server Request
            const postData: CreatePostData = {
                content,
                category_id: categoryId,
                post_type: image ? 'media' : 'text',
                image: image || undefined
            };

            await dispatch(createPost({ categoryId, postData, tempId })).unwrap();
            onPostCreated?.();
        } catch (error) {
            console.error("Failed to create post:", error);
            toast.error(SOMALI_UI_TEXT.error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!userProfile) return null;

    return (
        <div className="bg-white dark:bg-[#2B2D31] border-b border-gray-200 dark:border-[#1E1F22] p-4">
            <div className="flex gap-3">
                <AuthenticatedAvatar
                    src={getMediaUrl(userProfile.profile_picture, 'profile_pics')} // USING FIXED ACCESSOR
                    alt={userProfile.first_name || userProfile.username}
                    size="md"
                    fallback={userProfile.first_name?.[0] || userProfile.username[0]}
                />

                <div className="flex-1">
                    {!isExpanded ? (
                        <div
                            onClick={handleExpand}
                            className="w-full bg-gray-100 dark:bg-[#1E1F22] text-gray-500 rounded-full px-4 py-2.5 cursor-text text-sm hover:bg-gray-200 dark:hover:bg-black/40 transition-colors"
                        >
                            {SOMALI_UI_TEXT.createPostPlaceholder}
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                            <Textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder={SOMALI_UI_TEXT.createPostPlaceholder}
                                className="min-h-[100px] bg-transparent border-none focus-visible:ring-0 text-base p-0 resize-none dark:text-white placeholder:text-gray-400"
                                autoFocus
                                disabled={isSubmitting}
                            />

                            {imagePreview && (
                                <div className="relative inline-block mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-60 rounded-lg border border-gray-200 dark:border-white/10"
                                    />
                                    <button
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1 hover:bg-black transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/5">
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        id="post-image-input"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        disabled={isSubmitting}
                                    />
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="text-gray-500 hover:text-primary hover:bg-primary/5 dark:text-gray-400"
                                        disabled={isSubmitting}
                                    >
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Sawir
                                    </Button>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                    >
                                        {SOMALI_UI_TEXT.cancel}
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={(!content.trim() && !image) || isSubmitting}
                                        className="bg-primary text-white hover:bg-primary/90 rounded-full px-6"
                                        size="sm"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <span className="mr-2">{SOMALI_UI_TEXT.post}</span>
                                                <Send className="h-3 w-3" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
