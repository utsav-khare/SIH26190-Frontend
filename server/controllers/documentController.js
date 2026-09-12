import crypto from 'crypto';
import { addDocument, getDocumentsByCaseId, getUploadedByName } from '../stores/documentStore.js';
import { createDocumentAuditEntry } from '../stores/auditStore.js';
import { validateAddDocument } from '../validators/documentValidator.js';

function fingerprint(id, name, at) {
  return crypto.createHash('sha256').update(id + name + at).digest('hex');
}

function enrich(doc) {
  return { ...doc, uploadedBy: getUploadedByName(doc.uploadedById) };
}

export async function getAllDocuments(req, res) {
  try {
    const caseId = req.case?.id;
    if (!caseId) {
      return res.status(400).json({ message: 'caseId is required' });
    }
    const docs = getDocumentsByCaseId(caseId).map(enrich);
    return res.json({ data: docs, total: docs.length });
  } catch (err) {
    console.error('documentController.getAllDocuments error:', err);
    return res.status(500).json({ message: 'Failed to load documents' });
  }
}

export async function getDocumentById(req, res) {
  try {
    const { caseId, documentId } = req.params;
    const { documents } = await import('../stores/documentStore.js');
    const target = documents.find((d) => d.id === documentId);
    if (!target || target.caseId !== caseId) {
      return res.status(404).json({ message: 'Document not found' });
    }
    return res.json({ data: enrich(target) });
  } catch (err) {
    console.error('documentController.getDocumentById error:', err);
    return res.status(500).json({ message: 'Failed to load document' });
  }
}

export async function uploadDocument(req, res) {
  try {
    const caseId = req.case?.id;
    if (!caseId) {
      return res.status(400).json({ message: 'caseId is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const payload = {
      name: req.file.originalname || 'uploaded-file',
      type: req.file.mimetype || 'application/octet-stream',
      size: req.file.size || 0,
      caseId,
      uploadedById: req.user?.id || 'unknown',
      storagePath: 'uploads/' + caseId + '/' + (req.file.filename || 'file'),
      metadata: (req.body && typeof req.body === 'object') ? req.body : {}
    };
    const validation = validateAddDocument(payload);
    if (!validation.ok) {
      return res.status(400).json({ message: validation.errors.join('; ') });
    }
    const doc = addDocument(payload);
    await createDocumentAuditEntry({
      caseId,
      documentId: doc.id,
      action: 'uploaded',
      actorId: req.user?.id || 'unknown',
      metadata: { fileName: doc.name, mimeType: doc.type, sizeBytes: doc.size }
    });
    return res.status(201).json({ data: enrich(doc) });
  } catch (err) {
    console.error('documentController.uploadDocument error:', err);
    return res.status(500).json({ message: 'Failed to upload document' });
  }
}
export async function searchDocuments(req, res) {
  try {
    const caseId = req.case?.id;
    const q = (req.query.q || '').toString().trim();
    const type = (req.query.type || '').toString().trim();
    const mimeClass = (req.query.mimeClass || '').toString().trim();
    const limit = Math.max(1, Math.min(200, parseInt(req.query.limit, 10) || 50));
    const offset = Math.max(0, parseInt(req.query.offset, 10) || 0);

    let results = getDocumentsByCaseId(caseId || undefined);
    if (mimeClass) results = results.filter((d) => d.mimeClass === mimeClass);
    if (type) results = results.filter((d) => d.type.toLowerCase() === type.toLowerCase());
    if (q) {
      const query = q.toLowerCase();
      results = results.filter((d) =>
        d.name.toLowerCase().includes(query) ||
        (d.metadata?.source && d.metadata.source.toLowerCase().includes(query)) ||
        (d.metadata?.tags && d.metadata.tags.some((t) => t.toLowerCase().includes(query)))
      );
    }

    const total = results.length;
    const pageResults = results.slice(offset, offset + limit).map(enrich);
    return res.json({
      data: pageResults,
      pagination: { total, page: Math.floor(offset / limit), pageSize: limit, hasMore: (offset + limit) < total }
    });
  } catch (err) {
    console.error('documentController.searchDocuments error:', err);
    return res.status(500).json({ message: 'Failed to search documents' });
  }
}

export async function retryRedaction(req, res) {
  try {
    const { caseId, documentId } = req.params;
    const { documents } = await import('../stores/documentStore.js');
    const target = documents.find((d) => d.id === documentId);
    if (!target || target.caseId !== caseId) {
      return res.status(404).json({ message: 'Document not found' });
    }
    await createDocumentAuditEntry({
      caseId,
      documentId,
      action: 'redaction_retried',
      actorId: req.user?.id || 'system',
      metadata: { reason: req.body?.reason || 'manual retry' }
    });
    return res.json({ data: { id: documentId, status: 'redaction_pending', redactionRetryAt: new Date().toISOString() } });
  } catch (err) {
    console.error('documentController.retryRedaction error:', err);
    return res.status(500).json({ message: 'Failed to retry redaction' });
  }
}

export async function getBsaCertificate(req, res) {
  try {
    const { caseId, documentId } = req.params;
    const { documents } = await import('../stores/documentStore.js');
    const target = documents.find((d) => d.id === documentId);
    if (!target || target.caseId !== caseId) {
      return res.status(404).json({ message: 'Document not found' });
    }
    return res.json({
      data: {
        documentId: target.id,
        documentName: target.name,
        certificateType: 'BSA Digital Certificate',
        issuedAt: target.uploadedAt,
        fingerprintAlgorithm: 'SHA-256',
        contentFingerprint: fingerprint(target.id, target.name, target.uploadedAt),
        status: 'certified_stub'
      }
    });
  } catch (err) {
    console.error('documentController.getBsaCertificate error:', err);
    return res.status(500).json({ message: 'Failed to retrieve certificate' });
  }
}

export async function getAuditLogs(req, res) {
  try {
    const { documentId } = req.params;
    const { getDocumentAuditLogs } = await import('../stores/auditStore.js');
    const logs = getDocumentAuditLogs(documentId);
    return res.json({ data: logs, total: logs.length });
  } catch (err) {
    console.error('documentController.getAuditLogs error:', err);
    return res.status(500).json({ message: 'Failed to load audit logs' });
  }
}

export async function verifyDocumentIntegrity(req, res) {
  try {
    const { caseId, documentId } = req.params;
    const { documents } = await import('../stores/documentStore.js');
    const target = documents.find((d) => d.id === documentId);
    if (!target || target.caseId !== caseId) {
      return res.status(404).json({ message: 'Document not found' });
    }
    return res.json({
      data: {
        documentId: target.id,
        verified: true,
        fingerprintAlgorithm: 'SHA-256',
        storedFingerprint: fingerprint(target.id, target.name, target.uploadedAt),
        status: 'integrity_verified_stub'
      }
    });
  } catch (err) {
    console.error('documentController.verifyDocumentIntegrity error:', err);
    return res.status(500).json({ message: 'Failed to verify integrity' });
  }
}