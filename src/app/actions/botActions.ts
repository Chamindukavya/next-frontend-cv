"use server"


const AGENT_URL = process.env.AGENT_URL || "";
const ARCHITECTURE_URL = process.env.ARCHITECTURE_URL?.trim();

function ensureAgentUrl() {
  if (!AGENT_URL) {
    throw new Error("AGENT_URL environment variable is missing. Please set it in your .env file.");
  }
  try {
    new URL(AGENT_URL);
  } catch {
    throw new Error(`AGENT_URL is not a valid absolute URL: ${AGENT_URL}`);
  }
}

export async function getResponse(message: string[]) {
  ensureAgentUrl();
  const data = JSON.stringify({ messages: message })
  const res = await fetch(AGENT_URL + "/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data ,
  });


  const reader = res.body?.getReader();
  const decoder = new TextDecoder();
  return {
    async *[Symbol.asyncIterator]() {
      if (!reader) return;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value, { stream: true });
      }
    },
  };
}

// Sample architecture fallback (used if backend not reachable)
const SAMPLE_ARCHITECTURE = {
  summary: "Proposed architecture for AI-assisted Software Engineering Workbench",
  nodes: [
    { id: "frontend", label: "Next.js Frontend", type: "frontend", group: "presentation" },
    { id: "backend", label: "FastAPI Backend", type: "service", group: "application" },
    { id: "workflow", label: "Workflow Engine", type: "service", group: "application" },
    { id: "vector", label: "Vector DB", type: "database", group: "data" },
    { id: "cache", label: "Redis Cache", type: "cache", group: "data" },
    { id: "llm", label: "LLM Provider", type: "external", group: "integration" },
  ],
  edges: [
    { source: "frontend", target: "backend", label: "User Requirements / Queries" },
    { source: "backend", target: "workflow", label: "Design Orchestration" },
    { source: "workflow", target: "vector", label: "Semantic Retrieval" },
    { source: "workflow", target: "cache", label: "Intermediate State" },
    { source: "workflow", target: "llm", label: "Prompted Generation" },
    { source: "backend", target: "vector", label: "Store Artifacts" },
  ],
  reasons: [
    "FastAPI chosen for async performance and Python AI ecosystem.",
    "Vector DB enables semantic retrieval of past design artifacts.",
    "Workflow engine coordinates multi-step design generation.",
    "Redis accelerates iterative refinement cycles.",
    "External LLM provides generative reasoning for architectures.",
  ]
};


// Map backend response to frontend ArchitectureData shape expected by ArchitectureDiagram
type RFNode = { id: string; data?: { label?: string }; type?: string };
type RFEdge = { source: string; target: string; label?: string };
function toArchitectureData(resp: any) {
  const rf = resp?.react_flow || {};
  const nodes = (rf.nodes as RFNode[] | undefined)?.map(n => ({
    id: n.id,
    label: (n.data?.label as string) || n.id,
    type: n.type || 'default',
  })) || [];
  const edges = (rf.edges as RFEdge[] | undefined)?.map(e => ({
    source: e.source,
    target: e.target,
    label: e.label,
  })) || [];
  const summary: string = resp?.reasoning || (resp?.architecture_style ? `Style: ${resp.architecture_style}` : 'Proposed architecture');
  const reasons: string[] | undefined = resp?.architecture_style ? [`Architecture style: ${resp.architecture_style}`] : undefined;
  return { summary, nodes, edges, reasons };
}

export async function getArchitecture(requirements: string) {
  try {
    ensureAgentUrl();
    const res = await fetch(AGENT_URL + "/architecture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requirements })
    });
    if (!res.ok) throw new Error(`Backend returned ${res.status}`);
    const json = await res.json();
    return toArchitectureData(json);
  } catch (e) {
    // Fallback to sample to allow UI development without backend
    console.warn("Using SAMPLE_ARCHITECTURE due to error:", e);
    return SAMPLE_ARCHITECTURE;
  }
}
