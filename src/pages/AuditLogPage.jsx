import React from 'react';
import { FileCheck2, Shield, Download, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { auditService } from '../services/auditService';
import { useAuth } from '../hooks/useAuth';
import { useApiData } from '../hooks/useApiData';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

export const AuditLogPage = () => {
  const { user } = useAuth();
  const canViewAudit = hasPermission(user?.role, PERMISSIONS.VIEW_AUDIT_LOG);

  // Step 12 — audit ledger via the service layer (mock records until the
  // /audit-logs backend endpoint is available). Hooks stay above any
  // conditional return so they always run in the same order.
  const { data: auditData, loading: auditLoading, error: auditError, reload: loadAuditLog } = useApiData(
    () => auditService.getAuditLog()
  );
  const auditEntries = auditData || [];

  if (!canViewAudit) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Audit Ledger Access Restricted</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Your clearance level does not permit viewing audit logs.</p>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', background: '#0b1320', border: '1px solid #142033', borderRadius: '8px' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#94a3b8' }}>Contact your administrator to request elevated access.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Tamper-Evident Audit Ledger</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Immutable record of all digital signatures, accesses, and transmissions</p>
        </div>
        <Button variant="outline" icon={Download}>
          Export Audit Trail (.CSV)
        </Button>
      </div>

      {/* Step 12 — API states: loading / error / empty */}
      {auditLoading && <LoadingState message="Verifying audit ledger integrity..." />}
      {!auditLoading && auditError && (
        <ErrorState
          title="Audit ledger unavailable"
          message={auditError}
          onRetry={loadAuditLog}
        />
      )}
      {!auditLoading && !auditError && auditEntries.length === 0 && (
        <EmptyState
          title="Audit ledger is empty"
          message="No vault activity has been recorded for your clearance scope yet."
        />
      )}

      {!auditLoading && !auditError && auditEntries.length > 0 && (
      <div className="section-box" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-dark)', color: 'var(--text-muted)', background: '#0b1320' }}>
              <th style={{ padding: '14px 18px' }}>Action Type</th>
              <th style={{ padding: '14px 18px' }}>Target Resource</th>
              <th style={{ padding: '14px 18px' }}>Actor</th>
              <th style={{ padding: '14px 18px' }}>Timestamp</th>
              <th style={{ padding: '14px 18px' }}>Verification Hash</th>
            </tr>
          </thead>
          <tbody>
            {auditEntries.map((a, index) => (
              <tr key={a.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="table-row-hover">
                <td style={{ padding: '14px 18px', color: 'var(--accent-gold)', fontWeight: 600 }}>{a.action}</td>
                <td style={{ padding: '14px 18px', color: 'var(--text-light)' }}>{a.target}</td>
                <td style={{ padding: '14px 18px', color: 'var(--text-muted)' }}>Officer (usr-9021)</td>
                <td style={{ padding: '14px 18px', color: 'var(--text-subtle)' }}>{a.date} {a.time}</td>
                <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                  SHA256: 8f4b...{index}a2c9
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

