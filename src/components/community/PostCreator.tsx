"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CreatePostData, PostFormData, PostFormErrors, CampusRoom } from '@/types/community';
import {
    Send,
    Image as ImageIcon,
    Video,
    X,
    AlertCircle,
    Upload,
    FileText,
    Hash,
    MessageCircle,
    Megaphone,
    HelpCircle,
    Paperclip,
    File,
    Film
} from 'lucide-react';
import { RoomSelector } from './RoomSelector';

interface PostCreatorProps {
    onSubmit: (postData: CreatePostData) => Promise<void>;
    onCancel?: () => void;
    campusSlug?: string | null;
    loading?: boolean;
    errors?: PostFormErrors;
    defaultRoomId?: string | null;
}

export const PostCreator: React.FC<PostCreatorProps> = ({
    onSubmit,
    onCancel,
    campusSlug = null,
    loading = false,
    errors = {},
    defaultRoomId = null
}) => {
    const [formData, setFormData] = useState<PostFormData>({
        title: '',
        content: '',
        room_id: defaultRoomId || null,
        language: 'so',
        post_type: 'discussion',
        images: [],
        video_url: '',
        attachments: []
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [localErrors, setLocalErrors] = useState<PostFormErrors>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachmentInputRef = useRef<HTMLInputElement>(null);

    const postTypes = [
        { value: 'discussion', label: 'Dood', icon: <MessageCircle className="h-4 w-4" />, description: 'Dood guud oo ku saabsan mawduuca' },
        { value: 'question', label: 'Su\'aal', icon: <HelpCircle className="h-4 w-4" />, description: 'Su\'aal jecel in laga jawaabo' },
        { value: 'announcement', label: 'Ogeysiis', icon: <Megaphone className="h-4 w-4" />, description: 'Ogeysiis muhiim ah' },
        { value: 'poll', label: 'Codbixin', icon: <Hash className="h-4 w-4" />, description: 'Codbixin si looga jawaabo su\'aal' }
    ];

    const handleInputChange = (field: keyof PostFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Clear specific error when user starts typing
        if (field in localErrors && localErrors[field as keyof PostFormErrors]) {
            setLocalErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setLocalErrors(prev => ({ ...prev, image: 'Kaliya sawirrada la aqoonsaday' }));
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setLocalErrors(prev => ({ ...prev, image: 'Sawirka waa inuu ka yar yahay 10MB' }));
            return;
        }

        setFormData(prev => ({ ...prev, images: [file] }));

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Clear error
        setLocalErrors(prev => ({ ...prev, image: undefined }));
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, images: [] }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length === 0) return;

        // Limit total files (e.g., 5)
        if (formData.attachments && (formData.attachments.length + files.length) > 5) {
            setLocalErrors(prev => ({ ...prev, attachments: 'Ma soo galin kartid in ka badan 5 fayl' }));
            return;
        }

        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        const validFiles: File[] = [];
        for (const file of files) {
            if (file.size > MAX_SIZE) {
                setLocalErrors(prev => ({ ...prev, attachments: `Faylka "${file.name}" aad buu u weyn yahay (Max 10MB).` }));
                continue;
            }
            validFiles.push(file);
        }

        setFormData(prev => ({
            ...prev,
            attachments: [...(prev.attachments || []), ...validFiles]
        }));

        if (validFiles.length > 0) {
            setLocalErrors(prev => ({ ...prev, attachments: undefined }));
        }
    };

    const removeAttachment = (index: number) => {
        setFormData(prev => ({
            ...prev,
            attachments: (prev.attachments || []).filter((_, i) => i !== index)
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: PostFormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Ciwaanka waa lagama maarmaan';
        } else if (formData.title.length < 5) {
            newErrors.title = 'Ciwaanka waa inuu ka kooban yahay ugu yaraan 5 xaraf';
        }

        if (!formData.content.trim()) {
            newErrors.content = 'Qoraalka waa lagama maarmaan';
        } else if (formData.content.length < 10) {
            newErrors.content = 'Qoraalka waa inuu ka kooban yahay ugu yaraan 10 xaraf';
        }

        if (!formData.room_id) {
            newErrors.room_id = 'Qolka waa lagama maarmaan';
        }

        if (formData.video_url && !isValidUrl(formData.video_url)) {
            newErrors.video_url = 'Link-ka video-ga ma sax aha';
        }

        setLocalErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async () => {
        if (!validateForm() || submitting) return;

        try {
            setSubmitting(true);
            const submitData: CreatePostData = {
                category: formData.room_id || '',
                content: formData.content,
                video_url: formData.video_url || undefined,
                images: formData.images,
                attachments: formData.attachments
            };
            await onSubmit(submitData);

            // Reset form on success
            setFormData({
                title: '',
                content: '',
                room_id: defaultRoomId || null,
                language: 'so',
                post_type: 'discussion',
                images: [],
                video_url: '',
                attachments: []
            });
            setImagePreview(null);
            setLocalErrors({});

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const allErrors = { ...localErrors, ...errors };
    const selectedPostType = postTypes.find(type => type.value === formData.post_type);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center text-lg">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    Samee Qoraal Cusub
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Post Type Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nooca Qoraalka
                    </label>
                    <Select
                        value={formData.post_type}
                        onValueChange={(value) => handleInputChange('post_type', value)}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {postTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    <div className="flex items-center space-x-2">
                                        {type.icon}
                                        <span>{type.label}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {selectedPostType && (
                        <p className="text-sm text-gray-500 mt-1">{selectedPostType.description}</p>
                    )}
                </div>

                {/* Room Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Qolka
                    </label>
                    <RoomSelector
                        campusSlug={campusSlug}
                        selectedRoomId={formData.room_id}
                        onRoomSelect={(roomId) => handleInputChange('room_id', roomId)}
                        showDescription={true}
                    />
                    {allErrors.room_id && (
                        <p className="text-red-500 text-sm mt-1">{allErrors.room_id}</p>
                    )}
                </div>

                {/* Title Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ciwaanka
                    </label>
                    <Input
                        placeholder="Qor ciwaanka qoraalka..."
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={allErrors.title ? 'border-red-500' : ''}
                    />
                    {allErrors.title && (
                        <p className="text-red-500 text-sm mt-1">{allErrors.title}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.title.length}/100 xaraf
                    </p>
                </div>

                {/* Content Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Qoraalka
                    </label>
                    <Textarea
                        placeholder="Qor qoraalka dhamma..."
                        value={formData.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        className={`min-h-[120px] resize-none ${allErrors.content ? 'border-red-500' : ''}`}
                    />
                    {allErrors.content && (
                        <p className="text-red-500 text-sm mt-1">{allErrors.content}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                        {formData.content.length}/2000 xaraf
                    </p>
                </div>

                {/* Media Upload Section */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Media (ikhtiyaari)
                    </label>

                    {/* Image/Video/File Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Side: Buttons */}
                        <div className="flex items-center gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex-1 h-10"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={submitting}
                            >
                                <ImageIcon className="h-4 w-4 mr-2 text-green-600" />
                                Sawir
                            </Button>

                            <input
                                ref={attachmentInputRef}
                                type="file"
                                multiple
                                onChange={handleFileAttach}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex-1 h-10"
                                onClick={() => attachmentInputRef.current?.click()}
                                disabled={submitting}
                            >
                                <Paperclip className="h-4 w-4 mr-2 text-blue-600" />
                                Fayl
                            </Button>
                        </div>

                        {/* Right Side: Video URL */}
                        <div className="relative">
                            <Video className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Link video (YouTube...)"
                                value={formData.video_url}
                                onChange={(e) => handleInputChange('video_url', e.target.value)}
                                className={`pl-9 h-10 text-sm ${allErrors.video_url ? 'border-red-500' : ''}`}
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {allErrors.image && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{allErrors.image}</AlertDescription>
                        </Alert>
                    )}

                    {allErrors.video_url && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{allErrors.video_url}</AlertDescription>
                        </Alert>
                    )}

                    {allErrors.attachments && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{allErrors.attachments}</AlertDescription>
                        </Alert>
                    )}

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full max-h-64 object-cover rounded-lg border"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={removeImage}
                                className="absolute top-2 right-2"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}

                    {/* Video Preview */}
                    {formData.video_url && isValidUrl(formData.video_url) && (
                        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Video className="h-5 w-5 text-blue-600" />
                                    <span className="text-sm font-medium">Video:</span>
                                    <span className="text-sm text-gray-600 truncate max-w-[200px]">{formData.video_url}</span>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleInputChange('video_url', '')}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Attachments List */}
                    {formData.attachments && formData.attachments.length > 0 && (
                        <div className="space-y-2">
                            {formData.attachments.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded border">
                                    <div className="flex items-center space-x-2 overflow-hidden">
                                        {file.type.startsWith('video/') ? (
                                            <Film className="h-4 w-4 text-purple-600 shrink-0" />
                                        ) : (
                                            <File className="h-4 w-4 text-gray-600 shrink-0" />
                                        )}
                                        <span className="text-xs truncate font-medium">{file.name}</span>
                                        <span className="text-[10px] text-gray-500 shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0"
                                        onClick={() => removeAttachment(index)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Language Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Luqada
                    </label>
                    <Select
                        value={formData.language}
                        onValueChange={(value) => handleInputChange('language', value as 'so' | 'en')}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="so">Somali</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* General Error */}
                {allErrors.general && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{allErrors.general}</AlertDescription>
                    </Alert>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                    {onCancel && (
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={submitting}
                        >
                            Jooji
                        </Button>
                    )}
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting || loading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {submitting || loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-2"></div>
                                Waa la soo galayaa...
                            </>
                        ) : (
                            <>
                                <Send className="h-4 w-4 mr-2" />
                                Soo gali qoraalka
                            </>
                        )}
                    </Button>
                </div>

                {/* Guidelines */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Tilmaamaha qoraalka:
                    </h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>• Ciwaanka ha ahaado cad oo sharaxaya mawduuca</li>
                        <li>• Isticmaal luqad sharaf leh oo macmiil ah</li>
                        <li>• Sawirrada iyo video-gada ha ahaadaan kuwo haboon</li>
                        <li>• Raadi qolka ku habboon mawduucaaga</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}; 