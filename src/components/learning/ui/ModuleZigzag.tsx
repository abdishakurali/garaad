"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Module } from "@/types/learning";
import { UserProgress } from "@/services/progress";
import { PlayCircle, ReplyIcon, CheckCircle, UserPlus } from "lucide-react";
import AuthService from "@/services/auth";

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
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authService = AuthService.getInstance();

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
    // Don't call onModuleClick here - only select for viewing
  };

  // Handle button click based on authentication and premium status
  const handleButtonClick = () => {
    const user = authService.getCurrentUser();
    const isAuthenticated = !!user;
    const isPremium = authService.isPremium();

    if (!isAuthenticated || !isPremium) {
      router.push('/welcome');
      return;
    }

    if (selectedModule) {
      setIsLoading(true);
      try {
        // Call the synchronous onModuleClick function
        onModuleClick(selectedModule.id);

        // Keep loading state for a short time to show the loading indicator
        // This gives users feedback that the action was triggered
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error starting lesson:', error);
        setIsLoading(false);
      }
    }
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

  // Get the first module as default selected
  useEffect(() => {
    if (!selectedModule && uniqueModules.length > 0) {
      setSelectedModule(uniqueModules[0]);
    }
  }, [uniqueModules, selectedModule]);

  const selectedModuleProgress = selectedModule ? hasModuleProgress(selectedModule.id) : false;
  const selectedModuleCompleted = selectedModule ? isModuleCompleted(selectedModule.title) : false;

  // Check authentication and premium status
  const user = authService.getCurrentUser();
  const isAuthenticated = !!user;
  const isPremium = authService.isPremium();
  const canStartLesson = isAuthenticated && isPremium;

  return (
    <div className="max-w-md mx-auto p-4 pb-32">
      {/* Course Modules - Zigzag Pattern */}
      {uniqueModules.map((module, index) => {
        const isCompleted = isModuleCompleted(module.title);
        const isActive = activeModuleId === module.id; // Use activeModuleId instead of selectedModule
        const isSelected = selectedModule?.id === module.id; // Track if module is selected
        const isRightAligned = index % 2 === 1; // Alternate left/right alignment

        return (
          <div
            key={module.id}
            className={`flex items-center mb-12 cursor-pointer transition-all duration-200 ${isRightAligned ? 'justify-end mr-4' : 'ml-4'
              } hover:opacity-80`}
            onClick={() => handleModuleClick(module)}
          >
            {isRightAligned ? (
              <>
                {/* Text on the left */}
                <div className="text-right">
                  <h3 className={`text-base font-medium transition-colors duration-300 ${isActive || isSelected ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                    {module.title.split(' ').slice(0, -1).join(' ')}
                  </h3>
                  <h4 className={`text-base font-medium transition-colors duration-300 ${isActive || isSelected ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                    {module.title.split(' ').slice(-1).join(' ')}
                  </h4>
                </div>
                {/* Icon on the right */}
                <div className="ml-6">
                  <div className="relative">
                    {/* Colored gradient rings based on status */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ease-in-out transform ${isCompleted
                      ? 'bg-gradient-to-br from-green-400 to-green-600 scale-100'
                      : isActive || isSelected
                        ? 'bg-gradient-to-br from-purple-400 to-purple-600 scale-105'
                        : 'bg-gradient-to-br from-gray-300 to-gray-400 scale-100'
                      }`}>
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transition-all duration-500">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${isCompleted
                          ? 'bg-gradient-to-br from-green-400 to-green-600'
                          : isActive || isSelected
                            ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                            : 'bg-gradient-to-br from-gray-300 to-gray-400'
                          }`}>
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-all duration-300">
                            {isCompleted && (
                              <CheckCircle className="w-4 h-4 text-green-600 transition-all duration-300" />
                            )}
                            {(isActive || isSelected) && !isCompleted && (
                              <PlayCircle className="w-4 h-4 text-purple-600 transition-all duration-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Status indicator on top */}
                    {isCompleted && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out">
                        <div className="w-8 h-8 bg-green-500 rounded-lg rotate-45 flex items-center justify-center shadow-md animate-pulse">
                          <div className="w-3 h-3 bg-gray-800 rounded-sm transform -rotate-45"></div>
                        </div>
                      </div>
                    )}
                    {(isActive || isSelected) && !isCompleted && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg rotate-45 flex items-center justify-center shadow-md animate-pulse">
                          <div className="w-3 h-3 bg-gray-800 rounded-sm transform -rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Icon on the left */}
                <div className="mr-6">
                  <div className="relative">
                    {/* Colored gradient rings based on status */}
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ease-in-out transform ${isCompleted
                      ? 'bg-gradient-to-br from-green-400 to-green-600 scale-100'
                      : isActive || isSelected
                        ? 'bg-gradient-to-br from-purple-400 to-purple-600 scale-105'
                        : 'bg-gradient-to-br from-gray-300 to-gray-400 scale-100'
                      }`}>
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center transition-all duration-500">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out ${isCompleted
                          ? 'bg-gradient-to-br from-green-400 to-green-600'
                          : isActive || isSelected
                            ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                            : 'bg-gradient-to-br from-gray-300 to-gray-400'
                          }`}>
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center transition-all duration-300">
                            {isCompleted && (
                              <CheckCircle className="w-4 h-4 text-green-600 transition-all duration-300" />
                            )}
                            {(isActive || isSelected) && !isCompleted && (
                              <PlayCircle className="w-4 h-4 text-purple-600 transition-all duration-300" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Status indicator on top */}
                    {isCompleted && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out">
                        <div className="w-8 h-8 bg-green-500 rounded-lg rotate-45 flex items-center justify-center shadow-md animate-pulse">
                          <div className="w-3 h-3 bg-gray-800 rounded-sm transform -rotate-45"></div>
                        </div>
                      </div>
                    )}
                    {(isActive || isSelected) && !isCompleted && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out">
                        <div className="w-8 h-8 bg-purple-500 rounded-lg rotate-45 flex items-center justify-center shadow-md animate-pulse">
                          <div className="w-3 h-3 bg-gray-800 rounded-sm transform -rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* Text on the right */}
                <div>
                  <h3 className={`text-base font-medium transition-colors duration-300 ${isActive || isSelected ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                    {module.title.split(' ').slice(0, -1).join(' ')}
                  </h3>
                  <h4 className={`text-base font-medium transition-colors duration-300 ${isActive || isSelected ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                    {module.title.split(' ').slice(-1).join(' ')}
                  </h4>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Fixed Bottom Card - Always visible when modules exist */}
      {uniqueModules.length > 0 && (
        <div className="fixed bottom-0 md:w-96 left-4 right-4 md:left-auto md:right-1/3 md:transform md:translate-x-1/2 bg-white rounded-t-3xl p-6 shadow-lg border-t border-gray-100 z-50" style={{ maxWidth: '40rem' }}>
          <h1 className="text-xl font-bold text-gray-900 text-center mb-4">
            {selectedModule?.title || uniqueModules[0]?.title || 'Select a module'}
          </h1>

          {isLoading ? (
            // Enhanced Loading State with dynamic colors
            <div className={`w-full rounded-2xl p-4 shadow-lg ${!canStartLesson
              ? 'bg-gradient-to-r from-blue-500 to-blue-600'
              : selectedModuleCompleted
                ? 'bg-gradient-to-r from-green-500 to-green-600'
                : selectedModuleProgress
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600'
              }`}>
              <div className="flex items-center justify-center space-x-3">
                <div className="relative">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <div className="absolute inset-0 w-5 h-5 border-2 border-transparent border-t-white/60 rounded-full animate-spin" style={{ animationDelay: '0.1s' }}></div>
                </div>
                <div className="text-white font-medium">
                  <div className="text-sm">La soo rarayo...</div>
                  <div className="text-xs opacity-80">Casharka ayaa la dirayaa</div>
                </div>
              </div>
            </div>
          ) : (
            // Normal Button State
            <button
              onClick={handleButtonClick}
              disabled={!selectedModule}
              className={`w-full font-semibold py-3 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-105 text-base ${!selectedModule
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : !canStartLesson
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                  : selectedModuleCompleted
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    : selectedModuleProgress
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                }`}
            >
              {!selectedModule ? (
                <>
                  <PlayCircle className="inline w-4 h-4 mr-2" />
                  Billow
                </>
              ) : !canStartLesson ? (
                <>
                  <UserPlus className="inline w-4 h-4 mr-2" />
                  Isdiiwaangeli
                </>
              ) : selectedModuleCompleted ? (
                <>
                  <ReplyIcon className="inline w-4 h-4 mr-2" />
                  Muraajacee
                </>
              ) : selectedModuleProgress ? (
                <>
                  <PlayCircle className="inline w-4 h-4 mr-2" />
                  Sii Wado
                </>
              ) : (
                <>
                  <PlayCircle className="inline w-4 h-4 mr-2" />
                  Billow
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
