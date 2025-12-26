import React from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "reactflow";

interface PathConnectionProps extends EdgeProps {
  data?: {
    progress?: number;
  };
}

export const PathConnection: React.FC<PathConnectionProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const progress = data?.progress ?? 0;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          strokeWidth: 2,
          stroke: "#e2e8f0",
        }}
      />
      {progress > 0 && (
        <BaseEdge
          id={`${id}-progress`}
          path={edgePath}
          style={{
            strokeWidth: 2,
            stroke: "#3b82f6",
            strokeDasharray: "4",
            strokeDashoffset: String(100 - progress),
          }}
        />
      )}
    </>
  );
};
