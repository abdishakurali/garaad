"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import clsx from "clsx";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch by only rendering after mount
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="p-2 w-9 h-9" />;
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={clsx(
                "p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group relative overflow-hidden",
                "bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800",
                "hover:bg-primary/5 dark:hover:bg-primary/10 hover:border-primary/20"
            )}
            aria-label="Beddel muuqaalka"
        >
            <div className="relative z-10">
                {theme === "dark" ? (
                    <Sun className="w-5 h-5 text-yellow-400 group-hover:rotate-45 transition-transform" />
                ) : (
                    <Moon className="w-5 h-5 text-slate-700 group-hover:-rotate-12 transition-transform" />
                )}
            </div>

            {/* Subtle background glow on hover */}
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
        </button>
    );
}
