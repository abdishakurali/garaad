/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";

// Types
type Position = "left" | "center" | "right";
type Orientation = "vertical" | "horizontal" | "none";

interface DiagramObject {
  type: string;
  color: string;
  number: number;
  position: Position;
  orientation: Orientation;
  weight_value?: number;
}

interface DiagramConfig {
  diagram_id: number;
  diagram_type: string;
  scale_weight: number;
  objects: DiagramObject[];
}

const DiagramScale: React.FC<{ config: DiagramConfig }> = ({ config }) => {
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

        const baseAccent = dg
          .rectangle(240, 4)
          .position(V2(0, 0))
          .stroke("#999999")
          .strokewidth(5);

        const displayBg = dg
          .rectangle(40, 30)
          .apply(dg.mod.round_corner(2))
          .fill("#222222")
          .position(V2(0, -45));

        const displayText = dg
          .textvar(String(config.scale_weight))
          .move_origin_text("center-center")
          .position(V2(0, -45))
          .textfill("white")
          .fontsize(13);

        const pivot = dg
          .rectangle(70, 10)
          .apply(dg.mod.round_corner(4))
          .position(V2(0, -10))
          .fill("#555555");

        const baseShape = dg
          .rectangle(180, 60)
          .apply(dg.mod.round_corner(6))
          .fill("#666666")
          .stroke("#333333")
          .strokewidth(2)
          .position(V2(0, -45));

        function makeShape(obj: DiagramObject) {
          const size = 40;
          let shape: any;
          switch (obj.type) {
            case "cube": {
              const fill = dg
                .square(size)
                .apply(dg.mod.round_corner(5))
                .fill(obj.color)
                .stroke("none");
              const outline = dg
                .square(size)
                .apply(dg.mod.round_corner(8))
                .stroke("black")
                .strokewidth(1)
                .fill("none");
              const glint = dg
                .circle(1)
                .fill("white")
                .opacity(0.8)
                .position(V2(-size / 2 + 6, -size / 2 + 6));
              shape = dg.diagram_combine(fill, outline, glint);
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
                .regular_polygon(5, size / 2 + 5)
                .fill(obj.color || "#ccc")
                .stroke("#333")
                .strokewidth(2);
              break;
            }
            default: {
              shape = dg.square(size).fill(obj.color).stroke("none");
            }
          }
          if (obj.weight_value != null) {
            const txt = dg
              .textvar(String(obj.weight_value))
              .move_origin_text("center-center")
              .textfill("black")
              .fontsize(12);
            shape = dg.diagram_combine(shape, txt);
          }
          return shape;
        }

        int.draw_function = () => {
          const V2 = dg.V2;
          const spacing = 50; // horizontal gap between object‐groups

          // 1. Build an index map of which config.objects belong to each position
          const groups: Record<Position, number[]> = config.objects.reduce(
            (acc, obj, idx) => {
              acc[obj.position] = acc[obj.position] ?? [];
              acc[obj.position].push(idx);
              return acc;
            },
            {} as Record<Position, number[]>
          );

          // 2. For each object‐definition, compute a base offset V2(x, y)
          const allShapes = config.objects.flatMap((obj, objIdx) => {
            // find this object’s group and its index within that group
            const group = groups[obj.position];
            const groupIndex = group.indexOf(objIdx);
            const groupSize = group.length;

            // center the whole group around X=0
            const startX = -((groupSize - 1) * spacing) / 2;
            const xBase = startX + groupIndex * spacing;
            const yBase = 25; // your existing vertical offset

            // build the shape once
            const baseShape = makeShape(obj);

            // now create its numbered copies with orientation & group offset
            return Array.from({ length: obj.number }).map((_, i) => {
              let inst = baseShape;
              if (obj.orientation === "vertical") {
                inst = inst.translate(V2(0, i * 40));
              } else if (obj.orientation === "horizontal") {
                inst = inst.translate(V2(-i * 40, 0));
              }
              // finally shift by the computed group offset
              return inst.translate(V2(xBase, yBase));
            });
          });

          draw(
            baseAccent,
            ...allShapes,
            baseShape,
            pivot,
            displayBg,
            displayText
          );
        };

        int.draw();
        int.dnd_initial_draw();
      })
      .catch(console.error);
  }, [config]);

  return (
    <div className="flex items-center justify-center">
      <div ref={controlRef} className="diagram-controls" />
      <svg ref={svgRef} width="350" height="190" />
    </div>
  );
};

export default DiagramScale;
