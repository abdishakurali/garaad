import React from "react";
import { Position } from "reactflow";
import { CourseData, LearningPathNode } from "./LearningPathNode";
import { PathConnection } from "./PathConnection";

interface LearningPathProps {
  courseData: CourseData;
}

export const LearningPath: React.FC<LearningPathProps> = ({ courseData }) => {
  const { nodes, connections } = courseData;

  return (
    <div className="relative w-full h-full">
      {nodes.map((node) => (
        <div
          key={node.id}
          style={{
            position: "absolute",
            left: `${node.position.column * 100}px`,
            top: `${node.position.row * 100}px`,
          }}
        >
          <LearningPathNode
            id={node.id}
            data={node}
            type="default"
            selected={false}
            zIndex={0}
            xPos={node.position.column * 100}
            yPos={node.position.row * 100}
            isConnectable={false}
            dragHandle={undefined}
            dragging={false}
            sourcePosition={Position.Right}
            targetPosition={Position.Left}
          />
        </div>
      ))}
      {connections.map((connection, index) => {
        const fromNode = nodes.find((n) => n.id === connection.fromNodeId);
        const toNode = nodes.find((n) => n.id === connection.toNodeId);
        const isActive = connection.isActive;
        const progressValue = connection.progressValue;

        if (!fromNode || !toNode) return null;

        return (
          <PathConnection
            key={index}
            id={`${fromNode.id}-${toNode.id}`}
            source={fromNode.id}
            target={toNode.id}
            sourceX={fromNode.position.column * 100}
            sourceY={fromNode.position.row * 100}
            targetX={toNode.position.column * 100}
            targetY={toNode.position.row * 100}
            sourcePosition={Position.Right}
            targetPosition={Position.Left}
            data={{ progress: isActive ? progressValue : 0 }}
          />
        );
      })}
    </div>
  );
};
