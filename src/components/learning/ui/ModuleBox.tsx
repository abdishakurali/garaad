"use client";

import { Module } from "@/types/learning";

interface ModuleBoxProps {
  module: Module;
  isActive: boolean;
  onClick: () => void;
  iconType: "blue" | "green" | "gray";
}

export default function ModuleBox({
  module,
  isActive,
  onClick,
  iconType,
}: ModuleBoxProps) {
  const getGradient = () => {
    switch (iconType) {
      case "blue":
        return "from-blue-300 to-blue-400";
      case "green":
        return "from-green-300 to-green-500";
      default:
        return "from-gray-300 to-gray-500";
    }
  };

  return (
    <div
      className={`
        flex flex-col items-center cursor-pointer transition-all duration-300 
        ${isActive ? "scale-105" : "hover:scale-105"}
      `}
      onClick={onClick}
    >
      {/* 3D checkmark block */}
      <div className="[perspective:800px]">
        <div
          className={`
            relative w-15 h-15 rounded-md 
            bg-gradient-to-br ${getGradient()} 
            shadow-[0_20px_30px_rgba(0,0,0,0.4)]
            border-e-neutral-500
            transform [transform-style:preserve-3d] 
            rotate-x-[10deg] rotate-y-[10deg] 
            flex items-center justify-center
          `}
        >
          {/* Inner semi‑transparent square */}
          <div
            className="
              absolute w-[50%] h-[50%] 
              bg-white/20 backdrop-blur-[1px] 
              rounded-[12px] shadow-inner 
              flex items-center justify-center
            "
          >
            {/* Checkmark icon */}
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 text-white"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M20.285 6.709a1 1 0 0 0-1.414-1.417L9 15.168l-3.871-3.87A1 1 0 0 0 3.714 12.71l4.578 4.578a1 1 0 0 0 1.415 0l9.578-9.578z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Module title */}
      <div className="mt-2 text-center max-w-[120px]">
        {/* <p className="text-sm font-medium">{module.title}</p> */}
      </div>
    </div>
  );
}
