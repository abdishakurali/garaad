"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
    createPost,
    addOptimisticPost,
} from "@/store/features/communitySlice";
import { CommunityPost, SOMALI_UI_TEXT } from "@/types/community";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Loader2, Image as ImageIcon, AlertCircle, Smile } from "lucide-react";
import { getMediaUrl, cn } from "@/lib/utils";
import AuthenticatedAvatar from "@/components/ui/authenticated-avatar";
import { EmojiPicker } from "./EmojiPicker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface InlinePostInputProps {
    categoryId: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function InlinePostInput({ categoryId }: InlinePostInputProps) {
    const dispatch = useDispatch<AppDispatch>();
    const { userProfile } = useSelector((state: RootState) => state.community);

    const [content, setContent] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setError(null);

        const validFiles: File[] = [];
        const previews: string[] = [];

        for (const file of files) {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                setError(`Nooca faylka "${file.name}" lama ogola.`);
                continue;
            }
            if (file.size > MAX_FILE_SIZE) {
                setError(`Faylka "${file.name}" aad buu u weyn yahay.`);
                continue;
            }
            validFiles.push(file);
            previews.push(URL.createObjectURL(file));
        }

        setImages(prev => [...prev, ...validFiles]);
        setImagePreviews(prev => [...prev, ...previews]);
    };

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleEmojiSelect = (emoji: string) => {
        setContent(prev => prev + emoji);
    };

    const handleSubmit = async () => {
        if (!content.trim() || !userProfile) return;

        const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const tempId = `temp-${Date.now()}`;
        const optimisticPost: CommunityPost = {
            id: tempId as any,
            category: categoryId,
            author: userProfile,
            content,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_edited: false,
            images: imagePreviews,
            replies: [],
            replies_count: 0,
            reactions_count: { like: 0, fire: 0, insight: 0 },
            user_reactions: [],
            request_id: requestId,
        };

        dispatch(addOptimisticPost(optimisticPost));

        const contentToSend = content;
        const imagesToSend = [...images];
        setContent("");
        setImages([]);
        setImagePreviews([]);
        setError(null);
        setIsSubmitting(true);
        setIsFocused(false);

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
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        }
    };

    return (
        <div className={cn(
            "bg-white dark:bg-[#1E1F22] rounded-2xl border-2 p-5 mb-6 transition-all duration-300 shadow-sm",
            isFocused
                ? "border-primary/20 ring-4 ring-primary/5 shadow-md"
                : "border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10"
        )}>
            <div className="flex gap-4">
                <div className="flex-shrink-0 pt-1">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/5 flex items-center justify-center">
                        <img src="/favicon.ico" alt="Garaad" className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Maxaa maskaxdaada ku jira?"
                        className={cn(
                            "w-full border-none focus-visible:ring-0 p-0 resize-none text-lg placeholder:text-gray-400 bg-transparent min-h-[40px] transition-all",
                            (isFocused || content.length > 0) ? "min-h-[100px]" : "min-h-[40px]"
                        )}
                        disabled={isSubmitting}
                    />

                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="w-full h-40 object-cover rounded-xl border border-gray-100 dark:border-white/5"
                                    />
                                    <button
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 backdrop-blur-sm"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {error && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-red-500 font-bold">
                            <AlertCircle className="h-3 w-3" />
                            <p>{error}</p>
                        </div>
                    )}

                    {(isFocused || content.length > 0 || imagePreviews.length > 0) && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    id="inline-image-upload"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    className="hidden"
                                    disabled={isSubmitting}
                                />
                                <label htmlFor="inline-image-upload">
                                    <div className="p-2 rounded-full hover:bg-primary/10 cursor-pointer transition-colors text-primary">
                                        <ImageIcon className="h-5 w-5" />
                                    </div>
                                </label>

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button className="p-2 rounded-full hover:bg-primary/10 cursor-pointer transition-colors text-primary outline-none">
                                            <Smile className="h-5 w-5" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent side="top" align="start" className="p-0 border-none bg-transparent shadow-none w-auto">
                                        <EmojiPicker
                                            onEmojiSelect={handleEmojiSelect}
                                            onClose={() => { }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={!content.trim() || isSubmitting}
                                className="rounded-full px-6 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    SOMALI_UI_TEXT.createPost
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
