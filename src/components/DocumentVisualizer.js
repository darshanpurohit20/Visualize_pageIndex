/**
 * DocumentVisualizer - Main ReactFlow-based tree visualization component.
 * Integrates graph building, layout, search, and collapse/expand logic.
 */
import React, { useMemo, useState, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CustomNode from './CustomNode';
import SearchBar from './SearchBar';
import { buildGraph, getDescendantIds } from '../utils/graphBuilder';
import '../styles/visualizer.css';

// Register custom node types
const nodeTypes = { customNode: CustomNode };

const DocumentVisualizer = ({ jsonData, jsonFiles, selectedIndex, onSelectFile }) => {
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Build the full graph once from JSON data
  const { nodes: allNodes, edges: allEdges } = useMemo(
    () => buildGraph(jsonData),
    [jsonData]
  );

  // Collect all hidden node IDs (descendants of collapsed nodes)
  const hiddenNodeIds = useMemo(() => {
    const hidden = new Set();
    collapsedNodes.forEach((nodeId) => {
      const descendants = getDescendantIds(nodeId, allEdges);
      descendants.forEach((id) => hidden.add(id));
    });
    return hidden;
  }, [collapsedNodes, allEdges]);

  // Search: find matching node IDs
  const highlightedNodeIds = useMemo(() => {
    if (!searchQuery.trim()) return new Set();
    const q = searchQuery.toLowerCase();
    const matches = new Set();
    allNodes.forEach((node) => {
      if (node.data.title && node.data.title.toLowerCase().includes(q)) {
        matches.add(node.id);
      }
    });
    return matches;
  }, [searchQuery, allNodes]);

  // Toggle collapse handler
  const handleToggleCollapse = useCallback(
    (nodeId) => {
      setCollapsedNodes((prev) => {
        const next = new Set(prev);
        if (next.has(nodeId)) {
          next.delete(nodeId);
        } else {
          next.add(nodeId);
        }
        return next;
      });
    },
    []
  );

  // Filter visible nodes and inject dynamic data (highlight, collapse state)
  const visibleNodes = useMemo(() => {
    return allNodes
      .filter((node) => !hiddenNodeIds.has(node.id))
      .map((node) => ({
        ...node,
        data: {
          ...node.data,
          isHighlighted: highlightedNodeIds.has(node.id),
          isCollapsed: collapsedNodes.has(node.id),
          onToggleCollapse: () => handleToggleCollapse(node.id),
        },
      }));
  }, [allNodes, hiddenNodeIds, highlightedNodeIds, collapsedNodes, handleToggleCollapse]);

  // Filter visible edges
  const visibleEdges = useMemo(() => {
    return allEdges.filter(
      (edge) => !hiddenNodeIds.has(edge.source) && !hiddenNodeIds.has(edge.target)
    );
  }, [allEdges, hiddenNodeIds]);

  const [nodes, setNodes, onNodesChange] = useNodesState(visibleNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(visibleEdges);

  // Sync state when visible nodes/edges change
  React.useEffect(() => {
    setNodes(visibleNodes);
  }, [visibleNodes, setNodes]);

  React.useEffect(() => {
    setEdges(visibleEdges);
  }, [visibleEdges, setEdges]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // MiniMap node color based on depth
  const minimapNodeColor = useCallback((node) => {
    if (!node.data?.colors) return '#64748b';
    return node.data.colors.border;
  }, []);

  return (
    <div className="visualizer-container">
      {/* Header bar */}
      <div className="visualizer-header">
        <div className="header-left">
          <h1 className="header-title">
            <span className="header-icon">🌳</span>
            PageIndex Document Visualizer
          </h1>
          <span className="header-subtitle">
            {jsonData.doc_name} &bull; {allNodes.length} nodes
          </span>
        </div>

        <div className="header-right">
          {/* File selector */}
          {jsonFiles && jsonFiles.length > 1 && (
            <div className="file-selector">
              <label className="file-selector-label">📂</label>
              <select
                className="file-selector-dropdown"
                value={selectedIndex}
                onChange={(e) => onSelectFile(Number(e.target.value))}
              >
                {jsonFiles.map((file, idx) => (
                  <option key={idx} value={idx}>
                    {file.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Search results count */}
      {searchQuery && (
        <div className="search-results-badge">
          {highlightedNodeIds.size} match{highlightedNodeIds.size !== 1 ? 'es' : ''} found
        </div>
      )}

      {/* ReactFlow Canvas */}
      <div className="flow-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
          minZoom={0.1}
          maxZoom={2}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
        >
          <Controls
            className="custom-controls"
            showInteractive={false}
          />
          <MiniMap
            className="custom-minimap"
            nodeColor={minimapNodeColor}
            maskColor="rgba(15, 23, 42, 0.7)"
            style={{
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid rgba(100, 116, 139, 0.3)',
              borderRadius: '12px',
            }}
          />
          <Background
            color="rgba(100, 116, 139, 0.15)"
            gap={24}
            size={1.5}
          />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="visualizer-legend">
        <span className="legend-item">
          <span className="legend-dot" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />
          Root
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: 'linear-gradient(135deg, #0891b2, #22d3ee)' }} />
          Level 1
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }} />
          Level 2
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: 'linear-gradient(135deg, #ec4899, #d946ef)' }} />
          Level 3
        </span>
        <span className="legend-item">
          <span className="legend-dot" style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }} />
          Leaf
        </span>
      </div>
    </div>
  );
};

export default DocumentVisualizer;
