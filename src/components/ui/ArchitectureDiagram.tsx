"use client";
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, applyNodeChanges, applyEdgeChanges, type Node, type Edge, type NodeChange, type EdgeChange } from 'reactflow';
import 'reactflow/dist/style.css';
import type { ArchitectureData } from '@/app/types/architecture';

interface Props {
  data: ArchitectureData;
  height?: number;
}

// Simple auto layout: place nodes on a circle
function useLayout(data: ArchitectureData) {
  return useMemo(() => {
    const radius = 180;
    const centerX = 250;
    const centerY = 200;
    const count = data.nodes.length || 1;
    const nodes: Node[] = data.nodes.map((n, i) => {
      const angle = (2 * Math.PI * i) / count;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return {
        id: n.id,
        position: { x, y },
        data: { label: n.label },
        type: 'default',
        style: {
          padding: 12,
          borderRadius: 12,
          border: '1px solid var(--border)',
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          fontSize: 12,
          minWidth: 120,
          textAlign: 'center',
          boxShadow: '0 6px 12px rgba(2,6,23,0.3)'
        }
      };
    });

    const edges: Edge[] = data.edges.map((e, idx) => ({
      id: `e-${idx}-${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      label: e.label,
      animated: true,
      style: { stroke: 'var(--chart-1)' },
      labelStyle: { fontSize: 10, fill: 'var(--foreground)' }
    }));

    return { nodes, edges };
  }, [data]);
}

export const ArchitectureDiagram: React.FC<Props> = ({ data, height = 500 }) => {
  const layout = useLayout(data);
  const [nodes, setNodes] = useState<Node[]>(layout.nodes);
  const [edges, setEdges] = useState<Edge[]>(layout.edges);

  // When incoming data changes, reset nodes/edges to new layout (draggable afterward)
  useEffect(() => {
    setNodes(layout.nodes);
    setEdges(layout.edges);
  }, [layout.nodes, layout.edges]);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  return (
    <div className="w-full border rounded-xl shadow-sm overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
      <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--card-foreground)' }}>Architecture Diagram</h3>
        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Auto-generated layout. Drag to reposition if desired.</p>
      </div>
      <div style={{ width: '100%', height }}>
        <ReactFlow 
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodesDraggable
          fitView 
          minZoom={0.2}
        >
          <Background gap={16} size={1} />
          <Controls />
          <MiniMap zoomable pannable />
        </ReactFlow>
      </div>
      {data.reasons?.length ? (
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--popover)' }}>
          <h4 className="text-xs font-semibold mb-2" style={{ color: 'var(--card-foreground)' }}>Design Rationale</h4>
          <ul className="space-y-1 list-disc list-inside text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {data.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default ArchitectureDiagram;
