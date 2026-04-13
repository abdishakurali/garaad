"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  DEFAULT_WHATSAPP_MESSAGE,
  whatsappHref,
} from "@/lib/whatsapp";

export function WhatsAppFloat() {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show button after a short delay for better UX
        const timer = setTimeout(() => setIsVisible(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Auto-show tooltip after component is visible
        if (isVisible) {
            const tooltipTimer = setTimeout(() => setIsTooltipVisible(true), 3000);
            const hideTimer = setTimeout(() => setIsTooltipVisible(false), 8000);
            return () => {
                clearTimeout(tooltipTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [isVisible]);

    const handleClick = () => {
        window.open(whatsappHref(DEFAULT_WHATSAPP_MESSAGE), "_blank");
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
            {/* Tooltip */}
            <div
                className={`relative bg-card border border-border rounded-xl px-4 py-3 shadow-xl max-w-[200px] transition-all duration-300 ${isTooltipVisible
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-4 pointer-events-none"
                    }`}
            >
                <button
                    onClick={() => setIsTooltipVisible(false)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-muted rounded-full flex items-center justify-center hover:bg-muted-foreground/20 transition-colors"
                >
                    <X className="w-3 h-3 text-muted-foreground" />
                </button>
                <p className="text-sm text-foreground font-medium leading-snug">
                    Su&apos;aal ma qabtaa?{" "}
                    <span className="text-primary">Nagala sheekayso halkan</span>
                </p>
                {/* Arrow */}
                <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-card" />
            </div>

            {/* WhatsApp Button */}
            <button
                onClick={handleClick}
                className="group relative w-14 h-14 bg-[#25D366] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300 hover:scale-110"
                aria-label="Chat on WhatsApp"
            >
                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />

                {/* Icon */}
                <svg
                    className="w-7 h-7 text-white relative z-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </button>
        </div>
    );
}
