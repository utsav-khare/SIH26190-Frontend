import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PencilLine, CheckCircle2, AlertCircle } from 'lucide-react';
import { documentService } from '../../services/documentService';
import { SUPPORTED_UPLOAD } from '../../utils/constants';
import { hasPermission, PERMISSIONS } from '../../utils/permissions';
import { useAuth } from '../../hooks/useAuth';

export const EditMetadataModal = ({ isOpen, onClose, document: doc, onUpdated }) => {
  const { user } = useAuth();
  const canEdit = hasPermission(user?.role, PERMISSIONS.EDIT_DOCUMENT);

  const [name, setName] = useState('');
  const [caseId, setCaseId] = useState('');
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && doc) {
      setName(doc.name || '');
      setCaseId(doc.caseId || '');
      setStatus(doc.status || 'Verified');
      setSaved(false);
      setError('');
    }
  }, [isOpen, doc]);

  if (!canEdit) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Restricted">
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#fff', marginBottom: '6px' }}>Metadata Edit Not Authorized</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            Your clearance level does not permit editing document metadata.
          </p>
          <Button variant="outline" onClick={onClose} style={{ marginTop: '16px' }}>
            Close
          </Button>
        </div>
      </Modal>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!doc) return;
    setError('');
    setIsSaving(true);
    try {
      const updated = await documentService.updateDocument(doc.id, { name, caseId, status });
      setSaved(true);
      if (onUpdated) onUpdated(updated);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1400);
    } catch (err) {
      setError(err.message || 'Failed to update document metadata.');
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Document Metadata">
      {saved ? (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <h4 style={{ color: '#fff', marginBottom: '6px' }}>Metadata Updated</h4>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Document record refreshed within the vault.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600 }}>
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Document Name</label>
            <input
              type="text"
              className="form-input no-icon"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Linked Case / FIR ID</label>
            <input
              type="text"
              className="form-input no-icon"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              placeholder="e.g. FIR-2026-145"
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Clearance Status</label>
            <select className="form-select no-icon" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Verified">Verified</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            block
            loading={isSaving}
            disabled={!name.trim()}
            icon={PencilLine}
          >
            Save Changes
          </Button>
        </form>
      )}
    </Modal>
  );
};