import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Module } from "@/types/learning";
import { Button } from "@/components/ui/button";

interface ModulePopupProps {
  module: Module;
}

export default function ModulePopup({ module }: ModulePopupProps) {
  const params = useParams();
  const router = useRouter();

  const handleModuleClick = (moduleId: string | number) => {
    router.push(
      `/courses/${params.categoryId}/${params.courseSlug}/lessons/${moduleId}`
    );
  };

  return (
    <div className="absolute top-0 left-1/2 transform -translate-x-[20%] translate-y-[calc(100%+65px)] w-64 bg-white rounded-lg shadow-lg p-4 z-20 animate-fadeIn border-2 border-border">
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
        Billow Casharka <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
}
