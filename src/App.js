import React from "react";
import jsonData from "./darshanpurohit_resume.json";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";

const jsonData = YOUR_JSON_HERE; // paste your JSON

const nodeWidth = 450;
const nodeHeight = 250;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

function layoutElements(nodes, edges) {
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
}

function buildGraph(data) {
  let nodes = [];
  let edges = [];
  let idCounter = 0;

  function createNode(title, summary, start, end, nodeId) {
    const id = `node-${idCounter++}`;
    nodes.push({
      id,
      data: {
        label: (
          <div style={{ width: 400 }}>
            <h3>{title}</h3>
            <p><b>Start:</b> {start}</p>
            <p><b>End:</b> {end}</p>
            <p><b>ID:</b> {nodeId}</p>
            <p style={{ whiteSpace: "pre-wrap" }}>{summary}</p>
          </div>
        ),
      },
      position: { x: 0, y: 0 },
      style: {
        background: "#1e1e1e",
        color: "white",
        padding: 15,
        borderRadius: 12,
        border: "1px solid #444",
      },
    });
    return id;
  }

  // ROOT NODE
  const rootId = createNode(data.doc_name, "", "", "", "ROOT");

  function traverse(node, parentId) {
    const nodeId = createNode(
      node.title,
      node.summary,
      node.start_index,
      node.end_index,
      node.node_id
    );

    edges.push({
      id: `${parentId}-${nodeId}`,
      source: parentId,
      target: nodeId,
    });

    if (node.nodes) {
      node.nodes.forEach((child) => traverse(child, nodeId));
    }
  }

  data.structure.forEach((section) => {
    traverse(section, rootId);
  });

  return layoutElements(nodes, edges);
}

export default function App() {
  const { nodes: initialNodes, edges: initialEdges } = buildGraph(jsonData);
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ height: "100vh", background: "#0f0f0f" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background color="#333" gap={16} />
      </ReactFlow>
    </div>
  );
}