import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
    createPost,
    addOptimisticPost,
} from "@/store/features/communitySlice";
import { CommunityPost, SOMALI_UI_TEXT } from "@/types/community";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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

        const tempId = `temp-${Date.now()}`;

        // Create optimistic post with preview URLs
        const optimisticPost: CommunityPost = {
            id: tempId as any,
            category: categoryId,
            author: userProfile.user,
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
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{SOMALI_UI_TEXT.createPost}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {/* Content Input */}
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Maxaa ku jira maskaxdaada?"
                        className="min-h-[150px]"
                        disabled={isSubmitting}
                    />

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2">
                        {/* Image Upload Button */}
                        <div>
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
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={isSubmitting}
                                    asChild
                                >
                                    <span className="cursor-pointer">
                                        <ImageIcon className="h-4 w-4 mr-1" />
                                        Sawir
                                    </span>
                                </Button>
                            </label>
                        </div>

                        {/* Submit/Cancel */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Jooji
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={!content.trim() || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                        {SOMALI_UI_TEXT.loading}
                                    </>
                                ) : (
                                    SOMALI_UI_TEXT.create
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
