"use client";

import { memo } from "react";
import type { Module } from "@/types/learning";

interface ModuleBoxProps {
  module: Module;
  onClick: () => void;
  isLocked?: boolean;
  isActive?: boolean;
}

const ModuleBox = memo(({ module, onClick, isLocked = false, isActive = false }: ModuleBoxProps) => {
  return (
    <div
      className={`flex items-center gap-6 cursor-pointer group transition-all duration-300 p-3 rounded-2xl
        ${isActive
          ? 'bg-gradient-to-r from-blue-50/80 to-blue-50/40 shadow-sm'
          : 'hover:bg-gradient-to-r hover:from-gray-50/80 hover:to-transparent'}`}
      onClick={!isLocked ? onClick : undefined}
    >
      {/* Module icon with rings */}
      <div className="relative w-16 h-16 flex-shrink-0">
        {/* Outer ring with gradient */}
        <div className={`absolute inset-0 rounded-full ${isLocked
          ? 'bg-gradient-to-br from-gray-200 to-gray-300/50'
          : 'bg-gradient-to-br from-blue-200/40 to-blue-300/20'
          }`} />

        {/* Inner ring with gradient */}
        <div
          className={`absolute inset-2 rounded-full ${isLocked
            ? 'bg-gradient-to-br from-gray-300 to-gray-200'
            : 'bg-gradient-to-br from-blue-300/50 to-blue-200/30'
            }`}
        />

        {/* Center with gradient */}
        <div
          className={`absolute inset-4 rounded-full ${isLocked
            ? 'bg-gradient-to-br from-gray-400 to-gray-500'
            : 'bg-gradient-to-br from-blue-500 to-blue-600'
            } flex items-center justify-center shadow-inner`}
        >
          {isLocked && (
            <div className="w-4 h-4 bg-gray-200/90 rounded-sm" />
          )}
        </div>

        {/* Subtle glow effect */}
        <div className={`absolute -inset-1 rounded-full blur-md opacity-20 transition-opacity duration-300
          ${isLocked ? 'bg-gray-400' : 'bg-blue-400'} 
          ${isActive ? 'opacity-40' : 'group-hover:opacity-30'}`}
        />
      </div>

      {/* Module title with better typography */}
      <div className="flex-1 min-w-0">
        <p className={`text-lg font-medium leading-snug line-clamp-2 transition-colors duration-200
          ${isLocked
            ? 'text-gray-400'
            : isActive
              ? 'text-gray-900'
              : 'text-gray-700 group-hover:text-gray-900'}`}
        >
          {module.title}
        </p>
      </div>
    </div>
  );
});

ModuleBox.displayName = "ModuleBox";
export default ModuleBox;
