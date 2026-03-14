import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronRight, Play, Pause, RotateCcw, Loader2, Maximize } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

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
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const optimizedUrl = React.useMemo(() => {
    if (!videoUrl) return "";
    if (videoUrl.includes("res.cloudinary.com") && videoUrl.includes("/video/upload/")) {
      let cleanUrl = videoUrl.replace(/\.[^/.]+$/, "");
      const parts = cleanUrl.split("/video/upload/");
      if (parts.length < 2 || !parts[1]) return videoUrl;
      const before = parts[0];
      const after = parts[1];
      const versionMatch = after.match(/(v\d+\/.*)/);
      let finalAfter = versionMatch ? versionMatch[1] : after.includes("/") ? after : after;
      return `${before}/video/upload/f_auto,q_30/${finalAfter}.mp4`;
    }
    return videoUrl;
  }, [videoUrl]);

  const posterUrl = React.useMemo(() => {
    if (!videoUrl) return undefined;
    if (content.thumbnail_url) return content.thumbnail_url;
    if (content.img_url) return content.img_url;
    if (content.thumbnail) return content.thumbnail;
    if (videoUrl.includes("res.cloudinary.com")) {
      const cleanUrl = videoUrl.replace(/\.[^/.]+$/, "");
      const parts = cleanUrl.split("/video/upload/");
      if (parts.length < 2 || !parts[1]) return undefined;
      const before = parts[0];
      const after = parts[1];
      const versionMatch = after.match(/(v\d+\/.*)/);
      let finalAfter = versionMatch ? versionMatch[1] : after;
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
      setIsLoading(false);
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

  const showPlayOverlay = !isPlaying && !isLoading;

  return (
    <div className="w-full mx-0 sm:mx-4 lg:mx-auto lg:max-w-2xl px-0">
      {/* Title + description above video */}
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
          "relative overflow-hidden bg-zinc-950 aspect-video",
          "mx-0 rounded-none shadow-none",
          "sm:mx-0 sm:rounded-2xl sm:shadow-lg",
          isFullscreen && "rounded-none w-screen h-screen aspect-auto mx-0 shadow-none"
        )}
      >
        {optimizedUrl ? (
          <div className={cn("relative w-full h-full", isFullscreen && "flex items-center justify-center bg-zinc-950")} suppressHydrationWarning>
            {!mounted ? (
              <div className="absolute inset-0 bg-zinc-950" aria-hidden />
            ) : (
              <>
            {isLoading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-950 animate-pulse">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-[10px] sm:text-xs text-white/80 font-medium uppercase tracking-wider">Garaad loading...</p>
                </div>
              </div>
            )}

            {isBuffering && !isLoading && (
              <div className="absolute inset-0 z-25 flex items-center justify-center bg-black/40 pointer-events-none">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                  <span className="text-[10px] text-white/70 uppercase tracking-wider">Buffering...</span>
                </div>
              </div>
            )}

            {showTryAgain && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-black/70">
                <p className="text-sm text-white/90 text-center px-4">Muuqaalka lama soo dejin karin.</p>
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
              preload="metadata"
              {...(typeof optimizedUrl === "string" && optimizedUrl.includes("api/media/") ? { crossOrigin: "anonymous" as const } : {})}
              className={cn(
                "w-full h-full object-cover bg-zinc-950",
                isFullscreen ? "rounded-none object-contain" : "sm:rounded-2xl"
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
              </>
            )}

            {/* Tap anywhere to play/pause */}
            <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />

            {/* Center play/pause overlay — visible when paused or first load, fades out when playing */}
            <div
              className={cn(
                "absolute inset-0 flex flex-col justify-end pointer-events-none z-20 transition-opacity duration-500",
                isPlaying ? "opacity-0" : "opacity-100"
              )}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                {!isLoading && (
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-black/60 active:scale-95 transition-transform"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isEnded ? (
                      <RotateCcw className="w-8 h-8 text-white" />
                    ) : (
                      <Play className="w-8 h-8 text-white fill-current ml-0.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Bottom controls bar — gradient, touch-friendly scrubber */}
              <div className="absolute bottom-0 left-0 right-0 pt-12 pb-3 px-3 sm:pb-4 sm:px-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <div className="flex flex-col gap-2 pointer-events-auto">
                  <div className="flex items-center gap-2 sm:gap-3 min-h-11">
                    <span className="text-xs font-mono font-medium text-white/90 min-w-[2.5rem]">
                      {formatTime(currentTime)}
                    </span>
                    <div className="flex-1 min-h-[44px] flex items-center touch-manipulation">
                      <Slider
                        value={[progress]}
                        max={100}
                        step={0.1}
                        onValueChange={handleSeek}
                        className="cursor-pointer touch-none py-2 [&_[data-slot=track]]:h-2.5"
                      />
                    </div>
                    <span className="text-xs font-mono font-medium text-white/70 min-w-[2.5rem] text-right">
                      {formatTime(duration)}
                    </span>
                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      className="min-h-11 min-w-11 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors touch-manipulation"
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
          <div className="w-full aspect-video flex items-center justify-center text-slate-500 bg-zinc-900">
            Muuqaalka lama helin
          </div>
        )}
      </div>

      <div className="mt-6 mb-2 mx-3 sm:mx-0">
        <Button
          onClick={onContinue}
          className="w-full min-h-[44px] h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]"
        >
          {isLastBlock ? "Dhamee" : "Sii wado"}
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default VideoBlock;
