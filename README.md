# PageIndex — Document Structure Visualizer

Implemented and visualized a novel **Page Indexing** framework (a next-generation RAG paradigm) that replaces flat vector retrieval with **hierarchical structural indexing** for improved document reasoning and contextual navigation.

## Overview

PageIndex parses PDF documents and generates a hierarchical JSON structure that captures the semantic organization of the document — sections, subsections, summaries, and page ranges. This visualizer renders that structure as an interactive, color-coded tree using **React** and **ReactFlow**, making it easy to explore and reason about document architecture at a glance.
Reference:https://github.com/VectifyAI/PageIndex
### Key Highlights

- **Hierarchical Structural Indexing** — moves beyond flat vector retrieval by preserving the document's native tree structure (sections → subsections → leaf content).
- **LLM-powered Summaries** — each node carries an AI-generated summary for rapid comprehension.
- **Interactive Tree Visualization** — expand/collapse subtrees, search by title, and zoom/pan through arbitrarily deep structures.
- **Depth-aware Color Coding** — root (blue/purple), level 1 (teal/cyan), level 2 (orange/amber), level 3 (pink/magenta), leaf nodes (green).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, ReactFlow 11, Dagre |
| Styling | Custom CSS, dark theme, glassmorphism |
| Data | PageIndex-generated JSON from PDF parsing |
| Layout | Dagre automatic graph layout (top → bottom) |

## Project Structure

```
src/
├── components/
│   ├── CustomNode.js          # Rich gradient node with metadata badges
│   ├── DocumentVisualizer.js   # Main ReactFlow canvas + controls
│   └── SearchBar.js            # Floating search with highlight
├── utils/
│   ├── colorSystem.js          # Depth-based gradient color palette
│   ├── graphBuilder.js         # JSON → ReactFlow nodes/edges converter
│   └── layoutEngine.js         # Dagre layout wrapper
├── styles/
│   └── visualizer.css          # Production-grade dark theme styles
├── App.js                      # Entry point
└── darshanpurohit_resume.json  # Sample PageIndex output
```
## OUTPUT
<img width="1470" height="885" alt="image" src="https://github.com/user-attachments/assets/50b9759d-856d-4ec0-aeb7-0bb97da2ec89" />

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Production build
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the visualizer.

## How It Works

1. **PDF Parsing** — PageIndex parses a PDF and extracts its hierarchical structure.
2. **JSON Generation** — The parsed structure is output as a nested JSON with section titles, page ranges, node IDs, and LLM-generated summaries.
3. **Graph Building** — `graphBuilder.js` recursively walks the JSON tree and creates ReactFlow nodes and edges with depth-aware color assignments.
4. **Automatic Layout** — `layoutEngine.js` uses Dagre to compute a clean top-to-bottom tree layout with no overlapping.
5. **Interactive Rendering** — `DocumentVisualizer.js` renders the tree with expand/collapse, search highlighting, minimap, and smooth zoom/pan.

## Features

- Collapsible subtrees (expand/collapse children)
- Search nodes by title with visual highlighting
- Full summary display on every node
- Animated edges with smooth step routing
- Responsive dark-themed UI
- MiniMap for large document navigation
- Color-coded legend

## License

HAO DARSHAN PUROHIT
