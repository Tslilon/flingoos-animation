export interface WorkflowStep {
  id: string;
  label: string;
  icon?: string; // Optional icon name
}

export interface Workflow {
  id: string;
  header: string;
  steps: WorkflowStep[];
}

export const workflows: Workflow[] = [
  {
    id: 'invoice-processing',
    header: 'Invoice Processing',
    steps: [
      { id: 'invoice-1', label: 'Receive Invoice', icon: 'document' },
      { id: 'invoice-2', label: 'Extract Data', icon: 'data' },
      { id: 'invoice-3', label: 'Match to PO', icon: 'search' },
      { id: 'invoice-4', label: 'Approve', icon: 'check' },
      { id: 'invoice-5', label: 'Book in ERP', icon: 'database' }
    ]
  },
  {
    id: 'client-onboarding',
    header: 'Client Onboarding',
    steps: [
      { id: 'client-1', label: 'Gather Documents', icon: 'clipboard' },
      { id: 'client-2', label: 'Identity Verification', icon: 'shield' },
      { id: 'client-3', label: 'Compliance Check', icon: 'check-circle' },
      { id: 'client-4', label: 'Create Account', icon: 'user-plus' }
    ]
  },
  {
    id: 'expense-approval',
    header: 'Expense Approval',
    steps: [
      { id: 'expense-1', label: 'Submit Request', icon: 'file-plus' },
      { id: 'expense-2', label: 'Manager Review', icon: 'eye' },
      { id: 'expense-3', label: 'Finance Audit', icon: 'dollar-sign' },
      { id: 'expense-4', label: 'Payment Initiated', icon: 'credit-card' }
    ]
  },
  {
    id: 'audit-prep',
    header: 'Audit Prep',
    steps: [
      { id: 'audit-1', label: 'Pull Data', icon: 'download' },
      { id: 'audit-2', label: 'Organize Accounts', icon: 'folder' },
      { id: 'audit-3', label: 'Flag Exceptions', icon: 'flag' },
      { id: 'audit-4', label: 'Generate Report', icon: 'file-text' }
    ]
  },
  {
    id: 'data-reconciliation',
    header: 'Data Reconciliation',
    steps: [
      { id: 'data-1', label: 'Import Bank Feed', icon: 'upload' },
      { id: 'data-2', label: 'Cross-check Ledger', icon: 'layers' },
      { id: 'data-3', label: 'Identify Mismatches', icon: 'alert-triangle' },
      { id: 'data-4', label: 'Resolve Issues', icon: 'check-square' }
    ]
  }
]; 