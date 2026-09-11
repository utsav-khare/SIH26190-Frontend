import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { UploadCloud, CheckCircle2, AlertCircle } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { SUPPORTED_UPLOAD } from '../../utils/constants';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
import { useAuth } from '../../hooks/useAuth';

export const UploadModal = ({ isOpen, onClose, onUploaded }) => {
  const { user } = useAuth();
  const canUpload = hasPermission(user?.role, PERMISSIONS.UPLOAD_DOCUMENT);

  const [file, setFile] = useState(null);
  const [caseId, setCaseId] = useState('');
  const [docType, setDocType] = useState('PDF');
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!canUpload) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Upload Restricted">
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#fff', marginBottom: '6px' }}>Upload Not Authorized</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Your clearance level does not permit document uploads.
          </p>
          <Button variant="outline" onClick={onClose} style={{ marginTop: '16px' }}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (!selected) return;

    setError('');
    const detected = SUPPORTED_UPLOAD.detectType(selected.name);
    if (!detected) {
      setError(`Unsupported file type. Allowed: ${SUPPORTED_UPLOAD.label}`);
      setFile(null);
      return;
    }
    if (selected.size > SUPPORTED_UPLOAD.maxSizeMB * 1024 * 1024) {
      setError(`File exceeds the ${SUPPORTED_UPLOAD.maxSizeMB}MB vault limit.`);
      setFile(null);
      return;
    }
    setFile(selected);
    setDocType(detected);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const newDoc = await documentService.uploadDocument({
        name: file.name,
        type: docType,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        caseId: caseId || 'CASE-2026-AUTO'
      });
      setSuccess(true);
      if (onUploaded) onUploaded(newDoc);
      setTimeout(() => {
        setSuccess(false);
        setFile(null);
        setCaseId('');
        setIsUploading(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      // Step 13 fix — surface the failure in the modal's existing error alert
      setError(err.message || 'Upload failed. Please verify the file and try again.');
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Secure Document Ingestion">
      {success ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#fff', marginBottom: '6px' }}>Document Encrypted & Uploaded</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Indexed into SIH26190 Vault securely.</p>
        </div>
      ) : (
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              border: '2px dashed var(--border-dark)',
              borderRadius: '8px',
              padding: '24px',
              textAlign: 'center',
              backgroundColor: 'rgba(7, 13, 24, 0.5)',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('vaultFileInput')?.click()}
          >
            <UploadCloud size={36} color="#f5b726" style={{ margin: '0 auto 8px' }} />
            <p style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
              {file ? file.name : 'Click or Drag legal documents to upload'}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Supported: {SUPPORTED_UPLOAD.label} (Max size {SUPPORTED_UPLOAD.maxSizeMB}MB)
            </p>
            <input
              id="vaultFileInput"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept={SUPPORTED_UPLOAD.accept}
            />
          </div>

          {file && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'rgba(20, 34, 63, 0.5)', border: '1px solid #223864', borderRadius: '8px' }}>
              <Badge variant={docType}>{docType}</Badge>
              <span style={{ fontSize: '0.8rem', color: '#f8fafc' }}>{file.name}</span>
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Linked Case / FIR ID</label>
            <input
              type="text"
              className="form-input no-icon"
              placeholder="e.g. FIR-2026-145"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Document Category (auto-detected)</label>
            <input
              type="text"
              className="form-input no-icon"
              value={docType === 'PDF' ? 'FIR / Investigation Report (PDF)' : 'Evidence Photo / Scan (Image)'}
              readOnly
              style={{ opacity: 0.8, cursor: 'default' }}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            block
            loading={isUploading}
            disabled={!file}
            icon={UploadCloud}
          >
            Encrypt & Upload Document
          </Button>
        </form>
      )}
    </Modal>
  );
};