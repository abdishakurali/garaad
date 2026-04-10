"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion,  } from "framer-motion";
import { cn } from "@/lib/utils";
interface MatchingPair {
    left: string;
    right: string;
    id: string;
}

interface MatchingBlockProps {
    options: any[]; // Can be string[] or {id, text}[]
    onComplete: (isCorrect: boolean) => void;
    isCorrect?: boolean | null;
}

const MatchingBlock: React.FC<MatchingBlockProps> = ({ options, onComplete, isCorrect }) => {
    const pairs = useMemo(() => {
        return options.map((opt, idx) => {
            const rawText = typeof opt === 'string' ? opt : opt.text;
            const [left, right] = rawText.split("|||").map((s: string) => s.trim());
            return { left, right, id: typeof opt === 'string' ? `pair-${idx}` : opt.id } as MatchingPair;
        });
    }, [options]);

    const [shuffledRights, setShuffledRights] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];
        return [...pairs.map(p => p.right)].sort(() => Math.random() - 0.5);
    });
    const [matches, setMatches] = useState<Record<string, string>>({});
    const [activeLeft, setActiveLeft] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        setShuffledRights([...pairs.map(p => p.right)].sort(() => Math.random() - 0.5));
    }, [pairs]);

    const handleMatch = (left: string, right: string) => {
        if (isCorrect !== null) return;
        const newMatches = { ...matches, [left]: right };
        setMatches(newMatches);

        if (Object.keys(newMatches).length === pairs.length) {
            const allCorrect = pairs.every(p => newMatches[p.left] === p.right);
            onComplete(allCorrect);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-8 w-full max-w-2xl mx-auto py-4">
            {/* Left Items (Static) */}
            <div className="space-y-4">
                {pairs.map((pair) => (
                    <div
                        key={pair.left}
                        className={cn(
                            "p-4 rounded-2xl border-2 transition-all duration-300",
                            matches[pair.left]
                                ? "bg-primary/5 border-primary/20"
                                : "bg-white dark:bg-zinc-800 border-slate-200 dark:border-white/10"
                        )}
                    >
                        <div className="text-sm font-bold mb-2 text-slate-500 uppercase tracking-widest">{pair.left}</div>
                        <div
                            className={cn(
                                "h-12 rounded-xl border-2 border-dashed flex items-center justify-center text-sm",
                                matches[pair.left]
                                    ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                                    : "border-slate-300 dark:border-white/20"
                            )}
                        >
                            {matches[pair.left] || "Jiid halkan..."}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Items (Draggable) */}
            <div className="space-y-4">
                {shuffledRights.map((right, idx) => {
                    const isMatched = Object.values(matches).includes(right);
                    return (
                        <motion.div
                            key={right}
                            drag={!isMatched && isCorrect === null}
                            dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                            dragSnapToOrigin
                            onDragEnd={(e, info) => {
                                // Simplified drop logic based on pointer position
                                // In a real app, we'd use ref.getBoundingClientRect()
                                // For now, click-to-match fallback or simplified hover
                            }}
                            whileHover={{ scale: isMatched ? 1 : 1.05 }}
                            whileTap={{ scale: isMatched ? 1 : 0.95 }}
                            onClick={() => {
                                if (isMatched || isCorrect !== null) return;
                                // Click-to-match logic: find first unmatched left item
                                const firstId = pairs.find(p => !matches[p.left])?.left;
                                if (firstId) handleMatch(firstId, right);
                            }}
                            className={cn(
                                "p-4 h-24 rounded-2xl border-2 flex items-center justify-center text-center font-bold cursor-grab active:cursor-grabbing transition-all",
                                isMatched
                                    ? "opacity-50 grayscale scale-90"
                                    : "bg-white dark:bg-zinc-800 border-primary shadow-lg shadow-primary/10 text-primary"
                            )}
                        >
                            {right}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default MatchingBlock;
