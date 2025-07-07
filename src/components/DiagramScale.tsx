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
          const baseSize = isMultiple ? 28 : 36; // Slightly smaller cubes to fit more
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

          // Calculate total objects to determine optimal spacing
          const totalObjects = config.objects.reduce((sum, obj) => sum + obj.number, 0);

          // Check if we need even tighter spacing for many objects (responsive adjustment)
          const isCrowded = totalObjects > 5;
          const responsiveScale = isCrowded ? 0.8 : 1.0;

          // Dynamic spacing based on number of objects - ensuring safe space between objects
          const baseSpacing = Math.max(isMultiple ? 40 : 50, (isMultiple ? 200 : 280) / Math.max(totalObjects, 1));
          const spacing = baseSpacing * scale * responsiveScale;
          const groupSpacing = (isMultiple ? 20 : 25) * scale * responsiveScale; // More spacing between different groups of shapes
          // Increased minimum spacing to ensure safe space between individual objects
          const sameTypeSpacing = Math.max(isMultiple ? 35 : 45, (isMultiple ? 160 : 220) / Math.max(totalObjects, 1)) * scale * responsiveScale;

          // Check if this is a platform diagram
          const isPlatform = config.diagram_type === "platform";

          // Create platform-specific base elements
          let baseElements: any[] = [];

          if (isPlatform) {
            // Platform layout exactly like the attached image
            const platformWidth = isMultiple ? 140 : 180;
            const platformHeight = isMultiple ? 12 : 16;
            const platformOffset = isMultiple ? 180 : 240;

            // Positions - from top to bottom
            const platformY = isMultiple ? 50 : 60;          // Platforms at top
            const beamY = isMultiple ? 120 : 140;             // Beam in middle  
            const fulcrumY = isMultiple ? 170 : 200;          // Fulcrum at bottom

            // Horizontal beam in the middle
            const beamWidth = platformOffset * 2.2;
            const beamHeight = isMultiple ? 6 : 8;
            const beam = dg
              .rectangle(beamWidth, beamHeight)
              .fill("#AAAAAA")
              .stroke("#888888")
              .strokewidth(1)
              .position(V2(0, beamY));

            // Left platform (suspended above the beam)
            const leftPlatform = dg
              .rectangle(platformWidth, platformHeight)
              .apply(dg.mod.round_corner(3))
              .fill("#CCCCCC")
              .stroke("#999999")
              .strokewidth(1)
              .position(V2(-platformOffset, platformY));

            // Right platform (suspended above the beam)
            const rightPlatform = dg
              .rectangle(platformWidth, platformHeight)
              .apply(dg.mod.round_corner(3))
              .fill("#CCCCCC")
              .stroke("#999999")
              .strokewidth(1)
              .position(V2(platformOffset, platformY));

            // Support chains connecting platforms to beam
            const chainHeight = beamY - platformY - platformHeight / 2;
            const leftChain = dg
              .rectangle(3, chainHeight)
              .fill("#666666")
              .position(V2(-platformOffset, platformY + platformHeight / 2 + chainHeight / 2));

            const rightChain = dg
              .rectangle(3, chainHeight)
              .fill("#666666")
              .position(V2(platformOffset, platformY + platformHeight / 2 + chainHeight / 2));

            // Central fulcrum (triangle pointing up at the bottom)
            const fulcrum = dg
              .regular_polygon(3, isMultiple ? 16 : 20)
              .fill("#777777")
              .stroke("#555555")
              .strokewidth(1)
              .rotate(0) // Point up
              .position(V2(0, fulcrumY));

            // Fulcrum base/support
            const fulcrumBase = dg
              .rectangle(isMultiple ? 40 : 50, isMultiple ? 8 : 10)
              .apply(dg.mod.round_corner(3))
              .fill("#666666")
              .position(V2(0, fulcrumY + (isMultiple ? 20 : 25)));

            baseElements = [fulcrumBase, beam, leftChain, rightChain, leftPlatform, rightPlatform, fulcrum];
          } else {
            // Original scale layout - adjusted for vertical centering
            const scaleBaseY = isMultiple ? 15 : 20; // Match platform beam position

            // Base shape and accent line should have the same width for consistency
            const scaleWidth = isMultiple ? 380 : 500; // Increased width to make beam longer

            const baseAccent = dg
              .rectangle(scaleWidth, isMultiple ? 5 : 6) // Accent line matches base shape width
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
              .rectangle(scaleWidth, isMultiple ? 56 : 70) // Base shape uses consistent width
              .apply(dg.mod.round_corner(8))
              .fill("#555555")
              .stroke("#333333")
              .strokewidth(2)
              .position(V2(0, scaleBaseY - (isMultiple ? 25 : 30)));

            baseElements = [baseAccent, baseShape, pivot, displayBg, displayText];
          }

          // Group objects by their platform position (left/right/center), then by type within each position
          const positionGroups: Record<string, Record<string, DiagramObject[]>> = {};
          if (isPlatform) {
            // First group by position, then by type
            config.objects.forEach((obj) => {
              const pos = obj.position;
              if (!positionGroups[pos]) positionGroups[pos] = {};
              if (!positionGroups[pos][obj.type]) positionGroups[pos][obj.type] = [];
              positionGroups[pos][obj.type].push(obj);
            });
          } else {
            // For non-platform, group by type regardless of position
            config.objects.forEach((obj) => {
              const pos = obj.position;
              if (!positionGroups[pos]) positionGroups[pos] = {};
              if (!positionGroups[pos][obj.type]) positionGroups[pos][obj.type] = [];
              positionGroups[pos][obj.type].push(obj);
            });
          }

          // Now layout all shapes, grouped by type within each position
          const allShapes = Object.entries(positionGroups).flatMap(([position, typeGroups]) => {
            const typeGroupEntries = Object.entries(typeGroups);
            let positionStartX = 0;

            // Calculate platform constraints for boundary checking - match new platform layout
            const platformWidth = isMultiple ? 140 : 180;
            const platformConstraints = {
              left: { min: -platformWidth / 2, max: platformWidth / 2 },
              right: { min: -platformWidth / 2, max: platformWidth / 2 },
              center: { min: -platformWidth, max: platformWidth }
            };

            // Calculate starting position for this position group
            if (isPlatform) {
              const platformOffset = isMultiple ? 180 : 240; // Match the new platform layout
              // Place left objects on left platform, right objects on right platform
              switch (position) {
                case "left":
                  positionStartX = -platformOffset;
                  break;
                case "right":
                  positionStartX = platformOffset;
                  break;
                case "center":
                default:
                  positionStartX = 0;
                  break;
              }
            } else {
              // For non-platform scales, position objects based on their position
              const scaleWidth = isMultiple ? 380 : 500; // Updated to match longer scale width
              switch (position) {
                case "left":
                  positionStartX = -scaleWidth / 3;
                  break;
                case "right":
                  positionStartX = scaleWidth / 3;
                  break;
                case "center":
                default:
                  positionStartX = 0;
                  break;
              }
            }

            // For platforms, calculate total width needed and distribute evenly
            let totalWidthNeeded = 0;
            const typeGroupWidths: number[] = [];

            if (isPlatform) {
              // Calculate width needed for each type group
              typeGroupEntries.forEach(([, objects]) => {
                let maxWidthForType = 0;
                objects.forEach((obj) => {
                  const totalShapes = obj.number;
                  let actualCols;
                  if (obj.orientation === "vertical") {
                    actualCols = 1;
                  } else if (obj.orientation === "horizontal") {
                    actualCols = totalShapes;
                  } else {
                    actualCols = Math.ceil(Math.sqrt(totalShapes));
                  }
                  // Ensure minimum spacing for multiple objects - improved calculation with safe space
                  const objectWidth = actualCols > 1 ?
                    (actualCols - 1) * sameTypeSpacing + (isMultiple ? 40 : 55) :
                    (isMultiple ? 40 : 55);
                  maxWidthForType = Math.max(maxWidthForType, objectWidth);
                });
                typeGroupWidths.push(maxWidthForType);
                totalWidthNeeded += maxWidthForType;
              });

              // Add spacing between type groups - much more generous spacing for safe space
              if (typeGroupEntries.length > 1) {
                totalWidthNeeded += (typeGroupEntries.length - 1) * (groupSpacing * 2);
              }

              // Calculate starting position to center all objects on the platform
              const platformConstraint = platformConstraints[position as keyof typeof platformConstraints];
              const availableWidth = platformConstraint.max - platformConstraint.min;
              const startOffset = Math.max(0, (availableWidth - totalWidthNeeded) / 2);
              positionStartX = positionStartX + platformConstraint.min + startOffset;
            }

            let currentTypeX = positionStartX;

            return typeGroupEntries.flatMap(([, objects], typeIdx) => {
              const typeGroupShapes: any[] = [];
              const typeGroupWidth = isPlatform ? typeGroupWidths[typeIdx] : 0;

              objects.forEach((obj) => {
                const baseShape = makeShape(obj, isPlatform);
                const totalShapes = obj.number;
                let actualCols;

                // Calculate columns based on orientation
                if (obj.orientation === "vertical") {
                  actualCols = 1;
                } else if (obj.orientation === "horizontal") {
                  actualCols = totalShapes;
                } else {
                  // For "none" orientation, arrange in a square-like pattern
                  actualCols = Math.ceil(Math.sqrt(totalShapes));
                }

                // Calculate object width including spacing between same-type objects with safe space
                const objectWidth = actualCols > 1 ?
                  (actualCols - 1) * sameTypeSpacing + (isMultiple ? 40 : 55) :
                  (isMultiple ? 40 : 55);

                let baseX = currentTypeX;
                let baseY;

                if (isPlatform) {
                  // Place objects on top of the platform (matching the attached image)
                  const platformY = isMultiple ? 50 : 60;
                  const platformHeight = isMultiple ? 12 : 16;
                  // Calculate platform top surface
                  const platformTop = platformY - platformHeight / 2;
                  // Position objects directly on top of the platform
                  baseY = platformTop - (isMultiple ? 25 : 35);

                  // Center this object group within the allocated type group width  
                  baseX = currentTypeX + Math.max(0, (typeGroupWidth - objectWidth) / 2);
                } else {
                  baseY = isMultiple ? 35 : 50;
                  // For non-platform, keep objects within scale bounds
                  const scaleWidth = isMultiple ? 380 : 500; // Updated to match longer scale width
                  const scaleLeftBound = -scaleWidth / 2;
                  const scaleRightBound = scaleWidth / 2;
                  baseX = Math.max(scaleLeftBound, Math.min(scaleRightBound - objectWidth, currentTypeX - objectWidth / 2));
                }

                // Create grid of shapes with consistent spacing
                for (let i = 0; i < totalShapes; i++) {
                  let row, col;
                  if (obj.orientation === "vertical") {
                    row = i;
                    col = 0;
                  } else if (obj.orientation === "horizontal") {
                    row = 0;
                    col = i;
                  } else {
                    row = Math.floor(i / actualCols);
                    col = i % actualCols;
                  }
                  const x = baseX + (col * sameTypeSpacing);

                  // For platforms, stack objects upward from the platform surface (sitting on top)
                  const y = isPlatform ?
                    baseY - (row * sameTypeSpacing) :
                    baseY + (row * sameTypeSpacing);

                  typeGroupShapes.push(baseShape.translate(V2(x, y)));
                }
              });

              // Update currentTypeX for next type group with safe spacing
              if (isPlatform) {
                currentTypeX += typeGroupWidth + (groupSpacing * 2);
              } else {
                currentTypeX += spacing + (groupSpacing * 1.5);
              }

              return typeGroupShapes;
            });
          });

          // Draw all elements
          draw(...baseElements, ...allShapes);
        };

        int.draw();
        int.dnd_initial_draw();
      })
      .catch(console.error);
  }, [config, isMultiple]);

  return (
    <div className="flex items-center justify-center w-full max-w-full overflow-hidden">
      <div ref={controlRef} className="diagram-controls" />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${isMultiple ? 640 : 900} ${isMultiple ? 240 : 300}`}
        className="w-full h-auto max-w-full drop-shadow-xl"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
          maxWidth: isMultiple ? '640px' : '900px',
          height: 'auto'
        }}
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default DiagramScale; 