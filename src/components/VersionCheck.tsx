"use client";

import { useEffect } from "react";

/**
 * VersionCheck Component
 *
 * This component ensures that users always see the latest version of the app.
 * it fetches a small /version.txt file from the server (bypassing cache)
 * and compares it with the locally stored version.
 *
 * If the versions differ, it means a new deployment has occurred.
 * It then unregisters all service workers, clears caches, and reloads the page.
 */
export default function VersionCheck() {
    useEffect(() => {
        // Only run on production
        if (window.location.hostname === "localhost") return;

        const checkVersion = async () => {
            try {
                // Fetch version with cache-busting timestamp
                const response = await fetch(`/version.txt?t=${Date.now()}`, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache'
                    }
                });

                if (!response.ok) return;

                const remoteVersion = (await response.text()).trim();
                const localVersion = localStorage.getItem("app_version");

                if (localVersion && remoteVersion && localVersion !== remoteVersion) {
                    console.log(`[VersionCheck] New version detected: ${remoteVersion}. Updating...`);

                    // 1. Store new version
                    localStorage.setItem("app_version", remoteVersion);

                    // 2. Unregister Service Workers
                    if ("serviceWorker" in navigator) {
                        const registrations = await navigator.serviceWorker.getRegistrations();
                        for (const registration of registrations) {
                            await registration.unregister();
                        }
                    }

                    // 3. Optional: Clear specific caches if needed
                    if ("caches" in window) {
                        const cacheNames = await caches.keys();
                        await Promise.all(cacheNames.map(name => caches.delete(name)));
                    }

                    // 4. Hard reload
                    const now = Date.now();
                    sessionStorage.setItem('pwa_recent_refresh', now.toString());
                    window.location.reload();
                } else if (!localVersion && remoteVersion) {
                    // Initial load, just set the version
                    localStorage.setItem("app_version", remoteVersion);
                }
            } catch (error) {
                console.error("[VersionCheck] Failed to check version:", error);
            }
        };

        // Check on load
        checkVersion();

        // Check periodically (every 15 minutes)
        const interval = setInterval(checkVersion, 15 * 60 * 1000);

        // Check when user returns to tab
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
                checkVersion();
            }
        });

        return () => clearInterval(interval);
    }, []);

    return null;
}
