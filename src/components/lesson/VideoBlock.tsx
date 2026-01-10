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

  // Optimize Cloudinary URL if present
  const optimizedUrl = React.useMemo(() => {
    if (!videoUrl) return "";
    if (videoUrl.includes("res.cloudinary.com") && videoUrl.includes("/video/upload/")) {
      const isMov = videoUrl.toLowerCase().endsWith(".mov") || videoUrl.includes(".mov?");
      if (!videoUrl.includes("q_auto") && !videoUrl.includes("f_auto")) {
        // For .mov files, we avoid f_auto to prevent conversion issues
        const params = isMov ? "q_auto" : "q_auto,f_auto";
        return videoUrl.replace("/video/upload/", `/video/upload/${params}/`);
      } else if (isMov && videoUrl.includes("f_auto")) {
        // Remove f_auto if it's already there for a .mov file
        return videoUrl.replace("f_auto,", "").replace(",f_auto", "").replace("f_auto", "");
      }
    }
    return videoUrl;
  }, [videoUrl]);

  // Generate a poster URL for cleaner loading
  const posterUrl = React.useMemo(() => {
    if (!videoUrl || !videoUrl.includes("res.cloudinary.com")) return undefined;
    return videoUrl
      .replace("/video/upload/", "/video/upload/q_auto,f_auto,so_0/")
      .replace(/\.[^/.]+$/, ".jpg");
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
    <div className="flex flex-col items-center justify-center min-h-[40vh] max-w-2xl mx-auto px-4">
      <Card className="w-full shadow-2xl rounded-[2rem] border-0 overflow-hidden bg-white dark:bg-slate-900 group">
        <CardContent className="p-0 relative">
          {optimizedUrl ? (
            <div
              className="relative aspect-video bg-black cursor-pointer group/video"
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
              >
                Browser-kaagu ma taageerayo video-ga.
              </video>

              {/* Centered Play Button Overlay */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center transition-all duration-300 bg-black/20",
                isPlaying && !isHovering ? "opacity-0 invisible" : "opacity-100 visible"
              )}>
                <div className={cn(
                  "w-20 h-20 rounded-full bg-white/90 dark:bg-primary/90 flex items-center justify-center shadow-2xl transform transition-transform duration-300",
                  "group-hover/video:scale-110 active:scale-95"
                )}>
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-black fill-black" />
                  ) : (
                    <Play className="w-10 h-10 text-black fill-black ml-1" />
                  )}
                </div>
              </div>

              {/* Progress Bar (Subtle) */}
              {isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div
                    className="h-full bg-primary transition-all duration-100"
                    style={{
                      width: videoRef.current ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` : '0%'
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video w-full flex items-center justify-center text-gray-500 bg-slate-100">
              Muuqaalka lama helin
            </div>
          )}

          <div className="p-8 space-y-4">
            {content.title && (
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {content.title}
              </h3>
            )}
            {content.description && (
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                {content.description}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-8 pb-8 pt-0">
          <Button
            onClick={onContinue}
            className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-1"
          >
            {isLastBlock ? "Dhamee" : "Sii wado"}
            <ChevronRight className="ml-2 h-6 w-6" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VideoBlock;
