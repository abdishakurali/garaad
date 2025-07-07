"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";

interface HintProps {
    hint: string;
    cost?: number;
}

export function Hint({ hint, cost = 1 }: HintProps) {
    const [isRevealed, setIsRevealed] = useState(false);
    const [usedHint, setUsedHint] = useState(false);

    const handleRevealHint = () => {
        if (!usedHint) {
            setUsedHint(true);
            // Adiga could dispatch an action here to update the user's hint points
        }
        setIsRevealed(!isRevealed);
    };

    return (
        <div className="mt-4">
            <Button
                variant="outline"
                onClick={handleRevealHint}
                className="w-full flex items-center justify-center gap-2 py-6"
            >
                <LightbulbIcon className="w-5 h-5" />
                {isRevealed ? "Hide Hint" : `Show Hint (${cost} ⚡️)`}
            </Button>

            {isRevealed && (
                <Card className="mt-2 p-4 bg-yellow-50 border-yellow-200">
                    <p className="text-sm text-gray-700">{hint}</p>
                </Card>
            )}
        </div>
    );
} 