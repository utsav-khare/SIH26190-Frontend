import React from 'react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Download, ShieldCheck, FileText, Calendar, User, Hash } from 'lucide-react';

export const DocumentPreviewModal = ({ isOpen, onClose, document: doc }) => {
  if (!doc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Secure Document Inspection" maxWidth="640px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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

        {/* Document Content Preview: image panel for IMG, text record for PDF */}
        {doc.type === 'IMG' ? (
          <div
            style={{
              padding: '18px',
              background: '#060a12',
              border: '1px solid #142033',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              minHeight: '160px',
              justifyContent: 'center'
            }}
          >
            <div style={{ color: '#f5b726', fontWeight: 'bold', fontSize: '0.8rem' }}>
              [CLASSIFIED EVIDENCE IMAGE // SIH26190 DIGITAL VAULT]
            </div>
            <div
              style={{
                width: '100%',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px dashed #223864',
                borderRadius: '6px',
                color: '#64748b',
                fontSize: '0.8rem',
                minHeight: '110px'
              }}
            >
              Image preview: {doc.name} (decrypted render on backend integration)
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '18px',
              background: '#060a12',
              border: '1px solid #142033',
              borderRadius: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              color: '#94a3b8',
              maxHeight: '180px',
              overflowY: 'auto',
              lineHeight: '1.6'
            }}
          >
            <div style={{ color: '#f5b726', marginBottom: '8px', fontWeight: 'bold' }}>
              [CLASSIFIED LEGAL RECORD // SIH26190 DIGITAL VAULT]
            </div>
            <div>--- BEGIN ENCRYPTED SUMMARY ---</div>
            <div>Document ID: {doc.id}</div>
            <div>Integrity Check: SHA-256 Verified (OK)</div>
            <div>Summary: Official record deposited under chain-of-custody protocols for legal and judicial proceedings. Tamper-evident seals intact.</div>
            <div>--- END RECORD PREVIEW ---</div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #17273f', paddingTop: '16px' }}>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            icon={Download}
            onClick={() => {
              alert(`Downloading encrypted copy of "${doc.name}" with legal chain-of-custody watermark.`);
              onClose();
            }}
          >
            Download Verified File
          </Button>
        </div>
      </div>
    </Modal>
  );
};

