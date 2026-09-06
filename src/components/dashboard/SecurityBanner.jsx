import React from 'react';
import { User, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SecurityBanner = () => {
  const { user } = useAuth();

  return (
    <div className="security-banner">
      <div className="security-banner-left">
        <div className="banner-avatar-icon">
          <User size={24} />
        </div>
        <div>
          <h2 className="banner-title">Welcome, {user?.name || 'Officer'}</h2>
          <p className="banner-sub">Here's what's happening with your cases and documents today.</p>
        </div>
      </div>

      <div className="security-banner-right">
        <div className="banner-lock-icon">
          <Lock size={22} />
        </div>
        <div className="banner-status-info">
          <div className="system-status-badge">
            <span>System Secure</span>
            <span className="status-dot-green"></span>
          </div>
          <p className="system-status-sub">All systems are protected and up to date</p>
        </div>
      </div>
    </div>
  );
};

