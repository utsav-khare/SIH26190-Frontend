import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Watermark, buildWatermarkText } from '../common/Watermark';
import { DocumentFrame } from '../common/DocumentFrame';
import { useSecureView } from '../../hooks/useSecureView';
import { Download, ShieldCheck, FileText, Calendar, User, Hash, AlertCircle } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { useAuth } from '../../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';

export const DocumentPreviewModal = ({ isOpen, onClose, document: doc }) => {
  const { user } = useAuth();
  const canView = hasPermission(user?.role, PERMISSIONS.VIEW_DOCUMENT);
  const canDownload = hasPermission(user?.role, PERMISSIONS.DOWNLOAD_DOCUMENT);
  // Step 14 — interaction lockdown: right-click, double-click selection,
  // copy/cut/drag and Ctrl+C/X/S/P/U are blocked while this secure viewer
  // is open (released automatically on close).
  useSecureView(Boolean(isOpen && canView));

  if (!doc) return null;
  if (!canView) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Access Restricted">
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#fff', marginBottom: '6px' }}>Document Access Denied</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Your clearance level does not permit viewing this document.
          </p>
          <Button variant="outline" onClick={onClose} style={{ marginTop: '16px' }}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  const handleDownload = async () => {
    // Step 13 — download routed through the service layer so real mode hits
    // GET /api/documents/:id/file; mock mode returns a download descriptor.
    try {
      const file = await documentService.downloadDocument(doc.id);
      alert('Downloading "' + (file.name || doc.name) + '" (' + (file.size || doc.size) + ') via secure channel.');
    } catch (err) {
      alert(err.message || 'Download failed. Please try again.');
    }
    onClose();
  };

  // Step 14 — CSS watermarking: every "Secure Document Inspection" view is
  // identity-stamped with the viewer (name/email/role) + doc ref + access
  // timestamp. Stabilize the access time per doc so re-renders don't churn it.
  const accessedAt = React.useMemo(() => new Date(), [doc?.id]);
  const wm = buildWatermarkText(user, doc, accessedAt);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Secure Document Inspection" maxWidth="640px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', userSelect: 'none' }}>
        {/* CSS Watermark overlay — identity stamp above all content */}
        <Watermark text={wm.primary} subText={wm.secondary} stampLabel="CONFIDENTIAL" />
        {/* Document Header Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px', background: '#0b1525', border: '1px solid #17273f', borderRadius: '8px' }}>
          <Badge variant={doc.type}>{doc.type}</Badge>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '2px' }}>{doc.name}</h4>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Docket: <strong style={{ color: '#f5b726' }}>{doc.caseId || 'CASE-2026-GENERAL'}</strong> • {doc.size}
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', padding: '4px 10px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderRadius: '4px', fontWeight: 600 }}>
            ● {doc.status || 'Verified'}
          </span>
        </div>

        {/* Security & Verification Metadata */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
          <div style={{ padding: '10px 14px', background: '#070e1b', border: '1px solid #142033', borderRadius: '6px' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} /> Uploaded By:
            </span>
            <strong style={{ color: '#f8fafc', display: 'block', marginTop: '2px' }}>{doc.uploadedBy || 'Officer'}</strong>
          </div>

          <div style={{ padding: '10px 14px', background: '#070e1b', border: '1px solid #142033', borderRadius: '6px' }}>
            <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} /> Timestamp:
            </span>
            <strong style={{ color: '#f8fafc', display: 'block', marginTop: '2px' }}>{doc.date} {doc.time}</strong>
          </div>
        </div>

        {/* Step 14 — Iframe rendering: real bytes in a sandboxed blob viewer,
            identity-watermarked on top (replaces static placeholder panels) */}
        <DocumentFrame doc={doc} />

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #17273f', paddingTop: '16px' }}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {canDownload && (
            <Button variant="primary" icon={Download} onClick={handleDownload}>
              Download Verified File
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

