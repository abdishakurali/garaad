"use client";

import { useEffect } from "react";

/**
 * PWARegister
 *
 * Keep SW updates silent to avoid forced refresh loops.
 * Only reload once when a real chunk/runtime error happens.
 */
export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (window.location.hostname === "localhost") return;

    const safeReloadOnce = () => {
      if (typeof window === "undefined") return;
      const key = "sw-runtime-reload-once";
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");
      console.warn("ChunkLoadError detected, but reload is disabled to prevent refresh loops.");
    };

    const registerSW = () => {
      navigator.serviceWorker
        // Stable URL: timestamp query here forces needless re-installs and controller changes.
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered");

          // Activate waiting SW immediately — but do NOT reload
          const activateWaiting = (sw: ServiceWorker) => {
            sw.postMessage({ type: "SKIP_WAITING" });
            // No window.location.reload() — user gets new SW on next navigation naturally
          };

          // If there's already a waiting SW on load
          if (registration.waiting) {
            activateWaiting(registration.waiting);
          }

          // When a new SW is found and installs
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                activateWaiting(newWorker);
              }
            });
          });

          // Check for updates every 30 minutes
          setInterval(() => registration.update(), 30 * 60 * 1000);
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });
    };

    if (document.readyState === "complete") {
      registerSW();
    } else {
      window.addEventListener("load", registerSW, { once: true });
    }

    // Check for updates when tab becomes visible — but never reload
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        navigator.serviceWorker
          .getRegistration()
          .then((reg) => reg?.update());
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const onGlobalError = (event: ErrorEvent) => {
      const msg = String(event?.message || "");
      if (msg.includes("ChunkLoadError") || msg.includes("loading chunk")) {
        safeReloadOnce();
      }
    };
    window.addEventListener("error", onGlobalError);

    return () =>
      {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.removeEventListener("error", onGlobalError);
      };
  }, []);

  return null;
}
