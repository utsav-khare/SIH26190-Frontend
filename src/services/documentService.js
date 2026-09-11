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
  }
};

