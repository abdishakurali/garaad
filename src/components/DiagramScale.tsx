/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { DiagramObject, DiagramConfig } from "../types/learning";

const DiagramScale: React.FC<{ config: DiagramConfig; isMultiple?: boolean }> = ({ config, isMultiple = false }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const controlRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!config || !config.objects || config.objects.length === 0) return;

    let dg: any;
    let int: any;

    import("diagramatics")
      .then((mod) => {
        dg = mod;
        const mysvg = svgRef.current;
        const controldiv = controlRef.current;
        if (!mysvg || !controldiv) return;

        const draw = (...diagrams: any[]) =>
          dg.draw_to_svg_element(mysvg, dg.diagram_combine(...diagrams));

        int = new dg.Interactive(controldiv, mysvg);
        const V2 = dg.V2;

        function makeShape(obj: DiagramObject, isPlatformDiagram: boolean = false) {
          const baseSize = isMultiple ? 30 : 40; // Smaller size for multiple diagrams
          const size = baseSize;
          let shape: any;
          switch (obj.type) {
            case "cube": {
              const fill = dg
                .square(size)
                .apply(dg.mod.round_corner(8))
                .fill(obj.color)
                .stroke("none");
              const outline = dg
                .square(size)
                .apply(dg.mod.round_corner(8))
                .stroke("rgba(0,0,0,0.3)")
                .strokewidth(2)
                .fill("none");
              const shadow = dg
                .square(size)
                .apply(dg.mod.round_corner(8))
                .fill("rgba(0,0,0,0.1)")
                .translate(V2(2, 2));
              shape = dg.diagram_combine(shadow, fill, outline);
              break;
            }
            case "circle": {
              shape = dg
                .circle(size / 2)
                .fill(obj.color)
                .stroke("none");
              break;
            }
            case "triangle": {
              shape = dg
                .regular_polygon(3, size / 1.35)
                .apply(dg.mod.round_corner(5))
                .fill(obj.color)
                .stroke("#777")
                .strokewidth(1);
              break;
            }
            case "weight": {
              shape = dg
                .regular_polygon(5, size / 2)
                .fill(obj.color || "#ccc")
                .stroke("#333")
                .strokewidth(2);
              break;
            }
            case "trapezoid_weight": {
              const trapezoidSize = size * 1.4;
              const points = [
                V2(-trapezoidSize / 2, -trapezoidSize / 3),
                V2(trapezoidSize / 2, -trapezoidSize / 3),
                V2(trapezoidSize / 3, trapezoidSize / 3),
                V2(-trapezoidSize / 3, trapezoidSize / 3),
              ];
              shape = dg
                .polygon(points)
                .fill(obj.color || "#ccc")
                .stroke("#333")
                .strokewidth(2);
              break;
            }
            default: {
              shape = dg.square(size).fill(obj.color).stroke("none");
            }
          }

          // Always show weight values for all types in platform diagrams if present
          if ((isPlatformDiagram || !isPlatformDiagram) && obj.weight_value != null && obj.weight_value !== undefined) {
            const baseFontSize = obj.type === "trapezoid_weight" ? 16 : 12;
            const fontSize = isMultiple ? baseFontSize * 0.8 : baseFontSize;
            const txt = dg
              .textvar(String(obj.weight_value))
              .move_origin_text("center-center")
              .textfill("black")
              .fontsize(fontSize);
            shape = dg.diagram_combine(shape, txt);
          }
          return shape;
        }

        int.draw_function = () => {
          const V2 = dg.V2;
          // Scale down elements when multiple diagrams are present
          const scale = isMultiple ? 0.7 : 1.0;
          const spacing = (isMultiple ? 35 : 45) * scale; // Base spacing between shapes
          const groupSpacing = (isMultiple ? 15 : 20) * scale; // Spacing between different groups of shapes

          // Check if this is a platform diagram
          const isPlatform = config.diagram_type === "platform";

          // Create platform-specific base elements
          let baseElements: any[] = [];

          if (isPlatform) {
            // Platform layout: two separate platforms connected by a beam
            const platformWidth = isMultiple ? 90 : 120;
            const platformHeight = isMultiple ? 9 : 12;
            const beamWidth = isMultiple ? 300 : 400;
            const beamHeight = isMultiple ? 5 : 6;
            const platformOffset = isMultiple ? 110 : 150; // Distance from center to each platform

            // Horizontal beam (centered vertically in SVG)
            const beamY = isMultiple ? 15 : 20;
            const beam = dg
              .rectangle(beamWidth, beamHeight)
              .fill("#AAAAAA")
              .stroke("#888888")
              .strokewidth(2)
              .position(V2(0, beamY));

            // Left platform
            const leftPlatform = dg
              .rectangle(platformWidth, platformHeight)
              .apply(dg.mod.round_corner(3))
              .fill("#CCCCCC")
              .stroke("#999999")
              .strokewidth(2)
              .position(V2(-platformOffset, beamY));

            // Right platform  
            const rightPlatform = dg
              .rectangle(platformWidth, platformHeight)
              .apply(dg.mod.round_corner(3))
              .fill("#CCCCCC")
              .stroke("#999999")
              .strokewidth(2)
              .position(V2(platformOffset, beamY));

            // Central fulcrum (triangle pointing up)
            const fulcrumY = isMultiple ? 28 : 35;
            const fulcrum = dg
              .regular_polygon(3, isMultiple ? 10 : 12)
              .fill("#777777")
              .stroke("#555555")
              .strokewidth(2)
              .rotate(0) // Point up
              .position(V2(0, fulcrumY));

            // Support posts for each platform
            const supportY = isMultiple ? 25 : 32;
            const supportHeight = isMultiple ? 20 : 25;
            const leftSupport = dg
              .rectangle(4, supportHeight)
              .fill("#999999")
              .position(V2(-platformOffset, supportY));

            const rightSupport = dg
              .rectangle(4, supportHeight)
              .fill("#999999")
              .position(V2(platformOffset, supportY));

            // No weight display for platform diagrams
            baseElements = [beam, leftSupport, rightSupport, leftPlatform, rightPlatform, fulcrum];
          } else {
            // Original scale layout - adjusted for vertical centering
            const scaleBaseY = isMultiple ? 15 : 20; // Match platform beam position
            const baseAccent = dg
              .rectangle(isMultiple ? 240 : 300, isMultiple ? 5 : 6)
              .position(V2(0, scaleBaseY))
              .stroke("#777777")
              .strokewidth(isMultiple ? 5 : 6);

            const displayBg = dg
              .rectangle(isMultiple ? 40 : 50, isMultiple ? 28 : 35)
              .apply(dg.mod.round_corner(4))
              .fill("#1a1a1a")
              .position(V2(0, scaleBaseY - (isMultiple ? 29 : 35)));

            const displayText = dg
              .textvar(String(config.scale_weight))
              .move_origin_text("center-center")
              .position(V2(0, scaleBaseY - (isMultiple ? 29 : 35)))
              .textfill("white")
              .fontsize(isMultiple ? 13 : 16);

            const pivot = dg
              .rectangle(isMultiple ? 70 : 90, isMultiple ? 10 : 12)
              .apply(dg.mod.round_corner(5))
              .position(V2(0, scaleBaseY + (isMultiple ? 5 : 8)))
              .fill("#444444")
              .stroke("#333333")
              .strokewidth(1);

            const baseShape = dg
              .rectangle(isMultiple ? 176 : 220, isMultiple ? 56 : 70)
              .apply(dg.mod.round_corner(8))
              .fill("#555555")
              .stroke("#333333")
              .strokewidth(2)
              .position(V2(0, scaleBaseY - (isMultiple ? 25 : 30)));

            baseElements = [baseAccent, baseShape, pivot, displayBg, displayText];
          }

          // Group objects by their platform position (left/right/center), then by type within each position
          let positionGroups: Record<string, Record<string, DiagramObject[]>> = {};
          if (isPlatform) {
            // First group by position, then by type
            config.objects.forEach((obj) => {
              const pos = obj.position;
              if (!positionGroups[pos]) positionGroups[pos] = {};
              if (!positionGroups[pos][obj.type]) positionGroups[pos][obj.type] = [];
              positionGroups[pos][obj.type].push(obj);
            });
          } else {
            // For non-platform, keep original grouping by position only
            positionGroups = config.objects.reduce((acc, obj) => {
              const pos = obj.position;
              if (!acc[pos]) acc[pos] = { all: [] };
              acc[pos]["all"].push(obj);
              return acc;
            }, {} as Record<string, Record<string, DiagramObject[]>>);
          }

          // Calculate the maximum width needed for each position (sum of type groups)
          const positionWidths = Object.entries(positionGroups).reduce((acc, [pos, typeGroups]) => {
            let totalWidth = 0;
            Object.values(typeGroups).forEach((objects, idx) => {
              objects.forEach((obj) => {
                // Calculate columns based on orientation
                const cols = obj.orientation === "vertical" ? 1 :
                  obj.orientation === "horizontal" ? obj.number :
                    Math.ceil(Math.sqrt(obj.number));
                totalWidth += (cols * spacing);
              });
              if (idx < Object.values(typeGroups).length - 1) {
                totalWidth += groupSpacing; // Add spacing between type groups
              }
            });
            acc[pos] = totalWidth;
            return acc;
          }, {} as Record<string, number>);

          // Now layout all shapes, grouped by type within each position
          const allShapes = Object.entries(positionGroups).flatMap(([position, typeGroups]) => {
            const typeGroupEntries = Object.entries(typeGroups);
            let positionStartX = 0;

            // Calculate starting position for this position group
            if (isPlatform) {
              const platformOffset = isMultiple ? 110 : 150;
              switch (position) {
                case "left":
                  positionStartX = -platformOffset - (positionWidths[position] / 2);
                  break;
                case "right":
                  positionStartX = platformOffset - (positionWidths[position] / 2);
                  break;
                case "center":
                default:
                  positionStartX = -(positionWidths[position] / 2);
                  break;
              }
            }

            let currentTypeX = positionStartX;

            return typeGroupEntries.flatMap(([, objects], typeIdx) => {
              // For each type group, layout all objects of that type
              return objects.flatMap((obj, objIndex) => {
                const baseShape = makeShape(obj, isPlatform);
                const shapes: any[] = [];
                const totalShapes = obj.number;
                let actualRows, actualCols;
                // Calculate rows and columns based on orientation
                if (obj.orientation === "vertical") {
                  actualRows = totalShapes;
                  actualCols = 1;
                } else if (obj.orientation === "horizontal") {
                  actualRows = 1;
                  actualCols = totalShapes;
                } else {
                  // For "none" orientation, arrange in a square-like pattern
                  actualCols = Math.ceil(Math.sqrt(totalShapes));
                  actualRows = Math.ceil(totalShapes / actualCols);
                }
                const objectWidth = (actualCols - 1) * spacing;
                let baseX = currentTypeX;
                let baseY;
                if (isPlatform) {
                  baseY = isMultiple ? 30 : 40;
                } else {
                  baseY = isMultiple ? 35 : 50;
                }

                if (!isPlatform) {
                  // Non-platform: original logic
                  switch (position) {
                    case "left":
                      baseX = -120;
                      break;
                    case "right":
                      baseX = 120;
                      break;
                    case "top":
                      baseY = -100;
                      break;
                    case "bottom":
                      baseY = 170;
                      break;
                    case "center":
                    default:
                      baseX = 0;
                      break;
                  }
                  const totalWidth = positionWidths[position];
                  // Default to center alignment for the simplified structure
                  baseX = baseX - (totalWidth / 2) + currentTypeX + (objectWidth / 2);
                }

                // Create grid of shapes with consistent spacing
                for (let i = 0; i < totalShapes; i++) {
                  let row, col;
                  if (isPlatform) {
                    row = Math.floor(i / actualCols);
                    col = i % actualCols;
                  } else {
                    row = i % actualRows;
                    col = Math.floor(i / actualRows);
                  }
                  const x = baseX + (col * spacing);
                  const y = baseY + (row * spacing);
                  shapes.push(baseShape.translate(V2(x, y)));
                }

                // Update currentTypeX for next object in this type group
                if (objIndex === objects.length - 1) {
                  // Last object in this type group - move to next type group position
                  currentTypeX += objectWidth + spacing;
                  if (typeIdx < typeGroupEntries.length - 1) {
                    currentTypeX += groupSpacing; // Add extra spacing between type groups
                  }
                } else {
                  // More objects in this type group - just add object width
                  currentTypeX += objectWidth + spacing;
                }

                return shapes;
              });
            });
          });

          // Draw all elements
          draw(...baseElements, ...allShapes);
        };

        int.draw();
        int.dnd_initial_draw();
      })
      .catch(console.error);
  }, [config]);

  return (
    <div className="flex items-center justify-center">
      <div ref={controlRef} className="diagram-controls" />
      <svg
        ref={svgRef}
        width={isMultiple ? "320" : "400"}
        height={isMultiple ? "200" : "250"}
        className="drop-shadow-xl"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  );
};

export default DiagramScale; 