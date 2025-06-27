"use client";

import { Button } from "@/components/ui/button";
import { PlayCircle, ReplyIcon } from "lucide-react";
import type { Module } from "@/types/learning";

interface ModulePopupProps {
  module: Module;
  isInProgress: boolean;
  isCompleted: boolean;
  onStartLesson: () => void;
}

export default function ModulePopup({
  module,
  isInProgress,
  isCompleted,
  onStartLesson,
}: ModulePopupProps) {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Pill indicator */}
      <div className="flex justify-center mb-4">
        <div className="w-12 h-1.5 rounded-full bg-gray-200" />
      </div>

      {/* Content */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900">{module.title}</h2>
          <p className="text-sm leading-relaxed text-gray-600">{module.description}</p>
        </div>

        <Button
          onClick={onStartLesson}
          variant="default"
          className="w-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
            text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-600/25 
            transition-all duration-300 rounded-2xl py-6 text-lg font-medium"
        >
          {isInProgress ? (
            <>
              Sii Wado Casharka
              <PlayCircle className="ml-2 w-5 h-5" />
            </>
          ) : isCompleted ? (
            <>
              Muraajacee Casharka
              <ReplyIcon className="ml-2 w-5 h-5" />
            </>
          ) : (
            <>
              Billow Casharka
              <PlayCircle className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
