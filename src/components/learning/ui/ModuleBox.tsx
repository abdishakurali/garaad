"use client";

import { useState, useRef, useMemo, useCallback, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { CheckCircle2, PlayCircle, Lock } from "lucide-react";
import type { Module } from "@/types/learning";
import dynamic from "next/dynamic";

// Dynamically import the 3D component to reduce initial bundle size
const Fantasy3DCircle = dynamic(
  () => import("./Fantazy3DCircle").then((mod) => mod.default),
  { ssr: false }
);

interface ModuleBoxProps {
  module: Module;
  isActive: boolean;
  onClick: () => void;
  iconType: "green" | "blue" | "gray" | "locked";
}

const ModuleBox = memo(
  ({ module, isActive, onClick, iconType }: ModuleBoxProps) => {
    const [hovered, setHovered] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);
    const isDisabled = iconType === "gray";

    // Memoized values
    const { icon, glowColor } = useMemo(() => {
      let icon, glowColor;

      switch (iconType) {
        case "green":
          icon = <CheckCircle2 className="w-6 h-6 text-green-500" />;
          glowColor = "#10b981";
          break;
        case "blue":
          icon = <PlayCircle className="w-6 h-6 text-blue-500" />;
          glowColor = "#3b82f6";
          break;
        case "locked":
          icon = <Lock className="w-6 h-6 text-gray-400" />;
          glowColor = "#a0a0a0";
          break;
        default:
          icon = <Lock className="w-6 h-6 text-gray-400" />;
          glowColor = "#6b7280";
      }

      return { icon, glowColor };
    }, [iconType]);

    // Event handlers
    const handleMouseEnter = useCallback(() => setHovered(true), []);
    const handleMouseLeave = useCallback(() => setHovered(false), []);
    const handleClick = useCallback(() => {
      if (!isDisabled) onClick();
    }, [isDisabled, onClick]);

    return (
      <div
        className={`relative w-52 max-w-sm transform transition duration-300
        ${isActive ? "scale-100" : "hover:scale-100"} 
        ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div ref={canvasRef} className="relative w-full h-48">
          <Canvas
            camera={{ position: [0, 0, 3], fov: 50 }}
            gl={{ antialias: false, powerPreference: "low-power" }}
            dpr={Math.min(window.devicePixelRatio, 1)}
            performance={{ min: 0.1 }}
            frameloop={isActive || hovered ? "always" : "demand"}
          >
            <Fantasy3DCircle
              color={glowColor}
              isActive={isActive}
              isHovered={hovered}
            />
          </Canvas>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div
              className={`p-3 rounded-full backdrop-blur-sm border-2 transition-all duration-300
              ${iconType === "green" ? "bg-green-100/80 border-green-300" : ""}
              ${iconType === "blue" ? "bg-blue-100/80 border-blue-300" : ""}
              ${iconType === "gray" ? "bg-gray-100/80 border-gray-300" : ""}
              ${iconType === "locked" ? "bg-gray-200/80 border-gray-400" : ""}
              ${hovered || isActive ? "scale-100 shadow-lg" : ""}`}
            >
              {icon}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <span className="absolute top-38 text-center font-semibold text-md">
            {module.title}
          </span>
        </div>
      </div>
    );
  }
);

ModuleBox.displayName = "ModuleBox";
export default ModuleBox;
