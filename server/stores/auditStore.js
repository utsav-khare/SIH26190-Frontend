import crypto from 'crypto';

const auditEntries = [];
let nextAuditId = 1000;

export function createDocumentAuditEntry({ documentId, caseId, action, actorId, metadata = {} }) {
  const entry = {
    id: 'audit-' + String(nextAuditId++),
    documentId,
    caseId,
    action,
    actorId,
    metadata,
    createdAt: new Date().toISOString()
  };
  auditEntries.unshift(entry);
  return entry;
}

export function getDocumentAuditLogs(documentId) {
  return auditEntries.filter((e) => e.documentId === documentId);
}

export function getCaseAuditLogs(caseId) {
  return auditEntries.filter((e) => e.caseId === caseId);
}

export function getAllAuditLogs() {
  return auditEntries.slice();
}

export function generateAuditId() {
  return 'audit-' + crypto.randomUUID ? crypto.randomUUID() : String(nextAuditId++);
}