"use client";

import { useEffect, useState } from "react";
import { useRive, Layout, Fit, Alignment, EventType } from "@rive-app/react-canvas";
import { cn } from "@/lib/utils";

interface FollowChartProps {
    className?: string;
    width?: number;
    height?: number;
    autoplay?: boolean;
    progress?: number;
    onStateChange?: (state: string) => void;
}

export function FollowChart({
    className,
    width = 400,
    height = 400,
    autoplay = true,
    progress = 0,
    onStateChange,
}: FollowChartProps) {
    const [isLoaded, setIsLoaded] = useState(false);

    const { RiveComponent, rive } = useRive({
        src: "/animations/follow-chart.riv",
        stateMachines: "Progress",
        layout: new Layout({
            fit: Fit.Contain,
            alignment: Alignment.Center,
        }),
        autoplay,
        onLoad: () => {
            setIsLoaded(true);
        },
    });

    // Update progress in the animation
    useEffect(() => {
        if (rive && isLoaded) {
            const inputs = rive.stateMachineInputs("Progress");
            const progressInput = inputs.find(input => input.name === "progress");
            if (progressInput) {
                progressInput.value = progress;
            }
        }
    }, [rive, isLoaded, progress]);

    // Handle state changes
    useEffect(() => {
        if (rive && onStateChange) {
            const handleStateChange = () => {
                const stateMachine = rive.stateMachineInputs("Progress");
                if (stateMachine && stateMachine.length > 0) {
                    onStateChange(stateMachine[0].name);
                }
            };
            rive.on(EventType.StateChange, handleStateChange);
            return () => {
                rive.off(EventType.StateChange, handleStateChange);
            };
        }
    }, [rive, onStateChange]);

    return (
        <div className={cn("relative rounded-lg overflow-hidden", className)}>
            <div
                className="w-full h-full"
                style={{ width, height }}
            >
                <RiveComponent />
            </div>

            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="animate-pulse text-gray-400">Loading animation...</div>
                </div>
            )}
        </div>
    );
} 