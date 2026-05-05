"use client";

import Link from "next/link";
import { Check, Lock, Play, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type LessonStatus = "complete" | "current" | "available" | "locked";

interface LessonCardProps {
    lessonNumber: number;
    title: string;
    durationMinutes?: number;
    status: LessonStatus;
    href?: string;
    className?: string;
}

const STATUS_CONFIG = {
    complete: {
        badge: "Complete",
        badgeClass: "text-foreground bg-foreground/10",
        icon: Check,
        iconClass: "text-gold",
        numberClass: "text-gold",
    },
    current: {
        badge: "Current",
        badgeClass: "text-gold bg-gold/10",
        icon: Play,
        iconClass: "text-gold",
        numberClass: "text-gold",
    },
    available: {
        badge: "Available",
        badgeClass: "text-muted-foreground bg-border/50",
        icon: null,
        iconClass: "",
        numberClass: "text-muted-foreground",
    },
    locked: {
        badge: "Locked",
        badgeClass: "text-muted-foreground bg-border/30",
        icon: Lock,
        iconClass: "text-muted-foreground",
        numberClass: "text-muted-foreground/40",
    },
} as const;

export function LessonCard({
    lessonNumber,
    title,
    durationMinutes,
    status,
    href,
    className,
}: LessonCardProps) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    const isLocked = status === "locked";

    const inner = (
        <div
            className={cn(
                "flex items-center gap-4 py-4 px-0 border-b border-border last:border-0 group",
                !isLocked && "cursor-pointer",
                className
            )}
        >
            {/* Lesson number */}
            <span
                className={cn(
                    "font-mono text-sm shrink-0 w-6 text-right",
                    config.numberClass
                )}
            >
                {String(lessonNumber).padStart(2, "0")}
            </span>

            {/* Title */}
            <span
                className={cn(
                    "flex-1 text-sm leading-snug",
                    isLocked ? "text-muted-foreground/50" : "text-foreground",
                    !isLocked && "group-hover:text-gold transition-colors"
                )}
            >
                {title}
            </span>

            {/* Right: duration + status */}
            <div className="flex items-center gap-3 shrink-0">
                {durationMinutes && !isLocked && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {durationMinutes}m
                    </span>
                )}
                <div className="flex items-center gap-1.5">
                    {Icon && <Icon className={cn("w-3.5 h-3.5", config.iconClass)} />}
                    <span
                        className={cn(
                            "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                            config.badgeClass
                        )}
                    >
                        {config.badge}
                    </span>
                </div>
            </div>
        </div>
    );

    if (href && !isLocked) {
        return <Link href={href}>{inner}</Link>;
    }

    return inner;
}
