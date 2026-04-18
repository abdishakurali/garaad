import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    priority?: boolean;
    loading?: "lazy" | "eager";
    sizes?: string;
    /** Force dark logo regardless of theme. */
    preferDark?: boolean;
}

function Logo({
    className,
    priority = false,
    loading = "lazy",
    sizes = "(max-width: 640px) 120px, (max-width: 768px) 140px, (max-width: 1024px) 160px, 200px",
    preferDark = false,
}: LogoProps) {
    if (preferDark) {
        return (
            <Image
                src="/logo_darkmode.png"
                alt="Garaad"
                width={692}
                height={461}
                className={cn(
                    "w-auto object-contain origin-left h-12 sm:h-14 scale-[1.12]",
                    className
                )}
                priority={priority}
                loading={priority ? undefined : loading}
                sizes={sizes}
            />
        );
    }

    return (
        // Wrapper keeps both images in flow but only one visible at a time via CSS.
        // No JS / no hydration mismatch — works correctly on first SSR paint.
        <span className="contents">
            {/* Light mode */}
            <Image
                src="/logo.png"
                alt="Garaad"
                width={692}
                height={461}
                className={cn(
                    "w-auto object-contain origin-left",
                    "h-10 sm:h-11 md:h-12",
                    "dark:hidden",
                    className
                )}
                priority={priority}
                loading={priority ? undefined : loading}
                sizes={sizes}
            />
            {/* Dark mode */}
            <Image
                src="/logo_darkmode.png"
                alt=""
                width={692}
                height={461}
                aria-hidden
                className={cn(
                    "w-auto object-contain origin-left",
                    "h-12 sm:h-14 scale-[1.12]",
                    "hidden dark:block",
                    className
                )}
                priority={priority}
                loading={priority ? undefined : loading}
                sizes={sizes}
            />
        </span>
    );
}

export default Logo;
