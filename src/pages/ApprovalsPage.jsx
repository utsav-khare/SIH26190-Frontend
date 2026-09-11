import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, ChevronLeft, ChevronRight, Download, Search, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { approvalService } from '../services/approvalService';
import { useAuth } from '../hooks/useAuth';
import { useApiData } from '../hooks/useApiData';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

const ITEMS_PER_PAGE = 7;

const TABS = ['All Requests', 'Pending', 'Approved', 'Denied'];

export const ApprovalsPage = () => {
  const { user } = useAuth();
  const canApprove = hasPermission(user?.role, PERMISSIONS.APPROVE_DOCUMENT);
  const [approvals, setApprovals] = useState([]);
  const [activeTab, setActiveTab] = useState('All Requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Step 12 — approvals come from the service layer (mock store until the
  // /approvals backend endpoint is available)
  const { data, loading: approvalsLoading, error: approvalsError, reload: loadApprovals } = useApiData(
    () => approvalService.getApprovals()
  );

  useEffect(() => {
    if (Array.isArray(data)) setApprovals(data);
  }, [data]);

  const handleAction = async (id, action) => {
    if (!canApprove) {
      alert('You do not have clearance to approve or deny document requests.');
      return;
    }
    // Optimistic update — rolled back if the service call fails
    const previous = approvals;
    setApprovals((prev) => prev.map((a) => (a.id === id ? { ...a, status: action } : a)));
    try {
      const updated = await approvalService.decideApproval(id, action);
      if (updated) {
        setApprovals((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
      }
    } catch (err) {
      setApprovals(previous);
      alert(err.message || 'Failed to record the authorization decision.');
    }
  };

  const counts = {
    'All Requests': approvals.length,
    'Pending': approvals.filter((a) => a.status === 'Pending').length,
    'Approved': approvals.filter((a) => a.status === 'Approved').length,
    'Denied': approvals.filter((a) => a.status === 'Denied').length
  };

  const filtered = approvals.filter((a) => {
    const matchesTab = activeTab === 'All Requests' || a.status === activeTab;
    const matchesSearch = a.document.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.requestType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          a.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paged = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    pages.push(
      <button key="prev" className="pagination-page-btn" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)}>
        <ChevronLeft size={14} />
      </button>
    );
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button key={i} className={`pagination-page-btn ${i === safePage ? 'active' : ''}`} onClick={() => goToPage(i)}>
          {i}
        </button>
      );
    }
    pages.push(
      <button key="next" className="pagination-page-btn" disabled={safePage === totalPages} onClick={() => goToPage(safePage + 1)}>
        <ChevronRight size={14} />
      </button>
    );
    return pages;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Clearance & Document Approvals</h2>
          <p className="page-subtitle">Review permission grants and document release authorizations</p>
        </div>
        <Button variant="outline" icon={Download} onClick={() => alert('Exporting approval report (.PDF)...')}>
          Export Report
        </Button>
      </div>

      {/* Tabs */}
      <div className="approval-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`approval-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
          >
            {tab} <span className="approval-tab-count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '38px' }}
          placeholder="Search by document reference, request type, requested by..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* Step 12 — API states: loading / error / empty */}
      {approvalsLoading && <LoadingState message="Retrieving authorization requests..." />}
      {!approvalsLoading && approvalsError && (
        <ErrorState
          title="Approvals unavailable"
          message={approvalsError}
          onRetry={loadApprovals}
        />
      )}
      {!approvalsLoading && !approvalsError && approvals.length === 0 && (
        <EmptyState
          title="No approval requests"
          message="There are no clearance or document release requests awaiting review."
        />
      )}

      {/* Approvals Table */}
      {!approvalsLoading && !approvalsError && approvals.length > 0 && (
      <div className="section-box" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #17273f', color: '#94a3b8', background: '#0b1320' }}>
              <th style={{ padding: '14px 18px' }}>Document Reference</th>
              <th style={{ padding: '14px 18px' }}>Request Type</th>
              <th style={{ padding: '14px 18px' }}>Requested By</th>
              <th style={{ padding: '14px 18px' }}>Timestamp</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Authorization Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  No approval requests found. All clearances up to date.
                </td>
              </tr>
            ) : (
              paged.map((app) => (
                <tr key={app.id} style={{ borderBottom: '1px solid #142033' }} className="table-row-hover">
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Badge variant={app.docType}>{app.docType}</Badge>
                      <span style={{ color: '#f8fafc', fontWeight: 600 }}>{app.document}</span>
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#f5b726', fontSize: '0.85rem' }}>{app.requestType}</td>
                  <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.85rem' }}>{app.requestedBy}</td>
                  <td style={{ padding: '14px 18px', color: '#64748b', fontSize: '0.85rem' }}>{app.date} {app.time}</td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    {app.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                          className="approval-action-btn approval-action-approve"
                          onClick={() => handleAction(app.id, 'Approved')}
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button
                          className="approval-action-btn approval-action-deny"
                          onClick={() => handleAction(app.id, 'Denied')}
                        >
                          <XCircle size={14} /> Deny
                        </button>
                      </div>
                    ) : (
                      <span className={`status-pill status-pill-${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination-bar" style={{ borderTop: '1px solid #142033' }}>
          <span className="pagination-info">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * ITEMS_PER_PAGE + 1} to{' '}
            {Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} results
          </span>
          <div className="pagination-pages">{renderPageNumbers()}</div>
        </div>
      </div>
      )}

    </div>
  );
};