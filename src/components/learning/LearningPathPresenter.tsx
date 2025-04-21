import { useCallback, useMemo } from "react";
import { useRive } from "@rive-app/react-canvas";

// import { useAccessibility } from "./AccessibilityHook";
import { calculateGridLayout } from "./rize/grid-layout";
import {
  ConnectionData,
  CourseData,
  LearningPathNode,
  NodeData,
  nodeStates,
} from "./rize/LearningPathNode";
import { PathConnection } from "./rize/PathConnection";

interface LearningPathPresenterProps {
  courseData: CourseData;
  currentActiveNode?: string;
  onNodeSelected: (nodeId: string) => void;
  onConnectionProgress?: (connectionId: string, progress: number) => void;
  dimensions?: { width: number; height: number };
  theme?: "light" | "dark";
}

export const LearningPathPresenter = ({
  courseData,
  currentActiveNode,
  onNodeSelected,
  onConnectionProgress,
  dimensions = { width: 800, height: 600 },
  theme = "light",
}: LearningPathPresenterProps) => {
  // const { prefersReducedMotion } = useAccessibility();
  const [gridColumns, gridRows] = calculateGridLayout(courseData.nodes);

  // Main Rive animation for background effects
  const { RiveComponent: BackgroundAnimation } = useRive({
    src: "/rive/learning-path-background.riv",
    stateMachines: ["BackgroundState"],
    autoplay: true,
  });

  const handleNodeInteraction = useCallback(
    (nodeId: string) => {
      const node = courseData.nodes.find(
        (n: { id: string }) => n.id === nodeId
      );
      if (node?.state === nodeStates.LOCKED) return;
      onNodeSelected(nodeId);
    },
    [courseData.nodes, onNodeSelected]
  );

  const themedStyles = useMemo(
    () => ({
      backgroundColor: theme === "dark" ? "#1a202c" : "#f7fafc",
      nodeTextColor: theme === "dark" ? "#e2e8f0" : "#2d3748",
      connectionColor: theme === "dark" ? "#4a5568" : "#cbd5e0",
    }),
    [theme]
  );

  const { nodePositions, connectionPaths } = useMemo(
    () => calculateNodePositions(courseData.nodes, courseData.connections),
    [courseData]
  );

  return (
    <div
      className="learning-path-presenter"
      style={{
        width: `${dimensions.width}px`,
        height: `${dimensions.height}px`,
        ...themedStyles,
      }}
    >
      {/* Background Animation Layer */}
      <div className="background-layer">
        <BackgroundAnimation />
      </div>

      {/* Connections Layer */}
      <div className="connections-layer">
        {connectionPaths.map((path, index) => (
          <PathConnection
            key={`connection-${index}`}
            // pathData={path}
            from={path.from}
            to={path.to}
            isActive={courseData.connections[index].isActive}
            progressValue={courseData.connections[index].progressValue}
            // theme={theme}
            // prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>

      {/* Nodes Layer */}
      <div
        className="nodes-grid"
        style={{
          gridTemplateColumns: `repeat(${gridColumns}, 1fr)`,
          gridTemplateRows: `repeat(${gridRows}, 1fr)`,
        }}
      >
        {courseData.nodes.map((node: NodeData) => (
          <div
            key={node.id}
            className="node-container"
            style={{
              gridRow: node.position.row,
              gridColumn: node.position.column,
            }}
          >
            <LearningPathNode
              nodeData={node}
              // theme={theme}
              // prefersReducedMotion={prefersReducedMotion}
              onStateChange={handleNodeInteraction}
            />
          </div>
        ))}
      </div>

      {/* Accessibility Overlay */}
      <div className="accessibility-overlay" aria-hidden="true">
        {courseData.nodes.map(
          (node: { id: string; title: any; state: number }) => (
            <button
              key={`aria-${node.id}`}
              className="sr-only"
              onClick={() => handleNodeInteraction(node.id)}
              aria-label={`${node.title}, ${getAccessibilityStateLabel(
                node.state
              )}`}
            />
          )
        )}
      </div>
    </div>
  );
};

// Helper functions
const getAccessibilityStateLabel = (state: number) => {
  switch (state) {
    case nodeStates.LOCKED:
      return "Locked node";
    case nodeStates.AVAILABLE:
      return "Available for activation";
    case nodeStates.ACTIVE:
      return "Currently active node";
    case nodeStates.COMPLETED:
      return "Completed node";
    default:
      return "";
  }
};

// Layout calculation utilities
const calculateNodePositions = (
  nodes: NodeData[],
  connections: ConnectionData[]
) => {
  // Implementation for precise node positioning and connection path calculations
  return {
    nodePositions: new Map(nodes.map((node) => [node.id, node.position])),
    connectionPaths: connections.map((conn) => ({
      from: nodes.find((n) => n.id === conn.fromNodeId)?.position,
      to: nodes.find((n) => n.id === conn.toNodeId)?.position,
    })),
  };
};
