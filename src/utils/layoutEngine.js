/**
 * Dagre-based layout engine for the document structure tree.
 * Handles automatic positioning of nodes in a top-to-bottom hierarchy.
 */
import dagre from 'dagre';

const NODE_WIDTH = 420;
const NODE_BASE_HEIGHT = 120;
const RANK_SEP = 100;
const NODE_SEP = 60;

/**
 * Estimate node height based on content.
 * Nodes with expanded summaries are taller.
 */
function estimateNodeHeight(node) {
  let height = NODE_BASE_HEIGHT;
  if (node.data?.hasSummary) {
    height += 40; // collapsed summary toggle button area
  }
  return height;
}

/**
 * Apply Dagre layout to position nodes in a top-to-bottom tree.
 * @param {Array} nodes - ReactFlow nodes
 * @param {Array} edges - ReactFlow edges
 * @param {string} direction - Layout direction ('TB' = top-bottom)
 * @returns {{ nodes: Array, edges: Array }}
 */
export function applyDagreLayout(nodes, edges, direction = 'TB') {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: RANK_SEP,
    nodesep: NODE_SEP,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    const height = estimateNodeHeight(node);
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const height = estimateNodeHeight(node);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - height / 2,
      },
      style: {
        ...node.style,
        width: NODE_WIDTH,
        height: 'auto',
        overflow: 'visible',
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}

export { NODE_WIDTH, NODE_BASE_HEIGHT };
