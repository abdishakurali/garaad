"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import ModuleBox from "./ModuleBox";
import ModulePopup from "./ModulePopup";
import type { Module } from "@/types/learning";
import { UserProgress } from "@/services/progress";

interface ModuleZigzagProps {
  modules: Module[];
  progress: UserProgress[];
  onModuleClick: (moduleId: number) => void;
  activeModuleId?: number;
}

export default function ModuleZigzag({
  modules,
  progress,
  onModuleClick,
  activeModuleId,
}: ModuleZigzagProps) {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

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
      return progress.some(
        (p) => p.lesson_title === lessonTitle && p.status === "completed"
      );
    },
    [progress]
  );

  const hasModuleProgress = useCallback(
    (moduleId: number) => {
      return progress.some(p => p.module_id === moduleId && p.status === 'in_progress');
    },
    [progress]
  );

  // Handle module box click
  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
  };

  // Update selected module when activeModuleId changes
  useEffect(() => {
    if (activeModuleId) {
      const activeModule = uniqueModules.find(m => m.id === activeModuleId);
      if (activeModule) {
        setSelectedModule(activeModule);
      }
    }
  }, [activeModuleId, uniqueModules]);

  return (
    <div className="w-full max-w-2xl mx-auto pb-40">
      {/* Modules in vertical list */}
      <div className="space-y-3 px-4 md:px-6">
        {uniqueModules.map((module, index) => {
          const isCompleted = isModuleCompleted(module.title);
          const inProgress = hasModuleProgress(module.id);
          const isLocked = !isCompleted && !inProgress && index > 0 && !isModuleCompleted(uniqueModules[index - 1]?.title);
          const isActive = selectedModule?.id === module.id || activeModuleId === module.id;

          return (
            <ModuleBox
              key={module.id}
              module={module}
              onClick={() => handleModuleClick(module)}
              isLocked={isLocked}
              isActive={isActive}
            />
          );
        })}
      </div>

      {/* Fixed bottom card for module details */}
      <div
        className={`fixed bottom-0 left-0 right-0 transform transition-all duration-300 ease-in-out
          ${selectedModule ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-gradient-to-t from-white via-white to-white/95 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.1)] rounded-t-[32px] backdrop-blur-sm">
          {selectedModule && (
            <ModulePopup
              module={selectedModule}
              isInProgress={hasModuleProgress(selectedModule.id)}
              isCompleted={isModuleCompleted(selectedModule.title)}
              onStartLesson={() => {
                onModuleClick(selectedModule.id);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
