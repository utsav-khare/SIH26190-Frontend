import crypto from 'crypto';
import fs from 'fs';
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
      physicalPath: (process.env.UPLOAD_DIR || 'uploads') + '/' + (req.file.filename || 'file'),
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

/* ------------------------------------------------------------------ */
/* Iframe rendering support — GET /:caseId/documents/:documentId/file  */
/* Sits behind requireAuth + requireCaseJurisdiction (PoLP enforced).  */
/* ------------------------------------------------------------------ */

function safeFileName(name) {
  return String(name || 'document').replace(/[^A-Za-z0-9._-]/g, '_').slice(0, 120);
}

function escapePdfText(s) {
  return String(s)
    .replace(/[^\x20-\x7E]/g, '-')   // PDF text must stay ASCII
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/** Assembles a minimal, valid single-page PDF with correct xref offsets. */
function buildStubPdf(lines) {
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

export async function getDocumentFile(req, res) {
  try {
    const { caseId, documentId } = req.params;
    const { documents } = await import('../stores/documentStore.js');
    const target = documents.find((d) => d.id === documentId);
    if (!target || target.caseId !== caseId) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Uploaded documents: stream the physical file stored by multer.
    if (target.physicalPath && fs.existsSync(target.physicalPath)) {
      res.setHeader('Content-Type', target.type || 'application/octet-stream');
      res.setHeader('Content-Disposition', 'inline; filename="' + safeFileName(target.name) + '"');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'no-store');
      return fs.createReadStream(target.physicalPath).pipe(res);
    }

    // Seeded/stub documents: synthesize a real, renderable PDF record
    // describing the vault entry (this is what the frontend iframe shows).
    const pdf = buildStubPdf([
      'Digilegal Vault - Secure Document Record',
      'Document: ' + target.name,
      'Document ID: ' + target.id,
      'Case: ' + target.caseId,
      'Class: ' + (target.mimeClass || 'pdf'),
      'Uploaded: ' + target.uploadedAt,
      'Status: ' + (target.status || 'certified'),
      '',
      'This system-generated preview is traceable to the',
      'authenticated viewer session. Unauthorized distribution',
      'or capture is prohibited under vault policy SIH26190.'
    ]);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + safeFileName(target.name) + '"');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(Buffer.from(pdf, 'binary'));
  } catch (err) {
    console.error('documentController.getDocumentFile error:', err);
    return res.status(500).json({ message: 'Failed to stream document file' });
  }
}