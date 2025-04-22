"use client";

import { useState, useRef, useEffect } from "react";
import ModuleBox from "./ModuleBox";
import ModulePopup from "./ModulePopup";
import { Module } from "@/types/learning";
import * as Popover from "@radix-ui/react-popover";

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
  const moduleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openPopoverId, setOpenPopoverId] = useState<number | null>(null);

  useEffect(() => {
    const calculateZigzagPath = () => {
      if (moduleRefs.current.length < 2) return;

      const validModules = moduleRefs.current.filter(Boolean);
      if (validModules.length < 2) return;

      let pathData = "";
      const firstModule = validModules[0];
      if (!firstModule) return;

      const firstRect = firstModule.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect() || {
        left: 0,
        top: 0,
      };

      let currentX = firstRect.left + firstRect.width / 2 - containerRect.left;
      let currentY = firstRect.bottom - containerRect.top + 5; // Increased initial offset

      pathData = `M ${currentX} ${currentY}`;

      for (let i = 1; i < validModules.length; i++) {
        const currentModule = validModules[i];
        const currentRect =
          currentModule?.getBoundingClientRect() || new DOMRect();
        const endX =
          currentRect.left + currentRect.width / 4 - containerRect.left;
        const endY = currentRect.top - containerRect.top - 0; // Adjusted end offset

        const isEven = i % 2 === 0;
        const horizontalOffset = isEven ? -120 : 120; // Matches ml-32/mr-32 (5rem = 120px)

        // Vertical segment
        pathData += ` L ${currentX} ${currentY + 20}`; // Reduced vertical segment
        currentY += 20;

        // Diagonal to side
        pathData += ` L ${currentX + horizontalOffset} ${
          (currentY + endY) / 2
        }`;
        currentX += horizontalOffset;
        currentY = (currentY + endY) / 2;

        // Connect to module
        pathData += ` L ${endX} ${endY}`;

        currentX = endX;
        currentY = currentRect.bottom - containerRect.top + 0;
      }

      setZigzagPath(pathData);
    };

    calculateZigzagPath();
    window.addEventListener("resize", calculateZigzagPath);

    return () => window.removeEventListener("resize", calculateZigzagPath);
  }, [modules]);

  const getModulePosition = (index: number) => {
    if (index === 0 || index === modules.length - 1) {
      return "justify-center";
    }
    return index % 2 === 1 ? "justify-start ml-56" : "justify-end mr-56";
  };

  return (
    <div className="relative" ref={containerRef}>
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none hover:scale-0"
        style={{ zIndex: 0 }}
      >
        <path
          d={zigzagPath}
          fill="none"
          stroke="gray"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          strokeDasharray="4 4"
          className="stroke-gray-300"
        />
      </svg>

      <div className="relative flex flex-col items-center z-10">
        {modules.map((module, index) => (
          <div
            key={module.id}
            ref={(el) => {
              moduleRefs.current[index] = el;
            }}
            className={`relative mb-24 ${getModulePosition(index)}`} // Increased vertical spacing
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
                    // iconType={
                    //   module.lessons[0]?.is_completed
                    //     ? "green"
                    //     : activeModuleId === module.id
                    //     ? "blue"
                    //     : "gray"
                    // }
                    iconType="gray"
                  />
                </div>
              </Popover.Trigger>

              <Popover.Portal>
                <Popover.Content
                  side={index % 2 === 0 ? "right" : "left"}
                  sideOffset={10}
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
