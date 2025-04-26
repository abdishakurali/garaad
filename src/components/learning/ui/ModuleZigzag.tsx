"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ModuleBox from "./ModuleBox";
import ModulePopup from "./ModulePopup";
import type { Module } from "@/types/learning";
import * as Popover from "@radix-ui/react-popover";
import { UserProgress } from "@/services/progress";
import { progressService } from "@/services/progress";

interface ModuleZigzagProps {
  modules: Module[];
  activeModuleId: number | null;
  onModuleClick: (moduleId: number) => void;
}

export default function ModuleZigzag({
  modules,
  activeModuleId,
  onModuleClick,
}: ModuleZigzagProps) {
  const [zigzagPath, setZigzagPath] = useState<string>("");
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [completedPath, setCompletedPath] = useState<string>("");
  const [modulePoints, setModulePoints] = useState<
    { x: number; y: number; completed: boolean; inProgress: boolean }[]
  >([]);
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      const progressData = await progressService.getUserProgress();
      setProgress(progressData || []);
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        console.error("Error fetching progress");
      }
    }
  }, []);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const isModuleCompleted = useCallback((moduleTitle: string) => {
    const moduleProgress = progress.filter(
      (p) => p.module_title === moduleTitle && p.status === "completed"
    );
    return moduleProgress.length > 0;
  }, [progress]);

  const hasModuleProgress = useCallback((moduleTitle: string) => {
    const moduleProgress = progress.filter(
      (p) => p.module_title === moduleTitle && p.status === "in_progress"
    );
    return moduleProgress.length > 0;
  }, [progress]);

  useEffect(() => {
    const calculateZigzagPath = () => {
      if (moduleRefs.current.length < 2) return;

      const validModules = moduleRefs.current.filter(Boolean);
      if (validModules.length < 2) return;

      let pathData = "";
      let completedPathData = "";
      const points: { x: number; y: number; completed: boolean; inProgress: boolean }[] = [];

      const containerRect = containerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };

      // Start from the first module
      const firstModule = validModules[0];
      if (!firstModule) return;
      const firstRect = firstModule.getBoundingClientRect();

      const startX = firstRect.left + firstRect.width / 2 - containerRect.left;
      const startY = firstRect.top + firstRect.height / 2 - containerRect.top;

      pathData = `M ${startX} ${startY}`;
      completedPathData = `M ${startX} ${startY}`;

      points.push({
        x: startX,
        y: startY,
        completed: isModuleCompleted(modules[0].title),
        inProgress: hasModuleProgress(modules[0].title)
      });

      let lastCompletedIndex = -1;

      // Find last completed module
      for (let i = 0; i < modules.length; i++) {
        if (isModuleCompleted(modules[i].title)) {
          lastCompletedIndex = i;
        } else {
          break;
        }
      }

      // Connect modules with curved lines
      for (let i = 1; i < validModules.length; i++) {
        const currentModule = validModules[i];
        if (!currentModule) continue;

        const prevModule = validModules[i - 1];
        if (!prevModule) continue;

        const prevRect = prevModule.getBoundingClientRect();
        const currentRect = currentModule.getBoundingClientRect();

        const prevX = prevRect.left + prevRect.width / 2 - containerRect.left;
        const prevY = prevRect.top + prevRect.height / 2 - containerRect.top;
        const currentX = currentRect.left + currentRect.width / 2 - containerRect.left;
        const currentY = currentRect.top + currentRect.height / 2 - containerRect.top;

        points.push({
          x: currentX,
          y: currentY,
          completed: isModuleCompleted(modules[i].title),
          inProgress: hasModuleProgress(modules[i].title)
        });

        const dx = currentX - prevX;
        const dy = currentY - prevY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const curveIntensity = distance * 0.5;

        const isEven = i % 2 === 0;
        const controlX1 = prevX + (isEven ? -curveIntensity : curveIntensity);
        const controlY1 = prevY + curveIntensity / 2;
        const controlX2 = currentX + (isEven ? curveIntensity : -curveIntensity);
        const controlY2 = currentY - curveIntensity / 2;

        pathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${currentX} ${currentY}`;

        if (i <= lastCompletedIndex) {
          completedPathData += ` C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${currentX} ${currentY}`;
        }
      }

      setZigzagPath(pathData);
      setCompletedPath(completedPathData);
      setModulePoints(points);
    };

    calculateZigzagPath();
    window.addEventListener("resize", calculateZigzagPath);

    return () => window.removeEventListener("resize", calculateZigzagPath);
  }, [modules, isModuleCompleted, hasModuleProgress]);

  const getModulePosition = (index: number) => {
    if (index === 0 || index === modules.length - 1) {
      return "justify-center";
    }
    return index % 2 === 1 ? "justify-start ml-56" : "justify-end mr-56";
  };

  return (
    <div className="relative" ref={containerRef}>
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Background path */}
        <path
          d={zigzagPath}
          fill="none"
          stroke="gray"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 4"
          className="stroke-gray-300 transition-all duration-500 ease-in-out"
        />

        {/* Completed path */}
        <path
          d={completedPath}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-500 ease-in-out"
        />

        {/* Module markers */}
        {modulePoints.map((point, index) => (
          <g key={index} className="transition-all duration-300 ease-in-out">
            {/* Outer circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r={12}
              className={`${point.completed
                ? "fill-green-500"
                : point.inProgress
                  ? "fill-blue-400"
                  : activeModuleId === modules[index]?.id
                    ? "fill-blue-200"
                    : "fill-gray-200"
                } transition-all duration-300`}
            />

            {/* Inner circle or check icon */}
            {point.completed ? (
              <g transform={`translate(${point.x - 6}, ${point.y - 6})`}>
                <circle cx="6" cy="6" r="6" fill="white" />
                <path
                  d="M3.5 6.5L5 8L8.5 4.5"
                  stroke="#22c55e"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </g>
            ) : point.inProgress ? (
              <g transform={`translate(${point.x - 6}, ${point.y - 6})`}>
                <circle cx="6" cy="6" r="6" fill="white" />
                <path
                  d="M4 6L6 8L8 4"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  strokeDasharray="4 2"
                />
              </g>
            ) : (
              <circle
                cx={point.x}
                cy={point.y}
                r={6}
                className={`${activeModuleId === modules[index]?.id
                  ? "fill-blue-400"
                  : "fill-white"
                  } transition-all duration-300`}
              />
            )}

            {/* Module number */}
            <text
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="central"
              className={`text-xs font-bold ${point.completed || point.inProgress || activeModuleId === modules[index]?.id
                ? "fill-white"
                : "fill-gray-500"
                }`}
            >
              {index + 1}
            </text>
          </g>
        ))}
      </svg>

      <div className="relative flex flex-col items-center z-10 no animate">
        {modules.map((module, index) => (
          <div
            key={module.id}
            ref={(el) => {
              moduleRefs.current[index] = el;
            }}
            className={`relative mb-24 ${getModulePosition(index)}`}
          >
            <Popover.Root
              open={openPopoverId === module.id}
              onOpenChange={(open) => setOpenPopoverId(open ? module.id : null)}
            >
              <Popover.Trigger asChild>
                <div>
                  <ModuleBox
                    module={module}
                    isActive={openPopoverId === module.id}
                    onClick={() => onModuleClick(module.id)}
                    iconType={
                      isModuleCompleted(module.title)
                        ? "green"
                        : hasModuleProgress(module.title)
                          ? "blue"
                          : "gray"
                    }
                  />
                </div>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  side={index % 2 === 0 ? "right" : "left"}
                  sideOffset={30}
                  className="z-[1000] bg-transparent p-0 shadow-none"
                >
                  <ModulePopup module={module} />
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </div>
        ))}
      </div>
    </div>
  );
}
