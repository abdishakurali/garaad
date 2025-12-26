import React from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { LearningPathNode } from "./LearningPathNode";
import { PathConnection } from "./PathConnection";

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    isComplete: boolean;
    isActive: boolean;
  };
}

interface Connection {
  id: string;
  source: string;
  target: string;
  type: string;
  data?: {
    progress: number;
  };
}

interface LearningPathPresenterProps {
  nodes: Node[];
  connections: Connection[];
}

const nodeTypes = {
  learningNode: LearningPathNode,
};

const edgeTypes = {
  pathConnection: PathConnection,
};

export const LearningPathPresenter: React.FC<LearningPathPresenterProps> = ({
  nodes,
  connections,
}) => {
  return (
    <div style={{ width: "100%", height: "500px" }}>
      <ReactFlow
        nodes={nodes}
        edges={connections}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};
