import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Filter, Trash2, Download, Eye } from 'lucide-react';
import { documentService } from '../services/documentService';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { UploadModal } from '../components/modals/UploadModal';
import { DocumentPreviewModal } from '../components/modals/DocumentPreviewModal';
import { useModal } from '../hooks/useModal';

export const DocumentsPage = () => {
  const [docs, setDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [previewDoc, setPreviewDoc] = useState(null);

  const { isOpen: isUploadOpen, openModal: openUpload, closeModal: closeUpload } = useModal();

  useEffect(() => {
    documentService.getDocuments().then(setDocs);
  }, []);

  const handleUploaded = (newDoc) => {
    setDocs((prev) => [newDoc, ...prev]);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Confirm deletion of this legal document from vault?')) {
      await documentService.deleteDocument(id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const filteredDocs = docs.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          d.caseId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'ALL' || d.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Document Registry</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Encrypted repository of all case documents and forensic evidence</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={openUpload}>
          Upload Document
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Search by document name, FIR or Case ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['ALL', 'PDF', 'IMG'].map((type) => (
            <button
              key={type}
              className={`btn btn-sm ${filterType === type ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table / Card List */}
      <div className="section-box" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #17273f', color: '#94a3b8', background: '#0b1320' }}>
              <th style={{ padding: '14px 18px' }}>Document Name</th>
              <th style={{ padding: '14px 18px' }}>Case Reference</th>
              <th style={{ padding: '14px 18px' }}>Size</th>
              <th style={{ padding: '14px 18px' }}>Timestamp</th>
              <th style={{ padding: '14px 18px' }}>Clearance Status</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((d) => (
              <tr
                key={d.id}
                onClick={() => setPreviewDoc(d)}
                style={{ borderBottom: '1px solid #142033', cursor: 'pointer' }}
                className="table-row-hover"
              >
                <td style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Badge variant={d.type}>{d.type}</Badge>
                  <span style={{ color: '#f8fafc', fontWeight: 600 }}>{d.name}</span>
                </td>
                <td style={{ padding: '14px 18px', color: '#94a3b8' }}>{d.caseId}</td>
                <td style={{ padding: '14px 18px', color: '#64748b' }}>{d.size}</td>
                <td style={{ padding: '14px 18px', color: '#94a3b8' }}>
                  {d.date} <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{d.time}</span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span style={{ color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>● {d.status}</span>
                </td>
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button
                      className="doc-action-btn"
                      title="View Preview"
                      onClick={(e) => { e.stopPropagation(); setPreviewDoc(d); }}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="doc-action-btn"
                      title="Download"
                      onClick={(e) => { e.stopPropagation(); alert(`Downloading ${d.name}`); }}
                    >
                      <Download size={16} />
                    </button>
                    <button
                      className="doc-action-btn"
                      onClick={(e) => handleDelete(d.id, e)}
                      title="Delete"
                      style={{ color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UploadModal isOpen={isUploadOpen} onClose={closeUpload} onUploaded={handleUploaded} />
      <DocumentPreviewModal isOpen={!!previewDoc} onClose={() => setPreviewDoc(null)} document={previewDoc} />
    </div>
  );
};
