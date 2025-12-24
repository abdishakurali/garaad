"use client";

import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if ("serviceWorker" in navigator && window.location.hostname !== "localhost") {
            window.addEventListener("load", () => {
                navigator.serviceWorker
                    .register("/sw.js")
                    .then(registration => {
                        console.log("PWA Service Worker registered with scope:", registration.scope);

                        // Check for updates every hour
                        setInterval(() => {
                            registration.update();
                            console.log("Checked for PWA update");
                        }, 60 * 60 * 1000);
                    })
                    .catch(error => {
                        console.error("PWA Service Worker registration failed:", error);
                    });
            });
        }
    }, []);

    return null;
}
