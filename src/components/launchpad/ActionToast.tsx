"use client";

import { useEffect } from "react";

interface ActionToastProps {
    message?: string;
    onDismiss: () => void;
    durationMs?: number;
}

/**
 * Transient success toast for Launchpad actions.
 * Bottom-right, primary bg, auto-dismiss after durationMs (default 2500).
 */
export function ActionToast({ message = "✓ Done", onDismiss, durationMs = 2500 }: ActionToastProps) {
    useEffect(() => {
        const t = setTimeout(() => onDismiss(), durationMs);
        return () => clearTimeout(t);
    }, [onDismiss, durationMs]);

    return (
        <button
            type="button"
            onClick={onDismiss}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-white shadow-lg transition hover:opacity-90 font-medium"
            aria-label="Dismiss"
        >
            <span>{message}</span>
        </button>
    );
}
