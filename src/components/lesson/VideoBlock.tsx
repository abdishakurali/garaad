import React, { useState, useRef, useCallback, useEffect } from "react";
import { ChevronRight, Play, RotateCcw, Loader2, Maximize } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { reportLessonVideoError } from "@/lib/report-lesson-video-error";

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

const LOAD_FAIL_MS = 10_000;
const FALLBACK_SO = "Fiidiyowgii waa dhammaaday";

function getVimeoEmbedUrl(raw: string): string | null {
  const m = raw.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
}

function loadVimeoPlayerScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const w = window as unknown as { Vimeo?: { Player: unknown } };
  if (w.Vimeo?.Player) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[src="https://player.vimeo.com/api/player.js"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(), { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = "https://player.vimeo.com/api/player.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject();
    document.body.appendChild(s);
  });
}

const VideoBlock: React.FC<{
  content: VideoContent | string;
  onContinue: () => void;
  isLastBlock: boolean;
  /** When set, load failures are reported to the LMS API */
  lessonId?: number;
  /** Fires when Vimeo or HTML5 playback reaches the end (scroll / nudge in parent). */
  onPlaybackEnded?: () => void;
}> = ({ content, onContinue, isLastBlock, lessonId, onPlaybackEnded }) => {
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
  const loadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRetryUsedRef = useRef(false);
  const prevVideoUrlRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isEnded, setIsEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [mounted, setMounted] = useState(false);
  /** Bump to remount video/iframe for automatic retry */
  const [reloadKey, setReloadKey] = useState(0);
  const [loadFatal, setLoadFatal] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  /** Shown after 3s delay once playback ends (Vimeo or HTML5). */
  const [videoEndPrompt, setVideoEndPrompt] = useState(false);
  const videoEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const playbackEndScheduledRef = useRef(false);
  const [vimeoIframeGeneration, setVimeoIframeGeneration] = useState(0);

  const vimeoEmbed = videoUrl ? getVimeoEmbedUrl(videoUrl) : null;
  const isVimeo = Boolean(vimeoEmbed);

  const clearLoadTimer = useCallback(() => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
      loadTimerRef.current = null;
    }
  }, []);

  const logFailure = useCallback(
    (errorType: string) => {
      if (lessonId == null) return;
      void reportLessonVideoError({
        lessonId,
        errorType,
        videoUrl: videoUrl ?? undefined,
      });
    },
    [lessonId, videoUrl]
  );

  const scheduleLoadWatchdog = useCallback(() => {
    clearLoadTimer();
    setIsLoading(true);
    setLoadFatal(false);
    loadTimerRef.current = setTimeout(() => {
      loadTimerRef.current = null;
      if (!autoRetryUsedRef.current) {
        autoRetryUsedRef.current = true;
        logFailure("load_timeout");
        setReloadKey((k) => k + 1);
        return;
      }
      logFailure("load_timeout_final");
      setLoadFatal(true);
      setIsLoading(false);
      setIsBuffering(false);
    }, LOAD_FAIL_MS);
  }, [clearLoadTimer, logFailure]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearVideoEndTimer = useCallback(() => {
    if (videoEndTimerRef.current) {
      clearTimeout(videoEndTimerRef.current);
      videoEndTimerRef.current = null;
    }
  }, []);

  const scheduleVideoEndPrompt = useCallback(() => {
    if (playbackEndScheduledRef.current) return;
    playbackEndScheduledRef.current = true;
    clearVideoEndTimer();
    videoEndTimerRef.current = window.setTimeout(() => {
      videoEndTimerRef.current = null;
      setVideoEndPrompt(true);
      onPlaybackEnded?.();
    }, 3000);
  }, [clearVideoEndTimer, onPlaybackEnded]);

  useEffect(() => {
    playbackEndScheduledRef.current = false;
    setVideoEndPrompt(false);
    clearVideoEndTimer();
    setVimeoIframeGeneration(0);
  }, [vimeoEmbed, reloadKey, clearVideoEndTimer]);

  useEffect(() => {
    if (!isVimeo || !vimeoEmbed || !mounted || !onPlaybackEnded || vimeoIframeGeneration === 0) return;
    const iframeEl = iframeRef.current;
    if (!iframeEl) return;
    let cancelled = false;
    const onEnded = () => {
      scheduleVideoEndPrompt();
    };
    (async () => {
      try {
        await loadVimeoPlayerScript();
        if (cancelled || !iframeRef.current) return;
        const Vimeo = (window as unknown as {
          Vimeo?: { Player: new (el: HTMLIFrameElement) => { on: (e: string, fn: () => void) => void } };
        }).Vimeo;
        if (!Vimeo?.Player) return;
        const player = new Vimeo.Player(iframeRef.current);
        player.on("ended", onEnded);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isVimeo, vimeoEmbed, mounted, reloadKey, scheduleVideoEndPrompt, vimeoIframeGeneration]);

  useEffect(() => {
    if (!videoUrl) return;
    if (prevVideoUrlRef.current !== videoUrl) {
      prevVideoUrlRef.current = videoUrl;
      autoRetryUsedRef.current = false;
    }
    scheduleLoadWatchdog();
    return () => clearLoadTimer();
  }, [videoUrl, reloadKey, scheduleLoadWatchdog, clearLoadTimer]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const markVideoReady = useCallback(() => {
    clearLoadTimer();
    setIsLoading(false);
    setLoadFatal(false);
  }, [clearLoadTimer]);

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
    if (!videoUrl || isVimeo) return "";
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
  }, [videoUrl, isVimeo]);

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
          playPromise.catch((error) => {
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
      markVideoReady();
    }
  }, [markVideoReady]);

  const handleSeek = useCallback((value: number[]) => {
    if (videoRef.current && videoRef.current.duration) {
      const newTime = (value[0] / 100) * videoRef.current.duration;
      videoRef.current.currentTime = newTime;
      setProgress(value[0]);
      setCurrentTime(newTime);
    }
  }, []);

  const manualRetry = useCallback(() => {
    autoRetryUsedRef.current = false;
    setLoadFatal(false);
    setReloadKey((k) => k + 1);
  }, []);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={cn(
          "relative w-full aspect-video overflow-hidden rounded-xl bg-zinc-900",
          "border border-zinc-800",
          isFullscreen && "rounded-none w-screen h-screen aspect-auto border-0"
        )}
      >
        {videoUrl ? (
          <div className={cn("relative w-full h-full", isFullscreen && "flex items-center justify-center bg-zinc-950")} suppressHydrationWarning>
            {!mounted ? (
              <div className="absolute inset-0 bg-zinc-950" aria-hidden />
            ) : (
              <>
                {isLoading && !loadFatal && (
                  <div className="absolute inset-0 z-30 flex items-center justify-center bg-zinc-800 animate-pulse rounded-xl">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                      <p className="text-xs text-zinc-500">Soo dejinaya...</p>
                    </div>
                  </div>
                )}

                {loadFatal && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-zinc-900 rounded-xl px-4">
                    <p className="text-sm text-zinc-300 text-center">{FALLBACK_SO}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-violet-500 text-violet-400 hover:bg-violet-500/10"
                      type="button"
                      onClick={manualRetry}
                    >
                      Dib u isku day
                    </Button>
                  </div>
                )}

                {isBuffering && !isLoading && !loadFatal && (
                  <div className="absolute inset-0 z-25 flex items-center justify-center bg-black/40 pointer-events-none">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-white animate-spin" />
                      <span className="text-[10px] text-white/70 uppercase tracking-wider">Buffering...</span>
                    </div>
                  </div>
                )}

                {isVimeo && vimeoEmbed ? (
                  <>
                    <iframe
                      ref={iframeRef}
                      key={`vimeo-${reloadKey}`}
                      title={contentObj.title || "Vimeo video"}
                      src={`${vimeoEmbed}?dnt=1`}
                      className={cn(
                        "w-full h-full border-0 bg-zinc-950",
                        isFullscreen ? "rounded-none min-h-[60vh]" : "rounded-xl"
                      )}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      onLoad={() => {
                        markVideoReady();
                        setVimeoIframeGeneration((g) => g + 1);
                      }}
                    />
                    {videoEndPrompt && (
                      <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2 max-w-[90%]">
                        <p className="text-xs font-bold text-white/90 text-center drop-shadow-md">
                          Muuqaalka waa dhammaadey
                        </p>
                        <button
                          type="button"
                          onClick={() => onContinue()}
                          className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg motion-safe:animate-pulse"
                        >
                          Sii wad →
                        </button>
                      </div>
                    )}
                  </>
                ) : optimizedUrl ? (
                  <video
                    key={`html5-${reloadKey}-${optimizedUrl}`}
                    ref={videoRef}
                    src={optimizedUrl}
                    poster={posterUrl ?? undefined}
                    playsInline
                    preload="metadata"
                    {...(typeof optimizedUrl === "string" && optimizedUrl.includes("api/media/")
                      ? { crossOrigin: "anonymous" as const }
                      : {})}
                    className={cn(
                      "w-full h-full object-cover bg-zinc-950",
                      isFullscreen ? "rounded-none object-contain" : "rounded-xl"
                    )}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                    onCanPlay={() => {
                      markVideoReady();
                      setIsBuffering(false);
                    }}
                    onLoadedData={markVideoReady}
                    onWaiting={() => setIsBuffering(true)}
                    onStalled={() => setIsBuffering(true)}
                    onPlaying={() => setIsBuffering(false)}
                    onEnded={() => {
                      setIsPlaying(false);
                      setIsEnded(true);
                      scheduleVideoEndPrompt();
                    }}
                    onError={(e) => {
                      console.error("Video error:", e);
                      const el = e.currentTarget;
                      if (el.src !== videoUrl && videoUrl) {
                        console.warn("Optimized source failed, switching to fallback:", videoUrl);
                        el.src = videoUrl;
                        scheduleLoadWatchdog();
                        return;
                      }
                      if (!autoRetryUsedRef.current) {
                        autoRetryUsedRef.current = true;
                        logFailure("media_error");
                        setReloadKey((k) => k + 1);
                        return;
                      }
                      logFailure("media_error_final");
                      clearLoadTimer();
                      setLoadFatal(true);
                      setIsLoading(false);
                      setIsBuffering(false);
                    }}
                  />
                ) : null}

                {!isVimeo && optimizedUrl ? (
                  <>
                    <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />

                    <div
                      className={cn(
                        "absolute inset-0 flex flex-col justify-end pointer-events-none z-20 transition-opacity duration-500",
                        isPlaying ? "opacity-0" : "opacity-100"
                      )}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        {!isLoading && !loadFatal && (
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
                    {!isVimeo && videoEndPrompt && (
                      <div className="absolute bottom-24 left-1/2 z-25 flex -translate-x-1/2 flex-col items-center gap-2 max-w-[90%] pointer-events-auto">
                        <p className="text-xs font-bold text-white/90 text-center drop-shadow-md">
                          Muuqaalka waa dhammaadey
                        </p>
                        <button
                          type="button"
                          onClick={() => onContinue()}
                          className="rounded-full bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg motion-safe:animate-pulse"
                        >
                          Sii wad →
                        </button>
                      </div>
                    )}
                  </>
                ) : null}
              </>
            )}
          </div>
        ) : (
          <div className="w-full aspect-video flex items-center justify-center text-slate-500 bg-zinc-900">
            Muuqaalka lama helin
          </div>
        )}
      </div>

      <Button
        onClick={onContinue}
        className="mt-4 w-full h-11 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors duration-150 min-h-[44px]"
      >
        {isLastBlock ? "Dhamee" : "Sii wad"}
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
};

export default VideoBlock;
