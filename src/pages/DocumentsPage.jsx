import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Download, Eye, PencilLine, FileText } from 'lucide-react';
import { documentService } from '../services/documentService';
import { useAuth } from '../hooks/useAuth';
import { useApiData } from '../hooks/useApiData';
import { useModal } from '../hooks/useModal';
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { UploadModal } from '../components/modals/UploadModal';
import { DocumentPreviewModal } from '../components/modals/DocumentPreviewModal';
import { EditMetadataModal } from '../components/modals/EditMetadataModal';

export const DocumentsPage = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [editDoc, setEditDoc] = useState(null);

  // RBAC — Step 10 permission guards
  const canView = hasPermission(user?.role, PERMISSIONS.VIEW_DOCUMENT);
  const canUpload = hasPermission(user?.role, PERMISSIONS.UPLOAD_DOCUMENT);
  const canEdit = hasPermission(user?.role, PERMISSIONS.EDIT_DOCUMENT);
  const canDelete = hasPermission(user?.role, PERMISSIONS.DELETE_DOCUMENT);
  const canDownload = hasPermission(user?.role, PERMISSIONS.DOWNLOAD_DOCUMENT);

  const { isOpen: isUploadOpen, openModal: openUpload, closeModal: closeUpload } = useModal();
  // Step 11 — consistent API state handling (loading / error / empty)
  const { data, loading, error: apiError, reload: loadDocuments } = useApiData(
    () => documentService.getDocuments()
  );

  useEffect(() => {
    if (Array.isArray(data)) setDocs(data);
  }, [data]);

  const handleUploaded = (newDoc) => {
    if (!newDoc) return;
    setDocs((prev) => [newDoc, ...prev.filter((d) => d.id !== newDoc.id)]);
  };

  const handleUpdated = (updatedDoc) => {
    if (!updatedDoc) return;
    setDocs((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)));
  };

  const handleDownload = async (doc, e) => {
    e.stopPropagation();
    if (!canDownload) {
      alert('Download not permitted for your role.');
      return;
    }
    try {
      const file = await documentService.downloadDocument(doc.id);
      alert('Downloading "' + (file.name || doc.name) + '" (' + (file.size || doc.size) + ') via secure channel.');
    } catch (err) {
      alert(err.message || 'Download failed. Please try again.');
    }
  };

  const handleDelete = async (doc, e) => {
    e.stopPropagation();
    if (!canDelete) {
      alert('Delete not permitted for your role.');
      return;
    }
    if (!window.confirm('Confirm deletion of this legal document from the vault?')) return;
    try {
      await documentService.deleteDocument(doc.id);
      setDocs((prev) => prev.filter((d) => d.id !== doc.id));
    } catch (err) {
      alert(err.message || 'Failed to delete document.');
    }
  };

  const filteredDocs = docs.filter((d) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch = !term ||
      d.name.toLowerCase().includes(term) ||
      (d.caseId || '').toLowerCase().includes(term) ||
      (d.uploadedBy || '').toLowerCase().includes(term);
    const matchesType = filterType === 'ALL' || d.type === filterType;
    return matchesSearch && matchesType;
  });

  const openPreview = (doc) => {
    if (canView) setPreviewDoc(doc);
  };
  const closePreview = () => setPreviewDoc(null);

  const thStyle = { padding: '14px 18px', textAlign: 'left', color: 'var(--text-subtle)', fontSize: '0.7rem', letterSpacing: '0.08em' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-light)', margin: 0 }}>Document Registry</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '4px 0 0' }}>
            Encrypted repository of all case documents and forensic evidence
          </p>
        </div>
        {canUpload && (
          <Button variant="primary" icon={Plus} onClick={openUpload}>
            Upload Document
          </Button>
        )}
      </div>

      {/* API state: loading / error / empty vault */}
      {loading && <LoadingState message="Synchronizing vault index..." />}
      {!loading && apiError && (
        <ErrorState title="Vault unavailable" message={apiError} onRetry={loadDocuments} />
      )}
      {!loading && !apiError && docs.length === 0 && (
        <EmptyState
          title="The vault is empty"
          message="No documents have been uploaded yet. Upload the first document to get started."
        />
      )}

      {/* Search + type filter */}
      {!loading && !apiError && docs.length > 0 && (
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 240px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)', pointerEvents: 'none' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '42px' }}
              placeholder="Search by document name, case ID, or uploader..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'PDF', 'IMG'].map((t) => (
              <button
                key={t}
                type="button"
                className={'btn btn-sm ' + (filterType === t ? 'btn-primary' : 'btn-outline')}
                onClick={() => setFilterType(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Documents table */}
      {!loading && !apiError && docs.length > 0 && (
        <div className="section-box" style={{ padding: 0, overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-dark)', background: 'var(--bg-card)' }}>
                <th style={thStyle}>DOCUMENT</th>
                <th style={thStyle}>TYPE</th>
                <th style={thStyle}>CASE ID</th>
                <th style={thStyle}>UPLOADED</th>
                <th style={thStyle}>STATUS</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      compact
                      title="No matches found"
                      message="Adjust your search terms or clear the type filter to see vault documents."
                    />
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="table-row-hover"
                    style={{ borderBottom: '1px solid var(--border-dark)', cursor: canView ? 'pointer' : 'default' }}
                    onClick={() => openPreview(doc)}
                  >
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} color="var(--accent-gold)" />
                        <span style={{ color: 'var(--text-light)', fontWeight: 600 }}>{doc.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <Badge variant={doc.type}>{doc.type}</Badge>
                    </td>
                    <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>{doc.caseId}</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>{doc.date}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{doc.time}</span>
                    </td>
                    <td style={{ padding: '14px 18px' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontWeight: 600,
                          background: doc.status === 'Verified' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 183, 38, 0.15)',
                          color: doc.status === 'Verified' ? '#34d399' : 'var(--accent-gold)'
                        }}
                      >
                        ● {doc.status || 'Verified'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                        {canView && (
                          <button className="doc-action-btn" title="View document" onClick={(e) => { e.stopPropagation(); openPreview(doc); }}>
                            <Eye size={16} />
                          </button>
                        )}
                        {canDownload && (
                          <button className="doc-action-btn" title="Download" onClick={(e) => handleDownload(doc, e)}>
                            <Download size={16} />
                          </button>
                        )}
                        {canEdit && (
                          <button className="doc-action-btn" title="Edit metadata" onClick={(e) => { e.stopPropagation(); setEditDoc(doc); }}>
                            <PencilLine size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button className="doc-action-btn" title="Delete" style={{ color: 'var(--text-error)' }} onClick={(e) => handleDelete(doc, e)}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {canUpload && (
        <UploadModal isOpen={isUploadOpen} onClose={closeUpload} onUploaded={handleUploaded} />
      )}
      {previewDoc && (
        <DocumentPreviewModal isOpen={!!previewDoc} onClose={closePreview} document={previewDoc} />
      )}
      {editDoc && canEdit && (
        <EditMetadataModal isOpen={!!editDoc} onClose={() => setEditDoc(null)} document={editDoc} onUpdated={handleUpdated} />
      )}
    </div>
  );
};

export default DocumentsPage;

