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
                .fill(obj.background_color || obj.color)
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
                .fill(obj.background_color || obj.color)
                .stroke("none");
              break;
            }
            case "triangle": {
              shape = dg
                .regular_polygon(3, size / 1.35)
                .apply(dg.mod.round_corner(5))
                .fill(obj.background_color || obj.color)
                .stroke("#777")
                .strokewidth(1);
              break;
            }

            case "weight": {
              shape = dg
                .regular_polygon(5, size / 2) // Reduced from size/2 + 5
                .fill(obj.background_color || obj.color || "#ccc")
                .stroke("#333")
                .strokewidth(2);
              break;
            }
            case "trapezoid_weight": {
              // Create a larger trapezoid shape for weights
              const trapezoidSize = size * 1.4; // Make trapezoid 40% larger
              const points = [
                V2(-trapezoidSize / 2, -trapezoidSize / 3),  // top left
                V2(trapezoidSize / 2, -trapezoidSize / 3),   // top right
                V2(trapezoidSize / 3, trapezoidSize / 3),    // bottom right
                V2(-trapezoidSize / 3, trapezoidSize / 3),   // bottom left
              ];
              shape = dg
                .polygon(points)
                .fill(obj.background_color || obj.color || "#ccc")
                .stroke("#333")
                .strokewidth(2);
              break;
            }
            default: {
              shape = dg.square(size).fill(obj.background_color || obj.color).stroke("none");
            }
          }

          // Only show weight values for scale diagrams, not platform diagrams
          if (!isPlatformDiagram && obj.weight_value != null && obj.weight_value !== undefined) {
            // Use larger font size for trapezoid_weight, normal size for others
            const baseFontSize = obj.type === "trapezoid_weight" ? 16 : 12;
            const fontSize = isMultiple ? baseFontSize * 0.8 : baseFontSize;
            const txt = dg
              .textvar(String(obj.weight_value))
              .move_origin_text("center-center")
              .textfill(obj.text_color || "black")
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

          // Check if this is a platform diagram
          const isPlatform = config.diagram_type === "platform";

          // Create platform-specific base elements
          let baseElements: any[] = [];

          if (isPlatform) {
            // Platform layout: two separate platforms, each with its own support, no connecting beam
            const platformWidth = isMultiple ? 90 : 120;
            const platformHeight = isMultiple ? 9 : 12;
            const platformOffset = isMultiple ? 120 : 170; // Separation

            // Left platform
            const leftPlatform = dg
              .rectangle(platformWidth, platformHeight)
              .apply(dg.mod.round_corner(3))
              .fill("#CCCCCC")
              .stroke("#999999")
              .strokewidth(2)
              .position(V2(-platformOffset, isMultiple ? 18 : 28));

            // Right platform  
            const rightPlatform = dg
              .rectangle(platformWidth, platformHeight)
              .apply(dg.mod.round_corner(3))
              .fill("#CCCCCC")
              .stroke("#999999")
              .strokewidth(2)
              .position(V2(platformOffset, isMultiple ? 18 : 28));

            // Central fulcrum (triangle pointing up)
            const fulcrumY = isMultiple ? 38 : 50;
            const fulcrum = dg
              .regular_polygon(3, isMultiple ? 12 : 16)
              .fill("#777777")
              .stroke("#555555")
              .strokewidth(2)
              .rotate(0) // Point up
              .position(V2(0, fulcrumY));

            // Support posts for each platform
            const supportY = isMultiple ? 28 : 38;
            const supportHeight = isMultiple ? 24 : 32;
            const leftSupport = dg
              .rectangle(4, supportHeight)
              .fill("#999999")
              .position(V2(-platformOffset, supportY));

            const rightSupport = dg
              .rectangle(4, supportHeight)
              .fill("#999999")
              .position(V2(platformOffset, supportY));

            baseElements = [leftSupport, rightSupport, leftPlatform, rightPlatform, fulcrum];
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

          // Group objects by their platform position (left/right/center)
          const positionGroups = config.objects.reduce((acc, obj) => {
            const pos = isPlatform ? (obj.position || obj.layout.position) : obj.layout.position;
            if (!acc[pos]) acc[pos] = [];
            acc[pos].push(obj);
            return acc;
          }, {} as Record<string, DiagramObject[]>);

          const allShapes = Object.entries(positionGroups).flatMap(([position, objects]) => {
            return objects.flatMap((obj) => {
              const baseShape = makeShape(obj, isPlatform);
              const shapes: any[] = [];

              // Calculate grid dimensions for this object
              const totalShapes = obj.number;
              let actualRows, actualCols;
              if (isPlatform) {
                actualRows = obj.layout.rows;
                actualCols = obj.layout.columns;
              } else {
                actualRows = obj.layout.rows;
                actualCols = Math.ceil(totalShapes / actualRows);
              }
              const gridWidth = (actualCols - 1) * spacing;

              // Calculate base position
              let baseX = 0;
              let baseY = 0;
              if (isPlatform) {
                baseY = isMultiple ? 8 : 18; // Place objects just above the platform
                const platformOffset = isMultiple ? 120 : 170;
                switch (position) {
                  case "left":
                    baseX = -platformOffset - gridWidth / 2;
                    break;
                  case "right":
                    baseX = platformOffset - gridWidth / 2;
                    break;
                  case "center":
                  default:
                    baseX = 0 - gridWidth / 2;
                    break;
                }
              } else {
                baseY = isMultiple ? 35 : 50; // Scale diagrams - above scale base
                // Original scale positioning
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

              return shapes;
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