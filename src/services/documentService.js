import { MOCK_RECENT_DOCUMENTS } from '../utils/constants';

let localDocuments = [...MOCK_RECENT_DOCUMENTS];

export const documentService = {
  async getDocuments() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...localDocuments];
  },

  async getDocumentById(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return localDocuments.find((d) => d.id === id) || null;
  },

  async uploadDocument(docData) {
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
  },

  async deleteDocument(id) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    localDocuments = localDocuments.filter((d) => d.id !== id);
    return { success: true, id };
  }
};

