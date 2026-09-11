import React from 'react';
import { FileSearch } from 'lucide-react';

export const EmptyState = ({ title = 'No records found', message = 'There is no data to display here yet.', compact = false }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: compact ? '24px' : '48px 24px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '44px',
          height: '44px',
          borderRadius: '9999px',
          background: 'var(--bg-card-hover)',
          border: '1px solid var(--border-dark)',
          color: 'var(--text-subtle)'
        }}
      >
        <FileSearch size={20} />
      </div>
      <p style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.95rem' }}>{title}</p>
      <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', maxWidth: '360px' }}>{message}</p>
    </div>
  );
};