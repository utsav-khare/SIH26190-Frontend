import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Scale, FileText, User, Clock, ArrowLeft, Plus, Eye, Download,
  MoreVertical, Check, Calendar, Phone, Mail, MapPin, Building,
  Tag, Search, AlertCircle
} from 'lucide-react';
import { caseService } from '../services/caseService';
import { DocumentPreviewModal } from '../components/modals/DocumentPreviewModal';
import { UploadModal } from '../components/modals/UploadModal';
import { useModal } from '../hooks/useModal';
import { useApiData } from '../hooks/useApiData';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { useAuth } from '../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

export const CaseDetailPage = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canView = hasPermission(user?.role, PERMISSIONS.VIEW_DOCUMENT);
  const canUpload = hasPermission(user?.role, PERMISSIONS.UPLOAD_DOCUMENT);
  const canEdit = hasPermission(user?.role, PERMISSIONS.EDIT_DOCUMENT);

  const [caseData, setCaseData] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const { isOpen: isUploadOpen, openModal: openUpload, closeModal: closeUpload } = useModal();

  // Step 11 — consistent API state handling (loading / error / not-found)
  const { data: fetchedCase, loading, error: caseError, reload: loadCase } = useApiData(
    () => caseService.getCaseById(caseId),
    [caseId]
  );

  useEffect(() => {
    setCaseData(fetchedCase || null);
  }, [fetchedCase]);

  const handleDocumentAdded = async (newDoc) => {
    if (!caseData) return;
    try {
      const added = await caseService.addDocumentToCase(caseData.id, newDoc);
      if (added) {
        setCaseData((prev) => ({
          ...prev,
          documents: [
            {
              id: added.id || `doc-${Date.now()}`,
              name: newDoc.name,
              type: newDoc.type || 'Supporting Document',
              uploadedOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              uploadedBy: added.uploadedBy || 'Officer',
              size: newDoc.size || '1.2 MB'
            },
            ...(prev.documents || [])
          ]
        }));
      }
    } catch (err) {
      alert(err.message || 'Failed to link document to this case.');
    } finally {
      closeUpload();
    }
  };

  if (loading) {
    return <LoadingState message="Opening case docket..." />;
  }

  if (caseError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
        <ErrorState
          title="Case docket unavailable"
          message={caseError}
          onRetry={loadCase}
        />
        <div style={{ textAlign: 'center' }}>
          <Link to="/cases" className="btn btn-outline">
            Back to Cases
          </Link>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#889bb5' }}>
        <p>Case docket not found.</p>
        <Link to="/cases" className="btn btn-primary" style={{ marginTop: '16px' }}>
          Back to Cases
        </Link>
      </div>
    );
  }

  if (!canView) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#889bb5' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 12px' }} />
        <h3 style={{ color: '#fff', marginBottom: '8px' }}>Case Access Restricted</h3>
        <p style={{ color: '#94a3b8' }}>Your clearance level does not permit viewing this case docket.</p>
        <Link to="/dashboard" className="btn btn-outline" style={{ marginTop: '16px' }}>
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const officer = caseData.assignedOfficer || {
    name: caseData.officer || 'Anjali Sharma',
    designation: 'Legal Officer',
    department: 'Civil Legal Department',
    assignedOn: caseData.filedOn || '21 May 2025',
    email: 'anjali.sharma@digilegal.in',
    phone: '+91 98765 43210'
  };

  return (
    <div className="case-detail-container">
      {/* Top Header & Breadcrumb */}
      <div className="case-detail-header-row">
        <div>
          <h2 className="case-detail-page-title">Case Detail</h2>
          <div className="case-detail-breadcrumb">
            <Link to="/cases" className="breadcrumb-link">Cases</Link>
            <span className="breadcrumb-sep">&gt;</span>
            <span className="breadcrumb-current">Case Detail</span>
          </div>
        </div>
        <Link to="/cases" className="btn btn-outline btn-sm case-back-btn">
          <ArrowLeft size={16} /> Back to Cases
        </Link>
      </div>

      {/* Case Summary Top Banner Card */}
      <div className="case-summary-card">
        <div className="case-summary-icon-box">
          <Scale size={28} color="#cca245" />
        </div>

        <div className="case-summary-meta-grid">
          <div className="case-summary-col">
            <span className="case-summary-label">CASE ID</span>
            <div className="case-summary-code">{caseData.code}</div>
            <div className="case-summary-status-pill">
              <Check size={13} /> {caseData.status || 'Approved'}
            </div>
          </div>

          <div className="case-summary-col">
            <div className="case-summary-item">
              <span className="case-summary-sublabel">Case Type</span>
              <span className="case-summary-val-bold">{caseData.type || 'Civil Dispute'}</span>
            </div>
            <div className="case-summary-item" style={{ marginTop: '8px' }}>
              <span className="case-summary-sublabel">Filed On</span>
              <span className="case-summary-val">
                <Calendar size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                {caseData.filedOn || '20 May 2025'}
              </span>
            </div>
          </div>

          <div className="case-summary-col">
            <div className="case-summary-item">
              <span className="case-summary-sublabel">Priority</span>
              <span className={`case-priority-badge priority-${(caseData.priority || 'medium').toLowerCase()}`}>
                {caseData.priority || 'Medium'}
              </span>
            </div>
            <div className="case-summary-item" style={{ marginTop: '8px' }}>
              <span className="case-summary-sublabel">Last Updated</span>
              <span className="case-summary-val">
                <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                {caseData.lastUpdated || '05 Sep 2025, 10:30 AM'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Grid: About the Case & Assigned Officer */}
      <div className="case-detail-grid-2col">
        {/* Left Card: ABOUT THE CASE */}
        <div className="section-box case-info-card">
          <div className="case-card-header">
            <FileText size={18} color="#cca245" />
            <span className="case-card-title">ABOUT THE CASE</span>
          </div>

          <div className="case-fields-list">
            <div className="case-field-row">
              <span className="case-field-label">Case Title</span>
              <span className="case-field-val case-title-val">{caseData.title}</span>
            </div>

            <div className="case-field-row">
              <span className="case-field-label">Case Category</span>
              <span className="case-field-val">{caseData.category || 'Property Law'}</span>
            </div>

            <div className="case-field-row">
              <span className="case-field-label">Case Description</span>
              <p className="case-field-val case-desc-val">
                {caseData.description || 'This case involves a legal dispute submitted to the vault.'}
              </p>
            </div>

            <div className="case-field-row">
              <span className="case-field-label">Location</span>
              <span className="case-field-val">{caseData.location || 'Indore, Madhya Pradesh'}</span>
            </div>

            <div className="case-field-row">
              <span className="case-field-label">Court / Authority</span>
              <span className="case-field-val">{caseData.court || 'Civil Court, Indore'}</span>
            </div>

            <div className="case-field-row">
              <span className="case-field-label">Tags</span>
              <div className="case-tags-wrapper">
                {(caseData.tags || ['Property', 'Boundary Dispute']).map((tag) => (
                  <span key={tag} className="case-tag-pill">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: ASSIGNED OFFICER */}
        <div className="section-box case-officer-card">
          <div className="case-card-header">
            <User size={18} color="#cca245" />
            <span className="case-card-title">ASSIGNED OFFICER</span>
          </div>

          <div className="officer-profile-layout">
            <div className="officer-avatar-box">
              <User size={36} color="#cca245" />
            </div>
            <div className="officer-identity-box">
              <span className="officer-name-title">{officer.name}</span>
              <span className="officer-role-sub">{officer.designation || 'Legal Officer'}</span>
              <span className="officer-dept-sub">{officer.department || 'Civil Legal Department'}</span>
            </div>
          </div>

          <div className="officer-details-list">
            <div className="officer-detail-item">
              <span className="officer-detail-label">Assigned On</span>
              <span className="officer-detail-val">
                <Calendar size={13} style={{ display: 'inline', marginRight: '6px' }} />
                {officer.assignedOn || '21 May 2025'}
              </span>
            </div>

            <div className="officer-detail-item" style={{ marginTop: '12px' }}>
              <span className="officer-detail-label">Contact</span>
              <div className="officer-contact-lines">
                <span className="officer-contact-link">
                  <Mail size={13} /> {officer.email || 'anjali.sharma@digilegal.in'}
                </span>
                <span className="officer-contact-link">
                  <Phone size={13} /> {officer.phone || '+91 98765 43210'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Timeline Card */}
      <div className="section-box case-timeline-card">
        <div className="case-card-header" style={{ marginBottom: '24px' }}>
          <Clock size={18} color="#cca245" />
          <span className="case-card-title">CASE TIMELINE</span>
        </div>

        <div className="case-timeline-horizontal">
          {(caseData.timeline || [
            { step: 'Case Created', date: '20 May 2025', by: 'System', icon: 'FileText', color: 'gold' },
            { step: 'Assigned to Officer', date: '21 May 2025', by: 'Anjali Sharma', icon: 'User', color: 'blue' },
            { step: 'Under Review', date: '28 May 2025', by: 'Anjali Sharma', icon: 'Search', color: 'gold' },
            { step: 'Approved', date: '05 Sep 2025', by: 'Anjali Sharma', icon: 'Check', color: 'green' }
          ]).map((item, idx, arr) => (
            <div key={idx} className="timeline-h-step">
              {idx > 0 && <div className="timeline-connector-line"></div>}
              <div className={`timeline-h-node node-${item.color || 'gold'}`}>
                {item.color === 'green' ? <Check size={16} /> :
                 item.icon === 'User' ? <User size={16} /> :
                 item.icon === 'Search' ? <Search size={16} /> :
                 <FileText size={16} />}
              </div>
              <div className="timeline-h-text">
                <span className="timeline-h-title">{item.step}</span>
                <span className="timeline-h-date">{item.date}</span>
                <span className="timeline-h-by">By: {item.by}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Documents Card */}
      <div className="section-box case-documents-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="case-docs-header-bar">
          <div className="case-card-header" style={{ margin: 0, border: 'none', padding: 0 }}>
            <FileText size={18} color="#cca245" />
            <span className="case-card-title">
              DOCUMENTS ({caseData.documents?.length || 0})
            </span>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={openUpload}
            disabled={!canUpload}
            title={canUpload ? "Add Document" : "Upload not permitted for your role"}
          >
            <Plus size={14} /> Add Document
          </button>
        </div>

        <table className="case-docs-table">
          <thead>
            <tr>
              <th>DOCUMENT NAME</th>
              <th>DOCUMENT TYPE</th>
              <th>UPLOADED ON</th>
              <th>UPLOADED BY</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {(caseData.documents && caseData.documents.length > 0) ? (
              caseData.documents.map((doc) => (
                <tr key={doc.id} className="case-doc-row" onClick={() => setSelectedDoc(doc)}>
                  <td>
                    <div className="case-doc-name-cell">
                      <FileText size={16} color="#cca245" />
                      <span className="case-doc-name-text">{doc.name}</span>
                    </div>
                  </td>
                  <td className="case-doc-type-text">{doc.type}</td>
                  <td className="case-doc-date-text">{doc.uploadedOn || doc.date}</td>
                  <td className="case-doc-by-text">{doc.uploadedBy || 'Court'}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="case-doc-actions-wrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="doc-action-btn"
                        title="Preview Document"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        className="doc-action-btn"
                        title="Download Document"
                        onClick={() => alert(`Downloading ${doc.name}`)}
                      >
                        <Download size={15} />
                      </button>
                      <button className="doc-action-btn" title="Options">
                        <MoreVertical size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  No documents linked to this case yet. Click "Add Document" to upload evidence.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Upload and Preview Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={closeUpload}
        onUploaded={handleDocumentAdded}
      />
      <DocumentPreviewModal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        document={selectedDoc}
      />
    </div>
  );
};

