/**
 * CustomNode - A rich, colorful node component for the document structure tree.
 * Features: gradient backgrounds, full summary display, hover glow, metadata badges.
 */
import React, { useState, memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = memo(({ data, selected }) => {
  const [summaryExpanded, setSummaryExpanded] = useState(false);
  const {
    title,
    summary,
    startIndex,
    endIndex,
    nodeId,
    depth,
    isRoot,
    hasChildren,
    colors,
    isHighlighted,
    isCollapsed,
    onToggleCollapse,
  } = data;

  const toggleSummary = useCallback((e) => {
    e.stopPropagation();
    setSummaryExpanded((prev) => !prev);
  }, []);

  const handleCollapse = useCallback((e) => {
    e.stopPropagation();
    if (onToggleCollapse) onToggleCollapse();
  }, [onToggleCollapse]);

  const hasMeta = startIndex != null || endIndex != null || nodeId;

  return (
    <div
      className={`custom-node ${selected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      style={{
        background: colors.gradient,
        borderColor: isHighlighted ? '#fbbf24' : colors.border,
        boxShadow: isHighlighted
          ? `0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 191, 36, 0.3)`
          : `0 4px 20px rgba(0, 0, 0, 0.3)`,
        height: 'auto',
        overflow: 'visible',
      }}
    >
      {/* Target handle (incoming edge) - not shown on root */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Top}
          className="node-handle"
          style={{ background: colors.border }}
        />
      )}

      {/* Header row with title and action buttons */}
      <div className="node-header">
        <div className="node-title-row">
          {isRoot && <span className="root-icon">📄</span>}
          {!isRoot && depth === 1 && <span className="section-icon">📑</span>}
          <h3 className="node-title" style={{ color: colors.text }}>
            {title}
          </h3>
        </div>

        <div className="node-actions">
          {hasChildren && (
            <button
              className="action-btn collapse-btn"
              onClick={handleCollapse}
              title={isCollapsed ? 'Expand children' : 'Collapse children'}
            >
              {isCollapsed ? '▶' : '▼'}
            </button>
          )}
        </div>
      </div>

      {/* Metadata badges */}
      {hasMeta && !isRoot && (
        <div className="node-meta">
          {nodeId && (
            <span className="meta-badge" style={{ background: colors.badge }}>
              ID: {nodeId}
            </span>
          )}
          {startIndex != null && (
            <span className="meta-badge" style={{ background: colors.badge }}>
              Start: {startIndex}
            </span>
          )}
          {endIndex != null && (
            <span className="meta-badge" style={{ background: colors.badge }}>
              End: {endIndex}
            </span>
          )}
        </div>
      )}

      {/* Depth indicator */}
      {!isRoot && (
        <div className="depth-indicator" style={{ color: colors.meta }}>
          Depth: {depth}
        </div>
      )}

      {/* Summary section - toggle button, no scroll when expanded */}
      {summary && (
        <div className="node-summary-section">
          <button
            className="summary-toggle"
            onClick={toggleSummary}
            style={{ color: colors.meta }}
          >
            {summaryExpanded ? '▾ Hide Summary' : '▸ Show Summary'}
          </button>
          {summaryExpanded && (
            <div className="node-summary" style={{ color: colors.meta }}>
              <p>{summary}</p>
            </div>
          )}
        </div>
      )}

      {/* Source handle (outgoing edge) - only if has children */}
      {hasChildren && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="node-handle"
          style={{ background: colors.border }}
        />
      )}
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

export default CustomNode;
