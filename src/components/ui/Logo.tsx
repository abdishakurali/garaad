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
}

export function Logo({
    className,
    priority = false,
    loading = "lazy",
    sizes = "(max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, 200px",
    width = 200,
    height = 60
}: LogoProps) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const isDarkMode = mounted && (resolvedTheme === "dark" || theme === "dark");
    const logoSrc = isDarkMode ? "/logo_darkmode.png" : "/logo.png";

    return (
        <Image
            src={logoSrc}
            alt="Garaad"
            width={width}
            height={height}
            className={cn(
                "w-auto object-contain transition-all duration-300",
                // Light mode sizes
                !isDarkMode && "h-14 sm:h-13 md:h-16 lg:h-18 max-w-[180px] sm:max-w-[200px] md:max-w-[210px]",
                // Dark mode sizes (larger)
                isDarkMode && "h-20 sm:h-24 md:h-28 lg:h-32 max-w-[200px] sm:max-w-[240px] md:max-w-[280px]",
                className
            )}
            priority={priority}
            loading={loading}
            sizes={sizes}
        />
    );
}

export default Logo;
