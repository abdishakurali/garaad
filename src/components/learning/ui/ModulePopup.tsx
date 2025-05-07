import { useParams, useRouter } from "next/navigation";
import { ArrowRight, PlayCircle, RefreshCwIcon } from "lucide-react";
import { Module } from "@/types/learning";
import { Button } from "@/components/ui/button";

interface ModulePopupProps {
  module: Module;
  isInProgress: boolean;
  isCompleted: boolean;
  side: "left" | "right";
}

export default function ModulePopup({
  module,
  isInProgress,
  isCompleted,
  side,
}: ModulePopupProps) {
  const params = useParams();
  const router = useRouter();

  const handleModuleClick = (moduleId: string | number) => {
    // Reset the local storage for the current lesson
    const storageKey = `lesson_progress_${moduleId}`;
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        blockIndex: 0, // Reset to the first block
        timestamp: new Date().toISOString(),
      })
    );
    // Navigate to the selected module
    router.push(
      `/courses/${params.categoryId}/${params.courseSlug}/lessons/${moduleId}`
    );
  };

  return (
    <div
      className={`absolute top-0 -ml-5 text-center items-center justify-center md:ml-0 left-1/2 transform ${
        side === "right" ? "-translate-x-[20%]" : "translate-x-[20%]"
      } translate-y-[calc(100%+55px)] w-80 bg-white rounded-lg shadow-lg p-4 z-20 animate-fadeIn border-2 border-border`}
    >
      <div className="absolute top-0 left-1/2 transform translate-y-full -translate-x-1/2">
        <div className="w-4 h-4 bg-white rotate-45 transform -translate-y-6 -translate-x-0 -z-30"></div>
      </div>
      <h3 className="font-bold mb-2">{module.title}</h3>
      <p className="text-sm mb-4">{module.description}</p>

      <Button
        onClick={() => handleModuleClick(module.id)}
        variant="default"
        className="w-full bg-foreground text-background hover:bg-foreground/70 rounded-full"
      >
        {isInProgress
          ? "Sii Wado Casharka"
          : isCompleted
          ? "Muraajacee Casharka"
          : "Billow Casharka"}{" "}
        {isInProgress ? (
          <PlayCircle className="ml-2 w-4 h-4" />
        ) : isCompleted ? (
          <RefreshCwIcon className="ml-2 w-4 h-4" />
        ) : (
          <ArrowRight className="ml-2 w-4 h-4" />
        )}
      </Button>
    </div>
  );
}
