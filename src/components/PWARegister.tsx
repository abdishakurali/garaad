"use client";

import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator && window.location.hostname !== "localhost") {
            let refreshing = false;

            // Handle controller change (new SW takes over)
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshing) return;
                refreshing = true;
                console.log("New content available, reloading...");
                window.location.reload();
            });

            const registerSW = () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then(registration => {
                        console.log("PWA Service Worker registered");

                        // Check for updates immediately
                        registration.update();

                        if (registration.waiting) {
                            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                        }

                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;
                            if (newWorker) {
                                newWorker.addEventListener('statechange', () => {
                                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                        newWorker.postMessage({ type: 'SKIP_WAITING' });
                                    }
                                });
                            }
                        });

                        setInterval(() => {
                            registration.update();
                        }, 30 * 60 * 1000);
                    })
                    .catch(error => {
                        console.error("PWA Service Worker registration failed:", error);
                    });
            };

            if (document.readyState === 'complete') {
                registerSW();
            } else {
                window.addEventListener('load', registerSW);
            }

            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    navigator.serviceWorker.getRegistration().then(reg => {
                        if (reg) reg.update();
                    });
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
        }
    }, []);

    return null;
}
