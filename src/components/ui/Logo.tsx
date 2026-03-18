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
                "h-9 sm:h-10 md:h-11 lg:h-12",
                "w-auto object-contain",
                // The dark-mode asset has slightly different padding; scale to match perceived size.
                isDarkMode && "origin-left scale-[1.06]",
                className
            )}
            priority={priority}
            loading={loading}
            sizes={sizes}
        />
    );
}

export default Logo;
