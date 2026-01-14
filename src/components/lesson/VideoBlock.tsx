import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronRight, Play, Pause, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Robustly handle Cloudinary optimized URLs
  const optimizedUrl = React.useMemo(() => {
    if (!videoUrl) return "";

    // For Cloudinary videos, we need to ensure MP4 format and proper transformations
    if (videoUrl.includes("res.cloudinary.com") && videoUrl.includes("/video/upload/")) {
      let cleanUrl = videoUrl.replace(/\.[^/.]+$/, "");
      const [before, after] = cleanUrl.split("/video/upload/");

      const versionMatch = after.match(/(v\d+\/.*)/);
      let finalAfter = after;

      if (versionMatch) {
        finalAfter = versionMatch[1];
      } else if (after.includes("/")) {
        finalAfter = after;
      }

      return `${before}/video/upload/f_mp4,q_auto/${finalAfter}.mp4`;
    }

    return videoUrl;
  }, [videoUrl]);

  const posterUrl = React.useMemo(() => {
    if (!videoUrl || !videoUrl.includes("res.cloudinary.com")) return undefined;
    const cleanUrl = videoUrl.replace(/\.[^/.]+$/, "");
    const [before, after] = cleanUrl.split("/video/upload/");

    const versionMatch = after.match(/(v\d+\/.*)/);
    let finalAfter = after;

    if (versionMatch) {
      finalAfter = versionMatch[1];
    }
    return `${before}/video/upload/f_auto,q_auto,so_0/${finalAfter}.jpg`;
  }, [videoUrl]);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Play prevented:", error);
            setIsPlaying(false);
          });
        }
        setIsEnded(false);
      } else {
        videoRef.current.pause();
      }
    }
  }, []);

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100);
      setIsLoading(false); // Ensure loading is false when time updates
    }
  }, []);

  const handleSeek = useCallback((value: number[]) => {
    if (videoRef.current && videoRef.current.duration) {
      const newTime = (value[0] / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
      setCurrentTime(newTime);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div
        className="relative group overflow-hidden rounded-3xl bg-gray-100 dark:bg-gray-800 shadow-sm min-h-[200px]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {optimizedUrl ? (
          <div className="relative w-full">

            {isLoading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <Skeleton className="w-full h-full absolute inset-0 rounded-xl" />
                <div className="z-40 flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-xs text-muted-foreground font-medium">Video-ga ayaa soo degaya...</p>
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              src={optimizedUrl}
              poster={posterUrl}
              playsInline
              preload="auto"
              className="w-full h-auto max-h-[70vh] object-contain rounded-xl bg-black"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onCanPlay={() => setIsLoading(false)}
              onWaiting={() => setIsLoading(true)}
              onPlaying={() => setIsLoading(false)}
              onEnded={() => {
                setIsPlaying(false);
                setIsEnded(true);
              }}
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== videoUrl && videoUrl) {
                  console.warn("Optimized source failed, switching to fallback:", videoUrl);
                  el.src = videoUrl;
                } else {
                  console.error("Video load error (both sources failed):", el.error);
                  setIsLoading(false); // Stop loading if error
                }
              }}
            />

            <div
              className="absolute inset-0 z-10 cursor-pointer"
              onClick={togglePlay}
            />

            <div className={cn(
              "absolute inset-0 flex flex-col justify-end transition-opacity duration-300 pointer-events-none z-20",
              isPlaying && !isHovering ? "opacity-0" : "opacity-100"
            )}>
              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!isLoading && (
                  <div className={cn(
                    "w-16 h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform duration-200 pointer-events-auto cursor-pointer hover:scale-110",
                    isPlaying && !isHovering ? "opacity-0 scale-90" : "opacity-100 scale-100"
                  )} onClick={togglePlay}>
                    {isEnded ? (
                      <RotateCcw className="w-7 h-7 text-white" />
                    ) : isPlaying ? (
                      <Pause className="w-7 h-7 text-white fill-current" />
                    ) : (
                      <Play className="w-7 h-7 text-white fill-current ml-1" />
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Controls */}
              <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-4 px-4 pointer-events-auto">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-medium text-white/90 min-w-[35px]">
                      {formatTime(currentTime)}
                    </span>

                    <div className="flex-1 group/slider relative h-5 flex items-center">
                      <Slider
                        value={[progress]}
                        max={100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="cursor-pointer"
                      />
                    </div>

                    <span className="text-xs font-mono font-medium text-white/60 min-w-[35px] text-right">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-800">
            Muuqaalka lama helin
          </div>
        )}
      </div>

      {(content.title || content.description) && (
        <div className="mt-4 px-2">
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
