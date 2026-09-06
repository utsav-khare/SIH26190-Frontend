import React from 'react';
import { FileCheck2, Shield, Download } from 'lucide-react';
import { MOCK_RECENT_ACTIVITY } from '../utils/constants';
import { Button } from '../components/common/Button';

export const AuditLogPage = () => {
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

      <div className="section-box" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #17273f', color: '#94a3b8', background: '#0b1320' }}>
              <th style={{ padding: '14px 18px' }}>Action Type</th>
              <th style={{ padding: '14px 18px' }}>Target Resource</th>
              <th style={{ padding: '14px 18px' }}>Actor</th>
              <th style={{ padding: '14px 18px' }}>Timestamp</th>
              <th style={{ padding: '14px 18px' }}>Verification Hash</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_RECENT_ACTIVITY.map((a, index) => (
              <tr key={a.id} style={{ borderBottom: '1px solid #142033' }}>
                <td style={{ padding: '14px 18px', color: '#f5b726', fontWeight: 600 }}>{a.action}</td>
                <td style={{ padding: '14px 18px', color: '#f8fafc' }}>{a.target}</td>
                <td style={{ padding: '14px 18px', color: '#94a3b8' }}>Officer (usr-9021)</td>
                <td style={{ padding: '14px 18px', color: '#64748b' }}>{a.date} {a.time}</td>
                <td style={{ padding: '14px 18px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#38bdf8' }}>
                  SHA256: 8f4b...{index}a2c9
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

