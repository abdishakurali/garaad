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
          const baseSize = isMultiple ? 36 : 48; // Increased from 28/36 to 36/48
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
              const triangleSize = size / 1.35;
              shape = dg
                .regular_polygon(3, triangleSize)
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
            const baseFontSize = obj.type === "trapezoid_weight" ? 18 : 15; // Increased from 16/12 to 18/15
            const fontSize = isMultiple ? baseFontSize * 0.9 : baseFontSize; // Changed from 0.8 to 0.9
            const txt = dg
              .textvar(String(obj.weight_value))
              .move_origin_text("center-center")
              .textfill("#FFFFFF") // White text
              .fontsize(fontSize);
            shape = dg.diagram_combine(shape, txt);
          }

          return shape;
        }

        int.draw_function = () => {
          const V2 = dg.V2;
          // Scale down elements when multiple diagrams are present - adjusted for larger items
          const scale = isMultiple ? 0.8 : 1.0; // Increased from 0.7 to 0.8

          // Calculate total objects to determine optimal spacing
          const totalObjects = config.objects.reduce((sum, obj) => sum + obj.number, 0);

          // Check if we need even tighter spacing for many objects (responsive adjustment)
          const isCrowded = totalObjects > 5;
          const responsiveScale = isCrowded ? 0.85 : 1.0; // Increased from 0.8 to 0.85

          // Dynamic spacing based on number of objects - adjusted for larger items
          const baseSpacing = Math.max(isMultiple ? 48 : 60, (isMultiple ? 240 : 320) / Math.max(totalObjects, 1)); // Increased spacing
          const spacing = baseSpacing * scale * responsiveScale;
          const groupSpacing = (isMultiple ? 25 : 30) * scale * responsiveScale; // Increased group spacing
          // Reduce groupSpacing for tighter grouping between types
          const reducedGroupSpacing = (isMultiple ? 12 : 16) * scale * responsiveScale; // Increased reduced spacing
          // Increased minimum spacing to ensure safe space between individual objects
          const sameTypeSpacing = Math.max(isMultiple ? 42 : 55, (isMultiple ? 200 : 280) / Math.max(totalObjects, 1)) * scale * responsiveScale; // Increased same type spacing

          // Check if this is a platform diagram
          const isPlatform = config.diagram_type === "platform";

          // Create platform-specific base elements
          let baseElements: any[] = [];

          if (isPlatform) {
            // Platform layout exactly like the attached image
            const platformWidth = isMultiple ? 200 : 260;
            const platformHeight = isMultiple ? 12 : 16;
            const platformOffset = isMultiple ? 180 : 240;

            // Positions - flipped: fulcrum at top, platforms at bottom
            const fulcrumY = isMultiple ? 15 : 20;            // Fulcrum at very top
            const beamY = isMultiple ? 120 : 140;             // Beam in middle  
            const platformY = isMultiple ? 170 : 200;         // Platforms at bottom

            // Horizontal beam in the middle
            const beamWidth = platformOffset * 2.2;
            const beamHeight = isMultiple ? 6 : 8;
            const beam = dg
              .rectangle(beamWidth, beamHeight)
              .fill("#333333") // Darker beam
              .stroke("#444444")
              .strokewidth(1)
              .position(V2(0, beamY));

            // Left platform (suspended above the beam)
            const leftPlatform = dg
              .rectangle(platformWidth, platformHeight)
              .apply(dg.mod.round_corner(3))
              .fill("#222222") // Darker platform
              .stroke("#444444")
              .strokewidth(1)
              .position(V2(-platformOffset, platformY));

            // Right platform (suspended above the beam)
            const rightPlatform = dg
              .rectangle(platformWidth, platformHeight)
              .apply(dg.mod.round_corner(3))
              .fill("#222222") // Darker platform
              .stroke("#444444")
              .strokewidth(1)
              .position(V2(platformOffset, platformY));

            // Support chains connecting platforms to beam
            const chainHeight = platformY - beamY - platformHeight / 2;
            const leftChain = dg
              .rectangle(isMultiple ? 4 : 6, chainHeight)
              .fill("#444444")
              .stroke("#555555")
              .strokewidth(1)
              .position(V2(-platformOffset, beamY + beamHeight / 2 + chainHeight / 2));

            const rightChain = dg
              .rectangle(isMultiple ? 4 : 6, chainHeight)
              .fill("#444444")
              .stroke("#555555")
              .strokewidth(1)
              .position(V2(platformOffset, beamY + beamHeight / 2 + chainHeight / 2));

            // Central fulcrum
            const fulcrum = dg
              .regular_polygon(3, isMultiple ? 24 : 32)
              .fill("#555555")
              .stroke("#666666")
              .strokewidth(1)
              .rotate(Math.PI)
              .position(V2(0, fulcrumY));

            // Fulcrum base
            const fulcrumBase = dg
              .rectangle(isMultiple ? 60 : 80, isMultiple ? 12 : 16)
              .apply(dg.mod.round_corner(3))
              .fill("#444444")
              .position(V2(0, fulcrumY - (isMultiple ? 28 : 36)));

            const connectionRadius = isMultiple ? 2 : 3;

            // Left connection points
            const leftBeamConnection = dg
              .circle(connectionRadius)
              .fill("#666666")
              .position(V2(-platformOffset, beamY + beamHeight / 2));

            const leftPlatformConnection = dg
              .circle(connectionRadius)
              .fill("#666666")
              .position(V2(-platformOffset, platformY - platformHeight / 2));

            // Right connection points
            const rightBeamConnection = dg
              .circle(connectionRadius)
              .fill("#666666")
              .position(V2(platformOffset, beamY + beamHeight / 2));

            const rightPlatformConnection = dg
              .circle(connectionRadius)
              .fill("#666666")
              .position(V2(platformOffset, platformY - platformHeight / 2));

            baseElements = [fulcrumBase, beam, leftChain, rightChain, leftPlatform, rightPlatform, fulcrum,
              leftBeamConnection, leftPlatformConnection, rightBeamConnection, rightPlatformConnection];
          } else {
            const scaleBaseY = isMultiple ? 15 : 20;
            const scaleWidth = isMultiple ? 380 : 500;

            const baseAccent = dg
              .rectangle(scaleWidth, isMultiple ? 5 : 6)
              .position(V2(0, scaleBaseY))
              .stroke("#444444")
              .strokewidth(isMultiple ? 5 : 6);

            const displayBg = dg
              .rectangle(isMultiple ? 40 : 50, isMultiple ? 28 : 35)
              .apply(dg.mod.round_corner(4))
              .fill("#000000") // Full black display
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
              .fill("#333333")
              .stroke("#444444")
              .strokewidth(1);

            const baseShape = dg
              .rectangle(scaleWidth, isMultiple ? 56 : 70)
              .apply(dg.mod.round_corner(8))
              .fill("#222222") // Darker base
              .stroke("#444444")
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
            const platformWidth = isMultiple ? 200 : 260;
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
                totalWidthNeeded += (typeGroupEntries.length - 1) * (reducedGroupSpacing * 2);
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

                // Special handling for trapezoid_weight not on platform
                if (
                  obj.type === "trapezoid_weight" &&
                  (!['left', 'right', 'center'].includes(obj.position))
                ) {
                  // Render reference weights at a fixed Y below the platform
                  const refY = (isMultiple ? 210 : 260); // visually below platform
                  const refX = currentTypeX; // keep X logic as before
                  for (let i = 0; i < totalShapes; i++) {
                    typeGroupShapes.push(baseShape.translate(V2(refX, refY)));
                  }
                  return; // skip normal arrangement
                }

                if (isPlatform) {
                  // Custom platform positioning system with enhanced design
                  const platformY = isMultiple ? 170 : 200;
                  const platformHeight = isMultiple ? 12 : 16;
                  const platformTopSurface = platformY - platformHeight / 2;

                  // Custom arrangement patterns based on object count and type
                  let arrangement: { x: number; y: number }[] = [];

                  if (totalShapes === 1) {
                    // Single object - center it
                    arrangement = [{ x: 0, y: 0 }];
                  } else if (totalShapes === 2) {
                    // Two objects - side by side with optimal spacing
                    const gap = obj.type === "trapezoid_weight" ?
                      (isMultiple ? 25 : 35) : (isMultiple ? 35 : 45);
                    arrangement = [
                      { x: -gap / 2, y: 0 },
                      { x: gap / 2, y: 0 }
                    ];
                  } else if (totalShapes === 3) {
                    // Three objects - two on the bottom, one centered above
                    const gap = obj.type === "trapezoid_weight" ?
                      (isMultiple ? 25 : 32) : (isMultiple ? 32 : 42);
                    const verticalGap = isMultiple ? 35 : 45;
                    arrangement = [
                      { x: -gap / 2, y: 0 }, // left bottom
                      { x: gap / 2, y: 0 },  // right bottom
                      { x: 0, y: -verticalGap } // top center
                    ];
                  } else if (totalShapes === 4) {
                    // Four objects - 2x2 grid or line based on orientation
                    const gap = obj.type === "trapezoid_weight" ?
                      (isMultiple ? 22 : 30) : (isMultiple ? 30 : 40);
                    const verticalGap = isMultiple ? 35 : 45;
                    if (obj.orientation === "horizontal") {
                      arrangement = [
                        { x: -gap * 1.5, y: 0 },
                        { x: -gap / 2, y: 0 },
                        { x: gap / 2, y: 0 },
                        { x: gap * 1.5, y: 0 }
                      ];
                    } else {
                      arrangement = [
                        { x: -gap / 2, y: 0 },
                        { x: gap / 2, y: 0 },
                        { x: -gap / 2, y: -verticalGap },
                        { x: gap / 2, y: -verticalGap }
                      ];
                    }
                  } else if (totalShapes === 5) {
                    // Five objects - pyramid formation
                    const gap = obj.type === "trapezoid_weight" ?
                      (isMultiple ? 20 : 28) : (isMultiple ? 28 : 38);
                    const verticalGap = isMultiple ? 32 : 42;
                    if (obj.orientation === "horizontal") {
                      arrangement = [
                        { x: -gap * 2, y: 0 },
                        { x: -gap, y: 0 },
                        { x: 0, y: 0 },
                        { x: gap, y: 0 },
                        { x: gap * 2, y: 0 }
                      ];
                    } else {
                      arrangement = [
                        { x: -gap, y: 0 },
                        { x: 0, y: 0 },
                        { x: gap, y: 0 },
                        { x: -gap / 2, y: -verticalGap },
                        { x: gap / 2, y: -verticalGap }
                      ];
                    }
                  } else {
                    // For 6+ objects, use optimized grid layout
                    const gap = obj.type === "trapezoid_weight" ?
                      (isMultiple ? 18 : 25) : (isMultiple ? 25 : 35);
                    const verticalGap = isMultiple ? 30 : 40;
                    let cols;

                    if (obj.orientation === "horizontal") {
                      cols = totalShapes;
                    } else if (obj.orientation === "vertical") {
                      cols = 1;
                    } else {
                      // Optimize for platform width
                      cols = Math.min(Math.ceil(Math.sqrt(totalShapes)), 4);
                    }

                    const totalWidth = (cols - 1) * gap;

                    for (let i = 0; i < totalShapes; i++) {
                      const row = Math.floor(i / cols);
                      const col = i % cols;
                      arrangement.push({
                        x: col * gap - totalWidth / 2,
                        y: -(row * verticalGap)
                      });
                    }
                  }

                  // Calculate base position for this object group
                  // Find the maximum Y offset in the arrangement (i.e., the lowest row)
                  const minYOffset = Math.min(...arrangement.map(pos => pos.y));
                  // Place the lowest row at the platform top
                  const baseY = platformTopSurface - (isMultiple ? 20 : -30) - minYOffset;

                  // Center the arrangement on the platform
                  let baseX;
                  if (isPlatform) {
                    // Platform type: use platform-specific positioning
                    const platformOffset = isMultiple ? 180 : 240; // Match the platform layout
                    if (position === "left") {
                      baseX = -platformOffset; // Center on left platform
                    } else if (position === "right") {
                      baseX = platformOffset; // Center on right platform
                    } else {
                      baseX = 0; // Center on middle
                    }
                  } else {
                    // Scale type: use the original positioning from positionStartX and currentTypeX
                    baseX = currentTypeX;
                  }

                  // Create shapes with custom arrangement
                  arrangement.forEach((pos, i) => {
                    if (i < totalShapes) {
                      const finalX = baseX + pos.x;
                      const finalY = baseY + pos.y;
                      typeGroupShapes.push(baseShape.translate(V2(finalX, finalY)));
                    }
                  });

                } else {
                  // Non-platform logic remains the same
                  let actualCols;
                  if (obj.orientation === "vertical") {
                    actualCols = 1;
                  } else if (obj.orientation === "horizontal") {
                    actualCols = totalShapes;
                  } else {
                    actualCols = Math.ceil(Math.sqrt(totalShapes));
                  }

                  const objectWidth = actualCols > 1 ?
                    (actualCols - 1) * sameTypeSpacing + (isMultiple ? 40 : 55) :
                    (isMultiple ? 40 : 55);

                  const baseY = isMultiple ? 35 : 50;
                  const scaleWidth = isMultiple ? 380 : 500;
                  const scaleLeftBound = -scaleWidth / 2;
                  const scaleRightBound = scaleWidth / 2;
                  const baseX = Math.max(scaleLeftBound, Math.min(scaleRightBound - objectWidth, currentTypeX - objectWidth / 2));

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
                    const y = baseY + (row * sameTypeSpacing);
                    typeGroupShapes.push(baseShape.translate(V2(x, y)));
                  }
                }
              });

              // Update currentTypeX for next type group with safe spacing
              if (isPlatform) {
                currentTypeX += typeGroupWidth + (reducedGroupSpacing * 2);
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