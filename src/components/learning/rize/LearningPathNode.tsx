import { useEffect } from "react";
import {
  useRive,
  Alignment,
  Layout,
  LayoutParameters,
  Fit,
} from "@rive-app/react-canvas";
import RiveCanvas from "@rive-app/react-canvas";
// import { NodeData } from "./types";

// move types folder
export interface CourseData {
  id: string;
  title: string;
  description: string;
  stats: {
    lessonCount: number;
    practiceCount: number;
  };
  nodes: NodeData[];
  connections: ConnectionData[];
}

export interface NodeData {
  id: string;
  title: string;
  state: number; // LOCKED(0), AVAILABLE(1), ACTIVE(2), COMPLETED(3)
  color: number;
  isComplete: boolean;
  position: {
    row: number;
    column: number;
  };
}

export interface ConnectionData {
  fromNodeId: string;
  toNodeId: string;
  isActive: boolean;
  progressValue?: number;
}

export const nodeStates = {
  LOCKED: 0,
  AVAILABLE: 1,
  ACTIVE: 2,
  COMPLETED: 3,
};

export const nodeColors = {
  blue: 1,
  green: 2,
  orange: 3,
  gray: 4,
  purple: 5,
  teal: 0,
};

interface LearningPathNodeProps {
  nodeData: NodeData;
  onStateChange: (nodeId: string) => void;
}

export const LearningPathNode = ({
  nodeData,
  onStateChange,
}: LearningPathNodeProps) => {
  const { rive, RiveComponent } = useRive({
    src: "/rive/learning-path-node.riv",
    stateMachines: ["NodeState"],
    autoplay: true,
    layout: {
      fit: Fit.Contain,
      alignment: Alignment.Center,
      // cachedRuntimeFit: undefined,
      // cachedRuntimeAlignment: undefined,
      // layoutScaleFactor: 0,
      // minX: 0,
      // minY: 0,
      // maxX: 0,
      // maxY: 0,
      // copyWith: function ({ fit, alignment, layoutScaleFactor, minX, minY, maxX, maxY, }: LayoutParameters): Layout {
      //   throw new Error("Function not implemented.");
      // },
      //   runtimeFit: function (rive: any): Fit {
      //     throw new Error("Function not implemented.");
      //   },
      //   runtimeAlignment: function (rive: any): Alignment {
      //     throw new Error("Function not implemented.");
      //   }
    },
  });

  useEffect(() => {
    if (!rive) return;

    const inputs = rive.stateMachineInputs("NodeState");
    const colorInput = inputs.find((input) => input.name === "Color");
    const completeInput = inputs.find((input) => input.name === "isComplete");
    const activeInput = inputs.find((input) => input.name === "isActive");
    const lockedInput = inputs.find((input) => input.name === "isLocked");
    // const motionInput = inputs.find(input => input.name === "isLimited")

    if (colorInput) colorInput.value = nodeData.color;
    if (completeInput) completeInput.value = nodeData.isComplete;
    if (activeInput) activeInput.value = nodeData.state === nodeStates.ACTIVE;
    if (lockedInput) lockedInput.value = nodeData.state === nodeStates.LOCKED;
    // if (motionInput)
    //   motionInput.value = window.matchMedia(
    //     "(prefers-reduced-motion: reduce)"
    //   ).matches;
  }, [rive, nodeData]);

  return (
    <div className="node-container">
      <RiveComponent
        onClick={() => onStateChange(nodeData.id)}
        role="button"
        aria-label={`${nodeData.title} node, ${getStateLabel(nodeData.state)}`}
      />
      <div className="node-title">{nodeData.title}</div>
    </div>
  );
};

const getStateLabel = (state: number) => {
  switch (state) {
    case nodeStates.LOCKED:
      return "Locked";
    case nodeStates.AVAILABLE:
      return "Available";
    case nodeStates.ACTIVE:
      return "Active";
    case nodeStates.COMPLETED:
      return "Completed";
    default:
      return "";
  }
};
