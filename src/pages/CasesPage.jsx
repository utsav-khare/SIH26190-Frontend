import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Briefcase, FolderOpen, FolderCheck, Hourglass, TrendingUp,
  Search, SlidersHorizontal, ChevronLeft, ChevronRight, ArrowRight, MoreVertical, FileText, UserCheck
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { NewCaseModal } from '../components/modals/NewCaseModal';
import { useModal } from '../hooks/useModal';
import { caseService } from '../services/caseService';
import { CASE_STATS } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import { useApiData } from '../hooks/useApiData';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

const CASES_PER_PAGE = 10;

const STATUS_PILL_CLASS = {
  'Approved': 'status-pill-approved',
  'In Progress': 'status-pill-inprogress',
  'Under Review': 'status-pill-underreview',
  'Pending': 'status-pill-pending',
  'Archived': 'status-pill-archived'
};

export const CasesPage = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my-cases'
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();
  const canCreateCase = hasPermission(user?.role, PERMISSIONS.UPLOAD_DOCUMENT); // New Case = officer-level create action
  const { isOpen: isNewCaseOpen, openModal: openNewCase, closeModal: closeNewCase } = useModal();

  // Step 11 — consistent API state handling (loading / error / empty)
  const { data, loading: casesLoading, error: casesError, reload: loadCases } = useApiData(
    () => caseService.getCases()
  );

  useEffect(() => {
    if (Array.isArray(data)) setCases(data);
  }, [data]);

  const handleCaseCreated = async (newCaseData) => {
    try {
      const created = await caseService.createCase(newCaseData);
      setCases((prev) => [created, ...prev]);
    } catch (err) {
      alert(err.message || 'Failed to create case docket.');
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesTab = activeTab === 'all' || 
      (c.officer && (c.officer.toLowerCase().includes('khare') || c.officer.toLowerCase().includes('sharma') || c.officer.toLowerCase().includes('officer')));
    const matchesStatus = statusFilter === 'All Status' || c.status === statusFilter;
    const matchesType = typeFilter === 'All Types' || c.type === typeFilter;
    const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.officer && c.officer.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesStatus && matchesType && matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / CASES_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedCases = filteredCases.slice((safePage - 1) * CASES_PER_PAGE, safePage * CASES_PER_PAGE);

  const stats = [
    { icon: Briefcase, value: CASE_STATS.total, label: 'Total Cases', sub: 'All active and closed cases', gold: false },
    { icon: FolderOpen, value: CASE_STATS.active, label: 'Active Cases', sub: 'Currently in progress', gold: true },
    { icon: FolderCheck, value: CASE_STATS.closed, label: 'Closed Cases', sub: 'Successfully resolved', gold: true },
    { icon: Hourglass, value: CASE_STATS.pending, label: 'Pending Cases', sub: 'Awaiting next action', gold: false }
  ];

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    let start = Math.max(1, safePage - 1);
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

    pages.push(
      <button key="prev" className="pagination-page-btn" disabled={safePage === 1} onClick={() => goToPage(safePage - 1)}>
        <ChevronLeft size={14} />
      </button>
    );
    if (start > 1) {
      pages.push(<button key={1} className="pagination-page-btn" onClick={() => goToPage(1)}>1</button>);
      if (start > 2) pages.push(<span key="dots1" style={{ color: '#64748b', fontSize: '0.8rem' }}>...</span>);
    }
    for (let i = start; i <= end; i++) {
      pages.push(
        <button key={i} className={`pagination-page-btn ${i === safePage ? 'active' : ''}`} onClick={() => goToPage(i)}>
          {i}
        </button>
      );
    }
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="dots2" style={{ color: '#64748b', fontSize: '0.8rem' }}>...</span>);
      pages.push(
        <button key={totalPages} className="pagination-page-btn" onClick={() => goToPage(totalPages)}>
          {totalPages}
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
          <h2 className="page-title">Cases</h2>
          <p className="page-subtitle">Manage and track all your legal cases efficiently.</p>
        </div>
        {canCreateCase && (
          <Button variant="primary" icon={Plus} onClick={openNewCase}>
            New Case
          </Button>
        )}
      </div>

      {/* Stat Cards */}
      <div className="case-stats-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="case-stat-card">
              <div className="case-stat-icon-row">
                <div className="case-stat-icon">
                  <Icon size={20} />
                </div>
                <TrendingUp size={16} className="case-stat-trend" />
              </div>
              <div className={`case-stat-value ${s.gold ? '' : 'case-stat-value-light'}`}>{s.value}</div>
              <div className="case-stat-label">{s.label}</div>
              <div className="case-stat-sub">{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Filter Toolbar & Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
          >
            All Cases ({cases.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'my-cases' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setActiveTab('my-cases'); setCurrentPage(1); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <UserCheck size={14} /> My Assigned Cases
          </button>
        </div>

        <div className="filter-toolbar">
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            {['All Status', 'In Progress', 'Under Review', 'Pending', 'Archived'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
          >
            {['All Types', 'Case', 'FIR', 'Civil Dispute'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <div className="filter-search-inline">
            <Search size={16} style={{ color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search cases by title, ID or officer..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <button className="btn btn-sm btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>
      </div>

      {/* Step 11 — API states: loading / error / empty */}
      {casesLoading && <LoadingState message="Retrieving case dockets..." />}
      {!casesLoading && casesError && (
        <ErrorState
          title="Case dockets unavailable"
          message={casesError}
          onRetry={loadCases}
        />
      )}
      {!casesLoading && !casesError && cases.length === 0 && (
        <EmptyState
          title="No case dockets yet"
          message="Create a new case docket to register and track your first legal case."
        />
      )}

      {/* Cases Table */}
      {!casesLoading && !casesError && cases.length > 0 && (
      <div className="section-box" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #17273f', color: '#94a3b8', background: '#0b1320' }}>
              <th style={{ padding: '14px 18px' }}>CASE ID</th>
              <th style={{ padding: '14px 18px' }}>CASE TITLE</th>
              <th style={{ padding: '14px 18px' }}>OFFICER</th>
              <th style={{ padding: '14px 18px' }}>STATUS</th>
              <th style={{ padding: '14px 18px' }}>NEXT HEARING</th>
              <th style={{ padding: '14px 18px' }}>DOCUMENTS</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pagedCases.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  No cases match your filters.
                </td>
              </tr>
            ) : (
              pagedCases.map((c) => (
                <tr
                  key={c.id}
                  style={{ borderBottom: '1px solid #142033', cursor: 'pointer' }}
                  className="table-row-hover"
                  onClick={() => navigate(`/cases/${c.id || c.code}`)}
                >
                  <td style={{ padding: '14px 18px', color: '#f5b726', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 600 }}>
                    {c.code}
                  </td>
                  <td style={{ padding: '14px 18px', color: '#f8fafc', fontWeight: 600 }}>{c.title}</td>
                  <td style={{ padding: '14px 18px', color: '#94a3b8' }}>{c.officer}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span className={`status-pill ${STATUS_PILL_CLASS[c.status] || 'status-pill-pending'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.85rem' }}>{c.nextHearing || c.filedOn}</td>
                  <td style={{ padding: '14px 18px', color: '#94a3b8', fontSize: '0.85rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={14} /> {c.documents ? c.documents.length : (c.docCount || 1)} Docs
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <button
                        className="metric-card-link"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}
                        onClick={() => navigate(`/cases/${c.id || c.code}`)}
                      >
                        Open Case <ArrowRight size={13} />
                      </button>
                      <button className="doc-action-btn" title="More actions">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination-bar" style={{ borderTop: '1px solid #142033' }}>
          <span className="pagination-info">
            Showing {filteredCases.length === 0 ? 0 : (safePage - 1) * CASES_PER_PAGE + 1} to{' '}
            {Math.min(safePage * CASES_PER_PAGE, filteredCases.length)} of {filteredCases.length} cases
          </span>
          <div className="pagination-pages">{renderPageNumbers()}</div>
        </div>
      </div>
      )}

      {canCreateCase && (
        <NewCaseModal isOpen={isNewCaseOpen} onClose={closeNewCase} onCreated={handleCaseCreated} />
      )}
    </div>
  );
};