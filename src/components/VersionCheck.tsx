"use client";

import { useEffect } from "react";

/**
 * VersionCheck
 *
 * Detects new deployments and updates the stored version — silently.
 * NEVER triggers window.location.reload().
 *
 * Strategy: when a new version is detected, we clear SW caches and store
 * the new version. The user gets fresh assets on their next natural navigation
 * via Next.js client-side routing. No disruption, no reload.
 *
 * The visibilitychange check is intentionally removed — it was the main
 * cause of unexpected reloads when switching tabs.
 */
export default function VersionCheck() {
  useEffect(() => {
    if (window.location.hostname === "localhost") return;

    const checkVersion = async () => {
      try {
        const response = await fetch(`/version.txt?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (!response.ok) return;

        const remoteVersion = (await response.text()).trim();
        if (!remoteVersion) return;

        const localVersion = localStorage.getItem("app_version");

        if (!localVersion) {
          // First visit — just store the version, nothing else
          localStorage.setItem("app_version", remoteVersion);
          return;
        }

        if (localVersion !== remoteVersion) {
          console.log(
            `[VersionCheck] New version: ${remoteVersion}. Clearing caches silently.`
          );

          // Store new version first
          localStorage.setItem("app_version", remoteVersion);

          // Unregister service workers so next fetch gets fresh assets
          if ("serviceWorker" in navigator) {
            const registrations =
              await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map((r) => r.unregister()));
          }

          // Clear caches
          if ("caches" in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map((name) => caches.delete(name)));
          }

          // DO NOT reload — Next.js App Router will fetch fresh JS/CSS
          // on the next client-side navigation automatically.
          // If you want to notify the user, show a toast here instead:
          // toast.info("Nooca cusub ayaa la helay. Bogga xiga waxaad arki doontaa isbedelada.")
        }
      } catch (error) {
        console.error("[VersionCheck] Failed:", error);
      }
    };

    // Check once on mount
    checkVersion();

    // Check every 15 minutes — but NOT on visibilitychange (that caused tab-switch reloads)
    const interval = setInterval(checkVersion, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
