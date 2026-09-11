import React from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';

export const LoadingState = ({ message = 'Loading secure data...', compact = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: compact ? '24px' : '48px 24px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'rgba(204, 162, 69, 0.1)',
          border: '1px solid var(--border-dark)'
        }}
      >
        <Loader2 size={24} color="var(--accent-gold)" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
      {!compact && <ShieldCheck size={18} color="var(--text-subtle)" />}
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{message}</p>
    </div>
  );
};