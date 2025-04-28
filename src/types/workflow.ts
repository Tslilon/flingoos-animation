export interface WorkflowNode {
  id: string;
  label: string;
}

export interface Workflow {
  id: string;
  header: string;
  nodes: WorkflowNode[];
} 