export interface ArchitectureNode {
  id: string;
  label: string;
  type: string;
  group?: string;
}

export interface ArchitectureEdge {
  source: string;
  target: string;
  label?: string;
}

export interface ArchitectureData {
  summary: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  reasons?: string[];
}
