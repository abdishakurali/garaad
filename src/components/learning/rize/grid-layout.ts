// move to libs
import { NodeData } from "./LearningPathNode";

export function calculateGridLayout(nodes: NodeData[]): [number, number] {
  // Calculate required grid size based on node positions
  const maxColumn = Math.max(...nodes.map((node) => node.position.column));
  const maxRow = Math.max(...nodes.map((node) => node.position.row));

  // Return [columns, rows] adding 1 because positions are 1-based
  return [maxColumn + 1, maxRow + 1];
}

// Alternative implementation for dynamic spacing:
export function calculateDynamicGridLayout(
  nodes: NodeData[],
  spacing = 2
): [number, number] {
  const columns = new Set<number>();
  const rows = new Set<number>();

  nodes.forEach((node) => {
    columns.add(node.position.column);
    rows.add(node.position.row);
  });

  return [
    Math.max(...Array.from(columns)) + spacing,
    Math.max(...Array.from(rows)) + spacing,
  ];
}
