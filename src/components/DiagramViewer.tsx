import React from "react";
import DiagramScale from "./DiagramScale";
import { ProblemContent } from "@/types/learning";

interface DiagramRendererProps {
  problems: ProblemContent[];
}

const DiagramRenderer: React.FC<DiagramRendererProps> = ({ problems }) => (
  <div className="space-y-8">
    {problems.map((problem) => (
      <div key={problem.id} className="p-4 border rounded-lg">
        <p className="mb-4 font-medium">{problem.question}</p>
        <div className="space-y-6 flex justify-center items-center">
          {Array.isArray(problem.diagram_config) &&
            problem.diagram_config.map((cfg) => (
              <DiagramScale key={cfg.diagram_id} config={cfg} />
            ))}
        </div>
      </div>
    ))}
  </div>
);

export default DiagramRenderer;
