"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';

interface AuthenticatedAvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    editable?: boolean;
    onImageUpdate?: (file: File) => Promise<void>;
    isUpdating?: boolean;
}

const AuthenticatedAvatar: React.FC<AuthenticatedAvatarProps> = ({
    src,
    alt = "Avatar",
    fallback = "👤",
    className = "",
    size = 'md',
    editable = false,
    onImageUpdate,
    isUpdating = false
}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const currentBlobUrl = useRef<string | null>(null);

    useEffect(() => {
        if (!src) {
            setIsLoading(false);
            setImageUrl(null);
            setError(false);
            return;
        }

        let isMounted = true;
        const controller = new AbortController();

        // Normalize src: handle relative /media/ paths
        let normalizedSrc = src;
        if (src.startsWith('/media/')) {
            normalizedSrc = `https://api.garaad.org${src}`;
        }

        // Cleanup previous blob URL if it exists
        if (currentBlobUrl.current) {
            URL.revokeObjectURL(currentBlobUrl.current);
            currentBlobUrl.current = null;
        }

        const isProtectedMedia =
            normalizedSrc.includes('api.garaad.org/api/media') ||
            normalizedSrc.includes('api.garaad.org/media');

        if (normalizedSrc.startsWith('http') && !isProtectedMedia) {
            setImageUrl(normalizedSrc);
            setIsLoading(false);
            setError(false);
            return;
        }

        // For authenticated media, send the httpOnly cookie via credentials:'include'
        fetch(normalizedSrc, { credentials: 'include', signal: controller.signal })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                return response.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                if (isMounted) {
                    currentBlobUrl.current = url;
                    setImageUrl(url);
                    setError(false);
                    setIsLoading(false);
                } else {
                    URL.revokeObjectURL(url);
                }
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                console.warn('Failed to load authenticated avatar, falling back to direct URL:', err);
                if (isMounted) {
                    setImageUrl(normalizedSrc);
                    setError(false);
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [src]);

    // Cleanup blob URL when component unmounts
    useEffect(() => {
        return () => {
            if (currentBlobUrl.current) {
                URL.revokeObjectURL(currentBlobUrl.current);
                currentBlobUrl.current = null;
            }
        };
    }, []);

    // Handle file selection
    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && onImageUpdate) {
            onImageUpdate(file);
        }
    };

    // Handle click to update image
    const handleUpdateClick = () => {
        if (editable && !isUpdating) {
            fileInputRef.current?.click();
        }
    };

    // Size classes
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-8 w-8',
        lg: 'h-10 w-10',
        xl: 'h-12 w-12'
    };

    return (
        <div className="relative inline-block">
            <Avatar className={`${sizeClasses[size]} ${className}`}>
                {!isLoading && !error && imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={alt}
                        className={`w-full h-full object-cover rounded-full ${className || ''}`}
                        onError={() => {
                            // Suppress annoying console error for broken images, just set fallback
                            setError(true);
                            setImageUrl(null);
                        }}
                    />
                ) : (
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {fallback}
                    </AvatarFallback>
                )}
            </Avatar>

            {/* Update Image Overlay */}
            {editable && (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    <Button
                        onClick={handleUpdateClick}
                        disabled={isUpdating}
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 shadow-lg border-2 border-white dark:border-gray-700 hover:scale-110 transition-transform"
                    >
                        {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                            <Camera className="h-3 w-3" />
                        )}
                    </Button>
                </>
            )}
        </div>
    );
};

export default AuthenticatedAvatar;
