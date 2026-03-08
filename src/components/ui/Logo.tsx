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
                "w-32 sm:w-36 md:w-40 lg:w-44",
                "h-auto object-contain",
                className
            )}
            priority={priority}
            loading={loading}
            sizes={sizes}
        />
    );
}

export default Logo;
