import { useEffect } from "react";
import { useRive } from "@rive-app/react-canvas";
import { NodeData } from "./LearningPathNode";

interface PathConnectionProps {
  from: NodeData;
  to: NodeData;
  isActive: boolean;
  progressValue?: number;
}

export const PathConnection = ({
  from,
  to,
  isActive,
  progressValue = 0,
}: PathConnectionProps) => {
  const { rive, RiveComponent } = useRive({
    src: "/rive/path-connection.riv",
    stateMachines: ["ConnectionState"],
    autoplay: true,
  });

  useEffect(() => {
    if (!rive) return;

    const inputs = rive.stateMachineInputs("ConnectionState");
    const activeInput = inputs.find((input) => input.name === "isActive");
    const progressInput = inputs.find(
      (input) => input.name === "progressValue"
    );

    if (activeInput) activeInput.value = isActive;
    if (progressInput) progressInput.value = progressValue;
  }, [rive, isActive, progressValue]);

  return (
    <RiveComponent
      className="connection"
      style={
        calculateConnectionStyle(
          from.position,
          to.position
        ) as React.CSSProperties
      }
      aria-hidden="true"
    />
  );
};

// Simplified connection positioning (requires CSS grid implementation)
const calculateConnectionStyle = (
  fromPos: { row: number; column: number },
  toPos: { row: number; column: number }
) => {
  // In real implementation, calculate based on actual grid cell dimensions
  return {
    position: "absolute" as "absolute",
    top: `${fromPos.row * 100}px`,
    left: `${fromPos.column * 100}px`,
    width: `${Math.abs(toPos.column - fromPos.column) * 100}px`,
    height: `${Math.abs(toPos.row - fromPos.row) * 100}px`,
  };
};
