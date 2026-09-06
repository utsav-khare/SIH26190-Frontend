import React from 'react';
import { Settings, Shield, User, Key, Bell, Database } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <div>
        <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>System Configuration & Security Clearance</h2>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Manage credentials, role governance, and security encryption protocols</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        <div className="section-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#f5b726' }}>
            <User size={20} />
            <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Active Profile</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>
            <div><strong style={{ color: '#fff' }}>Name:</strong> {user?.name || 'Officer'}</div>
            <div><strong style={{ color: '#fff' }}>Email:</strong> {user?.email || 'attorney@firm.com'}</div>
            <div><strong style={{ color: '#fff' }}>Clearance:</strong> Level 4 Top Secret</div>
            <div><strong style={{ color: '#fff' }}>Department:</strong> Legal Department</div>
          </div>
        </div>

        <div className="section-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', color: '#f5b726' }}>
            <Shield size={20} />
            <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Cryptographic Vault Security</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>
            <div><strong style={{ color: '#fff' }}>Encryption:</strong> AES-256-GCM</div>
            <div><strong style={{ color: '#fff' }}>Hashing:</strong> SHA-256 Chain of Custody</div>
            <div><strong style={{ color: '#fff' }}>MFA Status:</strong> Enforced via Hardware Token</div>
            <div><strong style={{ color: '#fff' }}>Session Expiry:</strong> 15 Minutes Inactivity</div>
          </div>
        </div>
      </div>
    </div>
  );
};

