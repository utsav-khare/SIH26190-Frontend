let nextDocId = 200;

export const documents = [
  {
    id: 'doc-1',
    name: 'Evidence_Log_RBI_FO_Part_A.pdf',
    type: 'application/pdf',
    size: 1843200,
    mimeClass: 'pdf',
    storagePath: 'vault/rooms/room-case-1/docs/doc-1',
    thumbnailPath: null,
    uploadedById: 'usr_admin',
    caseId: 'case-1',
    uploadedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'UPI/FO Dispute', confidentiality: 'internal', tags: ['evidence', 'finance'] }
  },
  {
    id: 'doc-2',
    name: 'Site_Survey_Photos.zip',
    type: 'application/zip',
    size: 12400000,
    mimeClass: 'archive',
    storagePath: 'vault/rooms/room-case-1/docs/doc-2',
    thumbnailPath: null,
    uploadedById: 'usr_admin',
    caseId: 'case-1',
    uploadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'field', confidentiality: 'restricted', tags: ['photos', 'survey'] }
  },
  {
    id: 'doc-3',
    name: 'Scanned_Agreement_Page_1.png',
    type: 'image/png',
    size: 420000,
    mimeClass: 'image',
    storagePath: 'vault/rooms/room-case-1/docs/doc-3',
    thumbnailPath: 'vault/rooms/room-case-1/docs/doc-3/thumb.png',
    uploadedById: 'usr_officer',
    caseId: 'case-1',
    uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    metadata: { source: 'client', confidentiality: 'internal', tags: ['contract'] }
  }
];

const uploadedByStore = {
  'usr_admin': { id: 'usr_admin', name: 'Admin User', email: 'admin@firm.com', role: 'admin' },
  'usr_officer': { id: 'usr_officer', name: 'Riya Nair', email: 'officer@firm.com', role: 'officer' },
  'usr_investigator': { id: 'usr_investigator', name: 'Tanya Verma', email: 'investigator@firm.com', role: 'investigator' }
};

export function addDocument(data) {
  const now = new Date().toISOString();
  const id = 'doc-' + String(nextDocId++);
  const doc = {
    id,
    name: data.name || 'untitled',
    type: data.type || 'application/octet-stream',
    size: Number(data.size) || 0,
    mimeClass: inferMimeClass(data.type, data.name),
    storagePath: data.storagePath || 'vault/rooms/room-unknown/docs/' + id,
    thumbnailPath: null,
    uploadedById: data.uploadedById || 'unknown',
    caseId: data.caseId || null,
    uploadedAt: now,
    metadata: data.metadata || {}
  };
  documents.push(doc);
  return doc;
}

export function getDocumentsByCaseId(caseId) {
  if (!caseId) return documents.slice();
  return documents.filter((d) => d.caseId === caseId);
}

export function updateDocumentMetadata(docId, metadata) {
  const doc = documents.find((d) => d.id === docId);
  if (!doc) return null;
  doc.metadata = Object.assign({}, doc.metadata, metadata);
  return doc;
}

export function inferMimeClass(type, name) {
  const t = (type || '').toLowerCase();
  const ext = (name || '').split('.').pop()?.toLowerCase();
  if (t.includes('pdf') || ext === 'pdf') return 'pdf';
  if (t.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) return 'image';
  if (t.includes('zip') || t.includes('tar') || t.includes('rar') || t.includes('7z') ||
      ['zip', 'tar', 'gz', 'rar', '7z'].includes(ext)) return 'archive';
  return 'other';
}

export function getUploadedByName(id) {
  return uploadedByStore[id] || { id, name: 'Unknown', email: '', role: '' };
}