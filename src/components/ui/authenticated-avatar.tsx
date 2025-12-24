"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import AuthService from '@/services/auth';
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
        const authService = AuthService.getInstance();
        const token = authService.getToken();

        // Cleanup previous blob URL if it exists
        if (currentBlobUrl.current) {
            URL.revokeObjectURL(currentBlobUrl.current);
            currentBlobUrl.current = null;
        }

        // If it's already a full URL and doesn't need authentication, use it directly
        if (src.startsWith('http') && !src.includes('api.garaad.org/api/media')) {
            setImageUrl(src);
            setIsLoading(false);
            setError(false);
            return;
        }

        // For authenticated media URLs, fetch with token
        if (token && src.includes('api.garaad.org/api/media')) {
            console.log('AuthenticatedAvatar: Fetching with token', {
                src,
                hasToken: !!token,
                tokenLength: token.length,
                tokenStart: token.substring(0, 20) + '...',
                tokenParts: token.split('.').length
            });

            // Check if token looks valid (basic check)
            if (token.split('.').length !== 3) {
                console.error('AuthenticatedAvatar: Invalid token format - should have 3 parts');
                setError(true);
                setIsLoading(false);
                return;
            }

            // Check if token might be expired
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const isExpired = payload.exp * 1000 < Date.now();
                console.log('AuthenticatedAvatar: Token payload', {
                    exp: payload.exp,
                    currentTime: Date.now() / 1000,
                    isExpired
                });

                if (isExpired) {
                    console.error('AuthenticatedAvatar: Token is expired');
                    setError(true);
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error('AuthenticatedAvatar: Could not decode token payload', error);
            }

            console.log('AuthenticatedAvatar: Making request with headers', {
                'Authorization': `Bearer ${token.substring(0, 20)}...`
            });

            fetch(src, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(response => {
                    console.log('AuthenticatedAvatar: Response status', response.status, response.statusText);
                    console.log('AuthenticatedAvatar: Response headers', Object.fromEntries(response.headers));
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.blob();
                })
                .then(blob => {
                    if (isMounted) {
                        const url = URL.createObjectURL(blob);
                        currentBlobUrl.current = url;
                        console.log('AuthenticatedAvatar: Created blob URL', url);
                        setImageUrl(url);
                        setError(false);
                        setIsLoading(false);
                    } else {
                        // Cleanup if component unmounted during fetch
                        URL.revokeObjectURL(url);
                    }
                })
                .catch(err => {
                    console.error('Failed to load authenticated avatar:', err);
                    if (isMounted) {
                        setError(true);
                        setIsLoading(false);
                        setImageUrl(null);
                    }
                });
        } else {
            console.log('AuthenticatedAvatar: Using direct URL or no token', {
                src,
                hasToken: !!token,
                token: token ? token.substring(0, 20) + '...' : 'none'
            });
            // For non-authenticated URLs, use directly
            setImageUrl(src);
            setIsLoading(false);
            setError(false);
        }

        return () => {
            isMounted = false;
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