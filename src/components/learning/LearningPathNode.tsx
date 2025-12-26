import React from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { useRive } from "@rive-app/react-canvas";
import { useNodeStatus } from "@/hooks/useNodeStatus";

export interface NodeData {
  id: string;
  position: {
    row: number;
    column: number;
  };
  isComplete: boolean;
  isActive: boolean;
  status?: "completed" | "current" | "locked";
  onStateChange?: (nodeId: string) => void;
}

export interface CourseData {
  nodes: NodeData[];
  connections: {
    fromNodeId: string;
    toNodeId: string;
    isActive: boolean;
    progressValue: number;
  }[];
}

export const LearningPathNode = ({ data, isConnectable }: NodeProps<NodeData>) => {
  const { status } = useNodeStatus(data);
  const { RiveComponent } = useRive({
    src: "/animations/node.riv",
    stateMachines: "State Machine 1",
    artboard: "New Artboard",
    autoplay: true,
  });

  const handleClick = () => {
    if (data.onStateChange) {
      data.onStateChange(data.id);
    }
  };

  return (
    <div className="relative" onClick={handleClick}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-gray-400"
      />
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center bg-white border-2 ${status === "completed"
          ? "border-green-500"
          : status === "current"
            ? "border-blue-500"
            : "border-gray-300"
          }`}
      >
        <RiveComponent className="w-12 h-12" />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-gray-400"
      />
    </div>
  );
};
