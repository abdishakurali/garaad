"use client";

import { useState, useCallback, useMemo } from "react";
import ModuleBox from "./ModuleBox";
import ModulePopup from "./ModulePopup";
import type { Module } from "@/types/learning";
import * as Popover from "@radix-ui/react-popover";
import { UserProgress } from "@/services/progress";

interface ModuleZigzagProps {
  modules: Module[];
  progress: UserProgress[];
  onModuleClick: (moduleId: number) => void;
  isPreview?: boolean;
}

export default function ModuleZigzag({
  modules,
  progress,
  onModuleClick,
  isPreview = false,
}: ModuleZigzagProps) {
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  const uniqueModules = useMemo(() => {
    const seenIds = new Set<number>();
    return modules.filter(module => {
      if (seenIds.has(module.id)) {
        return false;
      } else {
        seenIds.add(module.id);
        return true;
      }
    });
  }, [modules]);

  const isModuleCompleted = useCallback(
    (lessonTitle: string) => {
      if (isPreview) return false;
      return progress.some(
        (p) => p.lesson_title === lessonTitle && p.status === "completed"
      );
    },
    [progress, isPreview]
  );

  const hasModuleProgress = useCallback(
    (moduleId: number) => {
      if (isPreview) return false;
      return progress.some(p => p.module_id === moduleId && p.status === 'in_progress');
    },
    [progress, isPreview]
  );

  const isModuleLocked = useCallback((module: Module, index: number) => {
    if (isPreview) return index > 0;
    if (index === 0) return false;
    const prevModule = uniqueModules[index - 1];
    return !isModuleCompleted(prevModule.title);
  }, [uniqueModules, isModuleCompleted, isPreview]);


  return (
    <div className="relative w-full py-12">
      <div
        className="absolute top-0 bottom-0 left-1/2 w-1 bg-gray-200"
        style={{ transform: "translateX(-50%)" }}
      ></div>

      <div className="relative flex flex-col items-center z-10 space-y-24">
        {uniqueModules.map((module, index) => {
          const isCompleted = isModuleCompleted(module.title);
          const inProgress = hasModuleProgress(module.id);
          const locked = isModuleLocked(module, index);
          const side = index % 2 === 0 ? "left" : "right";

          return (
            <div
              key={module.id}
              className={`w-full flex ${side === "left" ? "justify-start" : "justify-end"
                }`}
            >
              <div
                className="relative w-1/2"
                style={{
                  paddingLeft: side === "right" ? "4rem" : "0",
                  paddingRight: side === "left" ? "4rem" : "0",
                }}
              >
                <Popover.Root
                  open={openPopoverId === module.id}
                  onOpenChange={(open) => {
                    if (locked) return;
                    setOpenPopoverId(open ? module.id : null);
                  }}
                >
                  <Popover.Trigger asChild>
                    <div className="cursor-pointer">
                      <ModuleBox
                        module={module}
                        isActive={openPopoverId === module.id}
                        onClick={() => !locked && onModuleClick(module.id)}
                        iconType={
                          isCompleted
                            ? "green"
                            : inProgress
                              ? "blue"
                              : locked
                                ? "locked"
                                : "gray"
                        }
                      />
                    </div>
                  </Popover.Trigger>

                  <Popover.Portal>
                    <Popover.Content
                      sideOffset={10}
                      side={side === 'left' ? 'right' : 'left'}
                      className="z-50"
                    >
                      <ModulePopup
                        module={module}
                        isInProgress={inProgress}
                        isCompleted={isCompleted}
                        isLocked={locked}
                        side={side}
                        isFirstModule={index === 0}
                        isLastModule={index === uniqueModules.length - 1}
                      />
                    </Popover.Content>
                  </Popover.Portal>
                </Popover.Root>
                <div
                  className="absolute top-1/2 w-16 h-1 bg-gray-300"
                  style={{
                    transform: "translateY(-50%)",
                    ...(side === "left"
                      ? { right: "-4rem" }
                      : { left: "-4rem" }),
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
