import React, { useState } from 'react';
import { Search, SlidersHorizontal, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { SUPPORTED_UPLOAD } from '../utils/constants';
import { Badge } from '../components/common/Badge';
import { documentService } from '../services/documentService';
import { useApiData } from '../hooks/useApiData';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'case', label: 'Case Reference' }
];

export const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [docType, setDocType] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list');

  // Step 11 — consistent API state handling (loading / error / empty)
  const { data, loading: searchLoading, error: searchError, reload: retrySearch } = useApiData(
    () => documentService.getDocuments()
  );
  const docs = data || [];

  const results = docs.filter((doc) => {
    const matchesQuery = (doc.name || '').toLowerCase().includes(query.toLowerCase()) ||
                         (doc.caseId || '').toLowerCase().includes(query.toLowerCase()) ||
                         (doc.uploadedBy || '').toLowerCase().includes(query.toLowerCase());
    const matchesType = docType === 'ALL' || doc.type === docType;
    return matchesQuery && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'oldest': return (a.id || '').localeCompare(b.id || '');
      case 'name': return (a.name || '').localeCompare(b.name || '');
      case 'case': return (a.caseId || '').localeCompare(b.caseId || '');
      default: return (b.id || '').localeCompare(a.id || '');
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2 className="page-title">Global Document Intelligence & Search</h2>
          <p className="page-subtitle">Search across all cases and investigation records</p>
        </div>
        <button className="btn btn-sm btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <SlidersHorizontal size={14} /> Advanced Search
        </button>
      </div>

      {/* Search panel */}
      <div className="section-box" style={{ gap: '16px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '14px', top: '14px', color: '#f5b726' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '44px', fontSize: '1.05rem' }}
              placeholder="Search by keywords, witness names, FIR numbers, hashes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-sm btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '12px 16px' }}>
            <SlidersHorizontal size={14} /> Filter
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          {['ALL', 'PDF', 'IMG'].map((t) => (
            <button
              key={t}
              className={`btn btn-sm ${docType === t ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setDocType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Results ({results.length})</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Sort by:</span>
          <select
            className="filter-select"
            style={{ minWidth: '140px' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              className={`doc-action-btn ${viewMode === 'list' ? 'active' : ''}`}
              title="List view"
              onClick={() => setViewMode('list')}
              style={{ color: viewMode === 'list' ? '#f5b726' : '#64748b' }}
            >
              <List size={16} />
            </button>
            <button
              className="doc-action-btn"
              title="Grid view"
              onClick={() => setViewMode('grid')}
              style={{ color: viewMode === 'grid' ? '#f5b726' : '#64748b' }}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {searchLoading ? (
        <LoadingState message="Searching the vault..." />
      ) : searchError ? (
        <ErrorState title="Search unavailable" message={searchError} onRetry={retrySearch} />
      ) : results.length === 0 ? (
        <EmptyState
          title={'No documents match "' + (query || 'your filters') + '"'}
          message={'Supported types: ' + SUPPORTED_UPLOAD.label + '. Adjust your keywords or filters and try again.'}
        />
      ) : (
        <div
          style={
            viewMode === 'grid'
              ? { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }
              : { display: 'flex', flexDirection: 'column', gap: '12px' }
          }
        >
          {results.map((r) => (
            <div key={r.id} className="recent-doc-row section-box" style={{ padding: '14px 16px' }}>
              <Badge variant={r.type}>{r.type}</Badge>
              <div className="doc-info">
                <div className="doc-name">{r.name}</div>
                <div className="doc-meta">Case: {r.caseId} • {r.size} • Uploaded by {r.uploadedBy}</div>
              </div>
              {viewMode === 'list' && (
                <div className="doc-time">
                  <div>{r.date}</div>
                  <div style={{ color: '#64748b' }}>{r.time}</div>
                </div>
              )}
              <span
                style={{
                  color: '#f5b726',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  display: viewMode === 'list' ? 'inline-flex' : 'none'
                }}
              >
                {r.caseId}
              </span>
              <ChevronRight size={16} style={{ color: '#64748b', flexShrink: 0 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};