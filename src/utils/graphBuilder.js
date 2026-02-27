/**
 * Graph builder: Converts PageIndex JSON structure into ReactFlow nodes and edges.
 * Handles arbitrary nesting depth, assigns colors dynamically, and tracks hierarchy.
 */
import { getNodeColor } from './colorSystem';
import { applyDagreLayout } from './layoutEngine';

/**
 * Build ReactFlow graph from PageIndex JSON data.
 * @param {Object} jsonData - The parsed PageIndex JSON
 * @returns {{ nodes: Array, edges: Array, maxDepth: number }}
 */
export function buildGraph(jsonData) {
  const nodes = [];
  const edges = [];
  let idCounter = 0;
  let maxDepth = 0;

  /**
   * Create a node with metadata.
   */
  function createNode({ title, summary, startIndex, endIndex, nodeId, depth, isLeaf, hasChildren }) {
    const id = `node-${idCounter++}`;
    const colors = getNodeColor(depth, isLeaf);

    nodes.push({
      id,
      type: 'customNode',
      data: {
        title,
        summary: summary || '',
        startIndex,
        endIndex,
        nodeId: nodeId || '',
        depth,
        isLeaf,
        hasChildren,
        hasSummary: !!summary,
        colors,
        isRoot: depth === 0,
      },
      position: { x: 0, y: 0 },
    });

    return id;
  }

  // Create root node from doc_name
  const rootId = createNode({
    title: jsonData.doc_name || 'Untitled Document',
    summary: '',
    startIndex: null,
    endIndex: null,
    nodeId: 'ROOT',
    depth: 0,
    isLeaf: !jsonData.structure || jsonData.structure.length === 0,
    hasChildren: jsonData.structure && jsonData.structure.length > 0,
  });

  /**
   * Recursively traverse the JSON structure and build nodes/edges.
   */
  function traverse(node, parentId, depth) {
    if (depth > maxDepth) maxDepth = depth;

    const hasChildren = node.nodes && node.nodes.length > 0;
    const isLeaf = !hasChildren;

    const newNodeId = createNode({
      title: node.title,
      summary: node.summary,
      startIndex: node.start_index,
      endIndex: node.end_index,
      nodeId: node.node_id,
      depth,
      isLeaf,
      hasChildren,
    });

    edges.push({
      id: `edge-${parentId}-${newNodeId}`,
      source: parentId,
      target: newNodeId,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: 'rgba(148, 163, 184, 0.5)',
        strokeWidth: 2,
      },
    });

    if (hasChildren) {
      node.nodes.forEach((child) => traverse(child, newNodeId, depth + 1));
    }
  }

  // Traverse all top-level sections
  if (jsonData.structure) {
    jsonData.structure.forEach((section) => {
      traverse(section, rootId, 1);
    });
  }

  // Apply Dagre layout
  const layouted = applyDagreLayout(nodes, edges);

  return {
    nodes: layouted.nodes,
    edges: layouted.edges,
    maxDepth,
  };
}

/**
 * Get all node IDs that are children (direct + indirect) of a given node.
 * Used for collapse/expand functionality.
 */
export function getDescendantIds(nodeId, edges) {
  const descendants = new Set();
  const queue = [nodeId];

  while (queue.length > 0) {
    const current = queue.shift();
    edges.forEach((edge) => {
      if (edge.source === current && !descendants.has(edge.target)) {
        descendants.add(edge.target);
        queue.push(edge.target);
      }
    });
  }

  return descendants;
}
