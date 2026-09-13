import { MOCK_RECENT_DOCUMENTS } from '../utils/constants';
import { api } from './api';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// In-memory mock store — used only when VITE_USE_MOCK=true
let localDocuments = [...MOCK_RECENT_DOCUMENTS];

/**
 * Document management service — handles CRUD for vault documents.
 *
 * When VITE_USE_MOCK=true (default), all operations run against an
 * in-memory array with simulated network latency.
 *
 * When VITE_USE_MOCK=false, operations are sent to the backend via the
 * centralized api client. Endpoints marked PENDING are not yet available
 * from the backend team.
 */
export const documentService = {
  /**
   * Fetch all documents.
   * Mock: returns in-memory array.
   * Real:  GET /api/documents
   */
  async getDocuments() {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return [...localDocuments];
    }
    return api.get('/documents');
  },

  /**
   * Fetch a single document by ID.
   * Mock: searches in-memory array.
   * Real:  GET /api/documents/:id
   */
  async getDocumentById(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return localDocuments.find((d) => d.id === id) || null;
    }
    return api.get(`/documents/${id}`);
  },

  /**
   * Upload a new document (metadata; file upload itself is PENDING).
   * Mock: prepends to in-memory array.
   * Real:  POST /api/documents  -> created document
   *        [PENDING — multipart file upload endpoint not yet available]
   */
  async uploadDocument(docData) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newDoc = {
        id: `doc-${Date.now().toString().slice(-4)}`,
        name: docData.name || 'Untitled_Document.pdf',
        type: docData.type || 'PDF',
        size: docData.size || '1.0 MB',
        uploadedBy: 'Officer',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        caseId: docData.caseId || 'CASE-2026-NEW',
        status: 'Verified'
      };
      localDocuments = [newDoc, ...localDocuments];
      return newDoc;
    }
    return api.post('/documents', docData);
  },

  /**
   * Delete a document by ID.
   * Mock: removes from in-memory array.
   * Real:  DELETE /api/documents/:id
   */
  async deleteDocument(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      localDocuments = localDocuments.filter((d) => d.id !== id);
      return { success: true, id };
    }
    return api.delete(`/documents/${id}`);
  },

  /**
   * Update document metadata.
   * Real equivalent: PUT /api/documents/:id  [PENDING — backend endpoint not yet available]
   */
  updateDocument(id, updates) {
    if (USE_MOCK) {
      localDocuments = localDocuments.map((d) =>
        d.id === id ? { ...d, ...updates } : d
      );
      return localDocuments.find((d) => d.id === id);
    }
    return api.put(`/documents/${id}`, updates);
  },

  /**
   * Search / filter documents.
   * Real equivalent: GET /api/documents?search=&type=&caseId=
   */
  async searchDocuments(params = {}) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return localDocuments.filter((d) => {
        const matchesSearch = !params.search ||
          d.name.toLowerCase().includes(params.search.toLowerCase()) ||
          d.caseId.toLowerCase().includes(params.search.toLowerCase());
        const matchesType = !params.type || params.type === 'ALL' || d.type === params.type;
        return matchesSearch && matchesType;
      });
    }
    return api.get('/documents', { params });
  },

  /**
   * Download / fetch a document resource.
   * Mock: returns a simulated download descriptor.
   * Real:  GET /api/documents/:id/file  -> binary stream  [PENDING — not yet available]
   */
  async downloadDocument(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const doc = localDocuments.find((d) => d.id === id);
      return {
        id,
        name: doc?.name || 'document.pdf',
        size: doc?.size || '1.0 MB',
        type: doc?.type || 'PDF'
      };
    }
    return api.get(`/documents/${id}/file`);
  },

  /* ----------------------------------------------------------------
   * Iframe rendering support — returns raw bytes as a Blob so the
   * viewer can wrap them in an opaque-origin blob: URL.
   *   Mock: synthesizes a renderable PDF / SVG stub client-side.
   *   Real: GET /api/documents/:id/file  (binary, via api.getBlob)
   * ---------------------------------------------------------------- */
  async getDocumentFile(id) {
    if (USE_MOCK) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const doc = localDocuments.find((d) => d.id === id);
      if (doc && doc.type === 'IMG') {
        const svg = buildMockSvg(doc);
        return { blob: new Blob([svg], { type: 'image/svg+xml' }), mime: 'image/svg+xml' };
      }
      const pdf = buildMockPdf(doc);
      return { blob: new Blob([pdf], { type: 'application/pdf' }), mime: 'application/pdf' };
    }
    const { blob, mime } = await api.getBlob(`/documents/${id}/file`);
    return { blob, mime };
  }
};

/* ---- mock byte builders (ASCII-only so blob encoding stays byte-exact) ---- */

function escapePdfText(s) {
  return String(s)
    .replace(/[^\x20-\x7E]/g, '-')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function buildMockPdf(doc) {
  const lines = [
    'Digilegal Vault - Secure Document Record',
    'Document: ' + (doc?.name || 'Untitled'),
    'Document ID: ' + (doc?.id || 'doc-?'),
    'Case: ' + (doc?.caseId || 'CASE-?'),
    'Status: ' + (doc?.status || 'Verified'),
    'Accessed: ' + new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    '',
    'System-generated preview rendered inside a sandboxed',
    'viewer. Traceable to the authenticated session.',
    'Unauthorized distribution is prohibited (SIH26190).'
  ];
  const content = lines
    .map((line, i) => 'BT /F1 ' + (i === 0 ? 16 : 11) + ' Tf 56 ' + (780 - i * 26) + ' Td (' + escapePdfText(line) + ') Tj ET')
    .join('\n');
  const objects = {
    1: '<< /Type /Catalog /Pages 2 0 R >>',
    2: '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    3: '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    4: '<< /Length ' + content.length + ' >>\nstream\n' + content + '\nendstream',
    5: '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'
  };
  let pdf = '%PDF-1.4\n';
  const offsets = {};
  for (let i = 1; i <= 5; i++) {
    offsets[i] = pdf.length;
    pdf += i + ' 0 obj\n' + objects[i] + '\nendobj\n';
  }
  const xrefPos = pdf.length;
  pdf += 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xrefPos + '\n%%EOF';
  return pdf;
}

function escapeXmlText(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildMockSvg(doc) {
  const name = escapeXmlText(doc?.name || 'Evidence Image');
  const ref = escapeXmlText((doc?.caseId || 'case?') + ' / ' + (doc?.id || 'doc?'));
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420">' +
    '<rect width="640" height="420" fill="#0b1525"/>' +
    '<rect x="20" y="20" width="600" height="380" fill="none" stroke="#223864" stroke-dasharray="8 6"/>' +
    '<text x="320" y="180" fill="#f5b726" font-family="monospace" font-size="20" text-anchor="middle">CLASSIFIED EVIDENCE</text>' +
    '<text x="320" y="220" fill="#94a3b8" font-family="monospace" font-size="14" text-anchor="middle">' + name + '</text>' +
    '<text x="320" y="260" fill="#64748b" font-family="monospace" font-size="12" text-anchor="middle">' + ref + '</text>' +
    '</svg>'
  );
}

