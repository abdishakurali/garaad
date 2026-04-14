"use client";

import { useEffect } from "react";

/**
 * PWARegister
 *
 * Registers the service worker WITHOUT ever triggering a hard reload.
 * When a new SW is available, it activates silently in the background.
 * The user gets the new version on their next natural navigation — no disruption.
 */
export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (window.location.hostname === "localhost") return;

    const safeReloadOnce = () => {
      if (typeof window === "undefined") return;
      const key = "sw-reload-once";
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");
      window.location.reload();
    };

    const registerSW = () => {
      navigator.serviceWorker
        .register(`/sw.js?v=${Date.now()}`)
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

    const onControllerChange = () => {
      // Prevent runtime/chunk mismatch after deploy:
      // once a new SW controls the page, reload one time.
      safeReloadOnce();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

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
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
        window.removeEventListener("error", onGlobalError);
      };
  }, []);

  return null;
}
