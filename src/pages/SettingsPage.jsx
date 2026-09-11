import React from 'react';
import { Settings, Shield, User, Key, Bell, Database, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { hasPermission, PERMISSIONS } from '../utils/permissions';

// Step 12 — remaining API dependencies (static content until endpoints land):
//   GET /api/users/me    -> live profile values          [PENDING]
//   GET /api/settings    -> security & session config    [PENDING]
//   GET /api/users       -> user governance / management [PENDING]
export const SettingsPage = () => {
  const { user } = useAuth();
  const canManage = hasPermission(user?.role, PERMISSIONS.MANAGE_USERS);

  if (!canManage) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-white)' }}>Settings Access Restricted</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Only administrators can access system configuration.</p>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', background: '#0b1320', border: '1px solid #142033', borderRadius: '8px' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 12px' }} />
          <p style={{ color: '#94a3b8' }}>Contact your administrator to request elevated privileges.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--text-white)' }}>System Configuration & Security Clearance</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage credentials, role governance, and security encryption protocols</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        <div className="section-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--accent-gold)' }}>
            <User size={20} />
            <h3 style={{ color: 'var(--text-white)', fontSize: '1.1rem' }}>Active Profile</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div><strong style={{ color: 'var(--text-white)' }}>Name:</strong> {user?.name || 'Officer'}</div>
            <div><strong style={{ color: 'var(--text-white)' }}>Email:</strong> {user?.email || 'attorney@firm.com'}</div>
            <div><strong style={{ color: 'var(--text-white)' }}>Clearance:</strong> Level 4 Top Secret</div>
            <div><strong style={{ color: 'var(--text-white)' }}>Department:</strong> Legal Department</div>
          </div>
        </div>

        <div className="section-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: 'var(--accent-gold)' }}>
            <Shield size={20} />
            <h3 style={{ color: 'var(--text-white)', fontSize: '1.1rem' }}>Cryptographic Vault Security</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <div><strong style={{ color: 'var(--text-white)' }}>Encryption:</strong> AES-256-GCM</div>
            <div><strong style={{ color: 'var(--text-white)' }}>Hashing:</strong> SHA-256 Chain of Custody</div>
            <div><strong style={{ color: 'var(--text-white)' }}>MFA Status:</strong> Enforced via Hardware Token</div>
            <div><strong style={{ color: 'var(--text-white)' }}>Session Expiry:</strong> 15 Minutes Inactivity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

