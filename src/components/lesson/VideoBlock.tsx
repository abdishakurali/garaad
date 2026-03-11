import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronRight, Play, Pause, RotateCcw, Loader2, Maximize } from "lucide-react";
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
    thumbnail_url?: string;
    img_url?: string;
    thumbnail?: string;
  };
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  const videoUrl = content.source || content.url;
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showTryAgain, setShowTryAgain] = useState(false);

  // Handle fullscreen state changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Robustly handle Cloudinary optimized URLs
  const optimizedUrl = React.useMemo(() => {
    if (!videoUrl) return "";

    // For Cloudinary videos, we need to ensure MP4 format and proper transformations
    if (videoUrl.includes("res.cloudinary.com") && videoUrl.includes("/video/upload/")) {
      let cleanUrl = videoUrl.replace(/\.[^/.]+$/, "");
      const parts = cleanUrl.split("/video/upload/");

      if (parts.length < 2 || !parts[1]) return videoUrl;

      const before = parts[0];
      const after = parts[1];

      const versionMatch = after.match(/(v\d+\/.*)/);
      let finalAfter = after;

      if (versionMatch) {
        finalAfter = versionMatch[1];
      } else if (after.includes("/")) {
        finalAfter = after;
      }

      return `${before}/video/upload/f_auto,q_30/${finalAfter}.mp4`;
    }

    return videoUrl;
  }, [videoUrl]);

  const posterUrl = React.useMemo(() => {
    if (!videoUrl) return undefined;
    if (content.thumbnail_url) return content.thumbnail_url;
    if (content.img_url) return content.img_url;
    if (content.thumbnail) return content.thumbnail;

    // Cloudinary-derived poster
    if (videoUrl.includes("res.cloudinary.com")) {
      const cleanUrl = videoUrl.replace(/\.[^/.]+$/, "");
      const parts = cleanUrl.split("/video/upload/");

      if (parts.length < 2 || !parts[1]) return undefined;

      const before = parts[0];
      const after = parts[1];

      const versionMatch = after.match(/(v\d+\/.*)/);
      let finalAfter = after;

      if (versionMatch) {
        finalAfter = versionMatch[1];
      }
      return `${before}/video/upload/f_auto,q_30,so_0/${finalAfter}.jpg`;
    }

    return undefined;
  }, [videoUrl, content]);

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
    <div className="w-full mx-0 sm:mx-4 lg:mx-auto lg:max-w-2xl px-0 sm:px-0">
      {/* Text overlay above video: title + description — mobile compact */}
      {(content.title || content.description) && (
        <div className="px-4 py-3 sm:px-0 sm:pt-0 sm:pb-2">
          {content.title && (
            <p className="text-sm font-semibold text-white line-clamp-2 truncate" title={content.title}>
              {content.title}
            </p>
          )}
          {content.description && (
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{content.description}</p>
          )}
        </div>
      )}
      <div
        ref={containerRef}
        className={cn(
          "relative group overflow-hidden bg-zinc-800 shadow-sm aspect-video",
          isFullscreen ? "rounded-none w-screen h-screen aspect-auto" : "rounded-none sm:rounded-2xl"
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {optimizedUrl ? (
          <div className={cn("relative w-full", isFullscreen ? "h-full flex items-center justify-center bg-black" : "")}>

            {isLoading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-800 animate-pulse">
                <div className="z-40 flex flex-col items-center gap-3 scale-90 sm:scale-100">
                  <div className="relative">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1 h-1 bg-primary rounded-full animate-ping" />
                    </div>
                  </div>
                  <div className="bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-xl">
                    <p className="text-[10px] sm:text-xs text-white font-bold uppercase tracking-widest">Garaad loading...</p>
                  </div>
                </div>
              </div>
            )}

            {isBuffering && !isLoading && (
              <div className="absolute inset-0 z-25 flex items-center justify-center bg-black/20 pointer-events-none">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}

            {showTryAgain && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/60">
                <p className="text-sm text-white/90">Muuqaalka lama soo dejin karin.</p>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setShowTryAgain(false);
                    setRetryCount(0);
                    if (videoRef.current) {
                      videoRef.current.src = optimizedUrl;
                      videoRef.current.load();
                    }
                  }}
                >
                  Isku day mar kale
                </Button>
              </div>
            )}

            <video
              ref={videoRef}
              src={optimizedUrl}
              poster={posterUrl ?? undefined}
              playsInline
              preload="auto"
              className={cn(
                "w-full h-full object-contain bg-black",
                isFullscreen ? "rounded-none" : "rounded-none sm:rounded-2xl"
              )}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
              onCanPlay={() => { setIsLoading(false); setIsBuffering(false); }}
              onWaiting={() => setIsBuffering(true)}
              onStalled={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onEnded={() => {
                setIsPlaying(false);
                setIsEnded(true);
              }}
              onError={(e) => {
                const el = e.currentTarget;
                if (el.src !== videoUrl && videoUrl) {
                  console.warn("Optimized source failed, switching to fallback:", videoUrl);
                  el.src = videoUrl;
                } else if (retryCount < 2) {
                  setRetryCount((c) => c + 1);
                  const src = el.src;
                  el.src = "";
                  el.load();
                  setTimeout(() => { el.src = src; el.load(); }, 100);
                } else {
                  setShowTryAgain(true);
                  setIsLoading(false);
                  setIsBuffering(false);
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
              {/* Center Play Button — min 44px touch target on mobile */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!isLoading && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className={cn(
                      "min-h-[44px] min-w-[44px] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center transition-transform duration-200 pointer-events-auto cursor-pointer hover:scale-110 active:scale-95",
                      isPlaying && !isHovering ? "opacity-0 scale-90" : "opacity-100 scale-100"
                    )}
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isEnded ? (
                      <RotateCcw className="w-7 h-7 text-white" />
                    ) : isPlaying ? (
                      <Pause className="w-7 h-7 text-white fill-current" />
                    ) : (
                      <Play className="w-7 h-7 text-white fill-current ml-0.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Bottom Controls — scrubber 6px on mobile, fullscreen always visible */}
              <div className="bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-4 px-4 pointer-events-auto">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs font-mono font-medium text-white/90 min-w-[32px] sm:min-w-[35px]">
                      {formatTime(currentTime)}
                    </span>
                    <div className="flex-1 min-h-6 flex items-center">
                      <Slider
                        value={[progress]}
                        max={100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="cursor-pointer"
                      />
                    </div>
                    <span className="text-xs font-mono font-medium text-white/60 min-w-[32px] sm:min-w-[35px] text-right">
                      {formatTime(duration)}
                    </span>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title={isFullscreen ? "Ka bax shaashadda weyn" : "Shaashadda weyn"}
                    >
                      <Maximize className="w-5 h-5 text-white shrink-0" />
                    </button>
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

      <div className="mt-6 mb-2 mx-3 sm:mx-0">
        <Button
          onClick={onContinue}
          className="w-full min-h-[44px] h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/10"
        >
          {isLastBlock ? "Dhamee" : "Sii wado"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoBlock;
