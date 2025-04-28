import { Workflow } from '../types/workflow';

export const workflows: Workflow[] = [
  {
    id: 'invoice-processing',
    header: 'Invoice Processing',
    nodes: [
      { id: 'ip-1', label: 'Receive Invoice' },
      { id: 'ip-2', label: 'Extract Data' },
      { id: 'ip-3', label: 'Match to PO' },
      { id: 'ip-4', label: 'Approve' },
      { id: 'ip-5', label: 'Book in ERP' }
    ]
  },
  {
    id: 'client-onboarding',
    header: 'Client Onboarding',
    nodes: [
      { id: 'co-1', label: 'Gather Documents' },
      { id: 'co-2', label: 'Identity Verification' },
      { id: 'co-3', label: 'Compliance Check' },
      { id: 'co-4', label: 'Create Account' }
    ]
  },
  {
    id: 'expense-approval',
    header: 'Expense Approval',
    nodes: [
      { id: 'ea-1', label: 'Submit Request' },
      { id: 'ea-2', label: 'Manager Review' },
      { id: 'ea-3', label: 'Finance Audit' },
      { id: 'ea-4', label: 'Payment Initiated' }
    ]
  },
  {
    id: 'audit-prep',
    header: 'Audit Prep',
    nodes: [
      { id: 'ap-1', label: 'Pull Data' },
      { id: 'ap-2', label: 'Organize Accounts' },
      { id: 'ap-3', label: 'Flag Exceptions' },
      { id: 'ap-4', label: 'Generate Report' }
    ]
  },
  {
    id: 'data-reconciliation',
    header: 'Data Reconciliation',
    nodes: [
      { id: 'dr-1', label: 'Import Bank Feed' },
      { id: 'dr-2', label: 'Cross-check Ledger' },
      { id: 'dr-3', label: 'Identify Mismatches' },
      { id: 'dr-4', label: 'Resolve Issues' }
    ]
  }
]; 