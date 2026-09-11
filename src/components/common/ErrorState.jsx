import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export const ErrorState = ({ title = 'Something went wrong', message = 'Could not load data. Please check your connection and try again.', onRetry, compact = false }) => {
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
          width: '44px',
          height: '44px',
          borderRadius: '9999px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'var(--text-error)'
        }}
      >
        <AlertTriangle size={20} />
      </div>
      <p style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.95rem' }}>{title}</p>
      <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', maxWidth: '360px' }}>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-outline btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}
        >
          <RotateCcw size={14} />
          Retry
        </button>
      )}
    </div>
  );
};