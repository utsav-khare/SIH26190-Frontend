import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MoreVertical, ArrowRight, Eye, Download, Trash2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { DocumentPreviewModal } from '../modals/DocumentPreviewModal';

export const RecentDocuments = ({ documents = [] }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);

  const handleRowClick = (doc) => {
    setSelectedDoc(doc);
    setActiveMenuId(null);
  };

  const toggleMenu = (e, id) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  return (
    <div className="section-box" style={{ position: 'relative' }}>
      <div className="section-box-header">
        <div className="section-box-title">
          <FileText size={18} color="var(--accent-gold)" />
          <span>Recent Documents</span>
        </div>
        <Link to="/documents" className="section-box-viewall">
          <span>View All</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="recent-docs-list">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="recent-doc-row"
            onClick={() => handleRowClick(doc)}
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <Badge variant={doc.variant || doc.type}>{doc.type}</Badge>
            <div className="doc-info">
              <div className="doc-name">{doc.name}</div>
              <div className="doc-meta">
                {doc.size} • Uploaded by {doc.uploadedBy}
              </div>
            </div>
            <div className="doc-time">
              <div>{doc.date}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.725rem' }}>{doc.time}</div>
            </div>
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="doc-action-btn"
                onClick={(e) => toggleMenu(e, doc.id)}
                title="Options"
              >
                <MoreVertical size={16} />
              </button>

              {activeMenuId === doc.id && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '28px',
                    backgroundColor: 'var(--bg-card-dark)',
                    border: '1px solid var(--border-dark)',
                    borderRadius: '6px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    zIndex: 20,
                    width: '130px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setSelectedDoc(doc); setActiveMenuId(null); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Eye size={14} /> Preview
                  </button>
                  <button
                    onClick={() => { alert(`Downloading ${doc.name}`); setActiveMenuId(null); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      background: 'none',
                      border: 'none',
                      color: '#f8fafc',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      borderTop: '1px solid #17263c'
                    }}
                  >
                    <Download size={14} /> Download
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <DocumentPreviewModal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        document={selectedDoc}
      />
    </div>
  );
};
