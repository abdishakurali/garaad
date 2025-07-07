import React from "react";
import DiagramScale from "./DiagramScale";
import { ProblemContent, DiagramConfig } from "@/types/learning";

interface DiagramRendererProps {
  problems: ProblemContent[];
}

const DiagramRenderer: React.FC<DiagramRendererProps> = ({ problems }) => {
  const renderDiagram = (cfg: DiagramConfig, isMultiple: boolean) => {
    // DiagramScale component now handles both scale and platform types natively
    return <DiagramScale config={cfg} isMultiple={isMultiple} />;
  };

  return (
    <div className="space-y-8">
      {problems.map((problem) => {
        // Determine if there are multiple diagrams for this problem
        const diagramCount = problem.diagrams?.length ||
          (Array.isArray(problem.diagram_config) ? problem.diagram_config.length : 1);
        const isMultiple = diagramCount > 1;

        return (
          <div key={problem.id} className="p-4 border rounded-lg max-w-full overflow-hidden">
            <p className="mb-4 font-medium">{problem.question}</p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center w-full max-w-full overflow-hidden">
              {problem.diagrams ? (
                // Handle new diagrams array format
                problem.diagrams.map((cfg) => (
                  <div key={cfg.diagram_id} className="flex-shrink min-w-0 w-full max-w-full">
                    {renderDiagram(cfg, isMultiple)}
                  </div>
                ))
              ) : Array.isArray(problem.diagram_config) ? (
                // Handle existing diagram_config array format
                problem.diagram_config.map((cfg) => (
                  <div key={cfg.diagram_id} className="flex-shrink min-w-0 w-full max-w-full">
                    {renderDiagram(cfg, isMultiple)}
                  </div>
                ))
              ) : problem.diagram_config ? (
                // Handle existing single diagram_config format
                <div className="flex-shrink min-w-0 w-full max-w-full">
                  {renderDiagram(problem.diagram_config, isMultiple)}
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DiagramRenderer;
