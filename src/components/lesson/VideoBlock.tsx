import React, { useState, useRef, useCallback } from "react";
import { ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { cn } from "@/lib/utils";

const VideoBlock: React.FC<{
  content: {
    source?: string;
    url?: string;
    type?: string;
    title?: string;
    controls?: boolean;
    description?: string;
  };
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  const videoUrl = content.source || content.url;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Use the video URL as-is from the backend
  // The backend now handles format optimization correctly
  const optimizedUrl = React.useMemo(() => {
    if (!videoUrl) return "";

    // Force .mp4 for Cloudinary videos to ensure accept-ranges: bytes support
    // and better browser compatibility.
    if (videoUrl.includes("res.cloudinary.com") && videoUrl.includes("/video/upload/")) {
      return videoUrl.replace(/\.[^/.]+$/, ".mp4");
    }

    return videoUrl;
  }, [videoUrl]);

  // Generate a poster URL for cleaner loading
  const posterUrl = React.useMemo(() => {
    if (!videoUrl || !videoUrl.includes("res.cloudinary.com")) return undefined;

    // Change extension to .jpg and add so_0 for a poster frame at the start
    // We use /video/upload/so_0/ to insert so_0 safely
    if (videoUrl.includes("/video/upload/v")) {
      // Raw URL without transformations
      return videoUrl
        .replace("/video/upload/", "/video/upload/f_auto,q_auto,so_0/")
        .replace(/\.[^/.]+$/, ".jpg");
    } else {
      // Already has transformations, just insert so_0
      return videoUrl
        .replace("/video/upload/", "/video/upload/so_0/")
        .replace(/\.[^/.]+$/, ".jpg");
    }
  }, [videoUrl]);


  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="relative group overflow-hidden rounded-3xl bg-black/5 dark:bg-black/40 backdrop-blur-sm border border-black/5 dark:border-white/5 transition-all duration-500 hover:bg-black/10 dark:hover:bg-black/60">
        {optimizedUrl ? (
          <div
            className="relative aspect-video cursor-pointer"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={togglePlay}
          >
            <video
              ref={videoRef}
              src={optimizedUrl}
              poster={posterUrl}
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onError={(e) => {
                console.error("Video error:", e);
              }}
            >
              Browser-kaagu ma taageerayo video-ga.
            </video>

            {/* Centered Play Button Overlay - Ultra Minimal */}
            <div className={cn(
              "absolute inset-0 flex items-center justify-center transition-all duration-300",
              isPlaying && !isHovering ? "opacity-0 invisible" : "opacity-100 visible bg-black/5 dark:bg-black/10"
            )}>
              <div className={cn(
                "w-12 h-12 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/20 flex items-center justify-center transition-all duration-300",
                "hover:scale-110 active:scale-95 group-hover:bg-black/20 dark:group-hover:bg-white/20"
              )}>
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-slate-800 dark:text-white fill-current" />
                ) : (
                  <Play className="w-5 h-5 text-slate-800 dark:text-white fill-current ml-0.5" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="aspect-video w-full flex items-center justify-center text-slate-500 bg-slate-900/50">
            Muuqaalka lama helin
          </div>
        )}

        {(content.title || content.description) && (
          <div className="p-5 border-t border-black/5 dark:border-white/5">
            {content.title && (
              <h3 className="text-md font-bold text-foreground mb-1">
                {content.title}
              </h3>
            )}
            {content.description && (
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {content.description}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button
          onClick={onContinue}
          className="w-full h-12 rounded-xl text-md font-bold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
        >
          {isLastBlock ? "Dhamee" : "Sii wado"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoBlock;
