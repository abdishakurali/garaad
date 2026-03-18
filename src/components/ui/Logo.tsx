"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface LogoProps {
    className?: string;
    priority?: boolean;
    loading?: "lazy" | "eager";
    sizes?: string;
    width?: number;
    height?: number;
    /** Force dark logo (logo_darkmode.png) when true; otherwise use theme (dark = dark logo, light = normal logo). */
    preferDark?: boolean;
}

export function Logo({
    className,
    priority = false,
    loading = "lazy",
    sizes = "(max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, 200px",
    width = 200,
    height = 60,
    preferDark = false,
}: LogoProps) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isDarkMode = preferDark || (mounted && (resolvedTheme === "dark" || theme === "dark"));
    const logoSrc = isDarkMode ? "/logo_darkmode.png" : "/logo.png";

    return (
        <Image
            src={logoSrc}
            alt="Garaad"
            width={692}
            height={461}
            className={cn(
                "w-auto object-contain origin-left",
                // Dark logo asset reads smaller; use taller box + light scale so it matches / exceeds light theme visually.
                isDarkMode
                    ? "h-12 sm:h-14 md:h-16 lg:h-[4.25rem] scale-[1.12]"
                    : "h-10 sm:h-11 md:h-12 lg:h-12",
                className
            )}
            priority={priority}
            loading={loading}
            sizes={sizes}
        />
    );
}

export default Logo;
