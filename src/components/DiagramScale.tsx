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
          .rectangle(300, 6)
          .position(V2(0, 0))
          .stroke("#777777")
          .strokewidth(6);

        const displayBg = dg
          .rectangle(50, 35)
          .apply(dg.mod.round_corner(4))
          .fill("#1a1a1a")
          .position(V2(0, -55));

        const displayText = dg
          .textvar(String(config.scale_weight))
          .move_origin_text("center-center")
          .position(V2(0, -55))
          .textfill("white")
          .fontsize(16);
        const pivot = dg
          .rectangle(90, 12)
          .apply(dg.mod.round_corner(5))
          .position(V2(0, -12))
          .fill("#444444")
          .stroke("#333333")
          .strokewidth(1);

        const baseShape = dg
          .rectangle(220, 70)
          .apply(dg.mod.round_corner(8))
          .fill("#555555")
          .stroke("#333333")
          .strokewidth(2)
          .position(V2(0, -50));

        function makeShape(obj: DiagramObject) {
          const size = 50;
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
          // Restore vertical stacking logic for objects
          const groups: Record<Position, number[]> = config.objects.reduce(
            (acc, obj, idx) => {
              acc[obj.position] = acc[obj.position] ?? [];
              acc[obj.position].push(idx);
              return acc;
            },
            {} as Record<Position, number[]>
          );

          const spacing = 70;
          const yBase = 35;
          const allShapes = config.objects.flatMap((obj, objIdx) => {
            // find this object's group and its index within that group
            const group = groups[obj.position];
            const groupIndex = group.indexOf(objIdx);
            const groupSize = group.length;

            // center the whole group around X=0
            const startX = -((groupSize - 1) * spacing) / 2;
            const xBase = startX + groupIndex * spacing;

            // build the shape once
            const baseShape = makeShape(obj);

            // now create its numbered copies with orientation & group offset
            return Array.from({ length: obj.number }).map((_, i) => {
              let inst = baseShape;
              if (obj.orientation === "vertical") {
                inst = inst.translate(V2(0, i * 50));
              } else if (obj.orientation === "horizontal") {
                inst = inst.translate(V2(i * 50, 0));
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
      <svg
        ref={svgRef}
        width="400"
        height="250"
        className="drop-shadow-xl"
        style={{
          filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
        }}
      />
    </div>
  );
};

export default DiagramScale;
