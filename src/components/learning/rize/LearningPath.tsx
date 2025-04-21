import { CourseData, LearningPathNode } from "./LearningPathNode";
import { PathConnection } from "./PathConnection";

interface LearningPathProps {
  courseData: CourseData;
  onNodeClick: (nodeId: string) => void;
}

export const LearningPath = ({
  courseData,
  onNodeClick,
}: LearningPathProps) => {
  return (
    <div className="learning-path-container">
      {/* Nodes Layer */}
      {courseData.nodes.map((node) => (
        <div
          key={node.id}
          className="node-wrapper"
          style={{
            gridRow: node.position.row,
            gridColumn: node.position.column,
          }}
        >
          <LearningPathNode nodeData={node} onStateChange={onNodeClick} />
        </div>
      ))}

      {/* Connections Layer */}
      <div className="connections-layer">
        {courseData.connections.map((connection, index) => {
          const fromNode = courseData.nodes.find(
            (n) => n.id === connection.fromNodeId
          );
          const toNode = courseData.nodes.find(
            (n) => n.id === connection.toNodeId
          );

          return fromNode && toNode ? (
            <PathConnection
              key={index}
              from={fromNode}
              to={toNode}
              isActive={connection.isActive}
              progressValue={connection.progressValue}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};
