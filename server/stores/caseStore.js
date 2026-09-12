let nextId = 100;

export const cases = [
  {
    id: 'case-1',
    title: 'RBAC & Document Access Control Validation',
    caseNumber: 'DGVH-2026-001',
    description: 'Verify role-based visibility and action permissions across cases, documents, and approvals.',
    status: 'open',
    priority: 'high',
    assignedOfficerIds: ['officer-a'],
    createdBy: 'usr_admin',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    notes: []
  },
  {
    id: 'case-2',
    title: 'Document Workflow End-to-End Walkthrough',
    caseNumber: 'DGVH-2026-002',
    description: 'Confirm upload, preview, download, metadata edit, and storage flows work per role.',
    status: 'open',
    priority: 'medium',
    assignedOfficerIds: [],
    createdBy: 'usr_admin',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    notes: []
  },
  {
    id: 'case-3',
    title: 'Audit Trail & Approval Decision Logging',
    caseNumber: 'DGVH-2026-003',
    description: 'Ensure every approval decision and metadata change is auditable.',
    status: 'pending',
    priority: 'medium',
    assignedOfficerIds: ['officer-b'],
    createdBy: 'usr_investigator',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    notes: []
  }
];

const officerStore = {
  'officer-a': { id: 'officer-a', name: 'Riya Nair', role: 'Officer', email: 'officer@firm.com' },
  'officer-b': { id: 'officer-b', name: 'Varun Menon', role: 'Officer', email: 'officer2@firm.com' }
};

export function createCaseInput(data) {
  const now = new Date().toISOString();
  const id = 'case-' + String(nextId++);
  const newCase = {
    id,
    title: data.title || 'Untitled Case',
    caseNumber: 'DGVH-2026-' + String(nextId).padStart(3, '0'),
    description: data.description || '',
    status: data.status || 'open',
    priority: data.priority || 'medium',
    assignedOfficerIds: Array.isArray(data.assignedOfficerIds) ? data.assignedOfficerIds : [],
    createdBy: data.createdBy || 'unknown',
    createdAt: now,
    updatedAt: now,
    notes: Array.isArray(data.notes) ? data.notes : []
  };
  cases.push(newCase);
  return newCase;
}

export function assignOfficerToCase(caseId, officerId, data = {}) {
  const target = cases.find((c) => c.id === caseId);
  if (!target) return null;
  if (!Array.isArray(target.assignedOfficerIds)) target.assignedOfficerIds = [];
  if (!target.assignedOfficerIds.includes(officerId)) {
    target.assignedOfficerIds.push(officerId);
  }
  target.updatedAt = new Date().toISOString();
  return { id: officerId, assignedAt: target.updatedAt, note: data.note || null };
}

export function getOfficers() {
  return Object.values(officerStore);
}

export function getOfficerById(id) {
  return officerStore[id] || null;
}