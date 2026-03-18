import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronRight, Play, Pause, RotateCcw, Loader2, Maximize } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

type VideoContent = {
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

const VideoBlock: React.FC<{
  content: VideoContent | string;
  onContinue: () => void;
  isLastBlock: boolean;
}> = ({ content, onContinue, isLastBlock }) => {
  const videoUrl =
    (typeof content === "object" && content !== null
      ? (content.url ?? content.source)
      : null) ?? (typeof content === "string" ? content : null);
  if (process.env.NODE_ENV === "development") {
    console.log("videoUrl:", videoUrl, "content:", content);
  }
  const contentObj = typeof content === "object" && content !== null ? content : ({} as VideoContent);
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

  // Fallback: clear loading if onCanPlay/onLoadedData don't fire within 10s (e.g. 206 streaming)
  useEffect(() => {
    if (!videoUrl) return;
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 10000);
    return () => clearTimeout(timeout);
  }, [videoUrl]);

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
    if (contentObj.thumbnail_url) return contentObj.thumbnail_url;
    if (contentObj.img_url) return contentObj.img_url;
    if (contentObj.thumbnail) return contentObj.thumbnail;
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
  }, [videoUrl, contentObj]);

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
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 lg:px-0">
      {(contentObj.title || contentObj.description) && (
        <div className="px-0 pt-0 pb-2 sm:pb-3">
          {contentObj.title && (
            <p className="text-sm font-semibold text-white line-clamp-2" title={contentObj.title}>
              {contentObj.title}
            </p>
          )}
          {contentObj.description && (
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{contentObj.description}</p>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
          "relative overflow-hidden bg-zinc-950 aspect-video w-full",
          "mx-0 rounded-none sm:mx-auto sm:rounded-2xl sm:border sm:border-zinc-800",
          isFullscreen && "rounded-none w-screen h-screen aspect-auto mx-0 border-0"
        )}
      >
        {optimizedUrl ? (
          <div className={cn("relative w-full h-full", isFullscreen && "flex items-center justify-center bg-zinc-950")} suppressHydrationWarning>
            {!mounted ? (
              <div className="absolute inset-0 bg-zinc-950" aria-hidden />
            ) : (
              <>
            {isLoading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-800 animate-pulse rounded-none sm:rounded-2xl">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                  <p className="text-xs text-zinc-500">Soo dejinaya...</p>
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
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-zinc-900 rounded-none sm:rounded-2xl">
                <p className="text-sm text-zinc-500 text-center px-4">Muuqaalka lama soo dejin karin.</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-violet-500 text-violet-400 hover:bg-violet-500/10"
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
              key={optimizedUrl}
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
              onCanPlay={() => {
                setIsLoading(false);
                setIsBuffering(false);
              }}
              onLoadedData={() => setIsLoading(false)}
              onWaiting={() => setIsBuffering(true)}
              onStalled={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onEnded={() => {
                setIsPlaying(false);
                setIsEnded(true);
              }}
              onError={(e) => {
                console.error("Video error:", e);
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
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-auto cursor-pointer hover:bg-black/60 min-w-[56px] min-h-[56px]"
                    aria-label={isPlaying ? "Pause" : "Play"}
                  >
                    {isEnded ? (
                      <RotateCcw className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-white fill-current ml-0.5" />
                    )}
                  </button>
                )}
              </div>

              {/* Bottom controls bar */}
              <div
                className="absolute bottom-0 left-0 right-0 pt-12 pb-3 px-3 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                }}
              >
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
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors touch-manipulation pointer-events-auto"
                      title={isFullscreen ? "Ka bax shaashadda weyn" : "Shaashadda weyn"}
                    >
                      <Maximize className="w-5 h-5 text-white/70 shrink-0" />
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

      <Button
        onClick={onContinue}
        className="mt-5 w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors duration-150 min-h-[44px]"
      >
        {isLastBlock ? "Dhamee" : "Sii wado"}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default VideoBlock;
