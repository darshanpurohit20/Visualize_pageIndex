/**
 * Color system for PageIndex Document Structure Visualizer.
 * Dynamically assigns gradient colors based on node depth in the tree.
 */

const DEPTH_COLORS = [
  {
    // Root node → Gradient Blue/Purple
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    border: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.4)',
    text: '#ffffff',
    meta: 'rgba(255, 255, 255, 0.7)',
    badge: 'rgba(255, 255, 255, 0.15)',
  },
  {
    // First level sections → Teal / Cyan
    gradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)',
    border: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.4)',
    text: '#ffffff',
    meta: 'rgba(255, 255, 255, 0.75)',
    badge: 'rgba(255, 255, 255, 0.15)',
  },
  {
    // Second level → Orange / Amber
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
    border: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
    text: '#ffffff',
    meta: 'rgba(255, 255, 255, 0.75)',
    badge: 'rgba(255, 255, 255, 0.15)',
  },
  {
    // Third level → Pink / Magenta
    gradient: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)',
    border: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.4)',
    text: '#ffffff',
    meta: 'rgba(255, 255, 255, 0.75)',
    badge: 'rgba(255, 255, 255, 0.15)',
  },
  {
    // Fourth level & beyond → Light Green
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
    border: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
    text: '#ffffff',
    meta: 'rgba(255, 255, 255, 0.75)',
    badge: 'rgba(255, 255, 255, 0.15)',
  },
];

/**
 * Get color scheme for a given depth level.
 * Depths beyond the defined palette will use the last color (leaf green).
 */
export function getColorForDepth(depth) {
  if (depth < 0) return DEPTH_COLORS[0];
  if (depth >= DEPTH_COLORS.length) return DEPTH_COLORS[DEPTH_COLORS.length - 1];
  return DEPTH_COLORS[depth];
}

/**
 * Check if a node is a leaf (has no children).
 * Leaf nodes always get the green color regardless of depth.
 */
export function getNodeColor(depth, isLeaf) {
  if (isLeaf) return DEPTH_COLORS[DEPTH_COLORS.length - 1];
  return getColorForDepth(depth);
}

export default DEPTH_COLORS;
