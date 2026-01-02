import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
    createPost,
    addOptimisticPost,
} from "@/store/features/communitySlice";
import { CommunityPost, SOMALI_UI_TEXT } from "@/types/community";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { getMediaUrl, cn } from "@/lib/utils";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";

interface CreatePostDialogProps {
    isOpen: boolean;
    onClose: () => void;
    categoryId: string;
}

// Image validation constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function CreatePostDialog({ isOpen, onClose, categoryId }: CreatePostDialogProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { userProfile } = useSelector((state: RootState) => state.community);

    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Validate and handle image selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setError(null);

        // Validate each file
        const validFiles: File[] = [];
        const previews: string[] = [];

        for (const file of files) {
            // Check file type
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setError(`Nooca faylka "${file.name}" lama ogola. Isticmaal JPEG, PNG, ama WebP.`);
                continue;
            }

            // Check file size
            if (file.size > MAX_FILE_SIZE) {
                setError(`Faylka "${file.name}" aad buu u weyn yahay. Ugu badnaan 5MB.`);
                continue;
            }

            validFiles.push(file);
            previews.push(URL.createObjectURL(file));
        }

        setImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...previews]);
    };

    // Remove image
    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    // OPTIMISTIC: Handle post creation with images
    const handleSubmit = async () => {
        if (!content.trim() || !userProfile) return;

        const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const tempId = `temp-${Date.now()}`;

        // Create optimistic post with preview URLs
        const optimisticPost: CommunityPost = {
            id: tempId as any,
            category: categoryId,
            author: userProfile,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_edited: false,
            images: imagePreviews, // Use preview URLs for optimistic display
            replies: [],
            replies_count: 0,
            reactions_count: {
                like: 0,
                fire: 0,
                insight: 0,
            },
            user_reactions: [],
            request_id: requestId,
        };

        // 1. Immediately add to UI
        dispatch(addOptimisticPost(optimisticPost));

        // Reset form and close
        const contentToSend = content;
        const imagesToSend = [...images];
        setContent("");
        setImages([]);
        setImagePreviews([]);
        setError(null);
        onClose();
        setIsSubmitting(true);

        // 2. Send to server with FormData
        try {
            await dispatch(createPost({
                categoryId,
                postData: {
                    category: categoryId,
                    content: contentToSend,
                    images: imagesToSend.length > 0 ? imagesToSend : undefined,
                    requestId,
                },
                tempId,
            })).unwrap();
        } catch (error) {
            console.error("Failed to create post:", error);
        } finally {
            setIsSubmitting(false);
            // Clean up preview URLs
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        }
    };

    // Cleanup on unmount
    const handleClose = () => {
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
        setImages([]);
        setImagePreviews([]);
        setContent("");
        setError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-white dark:bg-[#1E1F22] border-none shadow-2xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>{SOMALI_UI_TEXT.createPost}</DialogTitle>
                </DialogHeader>

                {/* Header with Close & Submit (Mobile-like feel, or just top bar) */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                    <button onClick={handleClose} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                    {/* Only show 'Draft' or empty space here if we want twitter style, traditionally 'Tweet' button is here or bottom right */}
                </div>

                <div className="p-4 flex gap-4">
                    {/* Left: Avatar */}
                    <div className="flex-shrink-0 pt-1">
                        <AuthenticatedAvatar
                            src={getMediaUrl(userProfile?.profile_picture, 'profile_pics')}
                            alt={userProfile?.first_name || userProfile?.username || "User"}
                            size="md"
                            fallback={userProfile?.first_name?.[0] || userProfile?.username?.[0] || "?"}
                        />
                    </div>

                    {/* Right: Input Area */}
                    <div className="flex-1 min-w-0">
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Maxaa ku jira maskaxdaada?"
                            className="min-h-[120px] w-full border-none focus-visible:ring-0 p-0 resize-none text-lg placeholder:text-gray-400 bg-transparent"
                            disabled={isSubmitting}
                        />

                        {/* Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 mt-4 mb-2">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-2xl border border-gray-100 dark:border-gray-800"
                                        />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm"
                                            disabled={isSubmitting}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-red-500">
                                <AlertCircle className="h-4 w-4" />
                                <p>{error}</p>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            {/* Media Tools */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    id="image-upload"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="image-upload">
                                    <div className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors text-primary">
                                        <ImageIcon className="h-5 w-5" />
                                    </div>
                                </label>
                            </div>

                            {/* Post Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={!content.trim() || isSubmitting}
                                className="rounded-full px-6 font-bold bg-primary hover:bg-primary/90 text-white"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    SOMALI_UI_TEXT.createPost
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
